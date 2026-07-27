import CreateProjectForm from '@/components/features/project/CreateProjectForm';
import { auth } from '@/lib/auth';
import { Metadata } from 'next';
import { redirect } from 'next/navigation';

export const metadata: Metadata = {
  title: 'ส่งคำขอสร้างบ้าน'
};

export default async function NewProjectPage() {
  const session = await auth();
  if (session?.user?.role !== 'CUSTOMER') {
    redirect('/');
  }

  return (
    <div className="mx-auto flex max-w-2xl flex-col gap-6">
      <div>
        <h1 className="text-2xl font-semibold text-foreground">
          ส่งคำขอสร้างบ้าน
        </h1>
        <p className="mt-1 text-sm text-muted-foreground">
          กรอกรายละเอียดโครงการที่ต้องการ ทีมงานจะติดต่อกลับหลังจากตรวจสอบคำขอ
        </p>
      </div>
      <CreateProjectForm />
    </div>
  );
}
