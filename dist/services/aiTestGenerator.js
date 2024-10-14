"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AITestGenerator = void 0;
const axios_1 = __importDefault(require("axios"));
const dotenv_1 = __importDefault(require("dotenv"));
// Cargar el archivo .env
dotenv_1.default.config();
class AITestGenerator {
    apiProvider = process.env.AI_PROVIDER || 'AI21';
    apiUrl;
    apiKey;
    constructor() {
        this.setApiConfig();
    }
    // Establece la configuración según el proveedor
    setApiConfig() {
        switch (this.apiProvider) {
            case 'AI21':
                this.apiUrl = process.env.AI21_API_URL;
                this.apiKey = process.env.AI21_API_KEY;
                break;
            case 'COPILOT':
                this.apiUrl = process.env.COPILOT_API_URL;
                this.apiKey = process.env.COPILOT_API_KEY;
                break;
            case 'OPENAI':
                this.apiUrl = process.env.OPENAI_API_URL;
                this.apiKey = process.env.OPENAI_API_KEY;
                break;
            default:
                throw new Error(`Unsupported AI provider: ${this.apiProvider}`);
        }
    }
    // Método para generar tanto el Gherkin como el código automatizado
    async generateTest(prompt) {
        const gherkin = await this.generateGherkin(prompt);
        const automatedTest = await this.generateAutomatedTest(gherkin);
        return { gherkin, automatedTest };
    }
    // Método para generar el Gherkin
    async generateGherkin(prompt) {
        return this.sendApiRequest(`Generate a complete and valid Gherkin test scenario in the Given-When-Then format for: "${prompt}".`);
    }
    // Método para generar el test automatizado
    async generateAutomatedTest(gherkinTest) {
        return this.sendApiRequest(`Generate a full Playwright and TypeScript test script for this Gherkin scenario: "${gherkinTest}".`);
    }
    // Método genérico para enviar la solicitud a la API adecuada
    async sendApiRequest(content) {
        const requestData = {
            model: "jamba-instruct", // Ajusta según el proveedor
            messages: [{ role: "user", content }],
            max_tokens: 2048,
        };
        try {
            const response = await axios_1.default.post(this.apiUrl, requestData, {
                headers: {
                    Authorization: `Bearer ${this.apiKey}`,
                    "Content-Type": "application/json",
                },
            });
            if (response.data?.choices?.length > 0) {
                return response.data.choices[0].message.content.trim();
            }
            else {
                throw new Error("API response is invalid or empty.");
            }
        }
        catch (error) {
            console.error("Error with API request:", error);
            throw new Error("Failed to generate test content.");
        }
    }
}
exports.AITestGenerator = AITestGenerator;
