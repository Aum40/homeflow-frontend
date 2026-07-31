import ResetPasswordForm from '@/components/features/auth/ResetPasswordForm';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'ตั้งรหัสผ่านใหม่'
};

export default async function ResetPasswordPage({
  searchParams
}: {
  searchParams: Promise<{ token?: string }>;
}) {
  const { token } = await searchParams;

  return (
    <div className="relative w-full max-w-md p-4">
      <div className="overflow-hidden rounded-xl bg-card shadow-[0_10px_25px_-5px_rgba(48,101,118,0.12)]">
        <div className="h-1 w-full bg-tertiary" />

        <div className="p-6 md:p-10">
          <div className="mb-8">
            <h1 className="text-2xl font-bold text-on-background md:text-3xl">
              ตั้งรหัสผ่านใหม่
            </h1>
            <p className="mt-2 text-sm text-on-surface-variant md:text-base">
              กรอกรหัสผ่านใหม่ของคุณด้านล่าง
            </p>
          </div>

          <ResetPasswordForm token={token} />
        </div>
      </div>
    </div>
  );
}
