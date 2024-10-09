import axios from 'axios';

export class AITestGenerator {
    // Definir apiUrl como la URL del servicio (AI21 Labs)
    private apiUrl: string = 'https://api.ai21.com/studio/v1/chat/completions';
    
    // Definir requestData con los datos necesarios para la API
    private requestData: object = {
        model: "jamba-instruct",
        messages: [
            {
                role: "user",
                content: "Genera un test de ejemplo para una API de login"
            }
        ],
        max_tokens: 100
    };

    // Aquí va tu método para generar el test
    async generateTest(prompt: string): Promise<string> {
        const requestData = {
            model: "jamba-instruct",  // Cambiar al modelo correcto
            messages: [
                {
                    role: "user",
                    content: prompt  // Usamos el prompt pasado como argumento
                }
            ],
            max_tokens: 100
        };

        try {
          console.log("API Key:", process.env.AI21_API_KEY);  
          const response = await axios.post(this.apiUrl, requestData, {
                headers: {
                    'Authorization': `Bearer ${process.env.AI21_API_KEY}`,  // Asegúrate de que el API Key esté en tu entorno
                    'Content-Type': 'application/json'
                }
            });

            if (response.data && response.data.choices) {
                console.log("Generated Test:", response.data.choices[0].message.content);
                return response.data.choices[0].message.content;
            } else {
                throw new Error("No valid test generated.");
            }
        } catch (error) {
            console.error("Error generating test:", error);
            throw new Error("Failed to generate test");
        }
    }
}
