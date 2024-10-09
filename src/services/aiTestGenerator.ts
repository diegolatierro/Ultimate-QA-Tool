import axios from 'axios';
import * as dotenv from 'dotenv';

dotenv.config();

export class AITestGenerator {
  private apiKey: string;

  constructor() {
    this.apiKey = process.env.OPENAI_API_KEY || '';
  }

  async generateTest(prompt: string): Promise<string> {
    const apiUrl = 'https://api.openai.com/v1/completions';
    const headers = {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${this.apiKey}`
    };

    const data = {
      model: 'text-davinci-003',
      prompt: prompt,
      max_tokens: 500,
      temperature: 0.7
    };

    try {
      const response = await axios.post(apiUrl, data, { headers });
      const generatedText = response.data.choices[0].text.trim();
      return generatedText;
    } catch (error) {
      console.error('Error generating test from OpenAI:', error);
      throw new Error('Failed to generate test');
    }
  }
}
