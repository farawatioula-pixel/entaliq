"use client";

import { useEffect, useState } from "react";
import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import AttendeeCard from "./AttendeeCard";
import { loadRegistration, type SavedRegistration } from "@/lib/registration";

/** The card is the step after registering: unregistered visitors are sent to register first. */
export default function SummitCardFlow() {
  const t = useTranslations("attendeeCard");
  const tr = useTranslations("registerForm");
  const [reg, setReg] = useState<SavedRegistration | null | undefined>(undefined);

  useEffect(() => {
    // Read once on mount: localStorage only exists in the browser.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setReg(loadRegistration());
  }, []);

  if (reg === undefined) return null;

  if (!reg) {
    return (
      <div className="rounded-sm border border-line bg-surface p-8">
        <p className="font-display text-xl font-bold text-fg">{t("registerFirstTitle")}</p>
        <p className="mt-2 text-[15px] text-neutral-600">{t("registerFirstBody")}</p>
        <Link
          href="/register"
          className="mt-5 inline-flex items-center rounded-sm bg-red px-6 py-3 text-sm font-semibold text-white hover:bg-red-dark"
        >
          {t("registerFirstCta")}
        </Link>
      </div>
    );
  }

  return (
    <>
      <div className="mb-8 rounded-sm border border-cyan-deep bg-cyan/5 p-6">
        <p className="font-display text-xl font-bold text-fg">{tr("successTitle")}</p>
        <p className="mt-2 text-[15px] text-neutral-600">{tr("successCeremony")}</p>
      </div>
      <AttendeeCard defaultName={reg.name} shareToken={reg.shareToken} />
    </>
  );
}
