/** Server-side helpers for Sign In with LinkedIn (OpenID Connect) + Share on LinkedIn. */
import { siteUrl } from "@/lib/summit";

export const LI_TOKEN_COOKIE = "li_token";
export const LI_STATE_COOKIE = "li_state";

export function linkedInConfigured(): boolean {
  return !!process.env.LINKEDIN_CLIENT_ID && !!process.env.LINKEDIN_CLIENT_SECRET;
}

export function redirectUri(): string {
  return `${siteUrl()}/api/linkedin/callback`;
}

export type LinkedInUser = { sub: string; name: string; picture: string | null };

export async function fetchUser(token: string): Promise<LinkedInUser | null> {
  const res = await fetch("https://api.linkedin.com/v2/userinfo", {
    headers: { Authorization: `Bearer ${token}` },
    cache: "no-store",
  });
  if (!res.ok) return null;
  const data = (await res.json()) as { sub?: string; name?: string; picture?: string };
  if (!data.sub) return null;
  return { sub: data.sub, name: data.name ?? "", picture: data.picture ?? null };
}
