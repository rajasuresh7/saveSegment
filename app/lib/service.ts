import apiClient from "./api-cliend";
import type { SegmentPayload } from "./type";

export const saveSegment = async (payload: SegmentPayload) => {
  const { data } = await apiClient.post("", payload);
  return data;
};
