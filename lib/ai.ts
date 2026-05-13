import { createOpenAI } from '@ai-sdk/openai';

// Initialize the NVIDIA AI client using the OpenAI compatible endpoint
export const nvidia = createOpenAI({
  compatibility: 'compatible', // Important for generic OpenAI compatible endpoints
  baseURL: 'https://integrate.api.nvidia.com/v1',
  apiKey: process.env.NVIDIA_API_KEY,
});

// We use meta/llama-3.1-70b-instruct as the default highly-capable model
export const defaultModel = nvidia.chat('meta/llama-3.1-70b-instruct');
