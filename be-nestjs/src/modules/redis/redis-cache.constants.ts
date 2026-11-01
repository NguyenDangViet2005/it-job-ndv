export const REDIS_CACHE_TTL = {
  LOCATION: {
    PROVINCES: 24 * 60 * 60,
    WARDS: 24 * 60 * 60,
  },
  SKILL: {
    LIST: 60 * 60,
    DETAIL: 60 * 60,
  },
  JOB: {
    LIST: 60,
    DETAIL: 2 * 60,
    TODAY: 60,
  },
  AUTH: {
    OAUTH_EXCHANGE_CODE: 60,
  },
} as const;

export const REDIS_KEYS = {
  location: {
    provinces: 'itjob:locations:provinces',
    wards: (provinceId: number) =>
      `itjob:locations:wards:province:${provinceId}`,
  },
  skill: {
    detail: (id: number) => `itjob:skills:detail:${id}`,
    list: (page: number, pageSize: number, keyword: string) =>
      `itjob:skills:list:${page}:${pageSize}:${encodeURIComponent(keyword)}`,
    all: 'itjob:skills:*',
  },
  job: {
    detail: (id: number) => `itjob:jobs:detail:${id}`,
    all: 'itjob:jobs:*',
  },
  auth: {
    oauthCode: (code: string) => `itjob:auth:oauth-code:${code}`,
  },
} as const;
