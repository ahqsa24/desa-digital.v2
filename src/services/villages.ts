import api from './api'

export const addVillage = async (body: any): Promise<any> => await api.post('/villages', body)
 