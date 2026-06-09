import { requestJson } from './http';
import type { Career } from '../types/career.types';
import { getCachedOrFetch } from './cache';

const CAREERS_ALL_CACHE_KEY = 'careers:all';

function normalizeCareer(rawCareer: any): Career {
  return {
    id: rawCareer.id,
    name: rawCareer.name,
    code: rawCareer.code || undefined,
  };
}

export async function getCareers(): Promise<Career[]> {
  return getCachedOrFetch(CAREERS_ALL_CACHE_KEY, async () => {
    const data = await requestJson<any>('/careers');
    const list = Array.isArray(data) ? data : data.data || [];
    return list.map(normalizeCareer);
  });
}
