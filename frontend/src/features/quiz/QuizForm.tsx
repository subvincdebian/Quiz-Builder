import React, { useEffect, useState } from 'react';
import { useForm, useFieldArray } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { quizSchema, type QuizFormData } from './schema';
import { Button } from '@/shared/ui/Button';
import { Input } from '@/shared/ui/Input';
import { quizApi } from '@/entities/quiz/api';
import { Plus, Trash2, Copy } from 'lucide-react';
import toast from 'react-hot-toast';
import { useNavigate, useParams } from 'react-router-dom';

export const QuizForm: React.FC = () => {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const isEditMode = !!id;
  const [loading, setLoading] = useState(isEditMode);

  const {
    register,
    control,
    handleSubmit,
    reset,
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

  const onSubmit = async (data: QuizFormData) => {
    try {
      const payload = {
        ...data,
        questions: data.questions.map((q) => ({
          ...q,
          correctAnswers: q.options
            .filter((o) => o.isCorrect)
            .map((o) => o.text),
        })),
      };

      if (isEditMode && id) {
        await quizApi.update(id, payload as any);
        toast.success('Quiz updated successfully!');
      } else {
        await quizApi.create(payload as any);
        toast.success('Quiz created successfully!');
      }
      navigate('/quizzes');
    } catch {
      toast.error(`Failed to ${isEditMode ? 'update' : 'create'} quiz`);
    }
  };

  if (loading)
    return <div className="p-8 text-center">Loading quiz data...</div>;

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="space-y-8 w-full max-w-3xl mx-auto p-6 sm:p-10 bg-zinc-900 border border-zinc-800 rounded-2xl shadow-xl"
    >
      <div className="space-y-2">
        <h2 className="text-2xl font-bold tracking-tight text-zinc-100">
          {isEditMode ? 'Edit Quiz' : 'Create New Quiz'}
        </h2>
        <p className="text-zinc-400">
          {isEditMode
            ? 'Modify your quiz'
            : 'Define your quiz title and questions below.'}
        </p>
      </div>

      <Input
        {...register('title')}
        label="Quiz Title *"
        placeholder="e.g., React Fundamentals"
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
          />
        ))}
      </div>

      <div className="flex flex-col sm:flex-row gap-3 pt-6 border-t border-zinc-800">
        <Button
          type="button"
          variant="ghost"
          className="w-full sm:w-auto"
          onClick={() => navigate(-1)}
        >
          Back
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
          <Plus className="w-4 h-4" /> Add Question
        </Button>
        <Button
          type="submit"
          className="w-full sm:w-auto ml-auto"
          isLoading={isSubmitting}
        >
          {isEditMode ? 'Save Changes' : 'Create Quiz'}
        </Button>
      </div>
    </form>
  );
};

const QuestionFields: React.FC<any> = ({
  control,
  qIndex,
  remove,
  fields,
  register,
  errors,
  insert,
}) => {
  const {
    fields: optFields,
    append: appendOption,
    remove: removeOption,
  } = useFieldArray({ control, name: `questions.${qIndex}.options` });

  const copyQuestion = () => {
    const values = { ...fields[qIndex] };
    insert(qIndex + 1, values);
  };

  return (
    <div className="p-5 sm:p-6 bg-zinc-950 border border-zinc-800 rounded-xl space-y-4">
      <div className="flex flex-col sm:flex-row justify-between items-start gap-4">
        <div className="flex-1 w-full">
          <Input
            {...register(`questions.${qIndex}.text`)}
            label={`Question ${qIndex + 1} *`}
            error={errors.questions?.[qIndex]?.text?.message}
          />
        </div>
        <div className="flex gap-2 shrink-0 pt-7">
          <Button
            type="button"
            variant="ghost"
            className="px-3"
            onClick={copyQuestion}
            title="Duplicate question"
          >
            <Copy className="w-4 h-4" />
          </Button>
          <Button
            type="button"
            variant="danger"
            disabled={fields.length === 1}
            className="px-3"
            onClick={() => remove(qIndex)}
            title="Delete question"
          >
            <Trash2 className="w-4 h-4" />
          </Button>
        </div>
      </div>

      <div className="space-y-2">
        <label className="text-sm font-medium text-zinc-400">Options *</label>
        {optFields.map((opt, oIndex) => (
          <div key={opt.id} className="flex gap-2 items-center">
            <Input
              {...register(`questions.${qIndex}.options.${oIndex}.text`)}
              placeholder={`Option ${oIndex + 1}`}
              error={
                errors.questions?.[qIndex]?.options?.[oIndex]?.text?.message
              }
            />
            <label
              className="flex items-center gap-2 cursor-pointer mt-7"
              title="Mark as correct"
            >
              <input
                type="checkbox"
                {...register(`questions.${qIndex}.options.${oIndex}.isCorrect`)}
                className="accent-indigo-500 w-5 h-5 flex-shrink-0"
              />
              <span className="text-xs text-zinc-500">Correct</span>
            </label>
            <Button
              type="button"
              variant="ghost"
              className="px-3 mt-7"
              disabled={optFields.length <= 2}
              onClick={() => removeOption(oIndex)}
              title="Remove option"
            >
              <Trash2 className="w-4 h-4" />
            </Button>
          </div>
        ))}
        <Button
          type="button"
          variant="ghost"
          className="text-xs w-full sm:w-auto mt-2"
          onClick={() => appendOption({ text: '', isCorrect: false })}
        >
          <Plus className="w-3 h-3" /> Add Option
        </Button>
      </div>
    </div>
  );
};
