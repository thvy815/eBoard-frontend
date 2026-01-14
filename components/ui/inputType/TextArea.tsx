"use client";

import { TextareaHTMLAttributes } from "react";

export default function Textarea(
  props: TextareaHTMLAttributes<HTMLTextAreaElement>
) {
  return (
    <textarea
      {...props}
      className={`
        w-full rounded-xl border px-3 py-2 text-sm
        focus:outline-none focus:ring-2 focus:ring-[#518581]/40
        ${props.className || ""}
      `}
    />
  );
}
