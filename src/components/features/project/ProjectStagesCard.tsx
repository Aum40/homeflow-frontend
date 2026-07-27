import { ChecklistItemResponse } from '@/lib/api/api.type';
import AddChecklistItemForm from './AddChecklistItemForm';
import ChecklistItemRow from './ChecklistItemRow';

export default function ProjectStagesCard({
  projectId,
  projectName,
  items,
  isManager
}: {
  projectId: string;
  projectName: string;
  items: ChecklistItemResponse[];
  isManager: boolean;
}) {
  const completedCount = items.filter((item) => item.isCompleted).length;

  return (
    <div className="flex h-full flex-col rounded-lg border border-outline-variant bg-surface-container-lowest p-6 shadow-sm transition-all hover:shadow-md">
      <div className="mb-4">
        <h3 className="text-lg font-bold text-on-surface">
          รายการความคืบหน้า
        </h3>
        <p className="text-sm font-bold text-primary">
          โครงการ: {projectName} · เสร็จแล้ว {completedCount}/{items.length}{' '}
          รายการ
        </p>
      </div>

      {isManager && (
        <div className="mb-4">
          <AddChecklistItemForm projectId={projectId} />
        </div>
      )}

      {items.length === 0 ? (
        <p className="text-sm text-on-surface-variant">
          ยังไม่มีรายการความคืบหน้าสำหรับโครงการนี้
        </p>
      ) : (
        <div className="space-y-3">
          {items.map((item) => (
            <ChecklistItemRow
              key={item.id}
              projectId={projectId}
              item={item}
              isManager={isManager}
            />
          ))}
        </div>
      )}
    </div>
  );
}
