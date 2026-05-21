# Maybrin Growth Strategies — Website

One-page site for Maybrin Growth Strategies. Single static `index.html` with embedded CSS and JavaScript. No build step.

---

## Deploy to Vercel

```bash
git init
git add .
git commit -m "Initial commit"
git remote add origin git@github.com:YOUR-USER/maybrin.git
git push -u origin main
```

Then at [vercel.com/new](https://vercel.com/new):
1. Import the repo.
2. Framework Preset: **Other**. Leave build command and output directory empty.
3. Deploy.
4. Add `maybrin.com` (and `www.maybrin.com`) under Project Settings → Domains.

`vercel.json` already handles clean URLs, security headers, and aggressive caching for static assets.

---

## One thing left before launch: wire up the forms

The two forms on the site (intake and newsletter) currently show a "Thanks" message but **do not send anything** until you set `FORM_ENDPOINT` in `index.html`.

The recommended setup is **Google Apps Script** — free, no third-party service, populates a Google Sheet *and* emails you on every submission. Setup takes about 10 minutes.

### Setup

1. Create a new Google Sheet. Name it something like "Maybrin – Form Submissions".
2. Add two tabs at the bottom: **`Intake`** and **`Newsletter`**.
3. In the Sheet menu: **Extensions → Apps Script**.
4. Delete the placeholder code, then paste the entire contents of `form-backend.gs` (in this repo).
5. The `NOTIFY_EMAIL` at the top is already set to `d.schemetti@gmail.com`. Change if needed.
6. Click **Deploy → New deployment**.
   - Type: **Web app**
   - Execute as: **Me**
   - Who has access: **Anyone**
   - Click **Deploy** and authorize.
7. Copy the **Web app URL** Google gives you.
8. Open `index.html` and find this line near the bottom of the `<script>` block:

   ```js
   const FORM_ENDPOINT = "";
   ```

   Paste the URL between the quotes. Commit and push.

That's it. Every form submission will append a row to the Sheet and send you an email with the details. Reply-to is set to the submitter's email, so you can reply directly from your inbox.

### Test it

After deploying, submit one of your own forms with a test name like "TEST – ignore". You should see:
- A new row in the appropriate tab of your Google Sheet
- An email in your inbox within seconds

---

## What's already wired up

- ✅ Real Calendly link: `https://calendly.com/donnie-schemetti`
- ✅ Donnie's LinkedIn: `https://www.linkedin.com/in/donnieschemetti/`
- ✅ Maybrin company LinkedIn: `https://www.linkedin.com/company/maybrin/`
- ✅ Email obfuscation: `d.schemetti@gmail.com` is hidden from HTML source and built in JavaScript from `data-u` and `data-d` attributes. Scrapers reading the raw HTML won't find a `name@domain` string.
- ✅ Favicons at every size (16, 32, 48, 180, 192, 512) plus multi-size `.ico` and `apple-touch-icon.png`
- ✅ Open Graph image at `/og-image.png` (1200×630, shows on LinkedIn / Slack / iMessage / X)
- ✅ Web app manifest for PWA / Add-to-Home-Screen support
- ✅ Schema.org structured data (`ProfessionalService` with founder info)
- ✅ Sitemap and robots.txt
- ✅ Security headers via `vercel.json`
- ✅ Skip-to-content link and visible focus rings (keyboard accessibility)
- ✅ `prefers-reduced-motion` respected
- ✅ Image dimensions on all `<img>` tags (prevents layout shift)

---

## Content you may want to update over time

- **Capacity language**: The CTA section no longer mentions specific open slots. If you want to add a capacity statement when truly available (e.g., "Q1 2027 capacity opens January"), look for the `cta-meta` block in `index.html`.
- **Pricing in FAQ**: Strategic Advisory $6K/mo, Fractional $12–20K/mo, projects mid-five-figures. Edit anytime.
- **First Field Notes dispatch**: The newsletter form will start collecting addresses on launch. Have your first issue queued so the empty inbox doesn't sit too long.

---

## Files

```
/
├── index.html              Single-file site (HTML + CSS + JS)
├── form-backend.gs         Google Apps Script for form submissions
├── og-image.png            1200×630 social share image
├── favicon.ico             Multi-size ICO (16/32/48)
├── favicon-16.png          16×16
├── favicon-32.png          32×32
├── favicon-48.png          48×48
├── favicon-180.png         180×180 (also copied to apple-touch-icon.png)
├── favicon-192.png         192×192 (Android)
├── favicon-512.png         512×512 (PWA / large)
├── apple-touch-icon.png    180×180
├── site.webmanifest        PWA manifest
├── vercel.json             Clean URLs, security headers, caching
├── robots.txt              Allow all crawlers, point to sitemap
├── sitemap.xml             Single URL sitemap
└── README.md               This file
```

---

## Tech notes

- **Fonts**: Bricolage Grotesque + JetBrains Mono via Google Fonts (preconnected).
- **Images**: Donnie's headshot + Maybrin logo hosted on Cloudinary.
- **No build step, no framework, no dependencies.** Edit the HTML directly.
- **Apps Script forms use `mode: 'no-cors'`** because Apps Script web apps don't return CORS headers. The browser can't read the response, so the script optimistically shows the success state. In practice, submission failure is extremely rare — but you can verify by checking your Google Sheet.
- **Alternative form backends**: If you ever want to switch off Apps Script, swap `FORM_ENDPOINT` for a Formspree URL, a Vercel Function, or Tally / Fillout embed. The `submitForm()` helper in `index.html` will work with any endpoint that accepts JSON POST.
