/** Which one-click sign-in providers are switched on in Supabase (checked hourly). */
export async function getOAuthProviders(): Promise<string[]> {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  if (!url || !key) return [];
  try {
    const res = await fetch(`${url}/auth/v1/settings`, { headers: { apikey: key }, next: { revalidate: 3600 } });
    if (!res.ok) return [];
    const j = (await res.json()) as { external?: Record<string, boolean> };
    return ["google", "linkedin_oidc"].filter((p) => j.external?.[p]);
  } catch {
    return [];
  }
}
