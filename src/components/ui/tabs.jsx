"use client";

import { cn } from "@/lib/utils";

export function Tabs({ value, onValueChange, children, className }) {
  return (
    <div
      className={className}
      role="tablist"
      onClick={(event) => {
        const button = event.target.closest("button[data-value]");
        if (button) {
          onValueChange?.(button.dataset.value);
        }
      }}
    >
      {typeof children === "function" ? children(value) : children}
    </div>
  );
}

export function TabsList({ className, ...props }) {
  return (
    <div
      className={cn(
        "inline-flex h-10 items-center justify-center rounded-md bg-muted p-1 text-muted-foreground",
        className
      )}
      {...props}
    />
  );
}

export function TabsTrigger({ className, value, activeValue, children, ...props }) {
  const active = value === activeValue;
  return (
    <button
      type="button"
      role="tab"
      data-value={value}
      aria-selected={active}
      className={cn(
        "inline-flex items-center justify-center whitespace-nowrap rounded-sm px-3 py-1.5 text-sm font-medium transition-all",
        active ? "bg-background text-foreground shadow-sm" : "",
        className
      )}
      {...props}
    >
      {children}
    </button>
  );
}
