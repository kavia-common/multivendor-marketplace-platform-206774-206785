import { getApiBaseUrl } from "../config";

/**
 * Normalizes an error response into a consistent Error instance.
 */
function buildHttpError({ status, statusText, bodyText, url }) {
  const message = `Request failed (${status} ${statusText}) for ${url}${bodyText ? `: ${bodyText}` : ""}`;
  const err = new Error(message);
  err.status = status;
  err.statusText = statusText;
  err.url = url;
  err.bodyText = bodyText;
  return err;
}

function joinUrl(baseUrl, path) {
  return `${baseUrl}${path.startsWith("/") ? "" : "/"}${path}`;
}

function isPlainObject(value) {
  return value !== null && typeof value === "object" && !Array.isArray(value);
}

// PUBLIC_INTERFACE
export async function apiFetch(path, options = {}) {
  /**
   * Fetch helper that prefixes the API base URL and parses JSON when available.
   *
   * Params:
   * - path: string, e.g. "/"
   * - options: fetch options
   *
   * Returns:
   * - parsed JSON object when response is JSON
   * - text otherwise
   */
  const baseUrl = getApiBaseUrl();
  const url = joinUrl(baseUrl, path);

  const res = await fetch(url, {
    ...options,
    headers: {
      Accept: "application/json",
      ...(options.headers || {}),
    },
  });

  const contentType = res.headers.get("content-type") || "";
  const isJson = contentType.includes("application/json");

  if (!res.ok) {
    const bodyText = await res.text().catch(() => "");
    throw buildHttpError({
      status: res.status,
      statusText: res.statusText,
      bodyText,
      url,
    });
  }

  if (isJson) return res.json();
  return res.text();
}

async function apiRequestJson(path, { method = "GET", token, body, headers = {}, ...rest } = {}) {
  const baseUrl = getApiBaseUrl();
  const url = joinUrl(baseUrl, path);

  const finalHeaders = {
    Accept: "application/json",
    ...headers,
  };

  // If body is an object, send JSON by default.
  const shouldJsonEncode = body !== undefined && isPlainObject(body);
  if (shouldJsonEncode) {
    finalHeaders["Content-Type"] = "application/json";
  }

  if (token) {
    finalHeaders.Authorization = `Bearer ${token}`;
  }

  const res = await fetch(url, {
    method,
    ...rest,
    headers: finalHeaders,
    body: body === undefined ? undefined : shouldJsonEncode ? JSON.stringify(body) : body,
  });

  const contentType = res.headers.get("content-type") || "";
  const isJson = contentType.includes("application/json");

  if (!res.ok) {
    const bodyText = await res.text().catch(() => "");
    throw buildHttpError({
      status: res.status,
      statusText: res.statusText,
      bodyText,
      url,
    });
  }

  if (isJson) return res.json();
  return res.text();
}

// PUBLIC_INTERFACE
export async function apiGetJson(path, { token, ...options } = {}) {
  /**
   * Perform a GET request expecting JSON response.
   * If token is provided, sets Authorization: Bearer <token>.
   */
  return apiRequestJson(path, { method: "GET", token, ...options });
}

// PUBLIC_INTERFACE
export async function apiPostJson(path, body, { token, ...options } = {}) {
  /**
   * Perform a POST request sending JSON and expecting JSON response.
   * If token is provided, sets Authorization: Bearer <token>.
   */
  return apiRequestJson(path, { method: "POST", token, body, ...options });
}
