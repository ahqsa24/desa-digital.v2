import api from "./api";

export const addInnovation = async (body: any): Promise<any> =>
  await api.post("/innovations", body);
export const getInnovation = async (): Promise<any> =>
  await api.get("/innovations");
export const getInnovationById = async (id: string | undefined) =>
  await api.get(`/innovations/${id}`);
