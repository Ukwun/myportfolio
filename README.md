This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Production lead notifications and analytics

The site stores `visitor-intelligence` submissions in Netlify Forms and includes an owner-alert function. Configure these variables in **Netlify → Site configuration → Environment variables**:

- `RESEND_API_KEY`: server-only Resend API key used by the lead-alert function.
- `LEAD_FROM_EMAIL`: optional verified sender, for example `Portfolio <leads@yourdomain.com>`. Until a domain is verified, the function uses Resend's onboarding sender.
- `NEXT_PUBLIC_GA_MEASUREMENT_ID`: GA4 measurement ID such as `G-XXXXXXXXXX`; this enables real-time visitors, page views, and `generate_lead` conversion events.

The notification recipient is fixed server-side to `solaceinterlude@gmail.com`. As an additional delivery path, enable **Netlify Forms → Form notifications → Email notification** for the `visitor-intelligence` form and use the same owner address.

## Ebook checkout and delivery

The `/ebooks` storefront initializes Paystack transactions from Netlify Functions, verifies the status, amount, currency, and product ID server-side, and sends the paid PDF as an email attachment through Resend. Card, bank, bank-transfer, and USSD channels are enabled when available on the connected Paystack account.

The ebook PDF is deliberately excluded from this public repository. It must be uploaded to the private, site-wide `ebook-files` Netlify Blob store with the exact key `how-i-flipped-30k.pdf`:

```powershell
npx netlify login
npx netlify link
npx netlify blobs:set ebook-files how-i-flipped-30k.pdf --input "C:\Users\LENOVO 1\Downloads\How_I_Flipped_30K_Into_4_5M_Contract.pdf"
```

Configure these variables in **Netlify → Project configuration → Environment variables**, with Functions scope where available:

- `PAYSTACK_SECRET_KEY`: Paystack test or live secret key. Never expose it in frontend code.
- `RESEND_API_KEY`: Resend API key used for automatic PDF delivery.
- `EBOOK_FROM_EMAIL`: verified sender, for example `John Solace <ebooks@yourdomain.com>`.
- `EBOOK_REPLY_TO`: optional support address; defaults to `solaceinterlude@gmail.com`.
- `EBOOK_PRICE_NAIRA`: optional whole-naira price; defaults to `5000`.

In the Paystack dashboard, set the webhook URL to:

```text
https://YOUR-DOMAIN/.netlify/functions/paystack-webhook
```

The purchase button remains disabled until the Paystack key, Resend key, and private Blob file are all available. Use Paystack test keys for an end-to-end test before switching to live keys.

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
