"use client";
import { motion } from "framer-motion";

const TABS = [
  { id: "upcoming", label: "Upcoming" },
  { id: "past", label: "Past" },
];

/* spring for snappy but smooth animation */
const spring = { type: "spring", stiffness: 500, damping: 30 };

export default function Tabs({ active, onChange }) {
  return (
    <div className="inline-flex rounded-full bg-gray-200/70 p-1">
      {TABS.map(({ id, label }) => {
        const isActive = active === id;
        return (
          <button
            key={id}
            onClick={() => onChange(id)}
            className="relative z-10 px-6 py-2 text-sm font-medium whitespace-nowrap"
          >
            {/* animated pill — only rendered for the active tab */}
            {isActive && (
              <motion.span
                layoutId="pill"
                transition={spring}
                className="absolute inset-0 rounded-full bg-blue-600 shadow"
              />
            )}

            {/* label text; ensure it stays above the pill */}
            <span className={`relative ${isActive ? "text-white" : "text-gray-600"}`}>
              {label}
            </span>
          </button>
        );
      })}
    </div>
  );
}
