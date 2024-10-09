import axios from 'axios';
import dotenv from 'dotenv';
import fs from 'fs';
import path from 'path';

// Cargar el archivo .env
dotenv.config();

export class AITestGenerator {
    private apiUrl: string = 'https://api.ai21.com/studio/v1/chat/completions';
    
    async generateTest(prompt: string): Promise<string> {
        const requestData = {
            model: "jamba-instruct",
            messages: [
                {
                    role: "user",
                    content: prompt
                }
            ],
            max_tokens: 150
        };

        try {
            const response = await axios.post(this.apiUrl, requestData, {
                headers: {
                    'Authorization': `Bearer ${process.env.AI21_API_KEY}`,
                    'Content-Type': 'application/json'
                }
            });

            // Validación y logging mejorados
            if (response.data && response.data.choices && response.data.choices.length > 0) {
                const gherkinTest = response.data.choices[0].message.content;

                if (!gherkinTest || gherkinTest.trim().length === 0) {
                    throw new Error("API returned an empty test. Check the prompt and API response.");
                }

                console.log("Generated Gherkin Test:", gherkinTest);

                // Extraer el nombre del archivo basado en el prompt
                const fileName = this.extractFileName(prompt);

                // Guardar el test en un archivo .feature
                await this.saveToFile(gherkinTest, fileName);
                return gherkinTest;
            } else {
                console.error("Invalid API response structure:", response.data);
                throw new Error("No valid test generated. API response structure is invalid.");
            }
        } catch (error) {
            console.error("Error generating test:", error);
            throw new Error("Failed to generate test. " + error.message);
        }
    }

    // Método para extraer el nombre del archivo del prompt
    private extractFileName(prompt: string): string {
        const match = prompt.match(/for the (.+?) functionality/i);
        if (match && match[1]) {
            return match[1].replace(/\s+/g, '').toLowerCase() + 'Test.feature'; // Debe generar ".feature"
        }
        return 'generatedTest.feature';  // Nombre por defecto
    }

    // Guardar el archivo Gherkin en la carpeta adecuada
    private async saveToFile(content: string, fileName: string): Promise<void> {
        const directory = path.join(__dirname, '../../tests/ui/features');
        
        // Crear el directorio si no existe
        try {
            if (!fs.existsSync(directory)) {
                fs.mkdirSync(directory, { recursive: true });
            }

            const filePath = path.join(directory, fileName);

            // Guardar el contenido en el archivo
            fs.writeFileSync(filePath, content);
            console.log(`Saved Gherkin Test to ${filePath}`);
        } catch (error) {
            console.error("Error saving file:", error);
            throw new Error("Failed to save the Gherkin test file.");
        }
    }
}
