"use client";

import { createContext, useContext, useEffect, useRef, useState } from "react";
import { track } from "@/lib/analytics";

export type EnquiryCopy = {
  ctaPackage: string;
  ctaContact: string;
  title: string;
  lede: string;
  fields: {
    name: string;
    email: string;
    phone: string;
    optional: string;
    package: string;
    quantity: string;
    message: string;
  };
  submit: string;
  copy: string;
  copied: string;
  close: string;
  to: string;
  subject: string;
};

export type EnquiryPackage = { id: string; name: string };

const EnquiryContext = createContext<((pkg?: string) => void) | null>(null);

export function useEnquiry() {
  return useContext(EnquiryContext);
}

function compose(form: HTMLFormElement, copy: EnquiryCopy, packages: EnquiryPackage[]) {
  const data = new FormData(form);
  const value = (key: string) => String(data.get(key) ?? "").trim();
  const pkg = packages.find((p) => p.id === value("package"));

  const lines = [
    `${copy.fields.package}: ${pkg?.name ?? "—"}`,
    `${copy.fields.quantity}: ${value("quantity") || "—"}`,
    "",
    value("message"),
    "",
    `${copy.fields.name}: ${value("name")}`,
    `${copy.fields.email}: ${value("email")}`,
    `${copy.fields.phone}: ${value("phone") || "—"}`,
  ];

  return {
    subject: `${copy.subject} — ${pkg?.name ?? ""}`.trim(),
    body: lines.join("\n"),
  };
}

export function EnquiryProvider({
  copy,
  packages,
  email,
  children,
}: {
  copy: EnquiryCopy;
  packages: EnquiryPackage[];
  email: string | null;
  children: React.ReactNode;
}) {
  const dialog = useRef<HTMLDialogElement>(null);
  const form = useRef<HTMLFormElement>(null);
  const [selected, setSelected] = useState(packages[0]?.id ?? "");
  const [copied, setCopied] = useState(false);

  const open = (pkg?: string) => {
    if (pkg) setSelected(pkg);
    setCopied(false);
    dialog.current?.showModal();
  };

  useEffect(() => {
    const node = dialog.current;
    if (!node) return;
    const onClose = () => setCopied(false);
    node.addEventListener("close", onClose);
    return () => node.removeEventListener("close", onClose);
  }, []);

  const submit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!email || !form.current) return;
    const { subject, body } = compose(form.current, copy, packages);
    window.location.href = `mailto:${email}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
  };

  const copyToClipboard = async () => {
    if (!form.current) return;
    const { body } = compose(form.current, copy, packages);
    await navigator.clipboard.writeText(body);
    setCopied(true);
  };

  const field = "mt-2 w-full border-b border-ink/25 bg-transparent pb-2 text-ink outline-none transition-colors focus:border-saffron";
  const label = "block text-xs uppercase tracking-[0.2em] text-ink/50";

  return (
    <EnquiryContext.Provider value={email ? open : null}>
      {children}

      <dialog
        ref={dialog}
        aria-labelledby="enquiry-title"
        /* Tailwind's preflight zeroes the margin a native dialog relies on to centre
           itself, so the centring is explicit here. */
        className="fixed inset-0 m-auto h-fit max-h-[88vh] w-[min(38rem,92vw)] overflow-y-auto bg-paper p-0 text-ink shadow-[0_40px_100px_-20px_rgba(0,0,0,0.55)] backdrop:bg-ink/75"
      >
        <form ref={form} onSubmit={submit} className="p-8 sm:p-10">
          <h2 id="enquiry-title" className="display text-3xl">
            {copy.title}
          </h2>
          <p className="mt-3 text-sm leading-relaxed text-ink/60">{copy.lede}</p>

          <div className="mt-8 grid gap-6 sm:grid-cols-2">
            <label className="sm:col-span-2">
              <span className={label}>{copy.fields.package}</span>
              <select
                name="package"
                value={selected}
                onChange={(e) => setSelected(e.target.value)}
                className={field}
              >
                {packages.map((p) => (
                  <option key={p.id} value={p.id}>
                    {p.name}
                  </option>
                ))}
              </select>
            </label>

            <label>
              <span className={label}>{copy.fields.name}</span>
              <input name="name" required autoComplete="name" className={field} />
            </label>

            <label>
              <span className={label}>{copy.fields.email}</span>
              <input name="email" type="email" required autoComplete="email" className={field} />
            </label>

            <label>
              <span className={label}>
                {copy.fields.phone}{" "}
                <span className="normal-case tracking-normal text-ink/30">
                  ({copy.fields.optional})
                </span>
              </span>
              <input name="phone" inputMode="tel" autoComplete="tel" dir="ltr" className={field} />
            </label>

            <label>
              <span className={label}>
                {copy.fields.quantity}{" "}
                <span className="normal-case tracking-normal text-ink/30">
                  ({copy.fields.optional})
                </span>
              </span>
              <input name="quantity" inputMode="numeric" className={field} />
            </label>

            <label className="sm:col-span-2">
              <span className={label}>{copy.fields.message}</span>
              <textarea name="message" rows={3} className={`${field} resize-none`} />
            </label>
          </div>

          <div className="mt-8 flex flex-wrap items-center gap-x-8 gap-y-4">
            <button
              type="submit"
              className="bg-saffron px-7 py-3 text-sm uppercase tracking-[0.2em] text-paper transition-colors hover:bg-ink"
            >
              {copy.submit}
            </button>
            <button
              type="button"
              onClick={copyToClipboard}
              className="border-b border-ink/30 pb-1 text-sm text-ink/60 transition-colors hover:border-saffron hover:text-saffron"
            >
              {copied ? copy.copied : copy.copy}
            </button>
            <button
              type="button"
              onClick={() => dialog.current?.close()}
              className="text-sm text-ink/40 transition-colors hover:text-ink"
            >
              {copy.close}
            </button>
          </div>

          <p className="mt-6 text-xs text-ink/35">
            {copy.to} <bdi dir="ltr">{email}</bdi>
          </p>
        </form>
      </dialog>
    </EnquiryContext.Provider>
  );
}

export function EnquiryButton({
  pkg,
  label,
  tone = "solid",
}: {
  pkg?: string;
  label: string;
  tone?: "solid" | "quiet";
}) {
  const open = useEnquiry();
  if (!open) return null;

  return (
    <button
      type="button"
      onClick={() => {
        track(pkg ? "enquiry-open-package" : "enquiry-open-contact", { package: pkg ?? "none" });
        open(pkg);
      }}
      className={
        tone === "solid"
          ? "bg-saffron px-7 py-3 text-sm uppercase tracking-[0.2em] text-paper transition-colors hover:bg-ink"
          : "border-b-2 border-saffron/40 pb-1 text-lg transition-colors hover:border-saffron hover:text-saffron"
      }
    >
      {label}
    </button>
  );
}
