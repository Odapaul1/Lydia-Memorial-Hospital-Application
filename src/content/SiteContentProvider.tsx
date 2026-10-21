import { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState, type ReactNode } from "react";
import { fetchPublicContent } from "./api";
import { defaultPages } from "./defaultPages";
import { defaultSiteSettings } from "./defaultSiteSettings";
import type { CmsPage, SiteSettings } from "./types";

/**
 * Single source of truth for published site content. Every visitor page reads
 * its copy and imagery from here, so editing an image in the admin library and
 * saving the settings/page that references it updates the live page on the next
 * load (and immediately when the tab regains focus).
 */

export type SiteContentStatus = "loading" | "ready" | "offline";

interface SiteContentValue {
  settings: SiteSettings;
  pages: CmsPage[];
  status: SiteContentStatus;
  reload: () => Promise<void>;
}

const SiteContentContext = createContext<SiteContentValue | null>(null);

export function SiteContentProvider({ children }: { children: ReactNode }) {
  const [settings, setSettings] = useState<SiteSettings>(defaultSiteSettings);
  const [pages, setPages] = useState<CmsPage[]>(defaultPages);
  const [status, setStatus] = useState<SiteContentStatus>("loading");
  const controllerRef = useRef<AbortController | null>(null);

  const reload = useCallback(async () => {
    controllerRef.current?.abort();
    const controller = new AbortController();
    controllerRef.current = controller;
    try {
      const payload = await fetchPublicContent(controller.signal);
      setSettings(payload.settings);
      setPages(payload.pages);
      setStatus("ready");
    } catch (error) {
      if ((error as Error | null)?.name === "AbortError") return;
      // Keep the bundled defaults so the public site still renders if the API
      // is unreachable (for example a static-only preview deployment).
      setStatus("offline");
    }
  }, []);

  useEffect(() => {
    void reload();
    const refresh = () => {
      if (document.visibilityState !== "visible") return;
      void reload();
    };
    window.addEventListener("focus", refresh);
    document.addEventListener("visibilitychange", refresh);
    return () => {
      controllerRef.current?.abort();
      window.removeEventListener("focus", refresh);
      document.removeEventListener("visibilitychange", refresh);
    };
  }, [reload]);

  const value = useMemo<SiteContentValue>(
    () => ({ settings, pages, status, reload }),
    [settings, pages, status, reload],
  );

  return <SiteContentContext.Provider value={value}>{children}</SiteContentContext.Provider>;
}

export function useSiteContent(): SiteContentValue {
  const value = useContext(SiteContentContext);
  if (!value) throw new Error("useSiteContent must be used inside <SiteContentProvider>");
  return value;
}

export const useSiteSettings = (): SiteSettings => useSiteContent().settings;
