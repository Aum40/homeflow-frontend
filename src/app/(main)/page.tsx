import ProjectCard from '@/components/features/project/ProjectCard';
import PmProjectsList from '@/components/features/project/PmProjectsList';
import { Button } from '@/components/ui/button';
import { auth } from '@/lib/auth';
import { ProjectApi } from '@/lib/api/project.api';
import { Metadata } from 'next';
import Link from 'next/link';
import { redirect } from 'next/navigation';

export const metadata: Metadata = {
  title: 'Home',
};

export const dynamic = 'force-dynamic';

export default async function HomePage() {
  const session = await auth();
  if (session?.user?.role === 'ADMIN') {
    redirect('/admin/manage-users');
  }

  if (session?.user?.role === 'PROJECT_MANAGER') {
    const managedProjects = await ProjectApi.getManaged();

    return (
      <div className='flex flex-col gap-4'>
        <div className='flex items-center justify-between'>
          <div>
            <h2 className='text-xl font-bold text-on-background'>
              โครงการที่คุณดูแล
            </h2>
            <p className='text-sm text-on-surface-variant'>
              ทั้งหมด {managedProjects.length} โครงการ
            </p>
          </div>
          <Button
            nativeButton={false}
            render={<Link href='/projects/new'>+ สร้างโครงการใหม่</Link>}
          />
        </div>
        {managedProjects.length === 0 ? (
          <p className='text-sm text-on-surface-variant'>
            คุณยังไม่ได้รับผิดชอบโครงการใด — เริ่มสร้างโครงการใหม่ได้เลย
          </p>
        ) : (
          <PmProjectsList projects={managedProjects} />
        )}
      </div>
    );
  }

  const projects = await ProjectApi.getMine();

  return (
    <div className='flex flex-col gap-4'>
      <div>
        <h2 className='text-xl font-bold text-on-background'>โครงการของคุณ</h2>
        <p className='text-sm text-on-surface-variant'>
          ทั้งหมด {projects.length} โครงการ
        </p>
      </div>
      {projects.length === 0 ? (
        <p className='text-sm text-on-surface-variant'>
          คุณยังไม่มีโครงการ — ทีมงานจะสร้างโครงการให้เมื่อเริ่มดำเนินการ
        </p>
      ) : (
        <div className='space-y-4'>
          {projects.map((project) => (
            <ProjectCard
              key={project.id}
              project={project}
              viewerRole='CUSTOMER'
            />
          ))}
        </div>
      )}
    </div>
  );
}
