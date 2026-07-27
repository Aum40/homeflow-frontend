'use client';

import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import homeflowIcon from '@/app/icon.png';
import { cn } from '@/lib/utils';
import { logoutAction } from '@/lib/actions/auth.action';
import {
  Boxes,
  Home,
  LayoutDashboard,
  LogOut,
  LucideIcon,
  Menu,
  PlusCircle,
  Settings,
  Users,
  X
} from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useState } from 'react';

type NavItem = {
  label: string;
  href: string;
  icon: LucideIcon;
  enabled: boolean;
};

function getNavItems(role?: string): NavItem[] {
  if (role === 'ADMIN') {
    return [
      {
        label: 'จัดการผู้ใช้งาน',
        href: '/admin/manage-users',
        icon: Users,
        enabled: true
      },
      {
        label: 'จัดการวัสดุ',
        href: '/admin/materials',
        icon: Boxes,
        enabled: true
      },
      {
        label: 'แดชบอร์ด',
        href: '/dashboard',
        icon: LayoutDashboard,
        enabled: true
      }
    ];
  }

  return [
    { label: 'งานก่อสร้างของคุณ', href: '/', icon: Home, enabled: true },
    {
      label: 'แดชบอร์ด',
      href: '/dashboard',
      icon: LayoutDashboard,
      enabled: true
    },
    { label: 'ตั้งค่า', href: '#', icon: Settings, enabled: false }
  ];
}

const ROLE_LABELS: Record<string, string> = {
  ADMIN: 'ผู้ดูแลระบบ',
  PROJECT_MANAGER: 'ผู้จัดการโครงการ',
  CUSTOMER: 'ลูกค้า'
};

function isNavItemActive(pathname: string, href: string) {
  if (href === '/') return pathname === '/';
  return pathname.startsWith(href);
}

function NavList({
  pathname,
  role,
  onNavigate
}: {
  pathname: string;
  role?: string;
  onNavigate?: () => void;
}) {
  const navItems = getNavItems(role);

  return (
    <nav className="flex flex-col gap-1 px-3">
      {navItems.map((item) => {
        const isActive = item.enabled && isNavItemActive(pathname, item.href);
        const Icon = item.icon;

        return (
          <Link
            key={item.label}
            href={item.href}
            onClick={item.enabled ? onNavigate : (e) => e.preventDefault()}
            aria-disabled={!item.enabled}
            className={cn(
              'flex items-center rounded-lg px-4 py-3 text-sm font-medium transition-colors',
              isActive
                ? 'border-r-4 border-secondary bg-primary font-bold text-primary-foreground'
                : item.enabled
                  ? 'text-on-surface-variant hover:bg-surface-variant'
                  : 'cursor-not-allowed text-outline'
            )}
          >
            <Icon className="mr-3 size-5" />
            {item.label}
          </Link>
        );
      })}
    </nav>
  );
}

function SidebarContent({
  pathname,
  user,
  onNavigate
}: {
  pathname: string;
  user: {
    firstName?: string;
    lastName?: string;
    role?: string;
    avatarUrl?: string | null;
  };
  onNavigate?: () => void;
}) {
  const fullName = `${user.firstName ?? ''} ${user.lastName ?? ''}`.trim();
  const initials = `${user.firstName?.[0] ?? ''}${user.lastName?.[0] ?? ''}`;
  const roleLabel = user.role ? (ROLE_LABELS[user.role] ?? user.role) : '';

  return (
    <div className="flex h-full flex-col">
      <div className="flex items-center space-x-3 px-6 py-6">
        <div className="flex size-10 items-center justify-center overflow-hidden rounded-lg bg-primary">
          <Image src={homeflowIcon} alt="Homeflow" className="size-full" />
        </div>
        <span className="text-xl font-bold text-primary">Homeflow</span>
      </div>

      <div className="mt-4 flex-grow">
        <NavList
          pathname={pathname}
          role={user.role}
          onNavigate={onNavigate}
        />
      </div>

      <div className="space-y-4 border-t border-outline-variant/30 p-gutter-desktop">
        {user.role === 'CUSTOMER' && (
          <Link
            href="/projects/new"
            onClick={onNavigate}
            className="flex w-full items-center justify-center gap-2 rounded-lg bg-primary py-3 font-bold text-primary-foreground transition-colors hover:bg-primary/90"
          >
            <PlusCircle className="size-5" />
            โครงการใหม่
          </Link>
        )}

        <button
          type="button"
          onClick={() => logoutAction()}
          className="flex w-full items-center gap-4 rounded px-2 py-2 text-left text-sm text-destructive transition-all hover:bg-destructive/10"
        >
          <LogOut className="size-4" />
          ออกจากระบบ
        </button>

        <Link
          href="/profile"
          onClick={onNavigate}
          className="flex items-center rounded-lg border-t border-outline-variant/30 pt-4 transition-colors hover:bg-surface-variant"
        >
          <Avatar size="lg" className="border-2 border-primary-fixed shadow-sm">
            <AvatarImage src={user.avatarUrl ?? undefined} alt="Profile" />
            <AvatarFallback>{initials}</AvatarFallback>
          </Avatar>
          <div className="ml-3 overflow-hidden">
            <p className="truncate text-sm font-bold text-on-surface">
              {fullName}
            </p>
            <p className="truncate text-[10px] text-on-surface-variant">
              {roleLabel}
            </p>
          </div>
        </Link>
      </div>
    </div>
  );
}

export default function AppSidebar({
  user
}: {
  user: {
    firstName?: string;
    lastName?: string;
    role?: string;
    avatarUrl?: string | null;
  };
}) {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();

  return (
    <>
      {/* Mobile top bar */}
      <div className="flex items-center justify-between border-b border-outline-variant bg-surface-container-low p-4 lg:hidden">
        <span className="text-lg font-bold text-primary">Homeflow</span>
        <button
          type="button"
          onClick={() => setOpen(true)}
          aria-label="เปิดเมนู"
        >
          <Menu className="size-6" />
        </button>
      </div>

      {/* Mobile drawer */}
      {open && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <div
            className="absolute inset-0 bg-black/40"
            onClick={() => setOpen(false)}
          />
          <div className="absolute inset-y-0 left-0 w-72 bg-surface-container-low shadow-lg">
            <div className="flex justify-end p-3">
              <button
                type="button"
                onClick={() => setOpen(false)}
                aria-label="ปิดเมนู"
              >
                <X className="size-5" />
              </button>
            </div>
            <SidebarContent
              pathname={pathname}
              user={user}
              onNavigate={() => setOpen(false)}
            />
          </div>
        </div>
      )}

      {/* Desktop sidebar */}
      <aside className="fixed top-0 left-0 z-50 hidden h-screen w-64 flex-col border-r border-outline-variant bg-surface-container-low lg:flex">
        <SidebarContent pathname={pathname} user={user} />
      </aside>
    </>
  );
}
