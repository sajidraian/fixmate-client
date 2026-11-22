# FixMate – Smart Device & Home Appliance Repair Service Platform

FixMate connects customers with repair technicians for home appliances and smart devices. It is a full-stack role-based platform built with Next.js, Express, MongoDB, BetterAuth, Stripe Checkout, and ImgBB.

## Repositories

- Frontend repository: https://github.com/sajidraian/fixmate-client
- Backend repository: https://github.com/sajidraian/fixmate-server
- Live frontend: https://fixmate-client-psi.vercel.app
- Live backend: https://fixmate-server-x1b6.onrender.com/

## Implemented Features

### Customer
- Email/password registration and login, plus Google sign-in when OAuth credentials are configured
- Browse approved and available services; search and category filtering
- View service details and request a repair with address, phone, preferred date, and problem description
- View booking history and live booking/payment status
- Cancel requests while they are still in the requested state
- Pay for completed bookings using Stripe Checkout
- Manage profile information

### Technician
- Register as a technician
- Create service listings with image upload, category, pricing, duration, service mode, and service area
- View, edit, and delete owned services; edited listings return to admin approval
- View only assigned booking requests
- Accept/reject requests, start repairs, and complete jobs with a final amount
- View dashboard counts and paid earnings

### Admin
- Review pending technician service submissions
- Approve or reject service listings

### Platform
- BetterAuth authentication and JWT-protected Express API
- Server-side role and ownership checks
- MongoDB application collections: `services`, `bookings`, and `payments`; BetterAuth manages its auth collections separately
- ImgBB image uploads
- Stripe Checkout with webhook confirmation and a server-side Checkout Session verification fallback
- Customer and technician dashboard summaries

## Tech Stack

- Next.js App Router, React, TypeScript, Tailwind CSS
- Express.js, Node.js, TypeScript
- MongoDB
- BetterAuth and JWT (JOSE)
- Stripe Checkout and webhooks
- ImgBB

## Run Locally

Use two terminals. Configure the environment files first.

### 1. Backend

```bash
git clone https://github.com/sajidraian/fixmate-server.git
cd fixmate-server
npm install
```

Copy `.env.example` to `.env` and set your MongoDB, BetterAuth URL, ImgBB, and Stripe values.

```bash
npm run dev
```

The API defaults to `http://localhost:5000`.

### 2. Frontend

```bash
git clone https://github.com/sajidraian/fixmate-client.git
cd fixmate-client
npm install
```

Copy `.env.example` to `.env.local`. Set the same MongoDB connection and database name used by the backend, a strong BetterAuth secret, the local BetterAuth URL, and Google OAuth credentials if Google sign-in is required.

```bash
npm run dev
```

Open `http://localhost:3000`.

## Stripe Test Payments

1. Use Stripe test-mode API keys in the backend environment.
2. Start the backend and frontend.
3. In a separate terminal, run:

   ```bash
   stripe listen --events checkout.session.completed --forward-to localhost:5000/api/webhooks/stripe
   ```

4. Copy the webhook signing secret printed by Stripe CLI into backend `STRIPE_WEBHOOK_SECRET`, then restart the backend if the value changed.
5. Complete a booking as a customer. A technician must accept it, start the repair, and mark it completed with a final amount before payment is available.
6. Pay with Stripe's test card `4242 4242 4242 4242`, a future expiry date, any 3-digit CVC, and any ZIP code.

The webhook is the primary confirmation mechanism. After Checkout redirects back, the app also asks the backend to verify the Checkout Session directly with Stripe. A booking is marked paid only after server-side confirmation.

## Admin Account

Public registration only allows the customer and technician roles. To create an admin, register a normal account, then update that account's `role` field to `admin` in the BetterAuth `user` collection in MongoDB. Do not expose an admin registration option in the public form.

## Main Routes

| Route | Purpose |
|---|---|
| `/` | Landing page |
| `/services` | Browse approved services |
| `/services/[id]` | Service details |
| `/services/[id]/book` | Create a booking |
| `/login`, `/register` | Authentication |
| `/customer`, `/customer/bookings` | Customer dashboard and bookings |
| `/technician` | Technician dashboard |
| `/technician/services` | Create service |
| `/technician/services/manage` | Manage own services |
| `/technician/bookings` | Manage repair requests |
| `/admin` | Admin service approvals |
| `/profile` | Profile settings |

## Build and Lint

```bash
npm run build
npm run lint
```

## Deployment Notes

- Deploy this Next.js repository to a Next.js-compatible host such as Vercel.
- Deploy the Express repository to a Node.js host.
- Use MongoDB Atlas or another reachable MongoDB deployment.
- Set production environment variables separately in each hosting provider; never commit real `.env` files.
- Set the backend `FRONTEND_URL` and `CORS_ORIGINS` to the deployed frontend origin.
- Set frontend `NEXT_PUBLIC_API_URL` to the deployed backend URL.
- Configure the Stripe webhook endpoint as `https://YOUR_BACKEND_HOST/api/webhooks/stripe` for the `checkout.session.completed` event and store the production signing secret in the backend environment.
- Configure Google OAuth redirect URLs for the deployed BetterAuth callback URL if Google sign-in is enabled.

## Notes

Production deployment: the frontend is hosted on Vercel and the Express API is hosted on Render. Confirm the hosting dashboards show the latest deployment as Ready/Live before presenting the site.


## Assignment Optional Features

- **Reviews & Ratings:** Customers can submit one 1–5 star review with a comment after a booking is completed and paid.
- **Booking Timeline:** Booking status history records requested, accepted/rejected, in-progress, completed, and customer cancellation events.
- **Pagination:** Service discovery, customer bookings, technician bookings, admin users, and admin bookings support paginated results.
- **Payment Invoice:** Customers can view and print/save an invoice for a successfully paid booking.
- **Dark Mode:** Site-wide dark/light theme switch with the selected theme saved in the browser.

## Additional Dashboard Routes

| Route | Purpose |
|---|---|
| `/customer/invoices/[bookingId]` | View and print a paid booking invoice |
| `/admin/users` | Manage user roles |
| `/admin/bookings` | Review bookings |
| `/admin/services` | Approve or reject service listings |
