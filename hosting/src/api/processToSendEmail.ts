import { off } from "process";
import apiClient from "./apiClient";
import { TargetAddressDataType } from "../components/emailForm/EmailForm";

type EmailDataType = {
  target_list: (TargetAddressDataType | null)[];
  cc_list: (string | null)[];
  subject: string;
  content: string;
}

const processToSendEmail = async (targetList:(TargetAddressDataType | null)[], ccList:(string | null)[], subject:string, content:string) => {
  const data:EmailDataType = {
    "target_list": targetList,
    "cc_list": ccList,
    "subject": subject,
    "content": content,
  }
  const response = await apiClient.post(
    `/process_send_email`,
    data,
    {
      headers: {
        'Content-Type': 'application/json'
      }
    }
  );
  return response.data
}

export default processToSendEmail;