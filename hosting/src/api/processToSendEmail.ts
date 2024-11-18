import type { TargetAddressDataType } from '@/components/emailForm/EmailForm';
import apiClient from './apiClient';

type AttachmentFileType = {
  name: string;
  content: string | ArrayBuffer;
  type: string;
};

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
  file?: File | null,
) => {
  const data: EmailDataType = {
    target_list: targetList,
    cc_list: ccList,
    subject: subject,
    content: content,
  };

  const formData = new FormData();
  formData.append('emailData', JSON.stringify(data));
  if (file) formData.append('attachmentFile', file, file.name);

  // FormDataの内容を確認
  console.log('FormData contents:');
  for (const pair of formData.entries()) {
    console.log(pair[0], pair[1]);
  }

  const response = await apiClient.post(`/process_send_email`, formData);

  return response.data;
};

export default processToSendEmail;
