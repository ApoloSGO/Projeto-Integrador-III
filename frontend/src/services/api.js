const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://127.0.0.1:8000/api";

async function request(path, options = {}) {
  const init = { ...options };

  if (init.body && typeof init.body !== "string") {
    init.headers = {
      "Content-Type": "application/json",
      ...(init.headers || {}),
    };
    init.body = JSON.stringify(init.body);
  }

  const response = await fetch(`${API_BASE_URL}${path}`, init);
  const contentType = response.headers.get("content-type") || "";
  const payload = contentType.includes("application/json")
    ? await response.json()
    : await response.text();

  if (!response.ok) {
    const detail =
      typeof payload === "string"
        ? payload
        : payload?.detail || Object.values(payload || {}).flat().join(" ");
    throw new Error(detail || "Nao foi possivel concluir a requisicao.");
  }

  return payload;
}

export function normalizeRepositoryUrl(url) {
  const trimmed = url.trim();

  if (!trimmed) {
    return "";
  }

  if (/^https?:\/\//i.test(trimmed)) {
    return trimmed;
  }

  return `https://${trimmed}`;
}

export const dataApi = {
  getProjects() {
    return request("/projects/");
  },

  createProject(payload) {
    return request("/projects/", {
      method: "POST",
      body: payload,
    });
  },

  createVersion(payload) {
    return request("/versions/", {
      method: "POST",
      body: payload,
    });
  },

  updateVersion(versionId, payload) {
    return request(`/versions/${versionId}/`, {
      method: "PATCH",
      body: payload,
    });
  },

  getFeedbacks(params = {}) {
    const searchParams = new URLSearchParams();

    Object.entries(params).forEach(([key, value]) => {
      if (value !== undefined && value !== null && value !== "") {
        searchParams.set(key, value);
      }
    });

    const query = searchParams.toString();
    return request(`/feedbacks/${query ? `?${query}` : ""}`);
  },

  createFeedback(payload) {
    return request("/feedbacks/", {
      method: "POST",
      body: payload,
    });
  },

  updateFeedback(feedbackId, payload) {
    return request(`/feedbacks/${feedbackId}/`, {
      method: "PATCH",
      body: payload,
    });
  },

  getDashboardStats() {
    return request("/dashboard/stats/");
  },
};
