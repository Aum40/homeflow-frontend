import CreateProjectForm from '@/components/features/project/CreateProjectForm';
import { HouseDesignApi } from '@/lib/api/house-design.api';
import { UserApi } from '@/lib/api/user.api';
import { auth } from '@/lib/auth';
import { Metadata } from 'next';
import { redirect } from 'next/navigation';

export const metadata: Metadata = {
  title: 'สร้างโครงการใหม่'
};

export default async function NewProjectPage() {
  const session = await auth();
  if (session?.user?.role !== 'PROJECT_MANAGER') {
    redirect('/');
  }

  const [customers, houseDesigns] = await Promise.all([
    UserApi.getCustomers(),
    HouseDesignApi.getAll()
  ]);

  return (
    <div className="mx-auto flex max-w-3xl flex-col gap-6">
      <div>
        <h1 className="text-2xl font-semibold text-foreground">
          สร้างโครงการใหม่
        </h1>
        <p className="mt-1 text-sm text-muted-foreground">
          เลือกลูกค้าและแบบบ้าน แล้วระบุที่ตั้งเพื่อเริ่มโครงการ
        </p>
      </div>
      <CreateProjectForm customers={customers} houseDesigns={houseDesigns} />
    </div>
  );
}
