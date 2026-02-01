import { apiGet } from "./api";
import type {
  ApiResponse,
  ProvinceResponse,
  WardResponse,
} from "@/types/api.type";

const ENDPOINT = "/locations";

export const locationApi = {
  // Lấy danh sách tất cả tỉnh/thành phố
  getProvinces: () => {
    return apiGet<ApiResponse<ProvinceResponse[]>>(`${ENDPOINT}/provinces`);
  },

  // Lấy danh sách quận/huyện theo tỉnh/thành phố
  getWards: (provinceid: number) => {
    return apiGet<ApiResponse<WardResponse[]>>(`${ENDPOINT}/wards`, {
      params: { provinceid },
    });
  },
};
