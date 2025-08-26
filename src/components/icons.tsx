import type { SVGProps } from "react";

export function Logo(props: SVGProps<SVGSVGElement>) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      {...props}
    >
        <path d="M7.5 7.5l-5 5 5 5" />
        <path d="M16.5 7.5l5 5-5 5" />
        <path d="M14 17l-6-10" />
    </svg>
  );
}
