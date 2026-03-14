"use client";
import Link from "next/link";
import { Avatar, AvatarFallback } from "@frontend/ui/components/avatar";
import {
  List,
  ListItem,
  ListItemContent,
  ListItemDescription,
  ListItemTitle,
} from "@frontend/ui/components/list";
import { DatetimeFormat, formatDatetime } from "@repo/datetimes";
import { getInitials } from "@/lib/utils/get-initials";
import { SessionsListDropdownMenu } from "./components/sessions-list-dropdown-menu";
import { useGroupedSessionsMetadata } from "./lib/state/hooks/use-grouped-sessions-metadata";
import { useSessionsMetadata } from "./lib/state/queries/use-sessions-metadata";

export function SessionsList() {
  const { data: sessions } = useSessionsMetadata();
  const sessionsByDay = useGroupedSessionsMetadata(sessions);
  return (
    <>
      {sessionsByDay.map((group) => (
        <div key={group.type === "earlier" ? "earlier" : group.date.toISO()}>
          <div className="p-2">
            <p className="text-xs font-medium text-muted-foreground">
              {group.type === "earlier"
                ? "Earlier"
                : formatDatetime(group.date, DatetimeFormat.DateWeekday)}
            </p>
          </div>
          <List>
            {group.sessions.map((session) => (
              <ListItem key={session.id} className="h-10">
                <Link
                  href={`/sessions/${session.id}`}
                  className="w-full cursor-default"
                >
                  <ListItemContent>
                    <Avatar>
                      <AvatarFallback>
                        {getInitials(session.lecturer)}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex flex-col">
                      <ListItemTitle>{session.name}</ListItemTitle>
                      <ListItemDescription className="text-xs text-muted-foreground">
                        {session.lecturer}
                      </ListItemDescription>
                    </div>
                  </ListItemContent>
                </Link>
                <SessionsListDropdownMenu session={session} />
              </ListItem>
            ))}
          </List>
        </div>
      ))}
    </>
  );
}
