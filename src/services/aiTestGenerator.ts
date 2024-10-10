import axios from 'axios';
import dotenv from 'dotenv';
import fs from 'fs';
import path from 'path';

// Cargar el archivo .env
dotenv.config();

export class AITestGenerator {
  private apiUrl: string = 'https://api.ai21.com/studio/v1/chat/completions';

  // Método para generar tanto el Gherkin como el código automatizado
  async generateTest(prompt: string): Promise<{ gherkin: string, automatedTest: string }> {
    const gherkin = await this.generateGherkin(prompt);
    const automatedTest = await this.generateAutomatedTest(gherkin);

    return { gherkin, automatedTest };
  }

  // Método para generar el test Gherkin a partir del prompt
  private async generateGherkin(prompt: string): Promise<string> {
    const requestData = {
      model: "jamba-instruct",
      messages: [
        {
          role: "user",
          content: `Generate a complete and valid Gherkin test scenario in the Given-When-Then format for the following functionality: "${prompt}". Ensure all necessary steps, preconditions, and outcomes are covered clearly.`
        }
      ],
      max_tokens: 2048
    };

    try {
      const response = await axios.post(this.apiUrl, requestData, {
        headers: {
          'Authorization': `Bearer ${process.env.AI21_API_KEY}`,
          'Content-Type': 'application/json'
        }
      });

      if (response.data && response.data.choices && response.data.choices.length > 0) {
        const gherkinTest = response.data.choices[0].message.content.trim();
        if (!gherkinTest || gherkinTest.length === 0) {
          throw new Error("API returned an empty Gherkin test. Check the prompt and API response.");
        }

        console.log("Generated Gherkin Test:", gherkinTest);
        return gherkinTest;
      } else {
        console.error("Invalid API response structure:", response.data);
        throw new Error("No valid Gherkin test generated. API response structure is invalid.");
      }
    } catch (error) {
      console.error("Error generating Gherkin test:", error);
      throw new Error("Failed to generate Gherkin test. " + error.message);
    }
  }

  // Método para generar el código automatizado a partir del Gherkin
  private async generateAutomatedTest(gherkinTest: string): Promise<string> {
    const requestData = {
      model: "jamba-instruct",
      messages: [
        {
          role: "user",
          content: `Generate a full Playwright and TypeScript test script based on the following Gherkin scenario:
            "${gherkinTest}"
            Include all necessary selectors, page interactions, and validation logic. Ensure it runs autonomously without relying on external classes or files.`
        }
      ],
      max_tokens: 3000
    };

    try {
      const response = await axios.post(this.apiUrl, requestData, {
        headers: {
          'Authorization': `Bearer ${process.env.AI21_API_KEY}`,
          'Content-Type': 'application/json'
        }
      });

      if (response.data && response.data.choices && response.data.choices.length > 0) {
        const automatedTest = response.data.choices[0].message.content.trim();

        if (!automatedTest || automatedTest.length === 0) {
          throw new Error("API returned an empty automated test. Check the prompt and API response.");
        }

        console.log("Generated Automated Test:", automatedTest);
        return automatedTest;
      } else {
        console.error("Invalid API response structure:", response.data);
        throw new Error("No valid automated test generated. API response structure is invalid.");
      }
    } catch (error) {
      console.error("Error generating automated test:", error);
      throw new Error("Failed to generate automated test. " + error.message);
    }
  }
}
