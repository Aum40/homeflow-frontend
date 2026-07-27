import { Button } from '@/components/ui/button';
import { Metadata } from 'next';
import Link from 'next/link';
import { ChevronLeft } from 'lucide-react';
import RegisterForm from '@/components/features/auth/RegisterForm';

export const metadata: Metadata = {
  title: 'ลงทะเบียนสมาชิก'
};

export default function RegisterPage() {
  return (
    <div className="relative w-full max-w-2xl p-4">
      {/* Decorative accent elements */}
      <div className="absolute -top-6 -left-6 -z-10 h-24 w-24 rounded-full bg-primary-container/20 blur-3xl" />
      <div className="absolute -right-10 -bottom-10 -z-10 h-32 w-32 rounded-full bg-secondary-container/10 blur-3xl" />

      <div className="overflow-hidden rounded-xl bg-card shadow-[0_10px_25px_-5px_rgba(48,101,118,0.12)]">
        {/* Top accent bar */}
        <div className="h-1 w-full bg-tertiary" />

        <div className="p-8 md:p-12">
          {/* Back button */}
          <div className="-ml-4 -mt-2 mb-4">
            <Button
              className="size-10 rounded-full"
              variant="ghost"
              nativeButton={false}
              render={
                <Link href="/login">
                  <ChevronLeft />
                </Link>
              }
            />
          </div>

          {/* Title */}
          <div className="mb-10">
            <span className="mb-2 block font-mono text-xs tracking-wider text-secondary uppercase">
              Account Creation
            </span>
            <h1 className="text-3xl font-semibold text-on-background">
              ลงทะเบียนสมาชิก - Homeflow
            </h1>
            <p className="mt-2 text-base text-on-surface-variant">
              เริ่มสร้างบ้านในฝันของคุณด้วยความเชื่อถือและเทคโนโลยีมืออาชีพ
            </p>
          </div>

          {/* Register form */}
          <RegisterForm />

          {/* Navigation back to login */}
          <div className="mt-8 flex flex-col items-center justify-between gap-4 border-t border-outline-variant pt-8 md:flex-row">
            <p className="text-base text-on-surface-variant">
              มีบัญชีผู้ใช้อยู่แล้ว?
            </p>
            <Button
              variant="outline"
              nativeButton={false}
              render={<Link href="/login">เข้าสู่ระบบ (Login)</Link>}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
