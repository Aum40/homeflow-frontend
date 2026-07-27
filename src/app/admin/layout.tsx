import AppHeader from '@/components/layout/AppHeader';
import AppSidebar from '@/components/layout/AppSidebar';
import { auth } from '@/lib/auth';
import { redirect } from 'next/navigation';

export default async function AdminLayout({
  children
}: {
  children: React.ReactNode;
}) {
  const session = await auth();
  if (session?.user?.role !== 'ADMIN') {
    redirect('/');
  }

  const user = {
    firstName: session.user.firstName,
    lastName: session.user.lastName,
    role: session.user.role,
    avatarUrl: session.user.avatarUrl
  };

  return (
    <div className="min-h-screen bg-background">
      <AppSidebar user={user} />
      <div className="lg:ml-64">
        <AppHeader title="แผงผู้ดูแลระบบ" user={user} />
        <main className="max-w-350 p-gutter-mobile lg:p-gutter-desktop">
          {children}
        </main>
      </div>
    </div>
  );
}
