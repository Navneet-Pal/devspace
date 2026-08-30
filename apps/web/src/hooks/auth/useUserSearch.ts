import { useQuery } from "@tanstack/react-query";

import authService from "@/services/auth/service";

export const useUserSearch = (query: string) => {
  const normalizedQuery = query.trim();

  return useQuery({
    queryKey: ["users", "search", normalizedQuery],

    queryFn: () => authService.searchUsers(normalizedQuery),

    enabled: normalizedQuery.length >= 2,

    staleTime: 30_000,

    gcTime: 5 * 60_000,

    retry: false,
  });
};
