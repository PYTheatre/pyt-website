// ============================================================
// /api/callback  — OAuth completion endpoint
// ============================================================
// What this does, in plain terms:
//
//   1. After the staff member clicks "Authorize" on GitHub's
//      consent screen, GitHub redirects their browser to here
//      (/api/callback) with two pieces of information in the URL:
//        - "code"  — a single-use token we can trade for a real
//                    access token.
//        - "state" — the random ticket we set in /api/auth. We
//                    check it matches the cookie we stored.
//
//   2. We exchange the "code" with GitHub for an "access_token"
//      (this requires our OAuth App's Client Secret — that's why
//      this step has to happen on a server, not in the browser).
//
//   3. We send the access token back to the Decap CMS popup window
//      using a small HTML page that performs the postMessage
//      handshake Decap expects:
//
//        a) The popup adds a message listener.
//        b) The popup posts "authorizing:github" to its opener.
//        c) Decap's main window replies with a message echoing
//           back the same string (this is how Decap signals it
//           is now listening for the success payload).
//        d) Only AFTER receiving that reply, the popup posts
//           "authorization:github:success:<json>" back to the
//           opener — at which point Decap reads the token and
//           transitions into the dashboard.
//        e) Popup closes itself.
// ============================================================

export async function onRequestGet(context) {
  const { request, env } = context;

  // 1) Read what GitHub sent back.
  const url = new URL(request.url);
  const code = url.searchParams.get("code");
  const returnedState = url.searchParams.get("state");

  // Compare the returned state with the cookie we set earlier.
  const cookieHeader = request.headers.get("Cookie") || "";
  const stateCookie = cookieHeader
    .split(";")
    .map((c) => c.trim())
    .find((c) => c.startsWith("oauth_state="))
    ?.slice("oauth_state=".length);

  if (!code) {
    return htmlError("GitHub did not return an authorization code. Please try logging in again.");
  }
  if (!returnedState || !stateCookie || returnedState !== stateCookie) {
    return htmlError("Login security check failed (state mismatch). Please close this window and try again.");
  }

  // 2) Read the OAuth App credentials from environment variables.
  const clientId = env.GITHUB_CLIENT_ID;
  const clientSecret = env.GITHUB_CLIENT_SECRET;
  if (!clientId || !clientSecret) {
    return htmlError(
      "OAuth misconfigured: GITHUB_CLIENT_ID or GITHUB_CLIENT_SECRET environment variable is missing in Cloudflare Pages settings."
    );
  }

  // 3) Exchange the authorization code for an access token.
  let tokenResponse;
  try {
    tokenResponse = await fetch("https://github.com/login/oauth/access_token", {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        client_id: clientId,
        client_secret: clientSecret,
        code: code,
      }),
    });
  } catch (e) {
    return htmlError("Could not reach GitHub to exchange the login code. Please try again.");
  }

  const tokenJson = await tokenResponse.json();
  const accessToken = tokenJson.access_token;
  if (!accessToken) {
    const reason = tokenJson.error_description || tokenJson.error || "unknown error";
    return htmlError(`GitHub refused to issue an access token: ${reason}`);
  }

  // 4) Send the token back to Decap via the postMessage handshake.
  const payload = JSON.stringify({ token: accessToken, provider: "github" });

  const successHtml = `<!doctype html>
<html>
<head><meta charset="utf-8" /><title>Login complete</title></head>
<body style="font-family: system-ui, sans-serif; padding: 2rem;">
  <p>Login complete. You can close this window.</p>
  <script>
    (function () {
      var payload = ${JSON.stringify(payload)};

      function receiveMessage(e) {
        // Decap echoes back "authorizing:github" to signal it's ready.
        window.opener.postMessage(
          'authorization:github:success:' + payload,
          e.origin
        );
        setTimeout(function () { window.close(); }, 800);
      }

      // (a) Listen first.
      window.addEventListener("message", receiveMessage, false);

      // (b) Then announce ourselves to the opener.
      window.opener.postMessage("authorizing:github", "*");
    })();
  </script>
</body>
</html>`;

  return new Response(successHtml, {
    status: 200,
    headers: {
      "Content-Type": "text/html; charset=utf-8",
      "Set-Cookie": "oauth_state=; Path=/; HttpOnly; Secure; SameSite=Lax; Max-Age=0",
    },
  });
}

function htmlError(message) {
  const body = `<!doctype html>
<html>
<head><meta charset="utf-8" /><title>Login error</title></head>
<body style="font-family: system-ui, sans-serif; padding: 2rem; max-width: 40rem; margin: auto;">
  <h1 style="color: #c43d6f;">Login error</h1>
  <p>${escapeHtml(message)}</p>
  <p><a href="/admin/">Return to the admin page</a></p>
</body>
</html>`;
  return new Response(body, {
    status: 400,
    headers: { "Content-Type": "text/html; charset=utf-8" },
  });
}

function escapeHtml(s) {
  return String(s)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;");
}
