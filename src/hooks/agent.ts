import { useMutation } from '@tanstack/react-query';
import { primaryAgentApi, createAgentApi } from '@/lib/api/agent';
import { toast } from 'sonner';

export const usePrimaryAgent = () => {
  return useMutation({
    mutationFn: primaryAgentApi,
    
  });
};

export const useCreateAgent = () => {
  return useMutation({
    mutationFn: createAgentApi,
    onSuccess:()=>{
      toast("Agent created Successfully")
    }
  });
};
