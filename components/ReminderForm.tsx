"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Select } from "@/components/ui/Select";
import { DatePicker } from "@/components/ui/DatePicker";
import { AlertBanner } from "@/components/ui/AlertBanner";
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";

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
  return Array.from(new Set(nums));
}

function FormSection(props: {
  step: string;
  title: string;
  description: string;
  children: React.ReactNode;
}) {
  return (
    <Card className="overflow-hidden p-0">
      <div className="grid grid-cols-1 gap-0 lg:grid-cols-12">
        <div className="border-b border-[var(--border)] bg-[var(--surface-muted)] p-5 lg:col-span-4 lg:border-b-0 lg:border-r">
          <div className="flex items-center gap-2 text-[11px] font-semibold uppercase tracking-[0.14em] text-[var(--accent-strong)]">
            <span className="flex h-5 w-5 items-center justify-center rounded-md bg-white font-mono text-[10px] font-bold ring-1 ring-[var(--border)]">
              {props.step}
            </span>
            Step
          </div>
          <div className="mt-3 text-[15px] font-semibold tracking-tight text-[var(--foreground-strong)]">
            {props.title}
          </div>
          <p className="mt-1 text-[13px] leading-5 text-[var(--muted)]">
            {props.description}
          </p>
        </div>
        <div className="space-y-4 p-5 lg:col-span-8 lg:p-6">
          {props.children}
        </div>
      </div>
    </Card>
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

  const offsetsPreview = (() => {
    try {
      return parseOffsets(data.offsetsDays);
    } catch {
      return null;
    }
  })();

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
        } finally {
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

      <FormSection
        step="01"
        title="Deadline details"
        description="Keep the title specific and the owner clear. This becomes the source of truth across alerts and audit records."
      >
        <Input
          label="Client / business (optional)"
          value={data.clientName}
          onChange={(e) =>
            setData((s) => ({ ...s, clientName: e.target.value }))
          }
          maxLength={140}
          placeholder="e.g. Acme Corp"
          hint="Used for filtering and accountability."
        />

        <Input
          label="Title"
          value={data.title}
          onChange={(e) => setData((s) => ({ ...s, title: e.target.value }))}
          maxLength={140}
          placeholder="e.g. File quarterly VAT return"
          required
        />

        <Input
          label="Description (optional)"
          value={data.description}
          onChange={(e) =>
            setData((s) => ({ ...s, description: e.target.value }))
          }
          maxLength={2000}
          placeholder="Reference numbers, links, internal notes."
        />

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <Select
            label="Category"
            value={data.category}
            onChange={(e) =>
              setData((s) => ({
                ...s,
                category: e.target.value as ReminderFormData["category"],
              }))
            }
            options={categoryOptions}
          />
          <DatePicker
            label="Due date"
            value={data.dueDate}
            onChange={(v) => setData((s) => ({ ...s, dueDate: v }))}
            hint="Drives escalation and notification offsets."
            required
          />
        </div>
      </FormSection>

      <FormSection
        step="02"
        title="Schedule & timezone"
        description="Define recurrence clearly. On completion, the next cycle is generated automatically."
      >
        <Input
          label="Timezone"
          value={data.timezone}
          onChange={(e) =>
            setData((s) => ({ ...s, timezone: e.target.value }))
          }
          placeholder="e.g. America/New_York"
          hint='Controls what "today" means for this deadline.'
        />

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <Select
            label="Frequency"
            value={data.frequency}
            onChange={(e) =>
              setData((s) => ({
                ...s,
                frequency: e.target.value as ReminderFormData["frequency"],
              }))
            }
            options={frequencyOptions}
          />
          {data.frequency === "CUSTOM" ? (
            <Input
              label="Custom interval (days)"
              inputMode="numeric"
              value={data.customIntervalDays}
              onChange={(e) =>
                setData((s) => ({ ...s, customIntervalDays: e.target.value }))
              }
              placeholder="e.g. 45"
            />
          ) : data.frequency === "ONE_TIME" ? (
            <Input label="Interval" value="—" readOnly disabled />
          ) : (
            <Input
              label="Interval"
              inputMode="numeric"
              value={data.interval}
              onChange={(e) =>
                setData((s) => ({ ...s, interval: e.target.value }))
              }
              placeholder="1"
              hint="e.g. every 2 months → Frequency: Monthly, Interval: 2"
            />
          )}
        </div>

        {data.frequency === "CUSTOM" ? (
          <Input
            label="Cron expression (reserved)"
            value={data.cronExpression}
            onChange={(e) =>
              setData((s) => ({ ...s, cronExpression: e.target.value }))
            }
            placeholder="Not executed in MVP (stored for future support)"
          />
        ) : null}
      </FormSection>

      <FormSection
        step="03"
        title="Notification offsets"
        description="Control when alerts fire. Comma-separated days before due date. Overdue items continue to escalate daily until completed."
      >
        <Input
          label="Offsets"
          value={data.offsetsDays}
          onChange={(e) =>
            setData((s) => ({ ...s, offsetsDays: e.target.value }))
          }
          placeholder="7,1,0"
          hint="e.g. 7,3,1,0 — comma-separated, integer days."
        />

        {/* Live preview */}
        {offsetsPreview && offsetsPreview.length > 0 ? (
          <div className="rounded-xl border border-[var(--border)] bg-[var(--surface-muted)] p-4">
            <div className="text-[11px] font-semibold uppercase tracking-[0.14em] text-[var(--muted-2)]">
              Preview
            </div>
            <div className="mt-3 flex flex-wrap items-center gap-2">
              {offsetsPreview
                .slice()
                .sort((a, b) => b - a)
                .map((d) => (
                  <Badge key={d} variant="accent">
                    {d === 0 ? "Due day" : `T-${d}d`}
                  </Badge>
                ))}
              <span className="text-[12.5px] text-[var(--muted-2)]">
                · plus daily reminders if it goes overdue
              </span>
            </div>
          </div>
        ) : null}
      </FormSection>

      <div className="flex flex-wrap items-center justify-end gap-2 border-t border-[var(--border)] pt-5">
        <Button
          type="button"
          variant="ghost"
          onClick={() => router.push("/reminders")}
        >
          Cancel
        </Button>
        <Button type="submit" disabled={submitting}>
          {submitting
            ? "Saving…"
            : props.mode === "create"
              ? "Create deadline"
              : "Save changes"}
        </Button>
      </div>
    </form>
  );
}
