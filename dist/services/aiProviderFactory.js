"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getAIProvider = getAIProvider;
// src/services/aiProviderFactory.ts
const OpenAIProvider_1 = require("./aiProviders/OpenAIProvider");
const AI21Provider_1 = require("./aiProviders/AI21Provider");
function getAIProvider(config) {
    const { provider, openAI, ai21 } = config;
    switch (provider) {
        case 'OpenAI':
            return new OpenAIProvider_1.OpenAIProvider(openAI.apiKey, openAI.model);
        case 'AI21':
            return new AI21Provider_1.AI21Provider(ai21.apiKey, ai21.model);
        default:
            throw new Error(`Unsupported provider: ${provider}`);
    }
}
