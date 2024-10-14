import axios from 'axios';

export class AI21Provider {
  constructor(private apiKey: string, private model: string) {}

  async generateTest(prompt: string): Promise<string> {
    const response = await axios.post(
      `https://api.ai21.com/studio/v1/${this.model}/complete`,
      {
        prompt: prompt,
        maxTokens: 3000,
      },
      {
        headers: { Authorization: `Bearer ${this.apiKey}` },
      }
    );
    return response.data.completions[0].data.text.trim();
  }
}
