# John Solace Portfolio

Premium digital systems studio website for John Solace. The public site presents websites, software platforms, mobile products, 3D storytelling, selected work, testimonials, a qualification form, and a direct WhatsApp contact path.

## What This Repository Does

### Public experience

- Static Next.js App Router pages for the home page, about, services, packages, process, case studies, contact, and ebooks.
- Responsive visual system with 3D scenes, project rails, client logos, testimonials, motion, and mobile-friendly navigation.
- Every WhatsApp CTA uses `src/lib/contact.ts`. The configured number is `08119678524`, represented in international WhatsApp format as `2348119678524`.
- The intake form submits to Netlify Forms and also stores a private lead record through `netlify/functions/lead-alert.mjs`.
- Optional GA4 tracking is enabled with `NEXT_PUBLIC_GA_MEASUREMENT_ID`.

### Private operations

- `/admin` is a passwordless email-code dashboard restricted to `Ukwun97@gmail.com`.
- Netlify Blobs store leads, pricing, ebook payment records, bank-transfer orders, entitlements, and private ebook files.
- Ebook delivery is deliberately manual: the buyer submits a GTBank transfer notice, the owner verifies the payment, and the admin dashboard sends a personalized, expiring, download-limited PDF link.
- Netlify Functions provide admin auth, live settings, lead alerts, ebook availability, bank-transfer orders, and protected ebook access.

## Current State

The application is structurally ready for a Netlify deployment. `next.config.ts` uses a static export, `netlify.toml` publishes `out`, and the production build has been verified with Next.js 16. The repository is connected to `https://github.com/Ukwun/myportfolio`, so a Netlify site linked to that repository can auto-deploy from `main`.

The following are implemented in code but cannot be completed by a repository commit alone:

- Netlify site creation/linking, custom domain DNS, and HTTPS.
- Netlify environment variables and Blob store access.
- Resend sender verification and API key.
- Uploading the private ebook PDFs to the `ebook-files` Blob store.
- A real bank-transfer submission, admin approval, email-delivery, and protected-download test.
- Production analytics and Netlify Forms email notifications, if desired.

## Local Development

Requirements: Node.js 20 and npm.

```powershell
npm install
npm run dev
```

Open `http://localhost:3000`.

Release checks:

```powershell
npm run lint
npm run build
```

`npm run build` creates the static site in `out`. Netlify Functions are deployed separately from `netlify/functions`.

## Netlify Auto-Deploy Setup

1. In Netlify, create or open a site and choose **Import from Git > GitHub**.
2. Select `Ukwun/myportfolio`, set the production branch to `main`, and let Netlify read `netlify.toml`.
3. Confirm these values:
   - Build command: `npm run build`
   - Publish directory: `out`
   - Functions directory: `netlify/functions`
   - Node version: `20`
4. Add the environment variables below under the production deploy context.
5. Deploy once, then configure the custom domain and HTTPS.
6. Keep future changes on `main` (or merge pull requests into it); Netlify will build and deploy automatically.

## Required Netlify Variables

Set these as server-side variables. Do not add secrets with the `NEXT_PUBLIC_` prefix.

| Variable | Purpose |
| --- | --- |
| `ADMIN_SESSION_SECRET` | At least 32 random bytes for signed admin sessions. Required in production. |
| `RESEND_API_KEY` | Sends lead alerts, admin codes, and approved ebook delivery emails. |
| `ADMIN_FROM_EMAIL` | Verified Resend sender for admin login codes. |
| `LEAD_FROM_EMAIL` | Verified Resend sender for lead alerts. |
| `EBOOK_FROM_EMAIL` | Verified Resend sender for ebook delivery. |
| `EBOOK_REPLY_TO` | Optional support/reply address; defaults to `Ukwun97@gmail.com`. |
| `EBOOK_ACCESS_SECRET` | Dedicated signing secret for protected ebook links; otherwise `ADMIN_SESSION_SECRET` is used. |
| `NEXT_PUBLIC_GA_MEASUREMENT_ID` | Optional GA4 ID such as `G-XXXXXXXXXX`. |
| `EBOOK_PRICE_NAIRA` | Optional initial price for the first ebook. |
| `EBOOK_ONE_SKILL_PRICE_NAIRA` | Optional initial price for the second ebook. |
| `EBOOK_BEIJING_PRICE_NAIRA` | Optional initial price for the third ebook. |

Generate secrets locally with:

```powershell
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

Use a verified domain sender in Resend. The temporary `onboarding@resend.dev` sender is suitable only for limited testing and may not deliver to arbitrary customers.

## Private Ebook Files

The PDFs must not be committed to GitHub or placed in `public/`. Install and authenticate the Netlify CLI, link the site, then upload the files using the exact keys expected by `netlify/lib/ebook-catalog.mjs`:

```powershell
npm install --global netlify-cli
netlify login
netlify link
netlify blobs:set ebook-files how-i-flipped-30k.pdf --input "C:\path\How_I_Flipped_30K_Into_4_5M_Contract.pdf"
netlify blobs:set ebook-files one-skill-first-million.pdf --input "C:\path\How_to_Turn_ONE_Skill_Into_Your_First_N1_Million.pdf"
netlify blobs:set ebook-files lost-beijing-client.pdf --input "C:\path\How_I_Lost_A_5000_Dollar_Client_From_Beijing.pdf"
```

The ebook purchase buttons remain unavailable until the required Resend configuration, access secret, and private Blob file exist.

## Go-Live Verification

Run this checklist after the first production deploy:

- Open every public route on desktop and mobile; check navigation, images, 3D assets, video, and the WhatsApp buttons.
- Click a WhatsApp CTA and confirm it opens `+234 811 967 8524` with the intended prefilled message.
- Submit the intake form and confirm both the Netlify Form record and owner alert.
- Request and verify an admin code at `/admin`; confirm pricing changes persist after refresh.
- Confirm each ebook reports available on `/ebooks`.
- Submit a real or controlled bank-transfer notice; verify the order appears in `/admin`.
- Check the bank account before using **Confirm & send ebook**.
- Confirm the buyer email, protected link, watermark, one-year expiry, and five-download limit.
- Test invalid, expired, repeated, and over-limit ebook links.
- Check Netlify deploy logs, Function logs, Forms, Blob data, Resend delivery logs, and analytics.

## Important Operational Notes

- The ebook workflow is bank-transfer based, not an automatic card payment gateway. A human must verify funds before delivery.
- Netlify Blobs and Resend are production dependencies; a successful static build does not prove those services are configured.
- Keep private keys, PDF files, customer data, and Blob credentials out of Git history.
- The admin route and ebook success route are excluded from `robots.txt`; this is not an authentication boundary.
