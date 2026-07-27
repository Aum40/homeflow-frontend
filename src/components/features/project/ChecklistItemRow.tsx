'use client';

import { Button } from '@/components/ui/button';
import {
  removeChecklistItemAction,
  toggleChecklistItemAction,
  uploadChecklistItemPhotosAction
} from '@/lib/actions/project.action';
import { ChecklistItemResponse } from '@/lib/api/api.type';
import { ImagePlus, Trash2 } from 'lucide-react';
import { useRef, useState, useTransition } from 'react';
import EditChecklistItemDialog from './EditChecklistItemDialog';
import PhotoThumbnail from './PhotoThumbnail';

function formatDateShort(value: string) {
  return new Intl.DateTimeFormat('th-TH', { dateStyle: 'medium' }).format(
    new Date(value)
  );
}

export default function ChecklistItemRow({
  projectId,
  item,
  isManager
}: {
  projectId: string;
  item: ChecklistItemResponse;
  isManager: boolean;
}) {
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);
  const fileInputEl = useRef<HTMLInputElement | null>(null);

  const handleToggle = () => {
    setError(null);
    startTransition(async () => {
      const result = await toggleChecklistItemAction(
        projectId,
        item.id,
        !item.isCompleted
      );
      if (result?.success === false) setError(result.message);
    });
  };

  const handleDelete = () => {
    if (!confirm(`ต้องการลบ "${item.title}" ใช่หรือไม่?`)) return;

    setError(null);
    startTransition(async () => {
      const result = await removeChecklistItemAction(projectId, item.id);
      if (result?.success === false) setError(result.message);
    });
  };

  const handlePhotoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files?.length) return;
    const files = Array.from(e.target.files);
    e.target.value = '';

    setError(null);
    startTransition(async () => {
      const result = await uploadChecklistItemPhotosAction(
        projectId,
        item.id,
        files
      );
      if (result?.success === false) setError(result.message);
    });
  };

  return (
    <div className="flex flex-col gap-3 rounded-xl border border-outline-variant bg-surface-container-low p-4">
      <div className="flex items-start justify-between gap-3">
        <label className="flex flex-1 cursor-pointer items-start gap-3">
          <input
            type="checkbox"
            checked={item.isCompleted}
            disabled={!isManager || isPending}
            onChange={handleToggle}
            className="mt-1 size-5 shrink-0 rounded border-outline text-primary focus:ring-primary disabled:cursor-not-allowed"
          />
          <div>
            <p
              className={
                item.isCompleted
                  ? 'font-bold text-on-surface-variant line-through'
                  : 'font-bold text-on-surface'
              }
            >
              {item.title}
            </p>
            {item.isCompleted && item.completedByName && item.completedAt && (
              <p className="text-xs text-on-surface-variant">
                เสร็จโดย {item.completedByName} ·{' '}
                {formatDateShort(item.completedAt)}
              </p>
            )}
          </div>
        </label>

        {isManager && (
          <div className="flex shrink-0 items-center gap-1">
            <input
              ref={fileInputEl}
              type="file"
              accept="image/*"
              multiple
              className="hidden"
              onChange={handlePhotoChange}
            />
            <Button
              variant="ghost"
              size="icon-sm"
              disabled={isPending}
              aria-label="แนบรูปภาพ"
              onClick={() => fileInputEl.current?.click()}
            >
              <ImagePlus className="size-4" />
            </Button>
            <EditChecklistItemDialog projectId={projectId} item={item} />
            <Button
              variant="ghost"
              size="icon-sm"
              disabled={isPending}
              aria-label="ลบรายการ"
              onClick={handleDelete}
            >
              <Trash2 className="size-4 text-destructive" />
            </Button>
          </div>
        )}
      </div>

      {error && <p className="text-xs text-destructive">{error}</p>}

      {item.photos.length > 0 && (
        <div className="flex flex-wrap gap-2">
          {item.photos.map((photo) => (
            <PhotoThumbnail
              key={photo.id}
              src={photo.imageUrl}
              alt={item.title}
              className="size-16 rounded-lg object-cover"
            />
          ))}
        </div>
      )}
    </div>
  );
}
