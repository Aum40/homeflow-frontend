import { formatCurrency } from '@/components/features/project/ProjectCard';
import { DashboardApi } from '@/lib/api/dashboard.api';
import { ProjectStatus } from '@/lib/api/api.type';
import { Metadata } from 'next';
import {
  Boxes,
  ClipboardList,
  PackageX,
  Users,
  Wallet
} from 'lucide-react';

export const metadata: Metadata = {
  title: 'แดชบอร์ด'
};

export const dynamic = 'force-dynamic';

const STATUS_LABELS: Record<ProjectStatus, string> = {
  REQUESTED: 'รอดำเนินการ',
  PLANNING: 'วางแผน',
  IN_PROGRESS: 'กำลังดำเนินการ',
  COMPLETED: 'เสร็จสิ้น',
  CANCELLED: 'ยกเลิก'
};

function StatCard({
  icon: Icon,
  label,
  value
}: {
  icon: React.ElementType;
  label: string;
  value: string | number;
}) {
  return (
    <div className="flex items-center gap-4 rounded-xl border border-outline-variant bg-surface-container-lowest p-6">
      <div className="flex size-12 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary">
        <Icon className="size-6" />
      </div>
      <div>
        <p className="text-xs text-outline uppercase">{label}</p>
        <p className="text-xl font-bold text-on-surface">{value}</p>
      </div>
    </div>
  );
}

function ProjectsByStatus({
  projectsByStatus
}: {
  projectsByStatus: Record<string, number>;
}) {
  const total = Object.values(projectsByStatus).reduce((a, b) => a + b, 0);

  return (
    <div className="flex flex-col gap-4 rounded-xl border border-outline-variant bg-surface-container-lowest p-6">
      <h2 className="text-lg font-bold text-on-background">
        โครงการแยกตามสถานะ
      </h2>
      {total === 0 ? (
        <p className="text-sm text-on-surface-variant">ยังไม่มีโครงการ</p>
      ) : (
        <ul className="flex flex-col gap-3">
          {(Object.keys(STATUS_LABELS) as ProjectStatus[]).map((status) => {
            const count = projectsByStatus[status] ?? 0;
            const percent = total > 0 ? Math.round((count / total) * 100) : 0;

            return (
              <li key={status} className="flex flex-col gap-1">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-on-surface-variant">
                    {STATUS_LABELS[status]}
                  </span>
                  <span className="font-bold text-on-surface">{count}</span>
                </div>
                <div className="h-2 w-full overflow-hidden rounded-full bg-surface-variant">
                  <div
                    className="h-full rounded-full bg-primary"
                    style={{ width: `${percent}%` }}
                  />
                </div>
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}

export default async function DashboardPage() {
  const dashboard = await DashboardApi.get();

  if (dashboard.role === 'ADMIN') {
    return (
      <div className="flex flex-col gap-6">
        <div>
          <h1 className="text-2xl font-semibold text-foreground">แดชบอร์ด</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            ภาพรวมของระบบทั้งหมด
          </p>
        </div>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <StatCard
            icon={Users}
            label="ผู้ใช้งานทั้งหมด"
            value={dashboard.totalUsers}
          />
          <StatCard
            icon={ClipboardList}
            label="โครงการทั้งหมด"
            value={dashboard.totalProjects}
          />
          <StatCard
            icon={Boxes}
            label="วัสดุทั้งหมด"
            value={dashboard.totalMaterials}
          />
          <StatCard
            icon={PackageX}
            label="วัสดุใกล้หมดสต็อก"
            value={dashboard.lowStockMaterials}
          />
        </div>

        <ProjectsByStatus projectsByStatus={dashboard.projectsByStatus} />
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="text-2xl font-semibold text-foreground">แดชบอร์ด</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          ภาพรวมโครงการของคุณ
        </p>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <StatCard
          icon={ClipboardList}
          label="โครงการทั้งหมด"
          value={dashboard.totalProjects}
        />
        <StatCard
          icon={Wallet}
          label="งบประมาณโดยประมาณรวม"
          value={formatCurrency(dashboard.totalEstimatedBudget)}
        />
        <StatCard
          icon={Wallet}
          label="ต้นทุนที่ใช้จริงรวม"
          value={formatCurrency(dashboard.totalActualCost)}
        />
      </div>

      <ProjectsByStatus projectsByStatus={dashboard.projectsByStatus} />
    </div>
  );
}
