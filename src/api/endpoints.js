export const API_BASE = "/api";

export const endpoints = {
  profile: (customerId) => `${API_BASE}/customers/${customerId}/profile`,
  summary: (customerId, period) =>
    `${API_BASE}/customers/${customerId}/spending/summary?period=${period}`,
  categories: (customerId, params = {}) => {
    const qs = new URLSearchParams(params).toString();
    return `${API_BASE}/customers/${customerId}/spending/categories${qs ? `?${qs}` : ""}`;
  },
  trends: (customerId, months = 12) =>
    `${API_BASE}/customers/${customerId}/spending/trends?months=${months}`,
  transactions: (customerId, params = {}) => {
    const qs = new URLSearchParams(params).toString();
    return `${API_BASE}/customers/${customerId}/transactions${qs ? `?${qs}` : ""}`;
  },
  goals: (customerId) => `${API_BASE}/customers/${customerId}/goals`,
  filters: (customerId) => `${API_BASE}/customers/${customerId}/filters`,
};
