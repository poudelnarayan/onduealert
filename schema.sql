-- WARNING: This schema is for context only and is not meant to be run.
-- Table order and constraints may not be valid for execution.

CREATE TABLE public.CompletionAttachment (
  id text NOT NULL,
  completionId text NOT NULL,
  filename text NOT NULL,
  mimeType text NOT NULL,
  sizeBytes integer NOT NULL,
  sha256 text NOT NULL,
  storageBucket text,
  storagePath text,
  data bytea,
  createdAt timestamp without time zone NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT CompletionAttachment_pkey PRIMARY KEY (id),
  CONSTRAINT CompletionAttachment_completionId_fkey FOREIGN KEY (completionId) REFERENCES public.ReminderCompletion(id)
);
CREATE TABLE public.NotificationLog (
  id text NOT NULL,
  reminderId text NOT NULL,
  type USER-DEFINED NOT NULL,
  status USER-DEFINED NOT NULL DEFAULT 'PENDING'::"NotificationStatus",
  scheduledFor timestamp without time zone NOT NULL,
  offsetDays integer NOT NULL,
  attemptCount integer NOT NULL DEFAULT 0,
  sentAt timestamp without time zone,
  providerMessageId text,
  errorMessage text,
  createdAt timestamp without time zone NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updatedAt timestamp without time zone NOT NULL,
  clerkUserId text NOT NULL,
  level USER-DEFINED NOT NULL DEFAULT 'NORMAL'::"EscalationLevel",
  CONSTRAINT NotificationLog_pkey PRIMARY KEY (id),
  CONSTRAINT NotificationLog_reminderId_fkey FOREIGN KEY (reminderId) REFERENCES public.Reminder(id)
);
CREATE TABLE public.Reminder (
  id text NOT NULL,
  scheduleId text NOT NULL,
  title text NOT NULL,
  description text,
  category USER-DEFINED NOT NULL,
  dueAt timestamp without time zone NOT NULL,
  status USER-DEFINED NOT NULL DEFAULT 'OPEN'::"ReminderStatus",
  completedAt timestamp without time zone,
  previousReminderId text,
  createdAt timestamp without time zone NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updatedAt timestamp without time zone NOT NULL,
  clerkUserId text NOT NULL,
  clientName text,
  snoozeCount integer NOT NULL DEFAULT 0,
  snoozedUntil timestamp without time zone,
  CONSTRAINT Reminder_pkey PRIMARY KEY (id),
  CONSTRAINT Reminder_scheduleId_fkey FOREIGN KEY (scheduleId) REFERENCES public.ReminderSchedule(id),
  CONSTRAINT Reminder_previousReminderId_fkey FOREIGN KEY (previousReminderId) REFERENCES public.Reminder(id)
);
CREATE TABLE public.ReminderCompletion (
  id text NOT NULL,
  clerkUserId text NOT NULL,
  reminderId text NOT NULL,
  completedAt timestamp without time zone NOT NULL DEFAULT CURRENT_TIMESTAMP,
  note text,
  createdAt timestamp without time zone NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT ReminderCompletion_pkey PRIMARY KEY (id),
  CONSTRAINT ReminderCompletion_reminderId_fkey FOREIGN KEY (reminderId) REFERENCES public.Reminder(id)
);
CREATE TABLE public.ReminderSchedule (
  id text NOT NULL,
  frequency USER-DEFINED NOT NULL,
  interval integer NOT NULL DEFAULT 1,
  customIntervalDays integer,
  cronExpression text,
  timezone text NOT NULL DEFAULT 'UTC'::text,
  offsetsDays ARRAY DEFAULT ARRAY[]::integer[],
  createdAt timestamp without time zone NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updatedAt timestamp without time zone NOT NULL,
  clerkUserId text NOT NULL,
  CONSTRAINT ReminderSchedule_pkey PRIMARY KEY (id)
);