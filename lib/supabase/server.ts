import { createClient } from "@supabase/supabase-js";

declare global {
  // eslint-disable-next-line no-var
  var __onduealert_supabase_admin:
    | ReturnType<typeof createClient>
    | undefined;
}

function required(name: string): string {
  const v = process.env[name];
  if (!v) throw new Error(`${name} is not set`);
  return v;
}

export function supabaseAdmin() {
  return (
    globalThis.__onduealert_supabase_admin ??
    (() => {
      const url = required("SUPABASE_URL");
      const key = required("SUPABASE_SERVICE_ROLE_KEY");
      return createClient(url, key, {
        auth: { persistSession: false, autoRefreshToken: false },
      });
    })()
  );
}

if (process.env.NODE_ENV !== "production") {
  globalThis.__onduealert_supabase_admin = supabaseAdmin();
}


