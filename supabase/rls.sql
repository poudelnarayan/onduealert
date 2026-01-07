-- OnDueAlert: lock down all application tables at the DB level.
-- The app uses server-side access (service role) and validates Clerk `userId`
-- before any read/write. No client-side direct DB access.

alter table if exists "ReminderSchedule" enable row level security;
alter table if exists "Reminder" enable row level security;
alter table if exists "ReminderCompletion" enable row level security;
alter table if exists "CompletionAttachment" enable row level security;
alter table if exists "NotificationLog" enable row level security;

-- Deny-by-default policies (service role bypasses RLS).
drop policy if exists "deny_all_select" on "ReminderSchedule";
drop policy if exists "deny_all_insert" on "ReminderSchedule";
drop policy if exists "deny_all_update" on "ReminderSchedule";
drop policy if exists "deny_all_delete" on "ReminderSchedule";
create policy "deny_all_select" on "ReminderSchedule" for select using (false);
create policy "deny_all_insert" on "ReminderSchedule" for insert with check (false);
create policy "deny_all_update" on "ReminderSchedule" for update using (false);
create policy "deny_all_delete" on "ReminderSchedule" for delete using (false);

drop policy if exists "deny_all_select" on "Reminder";
drop policy if exists "deny_all_insert" on "Reminder";
drop policy if exists "deny_all_update" on "Reminder";
drop policy if exists "deny_all_delete" on "Reminder";
create policy "deny_all_select" on "Reminder" for select using (false);
create policy "deny_all_insert" on "Reminder" for insert with check (false);
create policy "deny_all_update" on "Reminder" for update using (false);
create policy "deny_all_delete" on "Reminder" for delete using (false);

drop policy if exists "deny_all_select" on "ReminderCompletion";
drop policy if exists "deny_all_insert" on "ReminderCompletion";
drop policy if exists "deny_all_update" on "ReminderCompletion";
drop policy if exists "deny_all_delete" on "ReminderCompletion";
create policy "deny_all_select" on "ReminderCompletion" for select using (false);
create policy "deny_all_insert" on "ReminderCompletion" for insert with check (false);
create policy "deny_all_update" on "ReminderCompletion" for update using (false);
create policy "deny_all_delete" on "ReminderCompletion" for delete using (false);

drop policy if exists "deny_all_select" on "CompletionAttachment";
drop policy if exists "deny_all_insert" on "CompletionAttachment";
drop policy if exists "deny_all_update" on "CompletionAttachment";
drop policy if exists "deny_all_delete" on "CompletionAttachment";
create policy "deny_all_select" on "CompletionAttachment" for select using (false);
create policy "deny_all_insert" on "CompletionAttachment" for insert with check (false);
create policy "deny_all_update" on "CompletionAttachment" for update using (false);
create policy "deny_all_delete" on "CompletionAttachment" for delete using (false);

drop policy if exists "deny_all_select" on "NotificationLog";
drop policy if exists "deny_all_insert" on "NotificationLog";
drop policy if exists "deny_all_update" on "NotificationLog";
drop policy if exists "deny_all_delete" on "NotificationLog";
create policy "deny_all_select" on "NotificationLog" for select using (false);
create policy "deny_all_insert" on "NotificationLog" for insert with check (false);
create policy "deny_all_update" on "NotificationLog" for update using (false);
create policy "deny_all_delete" on "NotificationLog" for delete using (false);


