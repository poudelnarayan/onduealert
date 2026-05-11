"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Select } from "@/components/ui/Select";
import { DatePicker } from "@/components/ui/DatePicker";
import { AlertBanner } from "@/components/ui/AlertBanner";

type ReminderFormData = {
  clientName: string;
  title: string;
  description: string;
  category: "TAX" | "CONTRACT" | "LICENSE" | "CUSTOM";
  frequency: "ONE_TIME" | "WEEKLY" | "MONTHLY" | "YEARLY" | "CUSTOM";
  interval: string;
  customIntervalDays: string;
  cronExpression: string;
  dueDate: string;
  timezone: string;
  offsetsDays: string;
};

const categoryOptions = [
  { value: "TAX", label: "Tax" },
  { value: "CONTRACT", label: "Contract" },
  { value: "LICENSE", label: "License" },
  { value: "CUSTOM", label: "Custom" },
];

const frequencyOptions = [
  { value: "ONE_TIME", label: "One-time" },
  { value: "WEEKLY", label: "Weekly" },
  { value: "MONTHLY", label: "Monthly" },
  { value: "YEARLY", label: "Yearly" },
  { value: "CUSTOM", label: "Custom (interval days)" },
];

function parseOffsets(input: string): number[] {
  const raw = input
    .split(",")
    .map((x) => x.trim())
    .filter(Boolean);
  const nums = raw.map((x) => Number(x));
  if (nums.some((n) => !Number.isFinite(n) || n < 0 || !Number.isInteger(n))) {
    throw new Error("Offsets must be non-negative integers.");
  }
  return Array.from(new Set(nums)).sort((a, b) => b - a);
}

function Section({
  title,
  description,
  children,
}: {
  title: string;
  description?: string;
  children: React.ReactNode;
}) {
  return (
    <div className="grid grid-cols-1 gap-5 border-b border-[var(--border)] py-6 first:pt-0 last:border-b-0 last:pb-0 lg:grid-cols-12 lg:gap-8">
      <div className="lg:col-span-4">
        <h3 className="text-[14px] font-semibold tracking-tight text-[var(--foreground-strong)]">
          {title}
        </h3>
        {description ? (
          <p className="mt-1 text-[12.5px] leading-5 text-[var(--muted)]">
            {description}
          </p>
        ) : null}
      </div>
      <div className="space-y-4 lg:col-span-8">{children}</div>
    </div>
  );
}

