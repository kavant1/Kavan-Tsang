import React, { useState, useEffect, useRef } from "react";
import { motion } from "framer-motion";
import { User, FolderOpen, Briefcase, GraduationCap, Mail } from "lucide-react";
import type { LucideIcon } from "lucide-react";

interface NavItem {
  name: string;
  url: string;
  icon: LucideIcon;
}

const NAV_ITEMS: NavItem[] = [
  { name: "About",      url: "#about",      icon: User },
  { name: "Projects",   url: "#projects",   icon: FolderOpen },
  { name: "Experience", url: "#experience", icon: Briefcase },
  { name: "Education",  url: "#education",  icon: GraduationCap },
  { name: "Contact",    url: "#contact",    icon: Mail },
];

export function TubelightNavBar() {
  const [activeTab, setActiveTab] = useState("About");
  const scrollLocked = useRef(false);
  const lockTimer    = useRef<ReturnType<typeof setTimeout>>();

  // Scrollspy — sync active item with the visible section
  useEffect(() => {
    const targets = NAV_ITEMS.map(item => ({
      id: item.url.split("#")[1],
      name: item.name,
    }));

    const observer = new IntersectionObserver(
      entries => {
        // Skip updates while a click-scroll is in progress
        if (scrollLocked.current) return;
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            const match = targets.find(t => t.id === entry.target.id);
            if (match) setActiveTab(match.name);
          }
        });
      },
      { rootMargin: "-45% 0px -50% 0px" }
    );

    targets.forEach(({ id }) => {
      const el = document.getElementById(id);
      if (el) observer.observe(el);
    });

    return () => observer.disconnect();
  }, []);

  return (
    <nav
      className="flex items-center gap-0.5 py-1 px-1 rounded-full"
      style={{
        background: "color-mix(in srgb, var(--surface) 70%, transparent)",
        border: "1px solid var(--border)",
        backdropFilter: "blur(14px)",
        WebkitBackdropFilter: "blur(14px)",
      }}
    >
      {NAV_ITEMS.map(item => {
        const isActive = activeTab === item.name;
        const Icon = item.icon;

        return (
          <a
            key={item.name}
            href={item.url}
            onClick={() => {
              setActiveTab(item.name);
              scrollLocked.current = true;
              clearTimeout(lockTimer.current);
              lockTimer.current = setTimeout(() => {
                scrollLocked.current = false;
              }, 1000);
            }}
            className="relative rounded-full px-5 py-2 text-sm font-semibold cursor-pointer no-underline select-none"
            style={{ color: isActive ? "var(--accent)" : "var(--text-muted)" }}
          >
            {/* Desktop: text label */}
            <span className="hidden lg:inline relative z-10">{item.name}</span>
            {/* Mobile / compact: icon */}
            <span className="lg:hidden relative z-10 flex items-center justify-center">
              <Icon size={16} strokeWidth={2.2} />
            </span>

            {isActive && (
              <motion.span
                layoutId="tubelight-pill"
                className="absolute inset-0 rounded-full -z-0"
                style={{
                  background: "color-mix(in srgb, var(--accent) 10%, transparent)",
                }}
                initial={false}
                transition={{ type: "spring", stiffness: 500, damping: 50, mass: 0.5 }}
              >
                {/* Tubelight bar */}
                <span
                  className="absolute left-1/2 -translate-x-1/2 w-8 h-[3px] rounded-t-full"
                  style={{ top: "-5px", background: "var(--accent)" }}
                />
                {/* Outer glow */}
                <span
                  className="absolute left-1/2 -translate-x-1/2 w-14 h-7 rounded-full"
                  style={{
                    top: "-18px",
                    filter: "blur(10px)",
                    background: "color-mix(in srgb, var(--accent) 24%, transparent)",
                  }}
                />
                {/* Inner glow */}
                <span
                  className="absolute left-1/2 -translate-x-1/2 w-8 h-5 rounded-full"
                  style={{
                    top: "-12px",
                    filter: "blur(6px)",
                    background: "color-mix(in srgb, var(--accent) 32%, transparent)",
                  }}
                />
              </motion.span>
            )}
          </a>
        );
      })}
    </nav>
  );
}
