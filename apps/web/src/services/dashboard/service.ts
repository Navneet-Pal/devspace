import { axiosInstance } from "@/lib/axios";

import type { GetDashboardResponse } from "./types";

class DashboardService {
  async getDashboard(): Promise<GetDashboardResponse> {
    const response = await axiosInstance.get("/v1/dashboard");

    return response.data;
  }
}

export const dashboardService = new DashboardService();
