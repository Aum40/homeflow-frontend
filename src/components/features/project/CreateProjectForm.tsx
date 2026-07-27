'use client';

import { Button } from '@/components/ui/button';
import {
  Field,
  FieldError,
  FieldGroup,
  FieldLabel
} from '@/components/ui/field';
import { Input } from '@/components/ui/input';
import { createProjectAction } from '@/lib/actions/project.action';
import {
  CreateProjectInput,
  createProjectSchema
} from '@/lib/schemas/project.schema';
import { zodResolver } from '@hookform/resolvers/zod';
import { useState, useTransition } from 'react';
import { Controller, useForm } from 'react-hook-form';

export default function CreateProjectForm() {
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const { control, handleSubmit } = useForm<CreateProjectInput>({
    resolver: zodResolver(createProjectSchema),
    defaultValues: {
      projectName: '',
      houseType: '',
      location: '',
      estimatedBudget: 0,
      description: ''
    }
  });

  const [isPending, startTransition] = useTransition();

  const onSubmit = (data: CreateProjectInput) => {
    setErrorMessage(null);
    startTransition(async () => {
      const result = await createProjectAction(data);
      if (result?.success === false) {
        setErrorMessage(result.message);
      }
    });
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <FieldGroup className="gap-4">
        <Controller
          control={control}
          name="projectName"
          render={({ field, fieldState }) => (
            <Field className="gap-1" data-invalid={fieldState.invalid}>
              <FieldLabel htmlFor={field.name}>ชื่อโครงการ</FieldLabel>
              <Input
                placeholder="เช่น บ้านพักอาศัย หัวหิน"
                id={field.name}
                {...field}
                aria-invalid={fieldState.invalid}
              />
              {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
            </Field>
          )}
        />

        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          <Controller
            control={control}
            name="houseType"
            render={({ field, fieldState }) => (
              <Field className="gap-1" data-invalid={fieldState.invalid}>
                <FieldLabel htmlFor={field.name}>ประเภทบ้าน</FieldLabel>
                <Input
                  placeholder="เช่น บ้านน็อกดาวน์ ชั้นเดียว"
                  id={field.name}
                  {...field}
                  aria-invalid={fieldState.invalid}
                />
                {fieldState.invalid && (
                  <FieldError errors={[fieldState.error]} />
                )}
              </Field>
            )}
          />
          <Controller
            control={control}
            name="location"
            render={({ field, fieldState }) => (
              <Field className="gap-1" data-invalid={fieldState.invalid}>
                <FieldLabel htmlFor={field.name}>ที่ตั้ง</FieldLabel>
                <Input
                  placeholder="เช่น เชียงใหม่"
                  id={field.name}
                  {...field}
                  aria-invalid={fieldState.invalid}
                />
                {fieldState.invalid && (
                  <FieldError errors={[fieldState.error]} />
                )}
              </Field>
            )}
          />
        </div>

        <Controller
          control={control}
          name="estimatedBudget"
          render={({ field, fieldState }) => (
            <Field className="gap-1" data-invalid={fieldState.invalid}>
              <FieldLabel htmlFor={field.name}>งบประมาณโดยประมาณ (บาท)</FieldLabel>
              <Input
                type="number"
                placeholder="1500000"
                id={field.name}
                {...field}
                onChange={(e) => field.onChange(e.target.valueAsNumber)}
                aria-invalid={fieldState.invalid}
              />
              {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
            </Field>
          )}
        />

        <Controller
          control={control}
          name="description"
          render={({ field, fieldState }) => (
            <Field className="gap-1" data-invalid={fieldState.invalid}>
              <FieldLabel htmlFor={field.name}>รายละเอียดเพิ่มเติม</FieldLabel>
              <Input
                placeholder="ระบุความต้องการเพิ่มเติม (ถ้ามี)"
                id={field.name}
                {...field}
                aria-invalid={fieldState.invalid}
              />
              {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
            </Field>
          )}
        />

        <Field>
          {errorMessage && (
            <p className="text-sm text-destructive">{errorMessage}</p>
          )}
          <Button type="submit" disabled={isPending} className="w-fit">
            {isPending ? 'กำลังส่งคำขอ...' : 'ส่งคำขอสร้างบ้าน'}
          </Button>
        </Field>
      </FieldGroup>
    </form>
  );
}
