import apiClient from './apiClient';

const getGspreadDataByID = async (spread_sheet_id: string) => {
  if (spread_sheet_id === null) return null;
  const data = {
    spread_sheet_id,
  };
  const response = await apiClient.post(`/get_gspread_data_by_id`, data, {
    headers: {
      'Content-Type': 'application/json',
    },
  });

  return response.data;
};

export default getGspreadDataByID;
