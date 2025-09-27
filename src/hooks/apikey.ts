import ApiKeyService from "@/lib/api/apikey";
import { authClient } from "@/lib/auth-client";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";

export const useGetApiKeyList = () => {
  return useQuery({
    queryKey: ["apiKeys"],
    queryFn: async () => {
      const { data, error } = await authClient.apiKey.list();
      if (error) throw error;
      return data;
    },
  });
};

export const useDeleteApiKey = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (key_id: string) => {
      const { data, error } = await authClient.apiKey.delete({ keyId: key_id });
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["apiKeys"] });
    },
  });
};

export const useGetApiKey = (id: string) => {
  return useQuery({
    queryKey: ["apiKey", id],
    queryFn: async () => {
      const { data, error } = await authClient.apiKey.get({ query: { id } });
      if (error) throw error;
      return data;
    },
    enabled: !!id, // prevents running when id is undefined
  });
};

export const useCreateApiKey = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (name: string) => {
      const data = await ApiKeyService.createApiKey({ name });
    //   if (error) throw error;
      return data;
    },
    onSuccess: (data) => {
      console.log("API Key created successfully:", data);
      queryClient.invalidateQueries({ queryKey: ["apiKeys"] });
    },
    onError: (error) => {
      console.error("Error creating API Key:", error);
    },
  });
};
