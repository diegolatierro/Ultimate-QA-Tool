import axios from 'axios';

export class OpenAIProvider {
  constructor(private apiKey: string, private model: string) {}

  async generateTest(prompt: string): Promise<string> {
    const response = await axios.post(
      'https://api.openai.com/v1/completions',
      {
        model: this.model,
        prompt: prompt,
        max_tokens: 3000,
      },
      {
        headers: { Authorization: `Bearer ${this.apiKey}` },
      }
    );
    return response.data.choices[0].text.trim();
  }
}
