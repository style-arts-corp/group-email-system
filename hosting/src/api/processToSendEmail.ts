import { off } from "process";
import apiClient from "./apiClient";
import { TargetAddressDataType } from "../components/main/Main";

const processToSendEmail = async (target_list:(TargetAddressDataType | null)[], subject:string, content:string) => {
  const data = {
    "target_list": target_list,
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