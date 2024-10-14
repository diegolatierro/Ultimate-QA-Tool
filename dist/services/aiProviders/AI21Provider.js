"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AI21Provider = void 0;
const axios_1 = __importDefault(require("axios"));
class AI21Provider {
    apiKey;
    model;
    constructor(apiKey, model) {
        this.apiKey = apiKey;
        this.model = model;
    }
    async generateTest(prompt) {
        const response = await axios_1.default.post(`https://api.ai21.com/studio/v1/${this.model}/complete`, {
            prompt: prompt,
            maxTokens: 3000,
        }, {
            headers: { Authorization: `Bearer ${this.apiKey}` },
        });
        return response.data.completions[0].data.text.trim();
    }
}
exports.AI21Provider = AI21Provider;
