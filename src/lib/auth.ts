import { betterAuth } from "better-auth";
import { mongodbAdapter } from "@better-auth/mongo-adapter";
import { jwt } from "better-auth/plugins";
import { MongoClient } from "mongodb";

const mongoUri = process.env.MONGODB_URI;
if (!mongoUri) {
  throw new Error(
    "FixMate auth configuration error: MONGODB_URI is missing from fixmate-client/.env.local"
  );
}

const authSecret =
  process.env.BETTER_AUTH_SECRET ||
  (process.env.NODE_ENV !== "production"
    ? "fixmate-local-development-secret-change-before-deploy-2026"
    : undefined);

if (!authSecret) {
  throw new Error(
    "FixMate auth configuration error: BETTER_AUTH_SECRET is required in production"
  );
}

const client = new MongoClient(mongoUri);
const db = client.db(process.env.DB_NAME || "fixmate");

const googleClientId = process.env.GOOGLE_CLIENT_ID;
const googleClientSecret = process.env.GOOGLE_CLIENT_SECRET;

// Keep production OAuth callbacks on the exact domain registered in Google Cloud.
// Vercel preview URLs are still accepted separately through trustedOrigins below.
const configuredAuthUrl = process.env.BETTER_AUTH_URL?.trim();
const authBaseURL =
  process.env.NODE_ENV === "production"
    ? "https://fixmate-client-psi.vercel.app"
    : configuredAuthUrl || "http://localhost:3000";

export const auth = betterAuth({
  database: mongodbAdapter(db, { client }),
  baseURL: authBaseURL,
  secret: authSecret,
  trustedOrigins: [
    "https://fixmate-client-psi.vercel.app",
    ...(process.env.VERCEL_URL ? [`https://${process.env.VERCEL_URL}`] : []),
  ],

  emailAndPassword: {
    enabled: true,
  },

  // Google sign-in is enabled only when both OAuth values are configured.
  ...(googleClientId && googleClientSecret
    ? {
        socialProviders: {
          google: {
            clientId: googleClientId,
            clientSecret: googleClientSecret,
          },
        },
      }
    : {}),

  user: {
    additionalFields: {
      role: {
        type: "string",
        required: false,
        defaultValue: "customer",
        input: true,
      },
      phone: {
        type: "string",
        required: false,
        input: true,
      },
      area: {
        type: "string",
        required: false,
        input: true,
      },
      bio: {
        type: "string",
        required: false,
        input: true,
      },
    },
  },

  databaseHooks: {
    user: {
      create: {
        before: async (user) => {
          const roleValue = (user as { role?: unknown }).role;
          const role =
            typeof roleValue === "string" ? roleValue : "customer";

          if (!["customer", "technician"].includes(role)) {
            throw new Error("Invalid registration role");
          }

          return {
            data: {
              ...user,
              role,
            },
          };
        },
      },
    },
  },

  plugins: [
    jwt({
      jwt: {
        definePayload: ({ user }) => ({
          id: user.id,
          email: user.email,
          role: (user as typeof user & { role?: string }).role ?? "customer",
        }),
      },
    }),
  ],
});
