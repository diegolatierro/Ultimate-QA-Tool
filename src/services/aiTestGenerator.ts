import axios from 'axios';

export class AITestGenerator {
    // Definir apiUrl como la URL del servicio (por ejemplo, OpenAI API)
    private apiUrl: string = 'https://api.openai.com/v1/completions';
    
    // Definir requestData con los datos necesarios para la API
    private requestData: object = {
        model: "text-davinci-003",
        prompt: "Genera un test de ejemplo para una API de login",
        max_tokens: 100
    };

    // Aquí va tu método para generar el test
    async generateTest(prompt: string): Promise<string> {
      const requestData = {
          model: "text-davinci-003",
          prompt: prompt,  // Usamos el prompt pasado como argumento
          max_tokens: 100
      };

      try {
          const response = await axios.post(this.apiUrl, requestData, {
              headers: {
                  'Authorization': `Bearer ${process.env.OPENAI_API_KEY}`,
                  'Content-Type': 'application/json'
              }
          });

          if (response.data && response.data.choices) {
              console.log("Generated Test:", response.data.choices[0].text);
              return response.data.choices[0].text;
          } else {
              throw new Error("No valid test generated.");
          }
      } catch (error) {
          console.error("Error generating test:", error);
          throw new Error("Failed to generate test");
      }
  }
}
