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
  // files: AttachmentFileType[];
};

const processToSendEmail = async (
  targetList: Array<TargetAddressDataType | null>,
  ccList: Array<string | null>,
  subject: string,
  content: string,
  files: File[] = [],
) => {
  const processedAttachmentFiles: AttachmentFileType[] = await Promise.all(
    files.map(async (file) => {
      const buffer = await file.arrayBuffer();
      return {
        name: file.name,
        content: buffer,
        type: file.type,
      };
    }),
  );
  console.log(processedAttachmentFiles);

  const data: EmailDataType = {
    target_list: targetList,
    cc_list: ccList,
    subject: subject,
    content: content,
    // files: processedAttachmentFiles,
  };

  const response = await apiClient.post(`/process_send_email`, data, {
    headers: {
      'Content-Type': 'application/json',
    },
  });

  return response.data;
};

export default processToSendEmail;
