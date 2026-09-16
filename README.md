# World Best UI Components

Production-oriented UI component marketplace built with Next.js, Supabase and Razorpay.

## Stack
- Next.js App Router + React + TypeScript
- Tailwind CSS
- Supabase Auth + PostgreSQL + Storage
- Razorpay INR payments
- Railway deployment
- Admin OTP authentication

## Core rules
1. Admin is restricted to `reddysubramanyam.h@gmail.com`.
2. Paid source code is never embedded in public component pages.
3. Public component APIs only return metadata/preview data.
4. Paid code is returned only after a verified purchase entitlement.
5. Razorpay signatures are verified server-side.
6. Database RLS is the final access-control layer.

## Setup
1. Create a Supabase project.
2. Run `supabase/schema.sql` in SQL Editor.
3. Configure Supabase Auth email/SMTP and an email template containing `{{ .Token }}`.
4. Copy `.env.example` to `.env.local`.
5. Add Razorpay keys (server-only).
6. `npm install && npm run dev`.

## Production
Deploy the repository to Railway and configure the same environment variables.
Never expose `RAZORPAY_KEY_SECRET` or `SUPABASE_SERVICE_ROLE_KEY` to the browser.

## Admin
Open `/admin`, request an OTP for the fixed admin email, enter the OTP, then manage categories, components, versions, pricing and publication.

## Payment flow
Component/version -> create Razorpay order -> Razorpay Checkout -> server verifies signature -> purchase + entitlement transaction -> user can retrieve paid code.

## Important
This repository contains integration-ready code and schema. Real payment processing and email delivery require your own Supabase/Razorpay credentials and configuration.

## Production checklist
- Create/configure Supabase Auth email OTP delivery.
- Add Railway environment variables from `.env.example`.
- Add Razorpay live credentials only as server-side variables.
- Set `NEXT_PUBLIC_SITE_URL` to the production domain.
- Run `npm install`, `npm run build`, then `npm run start`.
