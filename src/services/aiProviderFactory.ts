// src/services/aiProviderFactory.ts
import { OpenAIProvider } from './aiProviders/OpenAIProvider';
import { AI21Provider } from './aiProviders/AI21Provider';

interface IAProvider {
  generateTest(prompt: string): Promise<string>;
}

export function getAIProvider(config: any): IAProvider {
  const { provider, openAI, ai21 } = config;

  switch (provider) {
    case 'OpenAI':
      return new OpenAIProvider(openAI.apiKey, openAI.model);
    case 'AI21':
      return new AI21Provider(ai21.apiKey, ai21.model);
    default:
      throw new Error(`Unsupported provider: ${provider}`);
  }
}
