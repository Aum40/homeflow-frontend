'use client';

import { Alert, AlertTitle } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '@/components/ui/select';
import {
  updateUserRoleAction,
  updateUserStatusAction
} from '@/lib/actions/user.action';
import { UserResponse, UserRole } from '@/lib/api/api.type';
import { AlertCircle } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useState, useTransition } from 'react';

const ROLE_LABELS: Record<UserRole, string> = {
  ADMIN: 'Admin',
  PROJECT_MANAGER: 'Project Manager',
  CUSTOMER: 'Customer'
};

export default function UserTable({
  users,
  currentUserId
}: {
  users: UserResponse[];
  currentUserId: string;
}) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);
  const [pendingUserId, setPendingUserId] = useState<string | null>(null);

  const handleRoleChange = (userId: string, role: UserRole) => {
    setPendingUserId(userId);
    startTransition(async () => {
      setError(null);
      const result = await updateUserRoleAction(userId, role);
      if (result?.success === false) {
        setError(result.message);
      } else {
        router.refresh();
      }
      setPendingUserId(null);
    });
  };

  const handleStatusToggle = (userId: string, nextIsActive: boolean) => {
    setPendingUserId(userId);
    startTransition(async () => {
      setError(null);
      const result = await updateUserStatusAction(userId, nextIsActive);
      if (result?.success === false) {
        setError(result.message);
      } else {
        router.refresh();
      }
      setPendingUserId(null);
    });
  };

  return (
    <div className="flex flex-col gap-4">
      {error && (
        <Alert
          variant="destructive"
          className="border-destructive bg-destructive/15"
        >
          <AlertCircle />
          <AlertTitle>{error}</AlertTitle>
        </Alert>
      )}

      <div className="overflow-x-auto rounded-lg border border-border">
        <table className="w-full min-w-[720px] text-left text-sm">
          <thead className="bg-muted text-muted-foreground">
            <tr>
              <th className="px-4 py-3 font-medium">ชื่อ</th>
              <th className="px-4 py-3 font-medium">อีเมล</th>
              <th className="px-4 py-3 font-medium">Role</th>
              <th className="px-4 py-3 font-medium">สถานะ</th>
              <th className="px-4 py-3 font-medium" />
            </tr>
          </thead>
          <tbody>
            {users.map((user) => {
              const isSelf = user.id === currentUserId;
              const rowPending = isPending && pendingUserId === user.id;

              return (
                <tr
                  key={user.id}
                  className="border-t border-border last:border-b-0"
                >
                  <td className="px-4 py-3">
                    {user.firstName} {user.lastName}
                    {isSelf && (
                      <span className="ml-2 text-xs text-muted-foreground">
                        (คุณ)
                      </span>
                    )}
                  </td>
                  <td className="px-4 py-3 text-muted-foreground">
                    {user.email}
                  </td>
                  <td className="px-4 py-3">
                    <Select
                      value={user.role}
                      disabled={isSelf || rowPending}
                      onValueChange={(value) =>
                        handleRoleChange(user.id, value as UserRole)
                      }
                    >
                      <SelectTrigger size="sm">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {(Object.keys(ROLE_LABELS) as UserRole[]).map(
                          (role) => (
                            <SelectItem key={role} value={role}>
                              {ROLE_LABELS[role]}
                            </SelectItem>
                          )
                        )}
                      </SelectContent>
                    </Select>
                  </td>
                  <td className="px-4 py-3">
                    <span
                      className={
                        user.isActive
                          ? 'text-on-primary-container'
                          : 'text-destructive'
                      }
                    >
                      {user.isActive ? 'เปิดใช้งาน' : 'ปิดใช้งาน'}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-right">
                    <Button
                      size="sm"
                      variant={user.isActive ? 'destructive' : 'outline'}
                      disabled={isSelf || rowPending}
                      onClick={() =>
                        handleStatusToggle(user.id, !user.isActive)
                      }
                    >
                      {user.isActive ? 'ปิดบัญชี' : 'เปิดบัญชี'}
                    </Button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
