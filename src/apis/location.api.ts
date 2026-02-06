import { Province, Ward } from "@/types";
import { apiGet } from "./api";
import type {
  ApiResponse,
} from "@/types/api.type";

const ENDPOINT = "/locations";

export const locationApi = {
  // Lấy danh sách tất cả tỉnh/thành phố
  getProvinces: () => {
    return apiGet<ApiResponse<Province[]>>(`${ENDPOINT}/provinces`);
  },

  // Lấy danh sách quận/huyện theo tỉnh/thành phố
  getWards: (provinceid: number) => {
    return apiGet<ApiResponse<Ward[]>>(`${ENDPOINT}/wards`, {
      params: { provinceid },
    });
  },
};
