// Temporarily stubbed out to isolate 307 redirect loop bug.
export const handlers = {
  GET: async () =>
    new Response("auth disabled", { status: 503 }),
  POST: async () =>
    new Response("auth disabled", { status: 503 }),
};
export const auth = async () => null;
export const signIn = async () => {};
export const signOut = async () => {};
