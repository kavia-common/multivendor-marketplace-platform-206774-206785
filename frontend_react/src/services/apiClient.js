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
  const url = `${baseUrl}${path.startsWith("/") ? "" : "/"}${path}`;

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

