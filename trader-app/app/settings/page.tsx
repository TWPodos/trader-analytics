"use client";

import { useState } from "react";
import { Header } from "@/components/layout/header";
import { cn } from "@/lib/utils";

interface FormState {
  name: string;
  accountSize: string;
  defaultRisk: string;
  maxDailyLoss: string;
  theme: "light" | "dark";
}

const initialState: FormState = { name: "", accountSize: "", defaultRisk: "1", maxDailyLoss: "", theme: "light" };

function SectionTitle({ children }: { children: React.ReactNode }) {
  return <p className="text-muted-foreground uppercase tracking-wider font-semibold mb-3" style={{ fontSize: "11px" }}>{children}</p>;
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="space-y-1">
      <label className="block text-foreground font-medium" style={{ fontSize: "11px" }}>{label}</label>
      {children}
    </div>
  );
}

const inputClass = cn(
  "w-full h-8 px-3 rounded border border-border bg-background text-foreground",
  "placeholder:text-muted-foreground outline-none transition-colors",
  "focus:border-[#2383e2]"
);

export default function SettingsPage() {
  const [form, setForm] = useState<FormState>(initialState);
  const [saved, setSaved] = useState(false);

  function handleChange(field: keyof FormState, value: string) {
    setForm((prev) => ({ ...prev, [field]: value }));
    setSaved(false);
  }

  function handleSave() {
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  }

  return (
    <div className="min-h-full bg-background">
      <Header title="Settings" subtitle="App preferences" />
      <div className="p-6 max-w-xl space-y-8">
        <section>
          <SectionTitle>Account</SectionTitle>
          <div className="border border-border rounded-lg divide-y divide-[#e9e9e7]" style={{ background: "#ffffff" }}>
            <div className="px-4 py-3 space-y-1">
              <Field label="Name">
                <input type="text" value={form.name} onChange={(e) => handleChange("name", e.target.value)} placeholder="e.g. John Doe" className={inputClass} style={{ fontSize: "13px" }} />
              </Field>
            </div>
            <div className="px-4 py-3 space-y-1">
              <Field label="Account Size ($)">
                <input type="number" value={form.accountSize} onChange={(e) => handleChange("accountSize", e.target.value)} placeholder="e.g. 25000" min={0} className={inputClass} style={{ fontSize: "13px" }} />
              </Field>
            </div>
          </div>
        </section>

        <section>
          <SectionTitle>Risk Management</SectionTitle>
          <div className="border border-border rounded-lg divide-y divide-[#e9e9e7]" style={{ background: "#ffffff" }}>
            <div className="px-4 py-3">
              <Field label="Default Risk % Per Trade">
                <div className="flex items-center gap-2">
                  <input type="number" value={form.defaultRisk} onChange={(e) => handleChange("defaultRisk", e.target.value)} placeholder="1" min={0} max={100} step={0.1} className={cn(inputClass, "max-w-[120px]")} style={{ fontSize: "13px" }} />
                  <span className="text-muted-foreground" style={{ fontSize: "13px" }}>% of account</span>
                </div>
              </Field>
            </div>
            <div className="px-4 py-3">
              <Field label="Max Daily Loss ($)">
                <input type="number" value={form.maxDailyLoss} onChange={(e) => handleChange("maxDailyLoss", e.target.value)} placeholder="e.g. 500" min={0} className={inputClass} style={{ fontSize: "13px" }} />
              </Field>
            </div>
          </div>
        </section>

        <section>
          <SectionTitle>Display</SectionTitle>
          <div className="border border-border rounded-lg divide-y divide-[#e9e9e7]" style={{ background: "#ffffff" }}>
            <div className="px-4 py-3">
              <p className="text-foreground font-medium mb-2" style={{ fontSize: "11px" }}>Theme</p>
              <div className="flex items-center gap-3">
                <button onClick={() => handleChange("theme", "light")} className={cn("flex items-center gap-2 px-3 h-8 rounded border transition-colors", form.theme === "light" ? "border-[#2383e2] bg-[#2383e2]/5 text-[#2383e2]" : "border-border text-foreground hover:bg-secondary")} style={{ fontSize: "13px" }}>
                  <span className="w-3.5 h-3.5 inline-flex items-center justify-center">☀</span>
                  Light
                </button>
                <button disabled className="flex items-center gap-2 px-3 h-8 rounded border border-border text-muted-foreground cursor-not-allowed opacity-40" style={{ fontSize: "13px" }} title="Dark mode coming soon">
                  <span className="w-3.5 h-3.5 inline-flex items-center justify-center">☾</span>
                  Dark
                </button>
                <span className="text-muted-foreground" style={{ fontSize: "11px" }}>Dark mode coming soon</span>
              </div>
            </div>
          </div>
        </section>

        <div className="flex items-center gap-3">
          <button onClick={handleSave} className="flex items-center h-8 px-4 rounded bg-[#2383e2] text-white font-medium hover:bg-[#1a6bbf] transition-colors" style={{ fontSize: "13px" }}>Save changes</button>
          {saved && <span className="text-[#0f7b6c] font-medium" style={{ fontSize: "13px" }}>Saved</span>}
        </div>
      </div>
    </div>
  );
}
