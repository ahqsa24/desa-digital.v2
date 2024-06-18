import apiLocation from "./apiLocation";

interface Location {
  id: string;
  nama: string;
}

type ApiResponse<T> = T[];

export const getProvinces = async () =>
  await apiLocation("/api/provinces.json");

export const getRegencies = async (idProvince: string) =>
  await apiLocation(`/api/regencies/${idProvince}.json`);

export const getDistricts = async (idRegency: string) =>
  await apiLocation(`/api/districts/${idRegency}.json`);

export const getVillages = async (idDistrict: string) =>
  await apiLocation(`/api/villages/${idDistrict}.json`);
