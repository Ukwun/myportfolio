This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Production lead notifications and analytics

The site stores `visitor-intelligence` submissions in Netlify Forms and includes an owner-alert function. Configure these variables in **Netlify → Site configuration → Environment variables**:

- `RESEND_API_KEY`: server-only Resend API key used by the lead-alert function.
- `LEAD_FROM_EMAIL`: optional verified sender, for example `Portfolio <leads@yourdomain.com>`. Until a domain is verified, the function uses Resend's onboarding sender.
- `NEXT_PUBLIC_GA_MEASUREMENT_ID`: GA4 measurement ID such as `G-XXXXXXXXXX`; this enables real-time visitors, page views, and `generate_lead` conversion events.

The notification recipient is fixed server-side to `Ukwun97@gmail.com`. Submissions are also stored privately for the admin dashboard. As an additional delivery path, enable **Netlify Forms → Form notifications → Email notification** for the `visitor-intelligence` form and use the same owner address.

## Super-admin dashboard

Use the **Admin login** link in the website footer, or open `/admin` directly. Only `Ukwun97@gmail.com` can request and verify its passwordless email code. The signed session is stored in an HTTP-only, secure cookie; pricing, enquiries, bank-transfer orders, and ebook delivery records are stored in private Netlify Blob stores.

Add these server-only Netlify environment variables:

- `ADMIN_SESSION_SECRET`: a random secret of at least 32 bytes. Generate one with `node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"`.
- `ADMIN_FROM_EMAIL`: optional verified sender for login codes. It falls back to `LEAD_FROM_EMAIL` or `EBOOK_FROM_EMAIL`.

The dashboard can change every ebook and service price, review captured enquiries, inspect each bank-transfer notice, and—after checking the GTBank account—select **Confirm & send ebook** to issue the private delivery link. Never prefix `ADMIN_SESSION_SECRET` with `NEXT_PUBLIC_`.

## Ebook checkout and delivery

The `/ebooks` storefront currently accepts **GTBank transfer only**: account number `0238589273`. A buyer enters their name, email and phone number, transfers the displayed amount, then submits a transfer notice. Resend emails `Ukwun97@gmail.com` with the buyer's details and the selected ebook. After you check the transfer in GTBank, use `/admin` to select **Confirm & send ebook**. Only that manual admin action emails the private one-click access link. Each link lasts one year, permits up to five downloads, and generates a PDF watermarked on every page with the buyer's email and order reference.

The ebook PDFs are deliberately excluded from this public repository. Install the Netlify CLI once to avoid temporary `npx` cleanup warnings, link this folder to the existing Netlify project, and upload all three PDFs to the private, site-wide `ebook-files` Blob store using these exact keys:

```powershell
npm install --global netlify-cli
netlify login
netlify link
netlify blobs:set ebook-files how-i-flipped-30k.pdf --input "C:\Users\LENOVO 1\Downloads\How_I_Flipped_30K_Into_4_5M_Contract.pdf"
netlify blobs:set ebook-files one-skill-first-million.pdf --input "C:\Users\LENOVO 1\Downloads\How_to_Turn_ONE_Skill_Into_Your_First_N1_Million.pdf"
netlify blobs:set ebook-files lost-beijing-client.pdf --input "C:\Users\LENOVO 1\Downloads\How_I_Lost_A_5000_Dollar_Client_From_Beijing.pdf"
```

If npm prints an `EPERM ... npm-cache\_npx` cleanup warning, close other terminals running Node and run `npm cache verify`. The warning concerns a temporary CLI cache; do not move any ebook PDF into `public/` to work around it.

Configure these variables in **Netlify → Project configuration → Environment variables**, with Functions scope where available:

- `RESEND_API_KEY`: Resend API key used for automatic PDF delivery.
- `EBOOK_FROM_EMAIL`: verified sender, for example `John Solace <ebooks@yourdomain.com>`.
- `EBOOK_REPLY_TO`: optional support address; defaults to `Ukwun97@gmail.com`.
- `EBOOK_ACCESS_SECRET`: optional dedicated signing secret for private download links. It falls back to `ADMIN_SESSION_SECRET`.
- `EBOOK_PRICE_NAIRA`: optional price for *How I Flipped ₦30K*; defaults to `5000`.
- `EBOOK_ONE_SKILL_PRICE_NAIRA`: optional price for *The One-Skill Playbook*; defaults to `5000`.
- `EBOOK_BEIJING_PRICE_NAIRA`: optional price for *The $5,000 Client I Lost*; defaults to `5000`.

Each purchase button remains disabled until the email-delivery configuration and that title's private Blob file are available. Test a complete bank-transfer notice and admin approval before promoting the store to customers.

The three price environment variables provide initial defaults. Prices saved from `/admin` take precedence immediately without a rebuild.

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.
