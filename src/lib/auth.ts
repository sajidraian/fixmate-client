
import { betterAuth } from "better-auth";
import { mongodbAdapter } from "@better-auth/mongo-adapter";
import { jwt } from "better-auth/plugins";
import { MongoClient } from "mongodb";

const client = new MongoClient(process.env.MONGODB_URI!);
const db = client.db(process.env.DB_NAME || "fixmate");

export const auth = betterAuth({
  database: mongodbAdapter(db, {
    client,
  }),

  baseURL: process.env.BETTER_AUTH_URL,
  secret: process.env.BETTER_AUTH_SECRET,

  // Email and Password Login
  emailAndPassword: {
    enabled: true,
  },

  // Google Login
  socialProviders: {
    google: {
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    },
  },

  // Additional User Fields
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

  // Role Security
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

  // JWT Plugin
  plugins: [jwt()],
});
