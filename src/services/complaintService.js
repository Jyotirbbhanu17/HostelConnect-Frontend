import { apiRequest } from "./api";

export async function getMyComplaints() {
  return apiRequest("/complaints/my");
}