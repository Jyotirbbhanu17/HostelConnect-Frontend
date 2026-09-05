import { apiRequest, clearAuthToken, setAuthToken } from "./api";

const AUTH_USER_KEY = "hostelConnectUser";

export async function loginUser({ email, password }) {
  return apiRequest("/auth/login", {
    method: "POST",
    skipAuth: true,
    body: JSON.stringify({ email, password }),
  });
}

export function saveAuthSession(user) {
  setAuthToken(user.token);
  localStorage.setItem(
    AUTH_USER_KEY,
    JSON.stringify({
      fullName: user.fullName,
      email: user.email,
      role: user.role,
    })
  );

  return user;
}

export function clearAuthSession() {
  clearAuthToken();

}

export function getAuthUser() {
  const storedUser = localStorage.getItem(AUTH_USER_KEY);

  if (!storedUser) {
    return null;
  }

  try {
    return JSON.parse(storedUser);
  } catch {
    clearAuthSession();
    return null;
  }
}
