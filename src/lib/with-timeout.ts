/**
 * Wraps a Supabase call (or any promise) with a timeout. Given the project's
 * distance from users (Singapore region) and the occasional network flakiness
 * we've seen, unprotected server-side calls can hang a whole page render.
 * This ensures a slow/hung call fails fast instead of taking the page down
 * with it — the caller decides what "failure" means (redirect, empty state).
 */
export async function withTimeout<T>(
  promise: PromiseLike<T>,
  ms: number = 5000
): Promise<T> {
  return Promise.race([
    Promise.resolve(promise),
    new Promise<T>((_, reject) =>
      setTimeout(() => reject(new Error(`Request timed out after ${ms}ms`)), ms)
    ),
  ]);
}
