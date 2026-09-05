const API_BASE_URL = "http://localhost:8081";
const AUTH_TOKEN_KEY = "hostelConnectToken";
const AUTH_USER_KEY = "hostelConnectUser";

export function getAuthToken() {
  return localStorage.getItem(AUTH_TOKEN_KEY);
}

export function setAuthToken(token) {
  localStorage.setItem(AUTH_TOKEN_KEY, token);
}

export function clearAuthToken() {
  localStorage.removeItem(AUTH_TOKEN_KEY);
  localStorage.removeItem(AUTH_USER_KEY);
}

export async function apiRequest(path, options = {}) {
  const token = getAuthToken();

  const {
    skipAuth = false,
    ...requestOptions
  } = options;

  const headers = {
    ...requestOptions.headers,
  };

  /*
   * Only add JSON Content-Type when we are actually
   * sending a JSON request.
   *
   * This is important for multipart/form-data requests.
   */
  if (!(requestOptions.body instanceof FormData)) {
    headers["Content-Type"] = "application/json";
  }

  /*
   * Do not attach an old JWT to public endpoints such as login.
   */
  if (token && !skipAuth) {
    headers.Authorization = `Bearer ${token}`;
  }

  const response = await fetch(`${API_BASE_URL}${path}`, {
    ...requestOptions,
    headers,
  });

  const contentType = response.headers.get("content-type") || "";

  const data = contentType.includes("application/json")
    ? await response.json()
    : null;

  /*
   * JWT expired / authentication failed.
   *
   * Remove the invalid session and send the user
   * back to login.
   *
   * skipAuth prevents the login request itself from
   * causing a redirect when the user simply entered
   * the wrong password.
   */
  if (response.status === 401 && !skipAuth) {
    clearAuthToken();

    if (window.location.pathname !== "/login") {
      window.location.assign("/login");
    }
  }

  if (!response.ok) {
    const error = new Error(data?.message || "Request failed.");
    error.status = response.status;
    error.data = data;
    throw error;
  }

  return data;
}