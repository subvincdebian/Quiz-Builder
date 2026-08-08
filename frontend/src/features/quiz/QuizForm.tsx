import React, { useEffect, useState } from 'react';
import {
  useForm,
  useFieldArray,
  useWatch,
  type SubmitHandler,
  type Control,
  type FieldArrayWithId,
  type UseFormRegister,
  type FieldErrors,
  type UseFormSetValue,
} from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { quizSchema, type QuizFormData } from './schema';
import type { QuestionFormData } from './schema';
import { Button } from '@/shared/ui/Button';
import { Input } from '@/shared/ui/Input';
import { RadioGroup } from '@/shared/ui/RadioGroup';
import { quizApi } from '@/entities/quiz/api';
import { Plus, Trash2, Copy, ArrowLeft } from 'lucide-react';
import toast from 'react-hot-toast';
import { useNavigate, useParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

export const QuizForm: React.FC = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const isEditMode = !!id;
  const [loading, setLoading] = useState(isEditMode);

  const {
    register,
    control,
    handleSubmit,
    reset,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm<QuizFormData>({
    resolver: zodResolver(quizSchema),
    defaultValues: {
      title: '',
      questions: [
        {
          type: 'BOOLEAN',
          text: '',
          options: [
            { text: '', isCorrect: false },
            { text: '', isCorrect: false },
          ],
        },
      ],
    },
  });

  useEffect(() => {
    if (isEditMode && id) {
      quizApi.getById(id).then((res) => {
        const { title, questions } = res.data;
        const formattedQuestions = questions.map((q) => ({
          ...q,
          options: q.options.map((opt) => ({
            text: opt,
            isCorrect: q.correctAnswers.includes(opt),
          })),
        }));

        reset({ title, questions: formattedQuestions });
        setLoading(false);
      });
    }
  }, [isEditMode, id, reset]);

  const { fields, append, remove, insert } = useFieldArray({
    control,
    name: 'questions',
  });

  const onSubmit: SubmitHandler<QuizFormData> = async (data) => {
    try {
      if (isEditMode && id) {
        await quizApi.update(id, data);
        toast.success(t('Quiz updated successfully!'));
      } else {
        await quizApi.create(data);
        toast.success(t('Quiz created successfully!'));
      }
      navigate('/quizzes');
    } catch {
      toast.error(
        t(isEditMode ? 'Failed to update quiz' : 'Failed to create quiz')
      );
    }
  };

  if (loading)
    return (
      <div className="p-8 text-center text-zinc-400">
        {t('Loading quiz data...')}
      </div>
    );

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="space-y-8 w-full max-w-3xl mx-auto p-6 sm:p-10 bg-zinc-900 border border-zinc-800 rounded-2xl shadow-xl"
    >
      <div className="space-y-2">
        <h2 className="text-2xl font-bold tracking-tight text-zinc-100">
          {isEditMode ? t('Edit Quiz') : t('Create New Quiz')}
        </h2>
      </div>

      <Input
        {...register('title')}
        label={t('Quiz Title *')}
        placeholder={t('e.g., React Fundamentals')}
        error={errors.title?.message}
      />

      <div className="space-y-6">
        {fields.map((field, qIndex) => (
          <QuestionFields
            key={field.id}
            control={control}
            qIndex={qIndex}
            remove={remove}
            fields={fields}
            register={register}
            errors={errors}
            insert={insert}
            setValue={setValue}
            t={t}
          />
        ))}
      </div>

      <div className="flex flex-col sm:flex-row gap-3 pt-6 border-t border-zinc-800">
        <Button type="button" variant="ghost" onClick={() => navigate(-1)}>
          <ArrowLeft className="w-4 h-4" /> {t('Back')}
        </Button>
        <Button
          type="button"
          variant="ghost"
          className="w-full sm:w-auto"
          onClick={() =>
            append({
              type: 'BOOLEAN',
              text: '',
              options: [
                { text: '', isCorrect: false },
                { text: '', isCorrect: false },
              ],
            })
          }
        >
          <Plus className="w-4 h-4" /> {t('Add Question')}
        </Button>
        <Button
          type="submit"
          className="w-full sm:w-auto ml-auto"
          isLoading={isSubmitting}
        >
          {isEditMode ? t('Save Changes') : t('Create Quiz')}
        </Button>
      </div>
    </form>
  );
};

interface QuestionFieldsProps {
  control: Control<QuizFormData>;
  qIndex: number;
  remove: (index: number) => void;
  fields: FieldArrayWithId<QuizFormData, 'questions'>[];
  register: UseFormRegister<QuizFormData>;
  errors: FieldErrors<QuizFormData>;
  insert: (index: number, value: QuestionFormData) => void;
  setValue: UseFormSetValue<QuizFormData>;
  t: (key: string, options?: { number: number }) => string;
}

