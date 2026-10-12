import type { ApiResponse, ResponseData } from "@/types/api.type";
import { buildURL, handleResponse } from "@/utils/api.utils";

const BE_ENDPOINT =
  process.env.NEXT_PUBLIC_BE_ENDPOINT || "http://localhost:8081/api";

interface ApiConfig extends RequestInit {
  params?: Record<string, string | number | boolean | undefined | null>;
  token?: string;
}

function createHeaders(
  customHeaders?: HeadersInit,
  token?: string,
  contentType: string | null = "application/json"
): Record<string, string> {
  const headers: Record<string, string> = {};

  if (contentType) {
    headers["Content-Type"] = contentType;
  }

  if (customHeaders) {
    if (customHeaders instanceof Headers) {
      customHeaders.forEach((value, key) => {
        headers[key] = value;
      });
    } else if (Array.isArray(customHeaders)) {
      customHeaders.forEach(([key, value]) => {
        headers[key] = value;
      });
    } else {
      Object.assign(headers, customHeaders);
    }
  }

  if (token) {
    headers["Authorization"] = `Bearer ${token}`;
  }

  return headers;
}

// GET request
export async function apiGet<T>(
  endpoint: string,
  config?: ApiConfig,
): Promise<T> {
  const { params, token, headers: customHeaders, ...restConfig } = config || {};
  const url = buildURL(BE_ENDPOINT, endpoint, params);
  const headers = createHeaders(customHeaders, token);

  try {
    const response = await fetch(url, {
      ...restConfig,
      method: "GET",
      headers,
    });

    return await handleResponse<T>(response);
  } catch (error) {
    console.error("❌ API GET Error:", error);
    throw error;
  }
}

// POST request
export async function apiPost<T>(
  endpoint: string,
  data?: unknown,
  config?: ApiConfig,
): Promise<T> {
  const { params, token, headers: customHeaders, ...restConfig } = config || {};
  const url = buildURL(BE_ENDPOINT, endpoint, params);
  const headers = createHeaders(customHeaders, token);

  const response = await fetch(url, {
    ...restConfig,
    method: "POST",
    headers,
    body: data !== undefined ? JSON.stringify(data) : undefined,
  });

  return handleResponse<T>(response);
}

// PUT request
export async function apiPut<T>(
  endpoint: string,
  data?: unknown,
  config?: ApiConfig,
): Promise<T> {
  const { params, token, headers: customHeaders, ...restConfig } = config || {};
  const url = buildURL(BE_ENDPOINT, endpoint, params);
  const headers = createHeaders(customHeaders, token);

  const response = await fetch(url, {
    ...restConfig,
    method: "PUT",
    headers,
    body: data !== undefined ? JSON.stringify(data) : undefined,
  });

  return handleResponse<T>(response);
}

// DELETE request
export async function apiDelete<T>(
  endpoint: string,
  config?: ApiConfig,
): Promise<T> {
  const { params, token, headers: customHeaders, ...restConfig } = config || {};
  const url = buildURL(BE_ENDPOINT, endpoint, params);
  const headers = createHeaders(customHeaders, token);

  const response = await fetch(url, {
    ...restConfig,
    method: "DELETE",
    headers,
  });

  return handleResponse<T>(response);
}

// PATCH request
export async function apiPatch<T>(
  endpoint: string,
  data?: unknown,
  config?: ApiConfig,
): Promise<T> {
  const { params, token, headers: customHeaders, ...restConfig } = config || {};
  const url = buildURL(BE_ENDPOINT, endpoint, params);
  const headers = createHeaders(customHeaders, token);

  const response = await fetch(url, {
    ...restConfig,
    method: "PATCH",
    headers,
    body: data !== undefined ? JSON.stringify(data) : undefined,
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
  const { params, token, headers: customHeaders, ...restConfig } = config || {};
  const url = buildURL(BE_ENDPOINT, endpoint, params);
  const headers = createHeaders(customHeaders, token, null);

  const formData = new FormData();
  formData.append(fieldName, file);

  const response = await fetch(url, {
    ...restConfig,
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
  const res = await apiGet<any>(endpoint, {
    ...config,
    params: {
      pageNumber: pageNumber,
      pageSize: pageSize,
      ...config?.params,
    },
  });

  const rawData = res?.data !== undefined ? res.data : res;

  const dataList: T[] = Array.isArray(rawData)
    ? rawData
    : Array.isArray(rawData?.data)
    ? rawData.data
    : Array.isArray(rawData?.items)
    ? rawData.items
    : [];

  const totalItems =
    res?.pagination?.totalItems ??
    res?.totalItems ??
    rawData?.totalItems ??
    rawData?.total ??
    dataList.length;

  const totalPages =
    res?.pagination?.totalPages ??
    res?.totalPages ??
    rawData?.totalPages ??
    (totalItems > 0 && pageSize > 0 ? Math.ceil(totalItems / pageSize) : 1);

  const page =
    res?.pagination?.page ??
    res?.page ??
    res?.pageNumber ??
    rawData?.page ??
    pageNumber;

  return {
    data: dataList,
    totalItems,
    totalPages: Math.max(totalPages, 1),
    page,
    pageSize: res?.pagination?.pageSize ?? res?.pageSize ?? pageSize,
  };
}

// Helper: GET by ID
export async function apiGetById<T>(
  endpoint: string,
  id: number,
  config?: ApiConfig,
): Promise<T> {
  const res = await apiGet<any>(`${endpoint}/${id}`, config);
  return (res && typeof res === "object" && "data" in res && res.data !== undefined
    ? res.data
    : res) as T;
}
