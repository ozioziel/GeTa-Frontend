import { requestJson } from './http';
import type { DashboardOverview } from '../types/dashboard.types';

export async function getDashboardOverview(): Promise<DashboardOverview> {
  return requestJson<DashboardOverview>('/dashboard/overview');
}
