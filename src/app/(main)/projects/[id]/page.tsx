import AcceptProjectButton from '@/components/features/project/AcceptProjectButton';
import BudgetPanel from '@/components/features/project/BudgetPanel';
import ProjectMaterialsSection from '@/components/features/project/ProjectMaterialsSection';
import ProjectPhotosGallery from '@/components/features/project/ProjectPhotosGallery';
import ProjectProgressRing from '@/components/features/project/ProjectProgressRing';
import ProjectStagesCard from '@/components/features/project/ProjectStagesCard';
import ProjectStatusBadge from '@/components/features/project/ProjectStatusBadge';
import { ApiError } from '@/lib/api/api-error';
import { MaterialApi } from '@/lib/api/material.api';
import { ProjectApi } from '@/lib/api/project.api';
import { auth } from '@/lib/auth';
import { notFound } from 'next/navigation';

function formatDate(value: string) {
  return new Intl.DateTimeFormat('th-TH', {
    dateStyle: 'medium'
  }).format(new Date(value));
}

function DetailItem({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <p className="text-xs text-outline uppercase">{label}</p>
      <p className="font-bold text-on-surface">{value}</p>
    </div>
  );
}

export default async function ProjectDetailPage({
  params
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const session = await auth();

  let project;
  try {
    project = await ProjectApi.getById(id);
  } catch (error) {
    if (
      error instanceof ApiError &&
      (error.statusCode === 404 || error.statusCode === 403)
    ) {
      notFound();
    }
    throw error;
  }

  const canAccept =
    session?.user?.role === 'PROJECT_MANAGER' &&
    project.status === 'REQUESTED';

  const isManager =
    session?.user?.role === 'PROJECT_MANAGER' &&
    project.projectManagerId === session.user.id;

  const showManagementSections = project.projectManagerId !== null;

  const [materials, checklistItems, budget, catalog] =
    showManagementSections
      ? await Promise.all([
          ProjectApi.getMaterials(id),
          ProjectApi.getChecklist(id),
          ProjectApi.getBudget(id),
          isManager ? MaterialApi.getAll() : Promise.resolve([])
        ])
      : [[], [], null, []];

  const completedChecklistCount = checklistItems.filter(
    (item) => item.isCompleted
  ).length;
  const overallProgressPercent = checklistItems.length
    ? Math.round((completedChecklistCount / checklistItems.length) * 100)
    : 0;

  return (
    <div className="mx-auto flex max-w-6xl flex-col gap-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold text-on-background">
            {project.projectName}
          </h1>
          <p className="text-sm text-on-surface-variant">
            {project.houseType} · {project.location}
          </p>
        </div>
        <ProjectStatusBadge status={project.status} />
      </div>

      {project.description && (
        <p className="text-on-surface-variant">{project.description}</p>
      )}

      <div className="grid grid-cols-1 gap-6 rounded-xl border border-outline-variant bg-surface-container-lowest p-6 sm:grid-cols-2">
        <DetailItem
          label="วันที่เริ่มต้น"
          value={project.startDate ? formatDate(project.startDate) : '-'}
        />
        <DetailItem
          label="วันที่คาดว่าจะเสร็จ"
          value={project.endDate ? formatDate(project.endDate) : '-'}
        />
        <DetailItem
          label="วันที่ส่งคำขอ"
          value={formatDate(project.createdAt)}
        />
        <DetailItem
          label="อัปเดตล่าสุด"
          value={formatDate(project.updatedAt)}
        />
      </div>

      {canAccept && <AcceptProjectButton projectId={project.id} />}

      {showManagementSections && budget && (
        <>
          <div className="grid grid-cols-1 gap-6 lg:grid-cols-12">
            <div className="lg:col-span-4">
              <ProjectProgressRing percent={overallProgressPercent} />
            </div>
            <div className="lg:col-span-8">
              <ProjectStagesCard
                projectId={project.id}
                projectName={project.projectName}
                items={checklistItems}
                isManager={isManager}
              />
            </div>
          </div>

          <BudgetPanel budget={budget} />

          <ProjectMaterialsSection
            projectId={project.id}
            materials={materials}
            catalog={catalog}
            isManager={isManager}
          />

          <ProjectPhotosGallery items={checklistItems} />
        </>
      )}
    </div>
  );
}
