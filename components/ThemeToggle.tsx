"use client";

import { Monitor, Moon, Sun } from "lucide-react";
import { useEffect, useRef, useState } from "react";

export type ThemeLabels = { theme: string; light: string; dark: string; system: string };
type Theme = "light" | "dark" | "system";

function resolvedTheme(theme: Theme) {
  if (theme !== "system") return theme;
  return window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
}

export function ThemeToggle({ labels }: { labels: ThemeLabels }) {
  const [theme, setTheme] = useState<Theme>("system");
  const [open, setOpen] = useState(false);
  const wrap = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const saved = (localStorage.getItem("theme") as Theme | null) ?? "system";
    setTheme(saved);
    document.documentElement.dataset.theme = resolvedTheme(saved);

    const media = window.matchMedia("(prefers-color-scheme: dark)");
    const onChange = () => {
      const current = (localStorage.getItem("theme") as Theme | null) ?? "system";
      if (current === "system") document.documentElement.dataset.theme = resolvedTheme("system");
    };
    media.addEventListener("change", onChange);
    return () => media.removeEventListener("change", onChange);
  }, []);

  useEffect(() => {
    const onClick = (event: MouseEvent) => {
      if (wrap.current && !wrap.current.contains(event.target as Node)) setOpen(false);
    };
    document.addEventListener("mousedown", onClick);
    return () => document.removeEventListener("mousedown", onClick);
  }, []);

  const choose = (next: Theme) => {
    setTheme(next);
    localStorage.setItem("theme", next);
    document.documentElement.dataset.theme = resolvedTheme(next);
    setOpen(false);
  };

  const Icon = theme === "dark" ? Moon : theme === "light" ? Sun : Monitor;

  return (
    <div className="themeWrap" ref={wrap}>
      <button className="iconButton" onClick={() => setOpen((value) => !value)} aria-label={labels.theme} aria-expanded={open}>
        <Icon size={17} />
      </button>
      {open && (
        <div className="themeMenu" role="menu">
          <button className={theme === "light" ? "active" : ""} onClick={() => choose("light")}><Sun size={15} /> {labels.light}</button>
          <button className={theme === "dark" ? "active" : ""} onClick={() => choose("dark")}><Moon size={15} /> {labels.dark}</button>
          <button className={theme === "system" ? "active" : ""} onClick={() => choose("system")}><Monitor size={15} /> {labels.system}</button>
        </div>
      )}
    </div>
  );
}
