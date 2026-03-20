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
import { useSuspenseQuery } from "@tanstack/react-query";
import { DatetimeFormat, formatDatetime } from "@repo/datetimes";
import { sessionsQueries } from "@/lib/state/queries";
import { getInitials } from "@/lib/utils/get-initials";
import { SessionsListDropdownMenu } from "./components/sessions-list-dropdown-menu";
import { useGroupedSessionsMetadata } from "./lib/state/hooks/use-grouped-sessions-metadata";

export function Content() {
  const { data: sessionsMetadata } = useSuspenseQuery(
    sessionsQueries.metadata()
  );
  const sessionsMetadataByDay = useGroupedSessionsMetadata(sessionsMetadata);
  return (
    <>
      {sessionsMetadataByDay.map((group) => (
        <div key={group.type === "earlier" ? "earlier" : group.date.toISO()}>
          <div className="p-2">
            <p className="text-xs font-medium text-muted-foreground">
              {group.type === "earlier"
                ? "Earlier"
                : formatDatetime(group.date, DatetimeFormat.DateWeekday)}
            </p>
          </div>
          <List>
            {group.sessions.map((sessionMetadata) => (
              <ListItem key={sessionMetadata.id} className="h-10">
                <Link
                  href={`/sessions/${sessionMetadata.id}`}
                  className="w-full cursor-default"
                >
                  <ListItemContent>
                    <Avatar>
                      <AvatarFallback>
                        {getInitials(sessionMetadata.lecturer)}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex flex-col">
                      <ListItemTitle>{sessionMetadata.name}</ListItemTitle>
                      <ListItemDescription className="text-xs text-muted-foreground">
                        {sessionMetadata.lecturer}
                      </ListItemDescription>
                    </div>
                  </ListItemContent>
                </Link>
                <SessionsListDropdownMenu sessionMetadata={sessionMetadata} />
              </ListItem>
            ))}
          </List>
        </div>
      ))}
    </>
  );
}
