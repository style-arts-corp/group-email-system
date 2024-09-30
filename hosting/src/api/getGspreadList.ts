import apiClient from './apiClient';

const getGspreadList = async () => {
  const response = await apiClient.get('/get_gspread_list');

  return response.data;
};

export default getGspreadList;
