import { useMutation } from '@tanstack/react-query';
import { primaryAgentApi, createAgentApi } from '@/lib/api/agent';

export const usePrimaryAgent = () => {
  return useMutation({
    mutationFn: primaryAgentApi,
  });
};

export const useCreateAgent = () => {
  return useMutation({
    mutationFn: createAgentApi,
  });
};