export function ReminderForm(props: {
  mode: "create" | "edit";
  reminderId?: string;
  initial?: Partial<ReminderFormData>;
}) {
  const router = useRouter();
  const [submitting, setSubmitting] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);

  const browserTz =
    Intl.DateTimeFormat().resolvedOptions().timeZone || "UTC";

  const [data, setData] = React.useState<ReminderFormData>(() => ({
    clientName: props.initial?.clientName ?? "",
    title: props.initial?.title ?? "",
    description: props.initial?.description ?? "",
    category: (props.initial?.category as ReminderFormData["category"]) ?? "TAX",
    frequency:
      (props.initial?.frequency as ReminderFormData["frequency"]) ?? "ONE_TIME",
    interval: props.initial?.interval ?? "1",
    customIntervalDays: props.initial?.customIntervalDays ?? "",
    cronExpression: props.initial?.cronExpression ?? "",
    dueDate: props.initial?.dueDate ?? "",
    timezone: props.initial?.timezone ?? browserTz,
    offsetsDays: props.initial?.offsetsDays ?? "7,1,0",
  }));

  const offsets = (() => {
    try {
      return parseOffsets(data.offsetsDays);
    } catch {
      return null;
    }
  })();

  const nextFireDates = React.useMemo(() => {
    if (!data.dueDate || !offsets) return null;
    const [y, m, d] = data.dueDate.split("-").map(Number);
    if (!y || !m || !d) return null;
    const due = new Date(Date.UTC(y, m - 1, d));
    return offsets.map((o) => {
      const fire = new Date(due);
      fire.setUTCDate(fire.getUTCDate() - o);
      return { offset: o, date: fire };
    });
  }, [data.dueDate, offsets]);

  return (
    <form
      className="space-y-6"
      onSubmit={async (e) => {
        e.preventDefault();
        setError(null);
        setSubmitting(true);
        try {
          const offsetsDays = parseOffsets(data.offsetsDays);
          const interval = data.interval ? Number(data.interval) : undefined;
          const customIntervalDays = data.customIntervalDays
            ? Number(data.customIntervalDays)
            : undefined;

          if (!data.dueDate) throw new Error("Due date is required.");
          if (!data.title.trim()) throw new Error("Title is required.");

          const payload: Record<string, unknown> = {
            clientName: data.clientName.trim() ? data.clientName.trim() : null,
            title: data.title.trim(),
            description: data.description.trim()
              ? data.description.trim()
              : null,
            category: data.category,
            frequency: data.frequency,
            interval,
            customIntervalDays,
            cronExpression: data.cronExpression.trim()
              ? data.cronExpression.trim()
              : undefined,
            dueDate: data.dueDate,
            timezone: data.timezone.trim() ? data.timezone.trim() : browserTz,
            offsetsDays,
          };

          const url =
            props.mode === "create"
              ? "/api/reminders"
              : `/api/reminders/${props.reminderId}`;
          const method = props.mode === "create" ? "POST" : "PUT";

          const res = await fetch(url, {
            method,
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(payload),
          });
          const json = await res.json().catch(() => null);
          if (!res.ok) {
            throw new Error(json?.error ?? "Request failed.");
          }

          router.push("/reminders");
          router.refresh();
        } catch (err) {
          setError(err instanceof Error ? err.message : "Something went wrong.");
          setSubmitting(false);
        }
      }}
    >
      {error ? (
        <AlertBanner
          variant="critical"
          title="Unable to save"
          description={error}
        />
      ) : null}

      <div className="overflow-hidden rounded-2xl border border-[var(--border)] bg-white">
        <div className="px-6 py-5 sm:px-8">
          <Section
            title="Basics"
            description="A descriptive title makes alerts and audit history scannable."
          >
            <Input
              label="Title"
              value={data.title}
              onChange={(e) =>
                setData((s) => ({ ...s, title: e.target.value }))
              }
              maxLength={140}
              placeholder="File Q1 VAT return"
              required
            />

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <Input
                label="Client or business"
                value={data.clientName}
                onChange={(e) =>
                  setData((s) => ({ ...s, clientName: e.target.value }))
                }
                maxLength={140}
                placeholder="Acme Corp"
                hint="Optional. Useful for filtering."
              />
              <Select
                label="Category"
                value={data.category}
                onChange={(e) =>
                  setData((s) => ({
                    ...s,
                    category: e.target
                      .value as ReminderFormData["category"],
                  }))
                }
                options={categoryOptions}
              />
            </div>

            <Input
              label="Notes"
              value={data.description}
              onChange={(e) =>
                setData((s) => ({ ...s, description: e.target.value }))
              }
              maxLength={2000}
              placeholder="Reference numbers, links, internal context"
              hint="Optional."
            />
          </Section>

          <Section
            title="Schedule"
            description="When this is due and how it repeats."
          >
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <DatePicker
                label="Due date"
                value={data.dueDate}
                onChange={(v) => setData((s) => ({ ...s, dueDate: v }))}
                required
              />
              <Input
                label="Timezone"
                value={data.timezone}
                onChange={(e) =>
                  setData((s) => ({ ...s, timezone: e.target.value }))
                }
                placeholder="America/New_York"
                hint='Controls when "today" rolls over.'
              />
            </div>

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <Select
                label="Repeats"
                value={data.frequency}
                onChange={(e) =>
                  setData((s) => ({
                    ...s,
                    frequency: e.target
                      .value as ReminderFormData["frequency"],
                  }))
                }
                options={frequencyOptions}
              />
              {data.frequency === "CUSTOM" ? (
                <Input
                  label="Every (days)"
                  inputMode="numeric"
                  value={data.customIntervalDays}
                  onChange={(e) =>
                    setData((s) => ({
                      ...s,
                      customIntervalDays: e.target.value,
                    }))
                  }
                  placeholder="45"
                />
              ) : data.frequency === "ONE_TIME" ? (
                <Input label="Interval" value="—" readOnly disabled />
              ) : (
                <Input
                  label="Every"
                  inputMode="numeric"
                  value={data.interval}
                  onChange={(e) =>
                    setData((s) => ({ ...s, interval: e.target.value }))
                  }
                  placeholder="1"
                  hint="e.g. every 2 months → Monthly, 2"
                />
              )}
            </div>
          </Section>

          <Section
            title="Notifications"
            description="Days before the due date that an alert is sent. Overdue items keep alerting daily until completed."
          >
            <Input
              label="Offsets (days)"
              value={data.offsetsDays}
              onChange={(e) =>
                setData((s) => ({ ...s, offsetsDays: e.target.value }))
              }
              placeholder="7,1,0"
              hint="Comma-separated. 0 = on the due date."
            />

            {/* Quick chips for common patterns */}
            <div className="flex flex-wrap items-center gap-2">
              <span className="text-[11.5px] text-[var(--muted-2)]">
                Quick set:
              </span>
              {["7,1,0", "14,7,3,1,0", "30,14,7,1,0", "0"].map((p) => (
                <button
                  key={p}
                  type="button"
                  onClick={() => setData((s) => ({ ...s, offsetsDays: p }))}
                  className="rounded-md border border-[var(--border-strong)] bg-white px-2 py-0.5 text-[11.5px] font-medium text-[var(--muted)] transition-colors hover:bg-[var(--surface-muted)] hover:text-[var(--foreground-strong)] active:scale-[0.97]"
                >
                  {p}
                </button>
              ))}
            </div>

            {/* Useful preview — actual fire dates */}
            {nextFireDates && nextFireDates.length > 0 ? (
              <div className="rounded-lg border border-[var(--border)] bg-[var(--surface-muted)] p-3">
                <div className="text-[11.5px] font-semibold uppercase tracking-wider text-[var(--muted-2)]">
                  Alerts will fire on
                </div>
                <ul className="mt-2 space-y-1">
                  {nextFireDates.map((f) => (
                    <li
                      key={f.offset}
                      className="flex items-center justify-between text-[12.5px]"
                    >
                      <span className="text-[var(--foreground)]">
                        {f.date.toLocaleDateString(undefined, {
                          weekday: "short",
                          month: "short",
                          day: "numeric",
                          year: "numeric",
                        })}
                      </span>
                      <span className="font-mono text-[11.5px] text-[var(--muted-2)]">
                        {f.offset === 0 ? "due day" : `T-${f.offset}`}
                      </span>
                    </li>
                  ))}
                </ul>
              </div>
            ) : null}
          </Section>
        </div>

        {/* Sticky save bar */}
        <div className="flex items-center justify-between gap-3 border-t border-[var(--border)] bg-[var(--surface-muted)] px-6 py-3 sm:px-8">
          <span className="hidden text-[12px] text-[var(--muted-2)] sm:block">
            {props.mode === "create"
              ? "Deadline will be tracked immediately after saving."
              : "Changes apply to future alerts."}
          </span>
          <div className="ml-auto flex items-center gap-2">
            <Button
              type="button"
              variant="ghost"
              onClick={() => router.push("/reminders")}
              disabled={submitting}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              loading={submitting}
              loadingText={
                props.mode === "create" ? "Creating…" : "Saving…"
              }
            >
              {props.mode === "create" ? "Create deadline" : "Save changes"}
            </Button>
          </div>
        </div>
      </div>
    </form>
  );
}
