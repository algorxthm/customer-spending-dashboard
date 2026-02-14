import { useQuery } from "@tanstack/react-query";
import { apiGet } from "./client";
import { endpoints } from "./endpoints";

// 1) Customer Profile :contentReference[oaicite:2]{index=2}
export function useCustomerProfile(customerId) {
  return useQuery({
    queryKey: ["profile", customerId],
    queryFn: () => apiGet(endpoints.profile(customerId)),
    enabled: !!customerId,
  });
}

// 2) Spending Summary :contentReference[oaicite:3]{index=3}
export function useSpendingSummary(customerId, period) {
  return useQuery({
    queryKey: ["summary", customerId, period],
    queryFn: () => apiGet(endpoints.summary(customerId, period)),
    enabled: !!customerId && !!period,
  });
}

// 3) Spending by Category (period + optional start/end) :contentReference[oaicite:4]{index=4}
export function useSpendingCategories(customerId, { period, startDate, endDate }) {
  const params = { period };
  if (startDate) params.startDate = startDate;
  if (endDate) params.endDate = endDate;

  return useQuery({
    queryKey: ["categories", customerId, params],
    queryFn: () => apiGet(endpoints.categories(customerId, params)),
    enabled: !!customerId && !!period,
  });
}

// 4) Trends :contentReference[oaicite:5]{index=5}
export function useSpendingTrends(customerId, months) {
  return useQuery({
    queryKey: ["trends", customerId, months],
    queryFn: () => apiGet(endpoints.trends(customerId, months)),
    enabled: !!customerId && !!months,
  });
}

// 6) Goals :contentReference[oaicite:6]{index=6}
export function useGoals(customerId) {
  return useQuery({
    queryKey: ["goals", customerId],
    queryFn: () => apiGet(endpoints.goals(customerId)),
    enabled: !!customerId,
  });
}
