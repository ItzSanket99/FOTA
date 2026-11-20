const BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000';

let authToken = null; // used once auth is built
export const setAuthToken = (token) => {
  authToken = token;
};

export async function request(path, { method = 'GET', body, isForm = false } = {}) {
  const headers = {};
  if (authToken) headers.Authorization = `Bearer ${authToken}`;
  if (body && !isForm) headers['Content-Type'] = 'application/json'; // FormData sets its own

  let res;
  try {
    res = await fetch(`${BASE_URL}${path}`, {
      method,
      headers,
      body: body ? (isForm ? body : JSON.stringify(body)) : undefined,
    });
  } catch {
    throw new Error('Cannot reach the server. Is the backend running?');
  }

  if (!res.ok) {
    let message = `Request failed (${res.status})`;
    try {
      const data = await res.json();
      if (typeof data.detail === 'string') message = data.detail;
    } catch {
      /* non-JSON error body */
    }
    throw new Error(message);
  }
  return res.status === 204 ? null : res.json();
}