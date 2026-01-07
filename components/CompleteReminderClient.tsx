"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/Button";
import { AlertBanner } from "@/components/ui/AlertBanner";

export function CompleteReminderClient(props: { reminderId: string }) {
  const router = useRouter();
  const [note, setNote] = React.useState("");
  const [file, setFile] = React.useState<File | null>(null);
  const [submitting, setSubmitting] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);

  async function submit() {
    setSubmitting(true);
    setError(null);
    try {
      const fd = new FormData();
      if (note.trim()) fd.set("note", note.trim());
      if (file) fd.set("file", file);

      const res = await fetch(`/api/reminders/${props.reminderId}/complete`, {
        method: "POST",
        body: fd,
      });
      const json = await res.json().catch(() => null);
      if (!res.ok) throw new Error(json?.error ?? "Completion failed.");

      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Completion failed.");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="space-y-3">
      {error ? (
        <AlertBanner
          variant="critical"
          title="Completion failed"
          description={error}
        />
      ) : null}

      <label className="block">
        <div className="mb-1 text-sm font-medium text-brand-900">
          Completion note (optional)
        </div>
        <textarea
          className="w-full rounded-md border border-border bg-surface px-3 py-2 text-sm text-brand-900 outline-none placeholder:text-brand-600/70 focus:border-brand-600 focus:ring-2 focus:ring-brand-900/10"
          rows={3}
          maxLength={2000}
          value={note}
          onChange={(e) => setNote(e.target.value)}
          placeholder="What did you do? Reference number? Link to proof?"
        />
        <div className="mt-1 text-sm text-brand-600">
          Stored in immutable completion history.
        </div>
      </label>

      <label className="block">
        <div className="mb-1 text-sm font-medium text-brand-900">
          Proof file (optional, max 2MB)
        </div>
        <input
          type="file"
          className="block w-full text-sm text-brand-700 file:mr-4 file:rounded-md file:border file:border-border file:bg-surface-muted file:px-3 file:py-1.5 file:text-sm file:font-medium file:text-brand-900 hover:file:bg-surface"
          onChange={(e) => setFile(e.target.files?.[0] ?? null)}
        />
        {file ? (
          <div className="mt-1 text-xs text-brand-600">
            Selected: <span className="font-mono">{file.name}</span>
          </div>
        ) : null}
      </label>

      <Button type="button" disabled={submitting} onClick={submit}>
        Mark completed
      </Button>
    </div>
  );
}


