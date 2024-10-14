import axios from 'axios';
import dotenv from 'dotenv';

// Cargar el archivo .env
dotenv.config();

export class AITestGenerator {
  private apiProvider: string = process.env.AI_PROVIDER || 'AI21';
  private apiUrl: string;
  private apiKey: string;

  constructor() {
    this.setApiConfig();
  }

  // Establece la configuración según el proveedor
  private setApiConfig() {
    switch (this.apiProvider) {
      case 'AI21':
        this.apiUrl = process.env.AI21_API_URL!;
        this.apiKey = process.env.AI21_API_KEY!;
        break;

      case 'COPILOT':
        this.apiUrl = process.env.COPILOT_API_URL!;
        this.apiKey = process.env.COPILOT_API_KEY!;
        break;

      case 'OPENAI':
        this.apiUrl = process.env.OPENAI_API_URL!;
        this.apiKey = process.env.OPENAI_API_KEY!;
        break;

      default:
        throw new Error(`Unsupported AI provider: ${this.apiProvider}`);
    }
  }

  // Método para generar tanto el Gherkin como el código automatizado
  async generateTest(prompt: string): Promise<{ gherkin: string; automatedTest: string }> {
    const gherkin = await this.generateGherkin(prompt);
    const automatedTest = await this.generateAutomatedTest(gherkin);
    return { gherkin, automatedTest };
  }

  // Método para generar el Gherkin
  private async generateGherkin(prompt: string): Promise<string> {
    return this.sendApiRequest(
      `Generate a complete and valid Gherkin test scenario in the Given-When-Then format for: "${prompt}".`
    );
  }

  // Método para generar el test automatizado
  private async generateAutomatedTest(gherkinTest: string): Promise<string> {
    return this.sendApiRequest(
      `Generate a full Playwright and TypeScript test script for this Gherkin scenario: "${gherkinTest}".`
    );
  }

  // Método genérico para enviar la solicitud a la API adecuada
  private async sendApiRequest(content: string): Promise<string> {
    const requestData = {
      model: "jamba-instruct", // Ajusta según el proveedor
      messages: [{ role: "user", content }],
      max_tokens: 2048,
    };

    try {
      const response = await axios.post(this.apiUrl, requestData, {
        headers: {
          Authorization: `Bearer ${this.apiKey}`,
          "Content-Type": "application/json",
        },
      });

      if (response.data?.choices?.length > 0) {
        return response.data.choices[0].message.content.trim();
      } else {
        throw new Error("API response is invalid or empty.");
      }
    } catch (error) {
      console.error("Error with API request:", error);
      throw new Error("Failed to generate test content.");
    }
  }
}
