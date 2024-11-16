import apiClient from './apiClient';

const getGspreadDataByID = async (spreadSheetId: string | null) => {
  if (spreadSheetId === null) return null;
  const data = {
    spread_sheet_id: spreadSheetId,
  };
  const response = await apiClient.post(`/get_gspread_data_by_id`, data, {
    headers: {
      'Content-Type': 'application/json',
    },
  });

  return response.data;
};

export default getGspreadDataByID;
