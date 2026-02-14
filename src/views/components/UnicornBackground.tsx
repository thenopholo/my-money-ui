import { useEffect, useRef } from "react";

const UNICORN_CDN = "https://cdn.unicorn.studio/v1.3.2/unicornStudio.umd.js";

interface UnicornBackgroundProps {
  projectId: string;
}

export function UnicornBackground({ projectId }: UnicornBackgroundProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const instanceRef = useRef<{ destroy: () => void } | null>(null);

  useEffect(() => {
    let cancelled = false;

    const loadScript = (): Promise<void> => {
      if (window.UnicornStudio) return Promise.resolve();

      return new Promise((resolve, reject) => {
        const script = document.createElement("script");
        script.src = UNICORN_CDN;
        script.async = true;
        script.onload = () => resolve();
        script.onerror = () => reject(new Error("Failed to load UnicornStudio"));
        document.head.appendChild(script);
      });
    };

    loadScript()
      .then(() => {
        if (cancelled || !window.UnicornStudio || !containerRef.current) return;
        return window.UnicornStudio.init({
          projectId,
          elementId: containerRef.current.id,
          scale: 1,
          lazyLoad: true,
        });
      })
      .then((inst) => {
        if (inst && !cancelled) {
          instanceRef.current = inst;
        }
      })
      .catch(() => {
        // Silently fail — decorative only
      });

    return () => {
      cancelled = true;
      instanceRef.current?.destroy();
      instanceRef.current = null;
    };
  }, [projectId]);

  return (
    <div
      ref={containerRef}
      id={`unicorn-bg-${projectId}`}
      data-us-project={projectId}
      className="fixed inset-0 z-0 pointer-events-none"
    />
  );
}
