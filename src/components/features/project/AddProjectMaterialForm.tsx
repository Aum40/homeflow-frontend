'use client';

import { Button } from '@/components/ui/button';
import { Field, FieldError, FieldGroup, FieldLabel } from '@/components/ui/field';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '@/components/ui/select';
import { addProjectMaterialAction } from '@/lib/actions/project.action';
import { MaterialResponse } from '@/lib/api/api.type';
import {
  AddProjectMaterialInput,
  addProjectMaterialSchema
} from '@/lib/schemas/project.schema';
import { zodResolver } from '@hookform/resolvers/zod';
import { useState, useTransition } from 'react';
import { Controller, useForm } from 'react-hook-form';

export default function AddProjectMaterialForm({
  projectId,
  availableMaterials
}: {
  projectId: string;
  availableMaterials: MaterialResponse[];
}) {
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  const { control, handleSubmit, reset } = useForm<AddProjectMaterialInput>({
    resolver: zodResolver(addProjectMaterialSchema),
    defaultValues: { materialId: '', plannedQty: 1 }
  });

  const onSubmit = (data: AddProjectMaterialInput) => {
    setErrorMessage(null);
    startTransition(async () => {
      const result = await addProjectMaterialAction(projectId, data);
      if (result?.success === false) {
        setErrorMessage(result.message);
        return;
      }
      reset();
    });
  };

  if (availableMaterials.length === 0) {
    return (
      <p className="text-sm text-on-surface-variant">
        ไม่มีวัสดุในคลังที่สามารถเพิ่มได้ (เพิ่มวัสดุทั้งหมดแล้ว)
      </p>
    );
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <FieldGroup className="flex-row flex-wrap items-end gap-3">
        <Controller
          control={control}
          name="materialId"
          render={({ field, fieldState }) => (
            <Field className="min-w-48 gap-1" data-invalid={fieldState.invalid}>
              <FieldLabel htmlFor={field.name}>วัสดุ</FieldLabel>
              <Select value={field.value} onValueChange={field.onChange}>
                <SelectTrigger id={field.name} className="w-full">
                  <SelectValue placeholder="เลือกวัสดุ" />
                </SelectTrigger>
                <SelectContent>
                  {availableMaterials.map((material) => (
                    <SelectItem key={material.id} value={material.id}>
                      {material.name} ({material.unit})
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
            </Field>
          )}
        />
        <Controller
          control={control}
          name="plannedQty"
          render={({ field, fieldState }) => (
            <Field className="w-28 gap-1" data-invalid={fieldState.invalid}>
              <FieldLabel htmlFor={field.name}>จำนวนที่วางแผน</FieldLabel>
              <Input
                type="number"
                id={field.name}
                {...field}
                onChange={(e) => field.onChange(e.target.valueAsNumber)}
                aria-invalid={fieldState.invalid}
              />
              {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
            </Field>
          )}
        />
        <Button type="submit" disabled={isPending}>
          {isPending ? 'กำลังเพิ่ม...' : 'เพิ่มวัสดุ'}
        </Button>
      </FieldGroup>
      {errorMessage && (
        <p className="mt-2 text-sm text-destructive">{errorMessage}</p>
      )}
    </form>
  );
}
