import { requestJson } from './http';
import type { Career } from '../types/career.types';

function normalizeCareer(rawCareer: any): Career {
  return {
    id: rawCareer.id,
    name: rawCareer.name,
    code: rawCareer.code || undefined,
  };
}

export async function getCareers(): Promise<Career[]> {
  const data = await requestJson<any>('/careers');
  const list = Array.isArray(data) ? data : data.data || [];
  return list.map(normalizeCareer);
}
