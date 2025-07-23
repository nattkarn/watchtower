const isProd = process.env.NODE_ENV === "production";

let apiUrl = "";

if (isProd) {
  apiUrl = process.env.NEXT_PUBLIC_PROD_API_URL!;
} else {
  apiUrl = process.env.NEXT_PUBLIC_DEV_API_URL!;
}

export const config = {
  apiUrl,
};

export default config;
