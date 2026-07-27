'use client';

import { Alert, AlertTitle } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { removeMaterialAction } from '@/lib/actions/material.action';
import { MaterialResponse } from '@/lib/api/api.type';
import { AlertCircle, Trash2 } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useState, useTransition } from 'react';
import MaterialFormDialog from './MaterialFormDialog';

function formatPrice(price: string) {
  return new Intl.NumberFormat('th-TH', {
    style: 'currency',
    currency: 'THB'
  }).format(Number(price));
}

export default function MaterialTable({
  materials
}: {
  materials: MaterialResponse[];
}) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);
  const [pendingId, setPendingId] = useState<string | null>(null);

  const handleDelete = (material: MaterialResponse) => {
    if (!confirm(`ต้องการลบวัสดุ "${material.name}" ใช่หรือไม่?`)) return;

    setPendingId(material.id);
    startTransition(async () => {
      setError(null);
      const result = await removeMaterialAction(material.id);
      if (result?.success === false) {
        setError(result.message);
      } else {
        router.refresh();
      }
      setPendingId(null);
    });
  };

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

      <div className="flex justify-end">
        <MaterialFormDialog />
      </div>

      <div className="overflow-x-auto rounded-lg border border-border">
        <table className="w-full min-w-[720px] text-left text-sm">
          <thead className="bg-muted text-muted-foreground">
            <tr>
              <th className="px-4 py-3 font-medium">ชื่อวัสดุ</th>
              <th className="px-4 py-3 font-medium">หมวดหมู่</th>
              <th className="px-4 py-3 font-medium">หน่วย</th>
              <th className="px-4 py-3 font-medium">ราคาต่อหน่วย</th>
              <th className="px-4 py-3 font-medium">คงเหลือ</th>
              <th className="px-4 py-3 font-medium" />
            </tr>
          </thead>
          <tbody>
            {materials.map((material) => {
              const rowPending = isPending && pendingId === material.id;
              const lowStock = material.stock <= 10;

              return (
                <tr
                  key={material.id}
                  className="border-t border-border last:border-b-0"
                >
                  <td className="px-4 py-3">{material.name}</td>
                  <td className="px-4 py-3 text-muted-foreground">
                    {material.category}
                  </td>
                  <td className="px-4 py-3 text-muted-foreground">
                    {material.unit}
                  </td>
                  <td className="px-4 py-3">{formatPrice(material.price)}</td>
                  <td className="px-4 py-3">
                    <span
                      className={
                        lowStock ? 'font-semibold text-destructive' : ''
                      }
                    >
                      {material.stock}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center justify-end gap-1">
                      <MaterialFormDialog material={material} />
                      <Button
                        variant="ghost"
                        size="icon-sm"
                        disabled={rowPending}
                        aria-label="ลบวัสดุ"
                        onClick={() => handleDelete(material)}
                      >
                        <Trash2 className="size-4 text-destructive" />
                      </Button>
                    </div>
                  </td>
                </tr>
              );
            })}
            {materials.length === 0 && (
              <tr>
                <td
                  colSpan={6}
                  className="px-4 py-6 text-center text-muted-foreground"
                >
                  ยังไม่มีวัสดุในระบบ
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
