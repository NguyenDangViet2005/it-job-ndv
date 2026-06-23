import { apiGet } from "./api";

const ENDPOINT = "/search";

interface SearchCompany {
  id: number;
  name: string;
  avatar: string;
  description: string;
  address: string;
  jobCount: number;
}

interface SearchJob {
  id: number;
  title: string;
  description: string;
  type: string;
  status: string;
  quantity: number;
  deadline: string;
  createdat: string;
  company: {
    id: number;
    name: string;
    avatar: string;
    website?: string;
    address: string;
    city?: string;
  };
  skills: Array<{
    id: number;
    name: string;
  }>;
}

interface SearchData {
  searchType: "job" | "skill" | "company" | "none";
  jobs: SearchJob[];
  companies: SearchCompany[];
  totalResults: number;
  pageNumber: number;
  pageSize: number;
  message: string;
}

interface SearchResponse {
  success: boolean;
  message: string;
  data: SearchData;
}

export const searchApi = {
  search: (keyword: string, pageNumber: number = 1, pageSize: number = 10) => {
    const trimmedKeyword = keyword.trim();
    if (!trimmedKeyword) {
      return Promise.reject(new Error("Keyword is required"));
    }
    return apiGet<SearchResponse>(ENDPOINT, {
      params: {
        keyword: trimmedKeyword,
        pageNumber: pageNumber,
        pageSize: pageSize,
      },
    });
  },
};

export type { SearchResponse, SearchData, SearchJob, SearchCompany };
