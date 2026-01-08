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
  dueDate: string; // YYYY-MM-DD
  timezone: string;
  offsetsDays: string; // e.g. "7,1,0"
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
    category: (props.initial?.category as any) ?? "TAX",
    frequency: (props.initial?.frequency as any) ?? "ONE_TIME",
    interval: props.initial?.interval ?? "1",
    customIntervalDays: props.initial?.customIntervalDays ?? "",
    cronExpression: props.initial?.cronExpression ?? "",
    dueDate: props.initial?.dueDate ?? "",
    timezone: props.initial?.timezone ?? browserTz,
    offsetsDays: props.initial?.offsetsDays ?? "7,1,0",
  }));

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

          const payload: any = {
            clientName: data.clientName.trim() ? data.clientName.trim() : null,
            title: data.title.trim(),
            description: data.description.trim() ? data.description.trim() : null,
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
        <AlertBanner variant="critical" title="Unable to save" description={error} />
      ) : null}

      <div className="space-y-4">
        <div>
          <div className="text-sm font-semibold text-brand-900">
            Deadline details
          </div>
          <div className="mt-1 text-sm text-brand-600">
            Keep the title specific and the owner clear.
          </div>
        </div>

        <Input
          label="Client / business (optional)"
          value={data.clientName}
          onChange={(e) => setData((s) => ({ ...s, clientName: e.target.value }))}
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
          onChange={(e) => setData((s) => ({ ...s, description: e.target.value }))}
          maxLength={2000}
          placeholder="Reference numbers, links, internal notes."
        />

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <Select
            label="Category"
            value={data.category}
            onChange={(e) =>
              setData((s) => ({ ...s, category: e.target.value as any }))
            }
            options={categoryOptions}
          />
          <DatePicker
            label="Due date"
            value={data.dueDate}
            onChange={(v) => setData((s) => ({ ...s, dueDate: v }))}
            hint="Used to compute escalation and notification offsets."
            required
          />
        </div>
      </div>

      <Input
        label="Timezone"
        value={data.timezone}
        onChange={(e) => setData((s) => ({ ...s, timezone: e.target.value }))}
        placeholder="e.g. America/New_York"
        hint="Controls what “today” means for this deadline."
      />

      <div className="space-y-4">
        <div>
          <div className="text-sm font-semibold text-brand-900">Schedule</div>
          <div className="mt-1 text-sm text-brand-600">
            Define recurrence clearly. On completion, the next cycle is generated
            automatically.
          </div>
        </div>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <Select
            label="Frequency"
            value={data.frequency}
            onChange={(e) =>
              setData((s) => ({ ...s, frequency: e.target.value as any }))
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
            <Input label="Interval" value="—" readOnly disabled aria-disabled />
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

      <Input
        label="Notification offsets"
        value={data.offsetsDays}
        onChange={(e) => setData((s) => ({ ...s, offsetsDays: e.target.value }))}
        placeholder="7,1,0"
        hint="Comma-separated days before due date (e.g. 7,3,1,0). Overdue items escalate daily until completed."
      />

      <div className="flex gap-2">
        <Button type="submit" disabled={submitting}>
          {props.mode === "create" ? "Create deadline" : "Save changes"}
        </Button>
        <Button
          type="button"
          variant="secondary"
          onClick={() => router.push("/reminders")}
        >
          Cancel
        </Button>
      </div>
    </form>
  );
}


