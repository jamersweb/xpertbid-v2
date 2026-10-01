"use client";

import { useState, type ReactNode } from "react";

type Props = {
  title: string;
  children: ReactNode;
  defaultOpen?: boolean;
};

export function AccordionItem({ title, children, defaultOpen = false }: Props) {
  const [open, setOpen] = useState(defaultOpen);

  return (
    <div className={`xb-accordion ${open ? "open" : ""}`}>
      <button
        type="button"
        className="xb-acc-head"
        onClick={() => setOpen((value) => !value)}
        aria-expanded={open}
      >
        <span>{title}</span>
        <i className={`fa-solid ${open ? "fa-chevron-up" : "fa-chevron-down"}`} />
      </button>
      {open ? <div className="xb-acc-body">{children}</div> : null}
    </div>
  );
}
