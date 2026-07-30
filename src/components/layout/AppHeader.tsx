'use client';

import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger
} from '@/components/ui/dropdown-menu';
import { logoutAction } from '@/lib/actions/auth.action';
import { LogOut, UserRound } from 'lucide-react';
import Link from 'next/link';

export default function AppHeader({
  title,
  user
}: {
  title: string;
  user: {
    firstName?: string;
    lastName?: string;
    avatarUrl?: string | null;
  };
}) {
  const initials = `${user.firstName?.[0] ?? ''}${user.lastName?.[0] ?? ''}`;

  return (
    <header className="sticky top-0 z-40 hidden h-16 items-center justify-between bg-surface px-gutter-desktop shadow-sm lg:flex">
      <div className="flex flex-grow items-center gap-8">
        <span className="text-lg font-bold whitespace-nowrap text-on-surface-variant">
          {title}
        </span>
      </div>
      <div className="flex items-center gap-6">
        <DropdownMenu>
          <DropdownMenuTrigger
            render={
              <button
                type="button"
                className="flex items-center gap-3 border-l border-outline-variant/30 pl-4 outline-none"
              />
            }
          >
            <Avatar className="ring-2 ring-transparent transition-all hover:ring-primary">
              <AvatarImage src={user.avatarUrl ?? undefined} alt="User" />
              <AvatarFallback>{initials}</AvatarFallback>
            </Avatar>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem render={<Link href="/profile" />}>
              <UserRound />
              โปรไฟล์
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem
              variant="destructive"
              onClick={() => logoutAction()}
            >
              <LogOut />
              ออกจากระบบ
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
}
