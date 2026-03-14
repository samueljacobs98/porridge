import type { ComponentProps } from "react";
import { cn } from "../lib/utils";

export function List({ className, children, ...props }: ComponentProps<"ul">) {
  return (
    <ul
      className={cn("group/list flex list-none flex-col gap-2", className)}
      {...props}
    >
      {children}
    </ul>
  );
}

export function ListItem({
  className,
  children,
  ...props
}: ComponentProps<"li">) {
  return (
    <li
      className={cn(
        "group/list-item flex items-center justify-between rounded-md px-2 py-1 font-semibold hover:bg-muted/50",
        className
      )}
      {...props}
    >
      {children}
    </li>
  );
}

export function ListItemContent({
  className,
  children,
  ...props
}: ComponentProps<"div">) {
  return (
    <div className={cn("flex items-center gap-2", className)} {...props}>
      {children}
    </div>
  );
}

export function ListItemTitle({
  className,
  children,
  ...props
}: ComponentProps<"p">) {
  return (
    <p className={cn("text-xs", className)} {...props}>
      {children}
    </p>
  );
}

export function ListItemDescription({
  className,
  children,
  ...props
}: ComponentProps<"p">) {
  return (
    <p className={cn("text-xs text-muted-foreground", className)} {...props}>
      {children}
    </p>
  );
}
