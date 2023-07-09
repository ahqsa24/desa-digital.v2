import api from "./api";

export const addInnovator = async (body: any): Promise<any> =>
  await api.post("/innovator", body);
export const getInnovator = async (): Promise<any> =>
  await api.get("/innovator");
export const getInnovatorById = async (id: string | undefined) =>
  await api.get(`/innovator/${id}`);
