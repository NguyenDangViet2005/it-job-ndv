import type { ApiResponse, ResponseData } from "@/types/api.type";

const BE_ENDPOINT = process.env.NEXT_PUBLIC_BE_ENDPOINT;

interface ApiConfig extends RequestInit {
  params?: Record<string, string | number | boolean>;
  token?: string;
}

// Helper function để lấy role từ localStorage
function getUserRole(): string {
  if (typeof window === "undefined") return "";
  const userInfo = localStorage.getItem("userInfo");
  if (!userInfo) return "";
  try {
    const parsed = JSON.parse(userInfo);
    return parsed?.role || "";
  } catch {
    return "";
  }
}

// Build URL với query params và tự động thêm role
function buildURL(
  endpoint: string,
  params?: Record<string, string | number | boolean>
): string {
  const url = new URL(endpoint, BE_ENDPOINT);

  // Thêm role vào params nếu có
  const role = getUserRole();
  if (role) {
    url.searchParams.append("role", role);
  }

  if (params) {
    Object.entries(params).forEach(([key, value]) => {
      url.searchParams.append(key, String(value));
    });
  }

  return url.toString();
}

// Handle response
async function handleResponse<T>(response: Response): Promise<T> {
  if (!response.ok) {
    const error = await response.json().catch(() => ({
      message: response.statusText,
    }));
    throw new Error(error.message || `HTTP Error: ${response.status}`);
  }

  // Check if response has content (some DELETE requests return empty body)
  const contentType = response.headers.get("content-type");
  const contentLength = response.headers.get("content-length");

  // If no content or content-length is 0, return empty object
  if (contentLength === "0" || !contentType?.includes("application/json")) {
    return {} as T;
  }

  // Try to parse JSON, return empty object if fails
  try {
    const data = await response.json();
    // Xử lý .NET JSON format với $values
    return transformDotNetResponse(data);
  } catch (error) {
    // If JSON parsing fails (empty body), return empty object
    return {} as T;
  }
}

// Transform .NET JSON response (xử lý $values từ ReferenceHandler)
function transformDotNetResponse(obj: any): any {
  if (obj === null || obj === undefined) {
    return obj;
  }

  // Nếu có $values, lấy array từ đó
  if (obj.$values && Array.isArray(obj.$values)) {
    return obj.$values.map((item: any) => transformDotNetResponse(item));
  }

  // Nếu là array, transform từng phần tử
  if (Array.isArray(obj)) {
    return obj.map((item: any) => transformDotNetResponse(item));
  }

  // Nếu là object, transform từng property
  if (typeof obj === "object") {
    const transformed: any = {};
    for (const key in obj) {
      // Skip các property $id, $ref của .NET
      if (key.startsWith("$") && key !== "$values") {
        continue;
      }
      transformed[key] = transformDotNetResponse(obj[key]);
    }
    return transformed;
  }

  return obj;
}

// GET request
export async function apiGet<T>(
  endpoint: string,
  config?: ApiConfig
): Promise<T> {
  const url = buildURL(endpoint, config?.params);

  const headers: HeadersInit | any = {
    "Content-Type": "application/json",
    ...config?.headers,
  };

  if (config?.token) {
    headers["Authorization"] = `Bearer ${config.token}`;
  }

  try {
    const response = await fetch(url, {
      method: "GET",
      headers,
      ...config,
    });

    const result = await handleResponse<T>(response);
    return result;
  } catch (error) {
    console.error("❌ API GET Error:", error);
    throw new Error(
      `Failed to fetch: ${
        error instanceof Error ? error.message : "Network error"
      }`
    );
  }
}

// POST request
export async function apiPost<T>(
  endpoint: string,
  data?: unknown,
  config?: ApiConfig
): Promise<T> {
  const url = buildURL(endpoint, config?.params);

  const headers: HeadersInit | any = {
    "Content-Type": "application/json",
    ...config?.headers,
  };

  if (config?.token) {
    headers["Authorization"] = `Bearer ${config.token}`;
  }

  const response = await fetch(url, {
    method: "POST",
    headers,
    body: data ? JSON.stringify(data) : undefined,
    ...config,
  });

  return handleResponse<T>(response);
}

// POST request with FormData (for file uploads)
export async function apiUploadFile<T>(
  endpoint: string,
  file: File,
  fieldName: string = "file",
  config?: ApiConfig
): Promise<T> {
  const url = buildURL(endpoint, config?.params);

  const formData = new FormData();
  formData.append(fieldName, file);

  const headers: Record<string, string> = {};
  if (config?.token) {
    headers["Authorization"] = `Bearer ${config.token}`;
  }
  // Note: Don't set Content-Type for FormData, browser will set it automatically with boundary

  const response = await fetch(url, {
    method: "POST",
    headers,
    body: formData,
  });

  return handleResponse<T>(response);
}

// PUT request
export async function apiPut<T>(
  endpoint: string,
  data?: unknown,
  config?: ApiConfig
): Promise<T> {
  const url = buildURL(endpoint, config?.params);

  const headers: Record<string, string> = {
    "Content-Type": "application/json",
    ...(config?.headers as Record<string, string>),
  };

  if (config?.token) {
    headers["Authorization"] = `Bearer ${config.token}`;
  }

  const response = await fetch(url, {
    method: "PUT",
    headers,
    body: data ? JSON.stringify(data) : undefined,
    ...config,
  });

  return handleResponse<T>(response);
}

// DELETE request
export async function apiDelete<T>(
  endpoint: string,
  config?: ApiConfig
): Promise<T> {
  const url = buildURL(endpoint, config?.params);

  const headers: Record<string, string> = {
    "Content-Type": "application/json",
    ...(config?.headers as Record<string, string>),
  };

  if (config?.token) {
    headers["Authorization"] = `Bearer ${config.token}`;
  }

  const response = await fetch(url, {
    method: "DELETE",
    headers,
    ...config,
  });

  return handleResponse<T>(response);
}

// PATCH request
export async function apiPatch<T>(
  endpoint: string,
  data?: unknown,
  config?: ApiConfig
): Promise<T> {
  const url = buildURL(endpoint, config?.params);

  const headers: HeadersInit | any = {
    "Content-Type": "application/json",
    ...config?.headers,
  };

  if (config?.token) {
    headers["Authorization"] = `Bearer ${config.token}`;
  }

  const response = await fetch(url, {
    method: "PATCH",
    headers,
    body: data ? JSON.stringify(data) : undefined,
    ...config,
  });

  return handleResponse<T>(response);
}

// Helper: GET với phân trang
export async function apiGetPaginated<T>(
  endpoint: string,
  pageNumber: number = 1,
  pageSize: number = 10,
  config?: ApiConfig
): Promise<ResponseData<T>> {
  return apiGet<ResponseData<T>>(endpoint, {
    ...config,
    params: {
      PageNumber: pageNumber,
      PageSize: pageSize,
      ...config?.params,
    },
  });
}

// Helper: GET by ID
export async function apiGetById<T>(
  endpoint: string,
  id: number,
  config?: ApiConfig
): Promise<T> {
  return apiGet<T>(`${endpoint}/${id}`, config);
}
