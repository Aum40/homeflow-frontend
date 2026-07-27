import AcceptProjectButton from '@/components/features/project/AcceptProjectButton';
import ProjectCard from '@/components/features/project/ProjectCard';
import { Button } from '@/components/ui/button';
import { auth } from '@/lib/auth';
import { ProjectApi } from '@/lib/api/project.api';
import { Metadata } from 'next';
import Link from 'next/link';
import { redirect } from 'next/navigation';

export const metadata: Metadata = {
  title: 'Home'
};

export const dynamic = 'force-dynamic';

export default async function HomePage() {
  const session = await auth();
  if (session?.user?.role === 'ADMIN') {
    redirect('/admin/manage-users');
  }

  if (session?.user?.role === 'PROJECT_MANAGER') {
    const [pendingRequests, managedProjects] = await Promise.all([
      ProjectApi.getPendingRequests(),
      ProjectApi.getManaged()
    ]);

    return (
      <div className="flex flex-col gap-8">
        <section className="flex flex-col gap-4">
          <div>
            <h2 className="text-xl font-bold text-on-background">
              คำขอที่รอดำเนินการ
            </h2>
            <p className="text-sm text-on-surface-variant">
              ทั้งหมด {pendingRequests.length} คำขอ
            </p>
          </div>
          {pendingRequests.length === 0 ? (
            <p className="text-sm text-on-surface-variant">
              ไม่มีคำขอที่รอดำเนินการในขณะนี้
            </p>
          ) : (
            <div className="space-y-4">
              {pendingRequests.map((project) => (
                <ProjectCard
                  key={project.id}
                  project={project}
                  viewerRole="PROJECT_MANAGER"
                  action={<AcceptProjectButton projectId={project.id} />}
                />
              ))}
            </div>
          )}
        </section>

        <section className="flex flex-col gap-4 border-t border-outline-variant pt-8">
          <div>
            <h2 className="text-xl font-bold text-on-background">
              โครงการที่คุณดูแล
            </h2>
            <p className="text-sm text-on-surface-variant">
              ทั้งหมด {managedProjects.length} โครงการ
            </p>
          </div>
          {managedProjects.length === 0 ? (
            <p className="text-sm text-on-surface-variant">
              คุณยังไม่ได้รับผิดชอบโครงการใด
            </p>
          ) : (
            <div className="space-y-4">
              {managedProjects.map((project) => (
                <ProjectCard
                  key={project.id}
                  project={project}
                  viewerRole="PROJECT_MANAGER"
                />
              ))}
            </div>
          )}
        </section>
      </div>
    );
  }

  const projects = await ProjectApi.getMine();

  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold text-on-background">
            โครงการของคุณ
          </h2>
          <p className="text-sm text-on-surface-variant">
            ทั้งหมด {projects.length} โครงการ
          </p>
        </div>
        <Button
          nativeButton={false}
          render={<Link href="/projects/new">ส่งคำขอสร้างบ้าน</Link>}
        />
      </div>
      {projects.length === 0 ? (
        <p className="text-sm text-on-surface-variant">
          คุณยังไม่มีโครงการ — เริ่มส่งคำขอสร้างบ้านได้เลย
        </p>
      ) : (
        <div className="space-y-4">
          {projects.map((project) => (
            <ProjectCard
              key={project.id}
              project={project}
              viewerRole="CUSTOMER"
            />
          ))}
        </div>
      )}
    </div>
  );
}
