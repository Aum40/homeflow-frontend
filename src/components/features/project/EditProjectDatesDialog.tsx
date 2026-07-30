'use client';

import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger
} from '@/components/ui/dialog';
import { Field, FieldError, FieldGroup, FieldLabel } from '@/components/ui/field';
import { Input } from '@/components/ui/input';
import { updateProjectDatesAction } from '@/lib/actions/project.action';
import {
  UpdateProjectDatesInput,
  updateProjectDatesSchema
} from '@/lib/schemas/project.schema';
import { zodResolver } from '@hookform/resolvers/zod';
import { Pencil } from 'lucide-react';
import { useState, useTransition } from 'react';
import { Controller, useForm } from 'react-hook-form';

function toDateInputValue(value: string | null) {
  return value ? value.slice(0, 10) : '';
}

export default function EditProjectDatesDialog({
  projectId,
  startDate,
  endDate
}: {
  projectId: string;
  startDate: string | null;
  endDate: string | null;
}) {
  const [open, setOpen] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  const { control, handleSubmit } = useForm<UpdateProjectDatesInput>({
    resolver: zodResolver(updateProjectDatesSchema),
    defaultValues: {
      startDate: toDateInputValue(startDate),
      endDate: toDateInputValue(endDate)
    }
  });

  const onSubmit = (data: UpdateProjectDatesInput) => {
    setErrorMessage(null);
    startTransition(async () => {
      const result = await updateProjectDatesAction(projectId, {
        startDate: data.startDate || undefined,
        endDate: data.endDate || undefined
      });
      if (result?.success === false) {
        setErrorMessage(result.message);
        return;
      }
      setOpen(false);
    });
  };

  return (
    <Dialog
      open={open}
      onOpenChange={(next) => {
        setOpen(next);
        if (next) setErrorMessage(null);
      }}
    >
      <DialogTrigger
        render={
          <Button variant="outline" size="sm" className="whitespace-nowrap" />
        }
      >
        <Pencil className="mr-1 size-4" />
        แก้ไขวันที่
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>แก้ไขวันที่โครงการ</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit(onSubmit)}>
          <FieldGroup className="gap-4">
            <Controller
              control={control}
              name="startDate"
              render={({ field, fieldState }) => (
                <Field className="gap-1" data-invalid={fieldState.invalid}>
                  <FieldLabel htmlFor={field.name}>วันที่เริ่มต้น</FieldLabel>
                  <Input
                    type="date"
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
              name="endDate"
              render={({ field, fieldState }) => (
                <Field className="gap-1" data-invalid={fieldState.invalid}>
                  <FieldLabel htmlFor={field.name}>
                    วันที่คาดว่าจะเสร็จ
                  </FieldLabel>
                  <Input
                    type="date"
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
            {errorMessage && (
              <p className="text-sm text-destructive">{errorMessage}</p>
            )}
          </FieldGroup>
          <DialogFooter>
            <Button type="submit" disabled={isPending}>
              {isPending ? 'กำลังบันทึก...' : 'บันทึก'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
