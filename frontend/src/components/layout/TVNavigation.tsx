import { useEffect, useRef } from "react";
import { useLocation } from "react-router-dom";

const focusableSelector =
  '[data-tv-focusable], a[href], button:not([disabled]), input:not([disabled]), [tabindex]:not([tabindex="-1"])';

const isVisible = (element: HTMLElement) => {
  const rect = element.getBoundingClientRect();
  const style = window.getComputedStyle(element);

  return (
    rect.width > 0 &&
    rect.height > 0 &&
    style.display !== "none" &&
    style.visibility !== "hidden"
  );
};

const TVNavigation = () => {
  const location = useLocation();
  const currentPath = useRef(location.pathname);
  const focusMemory = useRef<Record<string, string>>({});

  useEffect(() => {
    currentPath.current = location.pathname;

    const savedKey = focusMemory.current[location.pathname];
    const selector = savedKey
      ? `[data-tv-focus-key="${CSS.escape(savedKey)}"]`
      : "[data-tv-autofocus]";
    const focusTarget = () => {
      const element = document.querySelector<HTMLElement>(selector);
      if (!element || !isVisible(element)) return false;

      element.focus();
      element.scrollIntoView({ block: "nearest", inline: "center" });
      return true;
    };

    if (focusTarget()) return;

    const observer = new MutationObserver(() => {
      if (focusTarget()) observer.disconnect();
    });
    observer.observe(document.body, { childList: true, subtree: true });

    const timeout = window.setTimeout(() => observer.disconnect(), 5_000);
    return () => {
      observer.disconnect();
      window.clearTimeout(timeout);
    };
  }, [location.pathname]);

  useEffect(() => {
    const rememberFocus = (event: FocusEvent) => {
      const element = event.target as HTMLElement;
      const key = element.dataset.tvFocusKey;

      if (key) focusMemory.current[currentPath.current] = key;
    };

    const moveFocus = (event: KeyboardEvent) => {
      if (!["ArrowLeft", "ArrowRight", "ArrowUp", "ArrowDown"].includes(event.key)) {
        return;
      }

      const active = document.activeElement as HTMLElement | null;
      if (!active) return;

      if (active instanceof HTMLInputElement) {
        if (active.type === "range") return;

        const selectionStart = active.selectionStart ?? 0;
        const selectionEnd = active.selectionEnd ?? 0;
        const atStart = selectionStart === 0 && selectionEnd === 0;
        const atEnd =
          selectionStart === active.value.length &&
          selectionEnd === active.value.length;

        if (
          (event.key === "ArrowLeft" && !atStart) ||
          (event.key === "ArrowRight" && !atEnd)
        ) {
          return;
        }
      } else if (active.matches("textarea, select")) {
        return;
      }

      const activeScope = active.closest<HTMLElement>('[data-tv-scope="active"]');
      const root =
        activeScope ??
        document.querySelector<HTMLElement>('[data-tv-scope="active"]') ??
        document.body;
      const candidates = Array.from(
        root.querySelectorAll<HTMLElement>(focusableSelector)
      ).filter((element) => element !== active && isVisible(element));

      const current = active.getBoundingClientRect();
      const currentX = current.left + current.width / 2;
      const currentY = current.top + current.height / 2;

      const ranked = candidates
        .map((element) => {
          const rect = element.getBoundingClientRect();
          const x = rect.left + rect.width / 2;
          const y = rect.top + rect.height / 2;
          const deltaX = x - currentX;
          const deltaY = y - currentY;
          const valid =
            (event.key === "ArrowLeft" && deltaX < -1) ||
            (event.key === "ArrowRight" && deltaX > 1) ||
            (event.key === "ArrowUp" && deltaY < -1) ||
            (event.key === "ArrowDown" && deltaY > 1);

          if (!valid) return null;

          const primary =
            event.key === "ArrowLeft" || event.key === "ArrowRight"
              ? Math.abs(deltaX)
              : Math.abs(deltaY);
          const secondary =
            event.key === "ArrowLeft" || event.key === "ArrowRight"
              ? Math.abs(deltaY)
              : Math.abs(deltaX);

          return { element, score: primary + secondary * 2.5 };
        })
        .filter((item): item is { element: HTMLElement; score: number } => Boolean(item))
        .sort((a, b) => a.score - b.score);

      const next = ranked[0]?.element;
      if (!next) return;

      event.preventDefault();
      next.focus();
      next.scrollIntoView({
        behavior: "smooth",
        block: "nearest",
        inline: "center",
      });
    };

    document.addEventListener("focusin", rememberFocus);
    document.addEventListener("keydown", moveFocus);

    return () => {
      document.removeEventListener("focusin", rememberFocus);
      document.removeEventListener("keydown", moveFocus);
    };
  }, []);

  return null;
};

export default TVNavigation;
