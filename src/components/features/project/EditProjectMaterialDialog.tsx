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
import { updateProjectMaterialAction } from '@/lib/actions/project.action';
import { ProjectMaterialResponse } from '@/lib/api/api.type';
import {
  UpdateProjectMaterialInput,
  updateProjectMaterialSchema
} from '@/lib/schemas/project.schema';
import { zodResolver } from '@hookform/resolvers/zod';
import { Pencil } from 'lucide-react';
import { useState, useTransition } from 'react';
import { Controller, useForm } from 'react-hook-form';

export default function EditProjectMaterialDialog({
  projectId,
  projectMaterial
}: {
  projectId: string;
  projectMaterial: ProjectMaterialResponse;
}) {
  const [open, setOpen] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  const { control, handleSubmit } = useForm<UpdateProjectMaterialInput>({
    resolver: zodResolver(updateProjectMaterialSchema),
    defaultValues: { plannedQty: projectMaterial.plannedQty }
  });

  const onSubmit = (data: UpdateProjectMaterialInput) => {
    setErrorMessage(null);
    startTransition(async () => {
      const result = await updateProjectMaterialAction(
        projectId,
        projectMaterial.materialId,
        data
      );
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
        render={<Button variant="ghost" size="icon-sm" aria-label="แก้ไขจำนวนที่วางแผน" />}
      >
        <Pencil className="size-4" />
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>
            แก้ไขจำนวนที่วางแผน: {projectMaterial.materialName}
          </DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit(onSubmit)}>
          <FieldGroup className="gap-4">
            <Controller
              control={control}
              name="plannedQty"
              render={({ field, fieldState }) => (
                <Field className="gap-1" data-invalid={fieldState.invalid}>
                  <FieldLabel htmlFor={field.name}>
                    จำนวนที่วางแผน ({projectMaterial.unit})
                  </FieldLabel>
                  <Input
                    type="number"
                    id={field.name}
                    {...field}
                    onChange={(e) => field.onChange(e.target.valueAsNumber)}
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
