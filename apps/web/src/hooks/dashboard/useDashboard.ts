import { useQuery } from "@tanstack/react-query";

import { dashboardKeys } from "@/services/dashboard/keys";
import { dashboardService } from "@/services/dashboard/service";

export const useDashboard = () => {
  return useQuery({
    queryKey: dashboardKeys.overview(),

    queryFn: () => dashboardService.getDashboard(),
  });
};
