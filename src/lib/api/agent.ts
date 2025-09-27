import { apiClient } from '.';

export const primaryAgentApi = async ({
  requirement_json,
  message,
  apiKey,
}: {
  requirement_json: any;
  message: string;
  apiKey: string;
}) => {
  const response = await apiClient.post(
    '/dagent/',
    { requirement_json, message },
    {
      headers: {
        'x-api-key': apiKey,
      },
    }
  );
  return response.data;
};

export const createAgentApi = async ({
  name,
  description,
  agentCost,
  deployedUrl,
  llmProvider,
  skills,
  is_multiAgentSystem,
  default_agent_name,
  framework_used,
  can_stream,
}: {
  name: string;
  description: string;
  agentCost: number;
  deployedUrl: string;
  llmProvider: string;
  skills: string[];
  is_multiAgentSystem: boolean;
  default_agent_name: string;
  framework_used: string;
  can_stream: boolean;
}) => {
  const response = await apiClient.post('/dagent/create', {
    name,
    description,
    agentCost,
    deployedUrl,
    llmProvider,
    skills,
    is_multiAgentSystem,
    default_agent_name,
    framework_used,
    can_stream,
  });

  return response.data;
};
