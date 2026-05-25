export async function apiClient(url, options = {}) {
  const token =
    typeof window !== "undefined" ? localStorage.getItem("token") : null;

  const headers = {
    ...(options.headers || {}),
    Authorization: token ? `Bearer ${token}` : "",
  };

  const res = await fetch(url, {
    ...options,
    headers,
  });

  return res;
}
