import type { ReactNode } from "react";

export type IconName =
  | "arrow"
  | "phone"
  | "mail"
  | "pin"
  | "menu"
  | "close"
  | "chevron"
  | "heart"
  | "lab"
  | "pill"
  | "baby"
  | "move"
  | "shield"
  | "book"
  | "award"
  | "users"
  | "check"
  | "external"
  | "plus"
  | "hand"
  | "search"
  | "clock"
  | "alert"
  | "chevron-right"
  | "chevron-left"
  | "chevron-down"
  | "external-link"
  | "activity"
  | "briefcase"
  | "briefcase-medical"
  | "calendar"
  | "heart-pulse"
  | "hospital"
  | "info"
  | "facebook"
  | "instagram"
  | "youtube"
  | "message-circle"
  | "microscope"
  | "play"
  | "stethoscope"
  | "syringe"
  | "user-round"
  | "video"
  | "home"
  | "eye"
  | "quote";

function drawing(name: IconName): ReactNode {
  switch (name) {
    case "arrow": return <><path d="M5 12h14" /><path d="m12 5 7 7-7 7" /></>;
    case "phone": return <path d="M22 16.9v3a2 2 0 0 1-2.2 2 19.8 19.8 0 0 1-8.6-3.1 19.5 19.5 0 0 1-6-6A19.8 19.8 0 0 1 2.1 4.2 2 2 0 0 1 4.1 2h3a2 2 0 0 1 2 1.7l.5 3.1a2 2 0 0 1-.6 1.7L7.5 10a16 16 0 0 0 6.5 6.5l1.5-1.5a2 2 0 0 1 1.7-.6l3.1.5a2 2 0 0 1 1.7 2Z" />;
    case "mail": return <><rect x="3" y="5" width="18" height="14" rx="2" /><path d="m3 7 9 6 9-6" /></>;
    case "pin": return <><path d="M20 10c0 5-8 12-8 12S4 15 4 10a8 8 0 1 1 16 0Z" /><circle cx="12" cy="10" r="2.5" /></>;
    case "menu": return <><path d="M4 7h16" /><path d="M4 12h16" /><path d="M4 17h16" /></>;
    case "close": return <><path d="m6 6 12 12" /><path d="M18 6 6 18" /></>;
    case "chevron": return <path d="m6 9 6 6 6-6" />;
    case "heart": return <path d="M20.8 8.7c0 5.3-8.8 10.3-8.8 10.3S3.2 14 3.2 8.7A4.7 4.7 0 0 1 12 6a4.7 4.7 0 0 1 8.8 2.7Z" />;
    case "lab": return <><path d="M9 3h6" /><path d="M10 3v6.3L5.4 17a2 2 0 0 0 1.7 3h9.8a2 2 0 0 0 1.7-3L14 9.3V3" /><path d="M8 15h8" /></>;
    case "pill": return <><path d="m10.5 20.5 10-10a5.7 5.7 0 0 0-8-8l-10 10a5.7 5.7 0 0 0 8 8Z" /><path d="m8.5 8.5 7 7" /></>;
    case "baby": return <><circle cx="12" cy="8" r="4" /><path d="M8 12a7 7 0 0 0-3 5.5A3.5 3.5 0 0 0 8.5 21h7a3.5 3.5 0 0 0 3.5-3.5 7 7 0 0 0-3-5.5" /><path d="M10 8h.01M14 8h.01M10 10a3 3 0 0 0 4 0" /></>;
    case "move": return <><circle cx="12" cy="5" r="2" /><path d="m9 21 2-6-3-3 2-3 3 2 2 3h4" /><path d="m11 15-4 1-2 4" /></>;
    case "shield": return <><path d="M12 22s8-4 8-11V5l-8-3-8 3v6c0 7 8 11 8 11Z" /><path d="m9 12 2 2 4-4" /></>;
    case "book": return <><path d="M4 5.5A2.5 2.5 0 0 1 6.5 3H20v16H6.5A2.5 2.5 0 0 0 4 21.5Z" /><path d="M4 5.5v16M8 7h8M8 11h8" /></>;
    case "award": return <><circle cx="12" cy="8" r="6" /><path d="m8.2 13.1-1 8.2L12 18l4.8 3.3-1-8.2" /><path d="m9.5 8 1.7 1.7L14.7 6" /></>;
    case "users": return <><path d="M16 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" /><circle cx="10" cy="7" r="4" /><path d="M20 21v-2a4 4 0 0 0-3-3.9M16 3.1a4 4 0 0 1 0 7.8" /></>;
    case "check": return <><circle cx="12" cy="12" r="9" /><path d="m8 12 2.5 2.5L16 9" /></>;
    case "external": return <><path d="M14 3h7v7" /><path d="m10 14 11-11" /><path d="M19 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V7a2 2 0 0 1 2-2h6" /></>;
    case "plus": return <><path d="M12 5v14" /><path d="M5 12h14" /></>;
    case "hand": return <><path d="M7 11V5a1.5 1.5 0 0 1 3 0v5-7a1.5 1.5 0 0 1 3 0v7-5a1.5 1.5 0 0 1 3 0v7-3a1.5 1.5 0 0 1 3 0v6c0 4-2.5 7-7 7h-1c-2.5 0-4-1-5-2.5L4 15a1.7 1.7 0 0 1 2.5-2.2L9 15" /></>;
    case "search": return <><circle cx="11" cy="11" r="8" /><path d="m21 21-4.3-4.3" /></>;
    case "clock": return <><circle cx="12" cy="12" r="10" /><path d="M12 6v6l4 2" /></>;
    case "alert": return <><circle cx="12" cy="12" r="10" /><line x1="12" x2="12" y1="8" y2="12" /><line x1="12" x2="12.01" y1="16" y2="16" /></>;
    case "chevron-right": return <path d="m9 6 6 6-6 6" />;
    case "chevron-left": return <path d="m15 6-6 6 6 6" />;
    case "chevron-down": return <path d="m6 9 6 6 6-6" />;
    case "external-link": return <><path d="M15 3h6v6" /><path d="m10 14 11-11" /><path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" /></>;
    case "activity": return <path d="M22 12h-4l-3 9L9 3l-3 9H2" />;
    case "briefcase": return <><path d="M16 20V4a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16" /><rect x="2" y="6" width="20" height="14" rx="2" /></>;
    case "briefcase-medical": return <><path d="M12 11v4M14 13h-4" /><path d="M16 6V4a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v2" /><path d="M18 6v14M6 6v14" /><rect x="2" y="6" width="20" height="14" rx="2" /></>;
    case "calendar": return <><path d="M8 2v4M16 2v4" /><rect x="3" y="4" width="18" height="18" rx="2" /><path d="M3 10h18" /></>;
    case "heart-pulse": return <><path d="M19 14c1.5-1.5 3-3.2 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.8 0-3 .5-4.5 2-1.5-1.5-2.7-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4 3 5.5l7 7Z" /><path d="M3.2 12h6.3l.5-1 2 4.5 2-7 1.5 3.5h5.3" /></>;
    case "hospital": return <><path d="M12 6v4M14 8h-4" /><path d="M14 22v-4a2 2 0 0 0-4 0v4" /><path d="M18 22V5.6a1 1 0 0 0-.6-.9L12.9 2.4a2 2 0 0 0-1.8 0L6.6 4.7a1 1 0 0 0-.6.9V22" /><path d="m18 7 3.4 1.7a1 1 0 0 1 .6.9V20a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V9.6a1 1 0 0 1 .6-.9L6 7" /></>;
    case "info": return <><circle cx="12" cy="12" r="10" /><path d="M12 16v-4M12 8h.01" /></>;
    case "facebook": return <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3Z" />;
    case "instagram": return <><rect x="2" y="2" width="20" height="20" rx="5" /><circle cx="12" cy="12" r="4" /><path d="M17.5 6.5h.01" /></>;
    case "youtube": return <><path d="M2.5 17a24 24 0 0 1 0-10 2 2 0 0 1 1.4-1.4 49.6 49.6 0 0 1 16.2 0A2 2 0 0 1 21.5 7a24 24 0 0 1 0 10 2 2 0 0 1-1.4 1.4 49.6 49.6 0 0 1-16.2 0A2 2 0 0 1 2.5 17Z" /><path d="m10 15 5-3-5-3Z" /></>;
    case "message-circle": return <path d="M7.9 20A9 9 0 1 0 4 16.1L2 22Z" />;
    case "microscope": return <><path d="M6 18h8" /><path d="M3 22h18" /><path d="M14 22a7 7 0 1 0 0-14h-1" /><path d="M9 14h2" /><path d="M9 12a2 2 0 0 1-2-2V6h6v4a2 2 0 0 1-2 2Z" /><path d="M12 6V3a1 1 0 0 0-1-1H9a1 1 0 0 0-1 1v3" /></>;
    case "play": return <path d="M6 3 20 12 6 21Z" />;
    case "stethoscope": return <><path d="M11 2v2M5 2v2" /><path d="M5 3H4a2 2 0 0 0-2 2v4a6 6 0 0 0 12 0V5a2 2 0 0 0-2-2h-1" /><path d="M8 15a6 6 0 0 0 12 0v-3" /><circle cx="20" cy="10" r="2" /></>;
    case "syringe": return <><path d="m18 2 4 4M17 7l3-3M19 9 8.7 19.3a2 2 0 0 1-2.8 0l-.6-.6a2 2 0 0 1 0-2.8L15 5M9 11l4 4M5 19l-3 3M14 4l6 6" /></>;
    case "user-round": return <><circle cx="12" cy="8" r="5" /><path d="M20 21a8 8 0 0 0-16 0" /></>;
    case "video": return <><rect x="2" y="6" width="14" height="12" rx="2" /><path d="m16 10 6-3v10l-6-3Z" /></>;
    case "home": return <><path d="M15 21v-8a1 1 0 0 0-1-1h-4a1 1 0 0 0-1 1v8" /><path d="M3 10a2 2 0 0 1 .7-1.5l7-6a2 2 0 0 1 2.6 0l7 6A2 2 0 0 1 21 10v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2Z" /></>;
    case "eye": return <><path d="M2 12s3.6-7 10-7 10 7 10 7-3.6 7-10 7-10-7-10-7Z" /><circle cx="12" cy="12" r="3" /></>;
    case "quote": return <><path d="M10 9c0-2.2-1.8-4-4-4S2 6.8 2 9s1.8 4 4 4c0 2.2-.9 3.4-3 4" /><path d="M20 9c0-2.2-1.8-4-4-4s-4 1.8-4 4 1.8 4 4 4c0 2.2-.9 3.4-3 4" /></>;
  }
}

export function Icon({ name, size = 20, className }: { name: IconName; size?: number; className?: string }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.7"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      aria-hidden="true"
    >
      {drawing(name)}
    </svg>
  );
}
