const publicApiEndpoint =
  process.env.NEXT_PUBLIC_BE_ENDPOINT || "http://localhost:8081/api";

export function getApiEndpoint() {
  if (typeof window === "undefined") {
    return process.env.API_INTERNAL_URL || publicApiEndpoint;
  }

  return publicApiEndpoint;
}
