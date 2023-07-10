import apiLocation from "./apiLocation";

export const getProvinsi = async () => await apiLocation("/provinsi");
export const getKabupaten = async (idProvinsi: string) =>
  await apiLocation("/kota", { params: { id_provinsi: idProvinsi } });
export const getKecamatan = async (idKota: string) =>
  await apiLocation("/kecamatan", { params: { id_kota: idKota } });
export const getKelurahan = async (idKecamatan: string) =>
  await apiLocation("/kelurahan", { params: { id_kecamatan: idKecamatan } });
