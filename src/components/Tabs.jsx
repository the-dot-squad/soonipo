"use client";

import { Tabs as TabsRoot, TabsList, TabsTrigger } from "@/components/ui/tabs";

const TABS = [
  { id: "upcoming", label: "Upcoming" },
  { id: "past", label: "Past" },
];

export default function Tabs({ active, onChange }) {
  return (
    <TabsRoot value={active} onValueChange={onChange}>
      <TabsList className="rounded-full">
        {TABS.map(({ id, label }) => (
          <TabsTrigger key={id} value={id} activeValue={active} className="rounded-full px-6">
            {label}
          </TabsTrigger>
        ))}
      </TabsList>
    </TabsRoot>
  );
}
