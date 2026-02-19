import React from "react";

export function CarIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="none" {...props}>
      <rect x="2" y="10" width="20" height="6" rx="2" fill="currentColor" />
      <circle cx="7" cy="18" r="2" fill="currentColor" />
      <circle cx="17" cy="18" r="2" fill="currentColor" />
      <rect x="5" y="6" width="14" height="6" rx="2" fill="currentColor" opacity=".5" />
    </svg>
  );
}

export function UserIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="none" {...props}>
      <circle cx="12" cy="8" r="4" fill="currentColor" />
      <rect x="4" y="16" width="16" height="4" rx="2" fill="currentColor" />
    </svg>
  );
}

export function LeadIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="none" {...props}>
      <rect x="4" y="4" width="16" height="16" rx="4" fill="currentColor" />
      <rect x="8" y="8" width="8" height="2" rx="1" fill="#fff" />
      <rect x="8" y="12" width="5" height="2" rx="1" fill="#fff" />
    </svg>
  );
}
