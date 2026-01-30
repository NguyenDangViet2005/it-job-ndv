import type { ApiResponse, ResponseData } from "@/types/api.type";
import { buildURL, handleResponse } from "@/utils/api.utils";

const BE_ENDPOINT =
  process.env.NEXT_PUBLIC_BE_ENDPOINT || "http://localhost:8081/api";

interface ApiConfig extends RequestInit {
  params?: Record<string, string | number | boolean>;
  token?: string;
}

// GET request
export async function apiGet<T>(
  endpoint: string,
  config?: ApiConfig,
): Promise<T> {
  const url = buildURL(BE_ENDPOINT, endpoint, config?.params);

  const headers: HeadersInit = {
    "Content-Type": "application/json",
    ...config?.headers,
  };

  if (config?.token) {
    (headers as Record<string, string>)["Authorization"] =
      `Bearer ${config.token}`;
  }

  try {
    const response = await fetch(url, {
      method: "GET",
      headers,
      ...config,
    });

    return await handleResponse<T>(response);
  } catch (error) {
    console.error("❌ API GET Error:", error);
    throw new Error(
      `Failed to fetch: ${
        error instanceof Error ? error.message : "Network error"
      }`,
    );
  }
}

// POST request
export async function apiPost<T>(
  endpoint: string,
  data?: unknown,
  config?: ApiConfig,
): Promise<T> {
  const url = buildURL(BE_ENDPOINT, endpoint, config?.params);

  const headers: HeadersInit = {
    "Content-Type": "application/json",
    ...config?.headers,
  };

  if (config?.token) {
    (headers as Record<string, string>)["Authorization"] =
      `Bearer ${config.token}`;
  }

  const response = await fetch(url, {
    method: "POST",
    headers,
    body: data ? JSON.stringify(data) : undefined,
    ...config,
  });

  return handleResponse<T>(response);
}

// PUT request
export async function apiPut<T>(
  endpoint: string,
  data?: unknown,
  config?: ApiConfig,
): Promise<T> {
  const url = buildURL(BE_ENDPOINT, endpoint, config?.params);

  const headers: HeadersInit = {
    "Content-Type": "application/json",
    ...config?.headers,
  };

  if (config?.token) {
    (headers as Record<string, string>)["Authorization"] =
      `Bearer ${config.token}`;
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
  config?: ApiConfig,
): Promise<T> {
  const url = buildURL(BE_ENDPOINT, endpoint, config?.params);

  const headers: HeadersInit = {
    "Content-Type": "application/json",
    ...config?.headers,
  };

  if (config?.token) {
    (headers as Record<string, string>)["Authorization"] =
      `Bearer ${config.token}`;
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
  config?: ApiConfig,
): Promise<T> {
  const url = buildURL(BE_ENDPOINT, endpoint, config?.params);

  const headers: HeadersInit = {
    "Content-Type": "application/json",
    ...config?.headers,
  };

  if (config?.token) {
    (headers as Record<string, string>)["Authorization"] =
      `Bearer ${config.token}`;
  }

  const response = await fetch(url, {
    method: "PATCH",
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
  config?: ApiConfig,
): Promise<T> {
  const url = buildURL(BE_ENDPOINT, endpoint, config?.params);

  const formData = new FormData();
  formData.append(fieldName, file);

  const headers: Record<string, string> = {};
  if (config?.token) {
    headers["Authorization"] = `Bearer ${config.token}`;
  }

  const response = await fetch(url, {
    method: "POST",
    headers,
    body: formData,
  });

  return handleResponse<T>(response);
}

// Helper: GET với phân trang
export async function apiGetPaginated<T>(
  endpoint: string,
  pageNumber: number = 1,
  pageSize: number = 10,
  config?: ApiConfig,
): Promise<ResponseData<T>> {
  return apiGet<ResponseData<T>>(endpoint, {
    ...config,
    params: {
      pageNumber: pageNumber,
      pageSize: pageSize,
      ...config?.params,
    },
  });
}

// Helper: GET by ID
export async function apiGetById<T>(
  endpoint: string,
  id: number,
  config?: ApiConfig,
): Promise<T> {
  return apiGet<T>(`${endpoint}/${id}`, config);
}
