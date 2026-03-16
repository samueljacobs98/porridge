"use client";

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@frontend/ui/components/alert-dialog";
import { Button } from "@frontend/ui/components/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@frontend/ui/components/dropdown-menu";
import { Flag } from "@frontend/ui/components/flag";
import { useIsMounted } from "@frontend/ui/lib/state/hooks/use-is-mounted";
import { IconDots } from "@tabler/icons-react";
import { DatetimeFormat, formatDatetime } from "@repo/datetimes";
import type { SessionMetadata } from "@/lib/types";

export function SessionsListDropdownMenu({
  sessionMetadata,
}: {
  sessionMetadata: SessionMetadata;
}) {
  const mounted = useIsMounted();

  return (
    <>
      <p className="text-xs tabular-nums group-hover/list-item:hidden group-has-data-popup-open/list-item:hidden group-has-data-open/list-item:hidden">
        {formatDatetime(sessionMetadata.createdAt, DatetimeFormat.Time24)}
      </p>
      <Flag show={mounted}>
        <AlertDialog>
          <DropdownMenu>
            <DropdownMenuTrigger
              className="hidden rounded-full group-hover/list-item:flex data-popup-open:flex data-open:flex"
              render={<Button variant="ghost" size="icon" />}
            >
              <IconDots />
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" sideOffset={2}>
              <DropdownMenuItem
                variant="destructive"
                render={
                  <AlertDialogTrigger className="w-full" render={<button />} />
                }
                nativeButton
              >
                Move to trash
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
              <AlertDialogDescription>
                This action cannot be undone. This will permanently delete the
                session.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancel</AlertDialogCancel>
              <AlertDialogAction variant="destructive">
                Continue
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </Flag>
    </>
  );
}
