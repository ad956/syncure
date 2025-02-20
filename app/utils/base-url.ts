let BaseUrl: string;

if (
  process.env.NODE_ENV === "production" ||
  process.env.VERCEL_ENV === "production"
) {
  BaseUrl = process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000";
} else {
  BaseUrl = "http://localhost:3000";
}

export default BaseUrl;
