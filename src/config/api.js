const DEFAULT_LOCAL_API_URL = "https://paynet-1.onrender.com";
const DEFAULT_PRODUCTION_API_URL = "https://paynet-1.onrender.com";

const stripTrailingSlash = (value = "") => String(value).replace(/\/+$/, "");

const configuredApiUrl =
  process.env.REACT_APP_API_URL ||
  process.env.REACT_APP_BACKEND_URL ||
  process.env.REACT_APP_API_BASE_URL;

export const API_BASE_URL = stripTrailingSlash(
  configuredApiUrl ||
    (!process.env.NODE_ENV === "development"
      ? DEFAULT_LOCAL_API_URL
      : DEFAULT_PRODUCTION_API_URL)
);

export const apiUrl = (path = "") => {
  if (!path) {
    return API_BASE_URL;
  }

  if (/^https?:\/\//i.test(path)) {
    return path;
  }

  const normalizedPath = path.startsWith("/") ? path : `/${path}`;
  return `${API_BASE_URL}${normalizedPath}`;
};
