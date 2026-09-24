# PYT website switch-over plan

_Moving pytnet.org from the old WordPress site to the new site — Thursday 24 September 2026_

Prepared 2026-09-23 (freeze and old-editor wording clarified the same evening). Companion files: batch7-seo (paste before), batch8-switch (paste on the day).

## 1. What is happening, in one paragraph

The new PYT website has been built and tested at a temporary address (pyt-website.pages.dev). On switch day we point the real address, pytnet.org, at the new site instead of the old WordPress one. Nothing on the new site changes — only where the address points. Email (@pytnet.org, run through Google Workspace) is not part of the website and keeps working, provided the DNS admin copies the email records exactly as described in the appendix.

### What changes

- pytnet.org (and www.pytnet.org) show the new site.
- The site's domain records move from HostGator to Cloudflare (this is required — the new site is hosted on Cloudflare Pages, and a root domain like pytnet.org can only be attached when Cloudflare manages its DNS).
- Staff log in to edit the site at pytnet.org/admin (not the old .pages.dev address).

### What does not change

- The old website's content is not touched; it stays on HostGator and can be pointed back to within minutes if needed.
- @pytnet.org email addresses.
- Ticketing (MVCPA), registration (Active), donations (Soapbox), Mailchimp — all external services, unaffected.
- Every old link you have ever shared: 44 old-site addresses are tested and forward to the right new page.

## 2. Who does what

