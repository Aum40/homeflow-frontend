'use client';

import { Button } from '@/components/ui/button';
import { acceptProjectAction } from '@/lib/actions/project.action';
import { useState, useTransition } from 'react';

export default function AcceptProjectButton({
  projectId
}: {
  projectId: string;
}) {
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);

  const handleClick = () => {
    setError(null);
    startTransition(async () => {
      const result = await acceptProjectAction(projectId);
      if (result?.success === false) {
        setError(result.message);
      }
    });
  };

  return (
    <div className="flex flex-col items-end gap-1">
      <Button
        onClick={handleClick}
        disabled={isPending}
        className="whitespace-nowrap"
      >
        {isPending ? 'กำลังรับคำขอ...' : 'รับคำขอนี้'}
      </Button>
      {error && <p className="text-xs text-destructive">{error}</p>}
    </div>
  );
}
