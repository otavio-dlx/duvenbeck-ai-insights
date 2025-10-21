dotenv.config();
import dotenv from "dotenv";

// Load env so the config can use DATABASE_URL when run via npx locally
dotenv.config();

const config = {
  // Optional: path/glob to your schema files if you use Drizzle schema generation
  // If you don't have schema files yet, this can point to a directory where migrations will be written
  schema: "./drizzle/schema.ts",
  out: "./drizzle/migrations",
  // Required by newer drizzle-kit: tell it which SQL dialect you're using
  dialect: "postgresql",
  dbCredentials: {
    // Some drizzle versions expect `url`, some accept `connectionString`.
    // Provide both to be compatible.
    url: process.env.DATABASE_URL || process.env.VITE_DATABASE_URL,
    connectionString: process.env.DATABASE_URL || process.env.VITE_DATABASE_URL,
  },
};

export default config;