const QuestionFields: React.FC<QuestionFieldsProps> = ({
  control,
  qIndex,
  remove,
  fields,
  register,
  errors,
  insert,
  setValue,
  t,
}) => {
  const type = useWatch({ control, name: `questions.${qIndex}.type` });
  const {
    fields: optFields,
    append: appendOption,
    remove: removeOption,
  } = useFieldArray({ control, name: `questions.${qIndex}.options` });

  const copyQuestion = () => {
    const values = { ...fields[qIndex] };
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { id, ...questionData } = values;
    insert(qIndex + 1, questionData as QuestionFormData);
  };

  // Helper to handle type changes
  useEffect(() => {
    if (type === 'INPUT') {
      if (optFields.length !== 1) {
        setValue(`questions.${qIndex}.options`, [
          { text: '', isCorrect: true },
        ]);
      }
    } else if (type === 'BOOLEAN') {
      // Enforce exactly 2 options for Boolean
      if (optFields.length !== 2) {
        setValue(`questions.${qIndex}.options`, [
          { text: '', isCorrect: true },
          { text: '', isCorrect: false },
        ]);
      }
    } else if (optFields.length < 2) {
      // Dynamic options for Checkbox and Multiple Choice
      if (optFields.length === 0) {
        appendOption({ text: '', isCorrect: false });
        appendOption({ text: '', isCorrect: false });
      } else {
        appendOption({ text: '', isCorrect: false });
      }
    }
  }, [type, qIndex, setValue, optFields.length, appendOption]);

  const handleCorrectChange = (changedIndex: number, isChecked: boolean) => {
    if ((type === 'BOOLEAN' || type === 'MULTIPLE_CHOICE') && isChecked) {
      optFields.forEach((_, index) => {
        if (index !== changedIndex) {
          setValue(`questions.${qIndex}.options.${index}.isCorrect`, false);
        }
      });
    }
  };

  return (
    <div className="p-5 sm:p-6 bg-zinc-950 border border-zinc-800 rounded-xl space-y-4">
      <div className="flex flex-col gap-4">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1">
            <Input
              {...register(`questions.${qIndex}.text`)}
              label={t('Question {{number}} *', { number: qIndex + 1 })}
              placeholder={t('Enter your question here...')}
              error={errors.questions?.[qIndex]?.text?.message}
            />
          </div>
          <div className="md:w-auto">
            <RadioGroup
              label={t('Type')}
              value={type}
              onChange={(val) =>
                setValue(
                  `questions.${qIndex}.type`,
                  val as 'BOOLEAN' | 'INPUT' | 'CHECKBOX' | 'MULTIPLE_CHOICE'
                )
              }
              options={[
                { label: t('Boolean'), value: 'BOOLEAN' },
                { label: t('Input'), value: 'INPUT' },
                { label: t('Checkbox'), value: 'CHECKBOX' },
                { label: t('Multiple Choice'), value: 'MULTIPLE_CHOICE' },
              ]}
            />
          </div>
        </div>

        <div className="flex gap-2 justify-end">
          <Button
            type="button"
            variant="ghost"
            className="px-3"
            onClick={copyQuestion}
            title={t('Duplicate question')}
          >
            <Copy className="w-4 h-4" />
          </Button>
          <Button
            type="button"
            variant="danger"
            disabled={fields.length === 1}
            className="px-3"
            onClick={() => remove(qIndex)}
            title={t('Delete question')}
          >
            <Trash2 className="w-4 h-4" />
          </Button>
        </div>
      </div>

      <div className="space-y-2">
        <div className="flex justify-between items-center">
          <label className="text-sm font-medium text-zinc-400">
            {type === 'INPUT' ? t('Correct Answer *') : t('Options *')}
          </label>
          {type !== 'INPUT' && (
            <span className="text-xs text-zinc-500">
              {type === 'CHECKBOX'
                ? t('Select all that apply')
                : t('Select one')}
            </span>
          )}
        </div>
        {optFields.map((opt, oIndex) => (
          <div key={opt.id} className="flex gap-2 items-center">
            <Input
              {...register(`questions.${qIndex}.options.${oIndex}.text`)}
              placeholder={
                type === 'INPUT'
                  ? t('Correct answer')
                  : t('Option {{number}}', { number: oIndex + 1 })
              }
              error={
                errors.questions?.[qIndex]?.options?.[oIndex]?.text?.message
              }
            />

            {type !== 'INPUT' && (
              <label
                className="flex items-center gap-2 cursor-pointer mt-7"
                title={t('Mark as correct')}
              >
                <input
                  type="checkbox"
                  {...register(
                    `questions.${qIndex}.options.${oIndex}.isCorrect`,
                    {
                      onChange: (e: React.ChangeEvent<HTMLInputElement>) =>
                        handleCorrectChange(oIndex, e.target.checked),
                    }
                  )}
                  className="accent-indigo-500 w-5 h-5 flex-shrink-0"
                />
                <span className="text-xs text-zinc-500">{t('Correct')}</span>
              </label>
            )}

            {type !== 'INPUT' && type !== 'BOOLEAN' && (
              <Button
                type="button"
                variant="ghost"
                className="px-3 mt-7"
                disabled={optFields.length <= 2}
                onClick={() => removeOption(oIndex)}
                title={t('Remove option')}
              >
                <Trash2 className="w-4 h-4" />
              </Button>
            )}
          </div>
        ))}
        {type !== 'INPUT' && type !== 'BOOLEAN' && (
          <Button
            type="button"
            variant="ghost"
            className="text-xs w-full sm:w-auto mt-2"
            onClick={() => appendOption({ text: '', isCorrect: false })}
          >
            <Plus className="w-3 h-3" /> {t('Add Option')}
          </Button>
        )}
      </div>
    </div>
  );
};
