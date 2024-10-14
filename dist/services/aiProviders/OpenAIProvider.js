"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.OpenAIProvider = void 0;
const axios_1 = __importDefault(require("axios"));
class OpenAIProvider {
    apiKey;
    model;
    constructor(apiKey, model) {
        this.apiKey = apiKey;
        this.model = model;
    }
    async generateTest(prompt) {
        const response = await axios_1.default.post('https://api.openai.com/v1/completions', {
            model: this.model,
            prompt: prompt,
            max_tokens: 3000,
        }, {
            headers: { Authorization: `Bearer ${this.apiKey}` },
        });
        return response.data.choices[0].text.trim();
    }
}
exports.OpenAIProvider = OpenAIProvider;
