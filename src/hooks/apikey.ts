import ApiKeyService from "@/lib/api/apikey";
import { authClient } from "@/lib/auth-client";


export const useGetApiKeyList = async ()  => { 
    const {data, error} = await authClient.apiKey.list();
    return {data, error};
}

export const useDeleteApiKey = async (key_id: string) => {
    const {data, error} = await authClient.apiKey.delete({keyId: key_id});
    return {data, error};
}

export const useGetApiKey = async (id: string) => {
    const { data, error } = await authClient.apiKey.get({ query: { id: id } });

    return {data, error}
}

export const useCreateApiKey = async (name: string) => {
    const data = await ApiKeyService.createApiKey({name});
    return data;
}