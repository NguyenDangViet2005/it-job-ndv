/**
 * Build URL với query params
 */
export function buildURL(
  baseUrl: string,
  endpoint: string,
  params?: Record<string, string | number | boolean>
): string {
  const base = baseUrl.endsWith("/") ? baseUrl : `${baseUrl}/`;
  const cleanEndpoint = endpoint.startsWith("/") ? endpoint.slice(1) : endpoint;
  const url = new URL(cleanEndpoint, base);

  if (params) {
    Object.entries(params).forEach(([key, value]) => {
      url.searchParams.append(key, String(value));
    });
  }

  return url.toString();
}

/**
 * Handle API response
 */
export async function handleResponse<T>(response: Response): Promise<T> {
  if (!response.ok) {
    const error = await response.json().catch(() => ({
      message: response.statusText,
    }));
    throw new Error(error.message || `HTTP Error: ${response.status}`);
  }

  const contentType = response.headers.get("content-type");
  const contentLength = response.headers.get("content-length");

  // If no content or content-length is 0, return empty object
  if (contentLength === "0" || !contentType?.includes("application/json")) {
    return {} as T;
  }

  // Parse JSON response
  try {
    const data = await response.json();
    // Auto inject success: true if missing and status is OK
    if (data && typeof data === "object" && !("success" in data)) {
      data.success = true;
    }
    return data;
  } catch (error) {
    return {} as T;
  }
}
