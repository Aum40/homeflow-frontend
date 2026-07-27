import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Bell, Search, Settings } from 'lucide-react';
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
        <div className="relative w-full max-w-md">
          <Search className="absolute top-1/2 left-3 size-4 -translate-y-1/2 text-outline" />
          <input
            className="w-full rounded-lg border border-outline-variant bg-surface-container-low py-2 pr-4 pl-10 text-sm transition-all outline-none focus:border-primary focus:ring-2 focus:ring-primary/20"
            placeholder="ค้นหาโครงการหรือวัสดุ..."
            type="text"
          />
        </div>
      </div>
      <div className="flex items-center gap-6">
        <div className="relative">
          <Bell className="size-9 cursor-pointer rounded-full p-2 text-on-surface-variant transition-colors hover:bg-surface-container hover:text-primary" />
          <div className="absolute top-1 right-1 size-2 rounded-full bg-error ring-2 ring-surface" />
        </div>
        <Settings className="size-9 cursor-pointer rounded-full p-2 text-on-surface-variant transition-colors hover:bg-surface-container hover:text-primary" />
        <Link
          href="/profile"
          className="flex items-center gap-3 border-l border-outline-variant/30 pl-4"
        >
          <Avatar className="ring-2 ring-transparent transition-all hover:ring-primary">
            <AvatarImage src={user.avatarUrl ?? undefined} alt="User" />
            <AvatarFallback>{initials}</AvatarFallback>
          </Avatar>
        </Link>
      </div>
    </header>
  );
}
