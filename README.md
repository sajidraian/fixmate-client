# FixMate – Smart Device & Home Appliance Repair Service Platform

FixMate is a full-stack repair service platform that connects customers with skilled technicians for smart device and home appliance repairs.

Customers can explore services, request repairs, track bookings, and make payments. Technicians can manage services and repair requests, while administrators manage service approvals.

## Live Project

- Frontend: Coming Soon
- Backend API: Coming Soon

## Features

### Customer
- Register and login using email or Google
- Browse and search approved repair services
- View detailed service information
- Book repair services
- Track booking status
- Cancel pending bookings
- Make payments for completed bookings
- Manage personal profile

### Technician
- Technician dashboard
- Create repair service listings
- Upload service images
- Manage customer bookings
- Accept or reject booking requests
- Update repair progress
- Set final repair amount

### Admin
- Admin dashboard
- View pending service submissions
- Approve or reject services
- Manage service availability through approval workflow

## Technologies Used

- Next.js
- React
- TypeScript
- Tailwind CSS
- BetterAuth
- MongoDB
- Express.js
- Stripe
- ImgBB API

## Installation

Clone the repository:

```bash
git clone https://github.com/sajidraian/fixmate-client.git
cd fixmate-client
```

Install dependencies:

```bash
npm install
```

## Environment Variables

Create a `.env.local` file in the project root:

```env
NEXT_PUBLIC_API_URL=http://localhost:5000

MONGODB_URI=your_mongodb_connection_string
DB_NAME=fixmate

BETTER_AUTH_SECRET=your_secure_secret
BETTER_AUTH_URL=http://localhost:3000

GOOGLE_CLIENT_ID=your_google_client_id
GOOGLE_CLIENT_SECRET=your_google_client_secret
```

Replace placeholder values with your own credentials. Never commit `.env.local` to GitHub.

## Run Locally

Start the development server:

```bash
npm run dev
```

Open:

`http://localhost:3000`

## Build for Production

```bash
npm run build
```

Start the production server:

```bash
npm start
```

## Project Routes

| Route | Description |
|---|---|
| `/` | Homepage |
| `/services` | Browse repair services |
| `/services/[id]` | Service details |
| `/login` | User login |
| `/register` | User registration |
| `/customer` | Customer dashboard |
| `/customer/bookings` | Customer bookings |
| `/technician` | Technician dashboard |
| `/technician/services` | Technician service management |
| `/technician/bookings` | Technician booking management |
| `/admin` | Admin dashboard |
| `/profile` | User profile management |

## Authentication & Authorization

FixMate uses BetterAuth for authentication and JWT for protected backend API requests.

The platform supports three roles:

- Customer
- Technician
- Admin

Role-based access control protects restricted dashboard pages and API endpoints.

## Backend Repository

GitHub: https://github.com/sajidraian/fixmate-server

## Payment Integration

Stripe Checkout is integrated for customer payments. Payment confirmation is handled through Stripe webhooks.

Stripe credentials and webhook configuration are required for live payment testing.

## Image Upload

ImgBB API is used to upload technician service images.

## Database

MongoDB stores the platform's application data, including users, services, bookings, and payments. BetterAuth manages separate authentication-related collections.

## Project Status

Core frontend features include role-based dashboards, authentication, service browsing, booking management, profile management, image upload, and payment workflow integration.