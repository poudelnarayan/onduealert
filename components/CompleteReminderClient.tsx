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
    <div className="space-y-4">
      {error ? (
        <AlertBanner
          variant="critical"
          title="Completion failed"
          description={error}
        />
      ) : null}

      <div>
        <label
          htmlFor="completion-note"
          className="mb-1.5 block text-[13px] font-medium text-[var(--foreground)]"
        >
          Completion note (optional)
        </label>
        <textarea
          id="completion-note"
          rows={4}
          maxLength={2000}
          value={note}
          onChange={(e) => setNote(e.target.value)}
          placeholder="What did you do? Reference number? Link to proof?"
          className="w-full rounded-lg border border-[var(--border-strong)] bg-white px-3 py-2 text-sm text-[var(--foreground)] outline-none transition placeholder:text-[var(--muted-3)] focus:border-[var(--accent)] focus:ring-2 focus:ring-[rgba(37,99,235,0.20)]"
        />
        <div className="mt-1.5 text-[12px] text-[var(--muted-2)]">
          Stored in the immutable completion history.
        </div>
      </div>

      <div>
        <div className="mb-1.5 text-[13px] font-medium text-[var(--foreground)]">
          Proof file (optional, max 2MB)
        </div>
        <label
          htmlFor="proof-file"
          className="flex cursor-pointer items-center justify-between gap-3 rounded-lg border border-dashed border-[var(--border-strong)] bg-[var(--surface-muted)] px-4 py-3 text-[13px] text-[var(--muted)] transition hover:border-[var(--accent)] hover:bg-white"
        >
          <span>
            {file ? (
              <>
                Selected:{" "}
                <span className="font-mono text-[var(--foreground)]">
                  {file.name}
                </span>{" "}
                · {Math.round(file.size / 1024)} KB
              </>
            ) : (
              "Choose a file or drag it here"
            )}
          </span>
          <span className="rounded-md bg-white px-2.5 py-1 text-[11.5px] font-semibold text-[var(--accent-strong)] ring-1 ring-[var(--border)]">
            Browse
          </span>
        </label>
        <input
          id="proof-file"
          type="file"
          className="sr-only"
          onChange={(e) => setFile(e.target.files?.[0] ?? null)}
        />
      </div>

      <Button type="button" disabled={submitting} onClick={submit}>
        {submitting ? "Saving…" : "Mark completed"}
      </Button>
    </div>
  );
}
