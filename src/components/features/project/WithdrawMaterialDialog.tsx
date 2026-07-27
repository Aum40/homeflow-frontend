'use client';

import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger
} from '@/components/ui/dialog';
import { Field, FieldError, FieldGroup, FieldLabel } from '@/components/ui/field';
import { Input } from '@/components/ui/input';
import { withdrawMaterialAction } from '@/lib/actions/project.action';
import { ProjectMaterialResponse } from '@/lib/api/api.type';
import {
  WithdrawMaterialInput,
  withdrawMaterialSchema
} from '@/lib/schemas/project.schema';
import { zodResolver } from '@hookform/resolvers/zod';
import { PackageMinus } from 'lucide-react';
import { useState, useTransition } from 'react';
import { Controller, useForm } from 'react-hook-form';

export default function WithdrawMaterialDialog({
  projectId,
  projectMaterial
}: {
  projectId: string;
  projectMaterial: ProjectMaterialResponse;
}) {
  const [open, setOpen] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  const remaining = projectMaterial.plannedQty - projectMaterial.usedQty;

  const { control, handleSubmit, reset } = useForm<WithdrawMaterialInput>({
    resolver: zodResolver(withdrawMaterialSchema),
    defaultValues: { qty: 1 }
  });

  const onSubmit = (data: WithdrawMaterialInput) => {
    setErrorMessage(null);
    startTransition(async () => {
      const result = await withdrawMaterialAction(
        projectId,
        projectMaterial.materialId,
        data
      );
      if (result?.success === false) {
        setErrorMessage(result.message);
        return;
      }
      setOpen(false);
      reset();
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
          <Button
            variant="outline"
            size="sm"
            disabled={remaining <= 0}
            aria-label="เบิกวัสดุ"
          />
        }
      >
        <PackageMinus className="mr-1 size-4" />
        เบิกวัสดุ
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>เบิกวัสดุ: {projectMaterial.materialName}</DialogTitle>
          <DialogDescription>
            เหลือให้เบิกได้อีก {remaining} {projectMaterial.unit}
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit(onSubmit)}>
          <FieldGroup className="gap-4">
            <Controller
              control={control}
              name="qty"
              render={({ field, fieldState }) => (
                <Field className="gap-1" data-invalid={fieldState.invalid}>
                  <FieldLabel htmlFor={field.name}>
                    จำนวนที่ต้องการเบิก ({projectMaterial.unit})
                  </FieldLabel>
                  <Input
                    type="number"
                    max={remaining}
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
              {isPending ? 'กำลังเบิก...' : 'ยืนยันการเบิก'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
