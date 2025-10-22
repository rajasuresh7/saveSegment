import { useMutation } from "@tanstack/react-query";
import type { SegmentPayload } from "./type";
import { saveSegment } from "./service";

export const useSaveSegment = () => {
  return useMutation({
    mutationFn: (payload: SegmentPayload) => saveSegment(payload),
  });
};
