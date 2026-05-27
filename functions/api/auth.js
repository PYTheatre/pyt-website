// ============================================================
// /api/auth  — OAuth start endpoint
// ============================================================
// What this does, in plain terms:
//
//   1. When a staff member clicks "Login with GitHub" inside the
//      Decap CMS admin page, Decap opens a small popup pointed at
//      /api/auth (this file).
//   2. This handler then redirects the popup to GitHub's official
//      "authorize this app" screen, telling GitHub:
//         - Which app is asking (our OAuth App's Client ID).
//         - What permission we want ("repo" — read & write content).
//         - Where to send the user back (our /api/callback).
//         - A random "state" value (a security ticket so we can
//           confirm later that the response really came from GitHub).
//
// What lives in environment variables (set in Cloudflare Pages):
//   - GITHUB_CLIENT_ID      : the public ID of the OAuth App.
//   - GITHUB_CLIENT_SECRET  : the secret password of the OAuth App.
//
// Why two separate endpoints?
//   GitHub OAuth is a round-trip: we send the user TO GitHub at
//   /api/auth, and GitHub sends them BACK to /api/callback after
//   they say "yes, allow it."
//
// This is a Cloudflare Pages Function. The file lives at
// /functions/api/auth.js, which means it answers requests for
// the URL path /api/auth on the deployed site.
// ============================================================

export async function onRequestGet(context) {
  const { request, env } = context;

  // Read the GitHub Client ID from environment variables.
  // If missing, fail loudly with a clear error message — no
  // mysterious silent failures.
  const clientId = env.GITHUB_CLIENT_ID;
  if (!clientId) {
    return new Response(
      "OAuth misconfigured: GITHUB_CLIENT_ID environment variable is missing in Cloudflare Pages settings.",
      { status: 500, headers: { "Content-Type": "text/plain" } }
    );
  }

  // Make a random "state" value. GitHub will echo this back to us
  // in the callback so we can confirm the response wasn't tampered with.
  const state = crypto.randomUUID();

  // Where GitHub should send the user back to. Cloudflare gives us
  // the request URL, so we build the callback URL from it — that way
  // this code works on any deployment domain (pages.dev, pytnet.org, etc.).
  const url = new URL(request.url);
  const redirectUri = `${url.origin}/api/callback`;

  // Build the GitHub authorize URL with all required parameters.
  const authorize = new URL("https://github.com/login/oauth/authorize");
  authorize.searchParams.set("client_id", clientId);
  authorize.searchParams.set("redirect_uri", redirectUri);
  authorize.searchParams.set("scope", "repo,user"); // permission to read/write the repo
  authorize.searchParams.set("state", state);

  // Send the user's browser to GitHub. We also drop the state value
  // into a short-lived cookie so /api/callback can compare it later.
  return new Response(null, {
    status: 302,
    headers: {
      Location: authorize.toString(),
      "Set-Cookie": `oauth_state=${state}; Path=/; HttpOnly; Secure; SameSite=Lax; Max-Age=600`,
    },
  });
}
