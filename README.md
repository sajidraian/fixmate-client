<div align="center">

# 🔧 FixMate

### Your device deserves a second life.

**Smart Device & Home Appliance Repair Platform**

Discover trusted technicians. Book a repair in minutes. Follow every update. Pay securely.

[![Live App](https://img.shields.io/badge/🚀_LAUNCH_APP-FixMate-84cc16?style=for-the-badge)](https://fixmate-client-psi.vercel.app)
[![Frontend CI](https://github.com/sajidraian/fixmate-client/actions/workflows/ci.yml/badge.svg?branch=main)](https://github.com/sajidraian/fixmate-client/actions/workflows/ci.yml)
![Next.js](https://img.shields.io/badge/Next.js-16-000000?logo=nextdotjs)
![TypeScript](https://img.shields.io/badge/TypeScript-5-3178C6?logo=typescript&logoColor=white)
![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-4-06B6D4?logo=tailwindcss&logoColor=white)

</div>

---

> **One platform. Three roles. A smoother repair experience.**  
> FixMate brings customers, technicians, and administrators together in one modern repair workflow.

## 🧭 Explore the README

- [What FixMate does](#-overview)
- [Features](#-features)
- [Tech stack](#-tech-stack)
- [Application routes](#️-application-routes)
- [Getting started](#-getting-started)
- [Roles and booking journey](#-roles-and-access)
- [Assignment features](#-assignment-optional-features)
- [Testing and deployment](#-testing-and-ci)

## ✨ Overview

**FixMate** is the customer-facing web application for a full-stack repair service platform. It connects customers with technicians who repair smart devices and home appliances. Customers can explore approved services, book a repair, follow job progress, pay securely, and review completed work. Technicians manage their services and assigned jobs, while administrators moderate service listings and manage the platform.

**Live application:** https://fixmate-client-psi.vercel.app  
**Backend API:** https://fixmate-server-x1b6.onrender.com/  
**Backend repository:** https://github.com/sajidraian/fixmate-server

## 🚀 Built for the complete repair journey

| 🧑‍💻 Customers | 🛠️ Technicians | 🛡️ Admins |
|---|---|---|
| Find, book, track & pay | Publish services & manage jobs | Approve services & manage users |

## 🚀 Features

### Customer experience
- Register and sign in with email/password; Google sign-in is available when OAuth is configured.
- Browse approved and available repair services.
- Search and filter services by category.
- View service details, pricing, duration, and service mode.
- Submit repair requests with address, preferred date, phone, and problem description.
- Track bookings and status history.
- Cancel a booking while it is still in the requested state.
- Pay for completed bookings through Stripe Checkout.
- View and print/save payment invoices.
- Submit a rating and review after a booking is completed and paid.
- Manage profile information.

### Technician workspace
- Register with the technician role.
- Create service listings with image upload, category, pricing, duration, service mode, and service area.
- View, edit, and delete owned services.
- Edited service listings return to pending approval.
- View assigned booking requests and manage repair progress.
- Accept or reject requests, start work, and complete jobs with a final amount.
- Review dashboard statistics and paid earnings.

### Admin workspace
- Review pending service submissions.
- Approve or reject technician service listings.
- Manage user roles.
- Review platform bookings and dashboard statistics.

### Platform experience
- Role-aware navigation and dashboards.
- JWT-authenticated requests to the Express API.
- Responsive interface with dark/light theme support.
- Paginated service, booking, and admin lists.
- Toast notifications and confirmation dialogs for important actions.

## 🧰 Tech stack

| Area | Technology |
|---|---|
| Framework | Next.js App Router |
| UI | React, Tailwind CSS |
| Language | TypeScript |
| Authentication | BetterAuth |
| Database access | MongoDB |
| API communication | Fetch API + JWT |
| Payments | Stripe Checkout |
| Image hosting | ImgBB |
| Hosting | Vercel |
| CI | GitHub Actions |

## 🗺️ Application routes

| Route | Description |
|---|---|
| `/` | Landing page |
| `/services` | Browse approved services |
| `/services/[id]` | Service details |
| `/services/[id]/book` | Create a booking |
| `/login`, `/register` | Authentication |
| `/customer` | Customer dashboard |
| `/customer/bookings` | Customer booking history |
| `/customer/invoices/[bookingId]` | Paid booking invoice |
| `/technician` | Technician dashboard |
| `/technician/services` | Create a service |
| `/technician/services/manage` | Manage own services |
| `/technician/bookings` | Manage assigned repair jobs |
| `/admin` | Admin dashboard |
| `/admin/services` | Moderate service listings |
| `/admin/users` | Manage user roles |
| `/admin/bookings` | Review bookings |
| `/profile` | Profile settings |

## 🏁 Getting started

### Prerequisites

- Node.js 20+
- npm
- A running FixMate backend
- MongoDB database access for BetterAuth
- Stripe and Google OAuth credentials only if those integrations are being used

### 1. Clone and install

```bash
git clone https://github.com/sajidraian/fixmate-client.git
cd fixmate-client
npm install
```

### 2. Configure environment variables

Copy the example file:

```bash
cp .env.example .env.local
```

On Windows PowerShell:

```powershell
Copy-Item .env.example .env.local
```

Set the values in `.env.local`:

| Variable | Purpose |
|---|---|
| `NEXT_PUBLIC_API_URL` | Backend API base URL, without a trailing slash |
| `MONGODB_URI` | MongoDB connection string used by BetterAuth |
| `DB_NAME` | MongoDB database name (for example, `fixmate`) |
| `BETTER_AUTH_SECRET` | Strong secret used by BetterAuth |
| `BETTER_AUTH_URL` | Base URL of this Next.js application |
| `GOOGLE_CLIENT_ID` | Optional Google OAuth client ID |
| `GOOGLE_CLIENT_SECRET` | Optional Google OAuth client secret |

Never commit `.env.local` or real credentials. Keep public-prefixed variables limited to values that are safe to expose in the browser.

### 3. Run the development server

```bash
npm run dev
```

Open http://localhost:3000.

### 4. Available scripts

| Command | Description |
|---|---|
| `npm run dev` | Start the Next.js development server |
| `npm run build` | Create a production build |
| `npm start` | Run the production build |
| `npm run lint` | Run ESLint |

## 🔐 Roles and access

| Role | Main capabilities |
|---|---|
| Customer | Browse services, create/cancel eligible bookings, pay, review |
| Technician | Manage own services and assigned bookings |
| Admin | Moderate services and manage users/bookings |

Public registration is limited to customer and technician roles. Admin accounts are created manually by changing the role of a trusted account in the BetterAuth `user` collection. Authorization must always be enforced by the backend; hiding a frontend control is not a security boundary.

## 🔄 Core booking journey

1. A technician submits a service listing.
2. An admin approves the listing.
3. A customer selects the approved service and submits a booking.
4. The assigned technician accepts or rejects the request.
5. The technician moves an accepted job to in progress and then completed, setting the final amount.
6. The customer pays through Stripe Checkout.
7. The customer can view the invoice and submit a review.

## 🌙 Extra touches that complete the experience

- **Reviews & Ratings:** One 1–5 star review with a comment for an eligible paid, completed booking.
- **Booking Timeline:** Timestamped booking status history.
- **Pagination:** Paginated services, customer bookings, technician bookings, admin users, and admin bookings.
- **Payment Invoice:** View and print/save an invoice after successful payment.
- **Dark Mode:** Site-wide dark/light theme switch with the selected theme saved in the browser.

## 🧪 Testing and CI

GitHub Actions runs the frontend production build on pushes and pull requests targeting `main`.

Run the checks locally:

```bash
npm ci
npm run lint
npm run build
```

For a complete manual flow, test customer and technician registration, admin service approval, booking lifecycle, Stripe test payment, invoice generation, review submission, timeline, pagination, and theme switching.

## 🚢 Deployment

The production frontend is hosted on Vercel.

1. Import this repository into Vercel.
2. Set the required production environment variables from the table above.
3. Set `NEXT_PUBLIC_API_URL` to the deployed backend URL.
4. Set `BETTER_AUTH_URL` to the deployed frontend origin.
5. Add the deployed frontend origin to the backend `FRONTEND_URL` and `CORS_ORIGINS`.
6. Configure Google OAuth authorized origins and BetterAuth callback URL if Google sign-in is enabled.
7. Redeploy after changing environment variables.

---

<div align="center">

**Made to make repairs feel effortless.**  
[Open FixMate](https://fixmate-client-psi.vercel.app) · [Backend API](https://fixmate-server-x1b6.onrender.com/)

</div>

## 🔗 Related project

- [FixMate Backend API](https://github.com/sajidraian/fixmate-server)

## 📄 License

This repository currently does not declare an open-source license. Contact the repository owner before redistributing or reusing the code.
