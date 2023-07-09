import api from "./api";

export const addVillage = async (body: any): Promise<any> =>
  await api.post("/villages", body);
  export const getVillages = async (): Promise<any> =>
  await api.get("/villages");
  export const getVillagesById = async (id: string | undefined) =>
  await api.get(`/villages/${id}`);