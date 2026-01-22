import api from "@/lib/api";
import type { ProvinceDto, WardDto } from "@/types/address";

export const addressService = {
  async getProvinces(): Promise<ProvinceDto[]> {
    const res = await api.get<ProvinceDto[]>("/address/provinces");
    return res.data;
  },

  async getWardsByProvinceCode(
    provinceCode: number | string
  ): Promise<WardDto[]> {
    if (!provinceCode) return [];
    const res = await api.get<WardDto[]>(
      `/address/provinces/${provinceCode}/wards`
    );
    return res.data;
  },
};
