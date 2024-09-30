import type { TargetAddressDataType } from '../components/main/Main';
import apiClient from './apiClient';

type EmailDataType = {
  target_list: Array<TargetAddressDataType | null>;
  cc_list: Array<string | null>;
  subject: string;
  content: string;
};

const processToSendEmail = async (
  targetList: Array<TargetAddressDataType | null>,
  ccList: Array<string | null>,
  subject: string,
  content: string,
) => {
  const data: EmailDataType = {
    target_list: targetList,
    cc_list: ccList,
    subject,
    content,
  };
  const response = await apiClient.post(`/process_send_email`, data, {
    headers: {
      'Content-Type': 'application/json',
    },
  });

  return response.data;
};

export default processToSendEmail;
