'use client';

import { Alert, AlertTitle } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { removeProjectMaterialAction } from '@/lib/actions/project.action';
import { ProjectMaterialResponse } from '@/lib/api/api.type';
import { AlertCircle, Trash2 } from 'lucide-react';
import { useState, useTransition } from 'react';
import EditProjectMaterialDialog from './EditProjectMaterialDialog';
import { formatCurrency } from './ProjectCard';
import WithdrawMaterialDialog from './WithdrawMaterialDialog';

export default function ProjectMaterialsTable({
  projectId,
  materials,
  isManager
}: {
  projectId: string;
  materials: ProjectMaterialResponse[];
  isManager: boolean;
}) {
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);
  const [pendingId, setPendingId] = useState<string | null>(null);

  const handleRemove = (projectMaterial: ProjectMaterialResponse) => {
    if (
      !confirm(
        `ต้องการนำ "${projectMaterial.materialName}" ออกจากแผนวัสดุใช่หรือไม่?`
      )
    )
      return;

    setPendingId(projectMaterial.materialId);
    startTransition(async () => {
      setError(null);
      const result = await removeProjectMaterialAction(
        projectId,
        projectMaterial.materialId
      );
      if (result?.success === false) {
        setError(result.message);
      }
      setPendingId(null);
    });
  };

  if (materials.length === 0) {
    return (
      <p className="text-sm text-on-surface-variant">
        ยังไม่มีวัสดุที่วางแผนไว้สำหรับโครงการนี้
      </p>
    );
  }

  return (
    <div className="flex flex-col gap-4">
      {error && (
        <Alert
          variant="destructive"
          className="border-destructive bg-destructive/15"
        >
          <AlertCircle />
          <AlertTitle>{error}</AlertTitle>
        </Alert>
      )}

      <div className="overflow-x-auto rounded-lg border border-border">
        <table className="w-full min-w-[720px] text-left text-sm">
          <thead className="bg-muted text-muted-foreground">
            <tr>
              <th className="px-4 py-3 font-medium">วัสดุ</th>
              <th className="px-4 py-3 font-medium">วางแผน</th>
              <th className="px-4 py-3 font-medium">เบิกไปแล้ว</th>
              <th className="px-4 py-3 font-medium">คงเหลือ</th>
              <th className="px-4 py-3 font-medium">ราคา/หน่วย</th>
              {isManager && <th className="px-4 py-3 font-medium" />}
            </tr>
          </thead>
          <tbody>
            {materials.map((material) => {
              const remaining = material.plannedQty - material.usedQty;
              const rowPending =
                isPending && pendingId === material.materialId;

              return (
                <tr
                  key={material.id}
                  className="border-t border-border last:border-b-0"
                >
                  <td className="px-4 py-3">{material.materialName}</td>
                  <td className="px-4 py-3">
                    {material.plannedQty} {material.unit}
                  </td>
                  <td className="px-4 py-3">
                    {material.usedQty} {material.unit}
                  </td>
                  <td className="px-4 py-3">
                    {remaining} {material.unit}
                  </td>
                  <td className="px-4 py-3 text-muted-foreground">
                    {formatCurrency(material.plannedUnitPrice)}
                  </td>
                  {isManager && (
                    <td className="px-4 py-3">
                      <div className="flex items-center justify-end gap-1">
                        <WithdrawMaterialDialog
                          projectId={projectId}
                          projectMaterial={material}
                        />
                        <EditProjectMaterialDialog
                          projectId={projectId}
                          projectMaterial={material}
                        />
                        <Button
                          variant="ghost"
                          size="icon-sm"
                          disabled={rowPending || material.usedQty > 0}
                          aria-label="นำวัสดุออก"
                          onClick={() => handleRemove(material)}
                        >
                          <Trash2 className="size-4 text-destructive" />
                        </Button>
                      </div>
                    </td>
                  )}
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
