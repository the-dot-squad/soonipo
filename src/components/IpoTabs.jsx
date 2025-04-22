"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Tabs from "./Tabs";
import IpoTable from "./IpoTable";
import IpoDetailsCard from "./IpoDetailsCard";

export default function IpoTabs({ upcomingIpos, pastIpos }) {
  /* ---------- state ---------- */
  const [active,   setActive]   = useState("upcoming");
  const [selected, setSelected] = useState(null);

  /* once a row is clicked for the first time */
  const [cardDocked, setCardDocked] = useState(false);

  const ipos = active === "upcoming" ? upcomingIpos : pastIpos;
  const showCard = Boolean(selected);

  /* table width: 100 % until first open, then 68 % */
  const tableWidth = cardDocked ? "68%" : "100%";

  /* ---------- helpers ---------- */
  const handleRowSelect = (ipo) => {
    setSelected(ipo);
    if (!cardDocked) setCardDocked(true); // lock layout after first open
  };

  const handleTabChange = (id) => {
    setActive(id);
    setSelected(null);
    setCardDocked(false); // reset layout on list switch
  };

  /* ---------- render ---------- */
  return (
    <div className="relative">
      {/* top tabs */}
      <div className="mb-6 flex justify-center">
        <Tabs active={active} onChange={handleTabChange} />
      </div>

      {/* flex row */}
      <div className="flex justify-center">
        {/* TABLE  */}
        <motion.div
          layout
          transition={{ duration: 0.45 }}
          style={{ width: tableWidth }}
          className="min-w-0"
        >
          <IpoTable ipos={ipos} onSelectIpo={handleRowSelect} />
        </motion.div>

        {/* CARD dock (desktop) stays mounted; inner content animates */}
        <motion.div
          layout
          style={{ width: cardDocked ? "32%" : 0 }}
          className={`hidden md:block overflow-hidden ml-6`}
        >
          <AnimatePresence mode="wait">
            {showCard && (
              <motion.div
                key={selected.symbol}
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -12 }}
                transition={{ duration: 0.25 }}
              >
                <IpoDetailsCard ipo={selected} />
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      </div>

      {/* Mobile card (stacked) */}
      <AnimatePresence mode="wait">
        {showCard && (
          <motion.div
            key={selected.symbol + "-m"}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25 }}
            className="md:hidden mt-6"
          >
            <IpoDetailsCard ipo={selected} />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
