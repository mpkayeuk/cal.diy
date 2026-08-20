"use client";

import { useEffect } from "react";

type CssVariables = Record<string, string>;

const applyVars = (element: HTMLElement, vars: CssVariables) => {
  Object.entries(vars).forEach(([key, value]) => {
    if (value) {
      element.style.setProperty(`--${key}`, value);
    }
  });
};

const useCalcomTheme = (theme: Record<string, CssVariables>) => {
  const themeKey = JSON.stringify(theme);

  useEffect(() => {
    const parsedTheme = JSON.parse(themeKey) as Record<string, CssVariables>;
    const root = document.documentElement;

    const apply = () => {
      const mode = root.classList.contains("dark") ? "dark" : "light";
      const active = parsedTheme[mode] ?? parsedTheme.light;
      if (active) {
        applyVars(root, active);
      }

      Object.entries(parsedTheme).forEach(([key, value]) => {
        if (!value || key === "root") {
          return;
        }

        document.querySelectorAll(`.${key}`).forEach((element) => {
          applyVars(element as HTMLElement, value);
        });
      });

      if (parsedTheme.root) {
        applyVars(root, parsedTheme.root);
      }
    };

    apply();

    const observer = new MutationObserver(apply);
    observer.observe(root, { attributes: true, attributeFilter: ["class"] });
    return () => observer.disconnect();
  }, [themeKey]);
};

export { useCalcomTheme };
