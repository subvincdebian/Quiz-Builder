import React from 'react';
import { useForm, useFieldArray } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { quizSchema, type QuizFormData } from './schema';
import { Button } from '@/shared/ui/Button';
import { Input } from '@/shared/ui/Input';
import { quizApi } from '@/entities/quiz/api';
import { Plus, Trash2, Copy } from 'lucide-react';
import toast from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';

export const QuizForm: React.FC = () => {
  const navigate = useNavigate();
  const {
    register,
    control,
    handleSubmit,
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
  const { fields, append, remove, insert } = useFieldArray({
    control,
    name: 'questions',
  });

  const onSubmit = async (data: QuizFormData) => {
    try {
      await quizApi.create(data);
      toast.success('Quiz created successfully!');
      navigate('/quizzes');
    } catch {
      // Error handled by interceptor
    }
  };

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="space-y-6 w-full max-w-2xl mx-auto p-4 sm:p-8 bg-zinc-900/50 border border-zinc-800/80 rounded-xl"
    >
      <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-zinc-100">
        Create New Quiz
      </h2>
      <div>
        <Input
          {...register('title')}
          label="Quiz Title *"
          placeholder="e.g., React Fundamentals"
        />
        {errors.title && (
          <p className="text-xs text-rose-400 mt-1">{errors.title.message}</p>
        )}
      </div>

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

      <div className="flex flex-col sm:flex-row gap-3 pt-4 border-t border-zinc-800">
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
          className="w-full sm:w-auto"
          disabled={isSubmitting}
        >
          {isSubmitting ? 'Saving...' : 'Create Quiz'}
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
    <div className="p-4 sm:p-6 bg-zinc-900 border border-zinc-800 rounded-lg space-y-4">
      <div className="flex flex-col sm:flex-row justify-between items-start gap-4">
        <div className="flex-1 w-full">
          <Input
            {...register(`questions.${qIndex}.text`)}
            label={`Question ${qIndex + 1} *`}
          />
          {errors.questions?.[qIndex]?.text && (
            <p className="text-xs text-rose-400 mt-1">
              {errors.questions[qIndex].text.message}
            </p>
          )}
        </div>
        <div className="flex gap-2 shrink-0">
          <Button
            type="button"
            variant="ghost"
            className="px-2"
            onClick={copyQuestion}
          >
            <Copy className="w-4 h-4" />
          </Button>
          <Button
            type="button"
            variant="danger"
            disabled={fields.length === 1}
            className="px-2"
            onClick={() => remove(qIndex)}
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
            />
            <input
              type="checkbox"
              {...register(`questions.${qIndex}.options.${oIndex}.isCorrect`)}
              className="accent-indigo-500 w-5 h-5 flex-shrink-0"
              title="Mark as correct"
            />
            <Button
              type="button"
              variant="ghost"
              className="px-2"
              disabled={optFields.length <= 2}
              onClick={() => removeOption(oIndex)}
            >
              <Trash2 className="w-4 h-4" />
            </Button>
          </div>
        ))}
        {errors.questions?.[qIndex]?.options && (
          <p className="text-xs text-rose-400">
            {errors.questions[qIndex].options.message}
          </p>
        )}
        <Button
          type="button"
          variant="ghost"
          className="text-xs w-full sm:w-auto"
          onClick={() => appendOption({ text: '', isCorrect: false })}
        >
          <Plus className="w-3 h-3" /> Add Option
        </Button>
      </div>
    </div>
  );
};
