"use client";

import { useEffect } from "react";

interface ShortcutMap {
  [key: string]: () => void;
}

export function useKeyboardShortcuts(shortcuts: ShortcutMap) {
  useEffect(() => {
    function handler(e: KeyboardEvent) {
      const meta = e.metaKey || e.ctrlKey;
      const shift = e.shiftKey;
      const target = e.target as HTMLElement;
      const isInput = target.tagName === "INPUT" || target.tagName === "TEXTAREA" || target.isContentEditable;

      // Build key string
      let key = "";
      if (meta) key += "mod+";
      if (shift) key += "shift+";
      key += e.key.toLowerCase();

      // Allow meta-combos even in inputs
      if (isInput && !meta) return;

      const action = shortcuts[key];
      if (action) {
        e.preventDefault();
        action();
      }
    }

    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [shortcuts]);
}
