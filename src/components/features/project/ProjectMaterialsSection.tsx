import { MaterialResponse, ProjectMaterialResponse } from '@/lib/api/api.type';
import AddProjectMaterialForm from './AddProjectMaterialForm';
import ProjectMaterialsTable from './ProjectMaterialsTable';

export default function ProjectMaterialsSection({
  projectId,
  materials,
  catalog,
  isManager
}: {
  projectId: string;
  materials: ProjectMaterialResponse[];
  catalog: MaterialResponse[];
  isManager: boolean;
}) {
  const availableMaterials = catalog.filter(
    (material) => !materials.some((pm) => pm.materialId === material.id)
  );

  return (
    <div className="flex flex-col gap-4 rounded-xl border border-outline-variant bg-surface-container-lowest p-6">
      <h2 className="text-lg font-bold text-on-background">วัสดุที่ใช้ในโครงการ</h2>

      {isManager && (
        <AddProjectMaterialForm
          projectId={projectId}
          availableMaterials={availableMaterials}
        />
      )}

      <ProjectMaterialsTable
        projectId={projectId}
        materials={materials}
        isManager={isManager}
      />
    </div>
  );
}