- PM (web lead): everything on GitHub and in the CMS; runs the checklist; the single point of contact on the day.
- DNS admin (remote): the Cloudflare account and the domain registrar. Steps marked [DNS] are theirs. Appendix A is written for them.
- Team: during the switch window (about an hour, between the PM's 'freeze' and 'all clear' messages) do not save anything in the NEW website's editor (pytnet.org/admin). That is the whole freeze — Active, Soapbox, MVCPA ticketing, Formspree and Mailchimp are separate services and carry on as normal. Smoke-test from your own devices when asked; report anything odd to the PM (not the group chat) so one person triages.
- Whoever runs Mailchimp: checks templates for images hosted on pytnet.org before the switch (see section 7).

## 3. Before switch day (today / tonight)

### PM

1. Paste the 'SEO batch' files (sitemap, robots, canonical and share tags, 404 page). Safe now; they read the domain from one setting.
2. In the CMS: Site-wide → Search & Sharing → upload the default share image (1200×630, under 300 KB) once it's ready.
3. Finish content edits in the new CMS. Anything edited in the OLD WordPress admin from now on will not be seen by anyone after the switch, so do it in the new editor instead.
4. Send the DNS admin Appendix A and agree a start time. Confirm they have logins for BOTH the registrar (where pytnet.org was bought) and HostGator cPanel, and that they can create a free Cloudflare account (or already have one).
5. Note the GitHub OAuth app owner (Settings → Developer settings → OAuth Apps on the account that created it) — their callback URL must change on the day.
6. Ask the Mailchimp owner to do section 7.

### DNS admin (can be done today, strongly recommended)

1. Do Appendix A, Part 1 — move the domain's DNS to Cloudflare with every record copied exactly, still pointing at the OLD site. Nothing visible changes. This takes the risky part off the critical path and lets email be checked overnight.

### Everyone

- The old WordPress editor is finished with as of today: anything you would have changed there, change in the new editor instead — edits to the old site are not copied across and stop being visible on Thursday. After the switch the old admin is no longer reachable at pytnet.org/wp-admin (only via HostGator's own address, for the backup below). If you changed anything on the old site in the last week, tell the PM so it can be checked on the new one.
- Old site backup: whoever has HostGator access exports the WordPress site (Tools → Export → All content) and downloads the media library (wp-content/uploads) before anyone cancels hosting. Keep HostGator paid for at least one month after the switch.

## 4. Switch day — order of events

One person (the PM) drives; the DNS admin is on a call or chat. Expected total time: 30–60 minutes plus waiting.

1. PM: announce the freeze to the team: no saves in the new website's editor (pytnet.org/admin) until the all-clear, and no Mailchimp campaign SENT during this hour (links in it could hit either site mid-change). Everything else runs as normal.
2. [DNS] If Part 1 of Appendix A was not done yesterday, do it now, then wait until pytnet.org and email both still work through Cloudflare before continuing (usually 1–4 hours).
3. [DNS] Appendix A, Part 2: in Cloudflare Pages → pyt-website → Custom domains, add pytnet.org and www.pytnet.org. Cloudflare creates the records itself. Wait for both to show Active with a certificate (usually under 10 minutes).
4. PM: paste the three 'switch batch' files (astro.config.mjs, nav-labels.json, config.yml). Wait for the Cloudflare build to go green (about 2 minutes).
5. OAuth app owner: change the GitHub OAuth app's Authorization callback URL to https://pytnet.org/api/callback and save.
6. PM: hard-refresh pytnet.org/admin, log out, log in again. If login fails, step 5 is wrong or not saved.
7. PM + team: run the smoke test in section 5.
8. PM: Google Search Console → add the sitemap https://pytnet.org/sitemap.xml; run URL Inspection on the home page and request indexing.
9. PM: lift the content freeze.
10. Comms lead: post the launch announcement (socials, newsletter). Not before step 7 passes.

## 5. Smoke test (10 minutes, from a phone AND a laptop)

1. pytnet.org loads the new home page, with the padlock (https). www.pytnet.org does too.
2. Open one musical and one Stories on Stage show page; click Buy Tickets — it reaches MVCPA.
3. Type an OLD address: pytnet.org/acting-classes-camps/ — it should land on Classes & Camps. Try pytnet.org/get-involved/donate/ too.
4. Contact page: send a real test message; it should land on the thank-you page at pytnet.org (not .pages.dev) and arrive by email within a few minutes.
5. Footer: click Español; the translated site should open.
6. Cast page: open the Wizard of Oz cast page link from the newsletter; password gate and embeds work.
7. Send an email to info@pytnet.org from a personal address and reply to it. Both directions must work.
8. Log in to pytnet.org/admin, change one harmless thing (e.g. a hint in the promo banner), save, confirm it publishes in ~2 minutes, then change it back.

> **If any step fails, stop and tell the PM. Don't 'try things'.**

## 6. If it goes wrong — rollback

The old site is untouched. To go back: in Cloudflare DNS, change the A records for pytnet.org and www back to 192.185.99.129 (HostGator) and remove the two custom domains from Cloudflare Pages. Visitors see the old site again within about five minutes. Email is never affected by rollback because its records don't change.

If email breaks at any point, that is a missing or mistyped record in Cloudflare DNS (Appendix A, Part 1). Compare against the HostGator zone export line by line; MX and the two TXT records are the usual culprits.

## 7. Mailchimp — please read (whoever sends the newsletter)

Every email that contains an image hosted on the old website (an image address starting pytnet.org/files/ or pytnet.org/wp-content/) shows that image by fetching it from the old server each time the email is opened. After the switch, those images turn into broken squares — in old emails people re-open, and in any template or scheduled campaign still using them. Images uploaded into Mailchimp's own content studio are fine.

1. Open each saved template, the automated welcome email, and any draft/scheduled campaign.
2. Click each image and look at its address. If it contains pytnet.org, download it and re-upload it into Mailchimp.
3. Check the signup form and the email footer logo the same way.
4. Links in old emails are fine — they forward to the new pages automatically.

## 8. After the switch — first week

- Day 1: check Cloudflare Pages analytics (turn on Web Analytics in the Pages dashboard if not already) and Search Console for crawl errors.
- Update the website link and any deep links on: Google Business Profile, Facebook and Instagram bios, Linktree if any, the Mailchimp signup form, printed programs going to print.
- Ask the DNS admin to confirm the SPF record still includes Google (it does if copied exactly).
- Photo weight: the home page currently downloads about 20 MB of images. The one-time resize batch happens this week; it makes the site noticeably faster on phones and helps Google ranking.
- Formspree: the free plan allows 50 form submissions per month across ALL forms on the site. Check usage after two weeks; upgrade if PYT is near the limit.
- After one month with no problems: cancel HostGator hosting (keep the domain registration if it's there!).

## Appendix A — for the DNS admin

Current state (checked 23 Sept 2026): pytnet.org's nameservers are ns1311/ns1312.websitewelcome.com (HostGator). The website A record is 192.185.99.129. Email is Google Workspace (MX smtp.google.com). There is an SPF TXT record and a google-site-verification TXT record. There may be DKIM (google._domainkey), DMARC (_dmarc) and cPanel records (mail, ftp, cpanel, webmail, autodiscover) — check the zone.

### Part 1 — move DNS to Cloudflare (no visible change)

1. In HostGator cPanel → Zone Editor → pytnet.org, export or screenshot EVERY record. This is the source of truth for the next step.
2. Create a free Cloudflare account (or use the existing one that owns the pyt-website Pages project — same account is simplest). Add site → pytnet.org → Free plan.
3. Cloudflare scans and imports records automatically, but it misses some. Go through your export line by line and make sure Cloudflare has ALL of: A @ → 192.185.99.129 (leave it pointing at the old site for now); A or CNAME www (same target); MX @ → smtp.google.com priority 1 (and any other MX rows exactly as they are); TXT @ v=spf1 … (exactly as written); TXT @ google-site-verification=…; TXT/CNAME google._domainkey (DKIM) if present; TXT _dmarc if present; any mail/ftp/cpanel/webmail/autodiscover rows.
4. Set the proxy status (orange cloud) OFF (grey, 'DNS only') for every record for now. Email records are always DNS only.
5. Cloudflare shows two nameservers (e.g. xxx.ns.cloudflare.com and yyy.ns.cloudflare.com). At the domain REGISTRAR (where pytnet.org was purchased — may be HostGator, may be elsewhere), replace the two websitewelcome.com nameservers with those two.
6. Wait. Cloudflare emails when the domain is active (typically 1–4 hours; up to 48 in rare cases). Check: pytnet.org still shows the OLD site; send/receive an email on an @pytnet.org address. Both must work before Part 2.

### Part 2 — attach the new site (switch day)

1. Cloudflare dashboard → Workers & Pages → pyt-website → Custom domains → Set up a custom domain → pytnet.org → Activate. Cloudflare replaces the A record for @ with a CNAME to pyt-website.pages.dev automatically (with CNAME flattening, which is why the DNS had to be on Cloudflare).
2. Repeat for www.pytnet.org.
3. Wait until both show Active and the certificate is issued (minutes). https://pytnet.org should now show the new site.
4. Tell the PM you're done; they paste the switch files and change the OAuth callback.

### Rollback

Remove both custom domains from the Pages project, then in DNS set A @ and www back to 192.185.99.129, DNS only. Do not touch MX/TXT.
