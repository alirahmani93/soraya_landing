"use client";

import Image from "next/image";
import { useRef, useState } from "react";
import { EnquiryButton } from "./Enquiry";

export type PackageView = {
  id: string;
  name: string;
  tier: string;
  description: string;
  groups: {
    id: string;
    name: string;
    note: string;
    rows: { key: string; name: string; qty: string | null; image: string | null }[];
  }[];
};

export default function Packages({
  packages,
  pendingLabel,
  ctaLabel,
}: {
  packages: PackageView[];
  pendingLabel: string;
  ctaLabel: string;
}) {
  const [active, setActive] = useState(0);
  const tabs = useRef<(HTMLButtonElement | null)[]>([]);
  const current = packages[active];

  const move = (event: React.KeyboardEvent) => {
    const rtl = document.documentElement.dir === "rtl";
    const back = rtl ? "ArrowRight" : "ArrowLeft";
    const forward = rtl ? "ArrowLeft" : "ArrowRight";
    if (event.key !== back && event.key !== forward) return;
    event.preventDefault();
    const step = event.key === forward ? 1 : -1;
    const next = (active + step + packages.length) % packages.length;
    setActive(next);
    tabs.current[next]?.focus();
  };

  return (
    <div className="mt-14">
      <div
        role="tablist"
        aria-label={current.name}
        onKeyDown={move}
        className="flex flex-wrap gap-x-8 gap-y-3 border-b border-ink/15 pb-4"
      >
        {packages.map((pkg, i) => (
          <button
            key={pkg.id}
            ref={(node) => {
              tabs.current[i] = node;
            }}
            role="tab"
            id={`tab-${pkg.id}`}
            aria-selected={i === active}
            aria-controls={`panel-${pkg.id}`}
            tabIndex={i === active ? 0 : -1}
            onClick={() => setActive(i)}
            className={`display -mb-[17px] border-b-2 pb-4 text-xl transition-colors sm:text-2xl ${
              i === active
                ? "border-saffron text-ink"
                : "border-transparent text-ink/35 hover:text-ink/70"
            }`}
          >
            {pkg.name}
          </button>
        ))}
      </div>

      <div
        role="tabpanel"
        id={`panel-${current.id}`}
        aria-labelledby={`tab-${current.id}`}
        tabIndex={0}
      >
        <p className="mt-8 max-w-xl text-ink/60">
          <span className="me-3 text-xs uppercase tracking-[0.25em] text-saffron">
            {current.tier}
          </span>
          {current.description}
        </p>

        <div className="mt-10 grid gap-px bg-ink/10 sm:grid-cols-2">
          {current.groups.map((group) => (
            <article key={group.id} className="bg-paper p-8">
              <h3 className="display text-2xl">{group.name}</h3>
              <p className="mt-3 text-sm leading-relaxed text-ink/60">{group.note}</p>
              <dl className="mt-6 space-y-4 text-sm">
                {group.rows.map((row) => (
                  <div key={row.key} className="flex items-center gap-4">
                    {row.image && (
                      <Image
                        src={row.image}
                        alt=""
                        width={224}
                        height={224}
                        sizes="(min-width: 640px) 112px, 80px"
                        className="size-20 shrink-0 rounded-full object-cover sm:size-28"
                      />
                    )}
                    <div className="flex flex-1 flex-col gap-1 sm:flex-row sm:items-baseline sm:gap-3">
                      <dt className="text-ink/70">{row.name}</dt>
                      <span className="rule hidden h-px flex-1 border-b border-current sm:block" />
                      <dd
                        className={
                          row.qty ? "font-medium tabular-nums text-saffron" : "text-xs text-ink/35"
                        }
                      >
                        {row.qty ?? pendingLabel}
                      </dd>
                    </div>
                  </div>
                ))}
              </dl>
            </article>
          ))}
          {current.groups.length % 2 === 1 && <div className="hidden bg-paper sm:block" />}
        </div>

        <div className="mt-12">
          <EnquiryButton pkg={current.id} label={ctaLabel} />
        </div>
      </div>
    </div>
  );
}
