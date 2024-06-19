export const DEVELOPMENT_BASE_URL = "http://localhost:3001/";
export const PRODUCTION_BASE_URL = "https://innovilage.vercel.app/api/";
export const BASE_URL =
  process.env.NODE_ENV === "production"
    ? PRODUCTION_BASE_URL
    : DEVELOPMENT_BASE_URL;
export const BASE_LOCATION_URL = "https://adsattt.github.io/api-wilayah-indonesia/";
