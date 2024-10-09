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
        const requestData = {
            model: "jamba-instruct",
            messages: [
                {
                    role: "user",
                    content: prompt
                }
            ],
            max_tokens: 300
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

                // Extraer el nombre del archivo basado en el prompt, utilizando el nombre "feature" por ejemplo
                const fileName = this.extractFileName(prompt);

                // Guardar el test en un archivo .feature
                await this.saveToFile(gherkinTest, fileName);

                // Generar el código automatizado usando el Gherkin generado
                const automatedTest = await this.generateAutomatedTest(gherkinTest);

                return { gherkin: gherkinTest, automatedTest };
            } else {
                console.error("Invalid API response structure:", response.data);
                throw new Error("No valid test generated. API response structure is invalid.");
            }
        } catch (error) {
            console.error("Error generating test:", error);
            throw new Error("Failed to generate test. " + error.message);
        }
    }

    // Método para extraer el nombre del archivo del prompt, asegurando un nombre único
    private extractFileName(prompt: string): string {
        // Extraer una referencia más clara al tipo de funcionalidad desde el prompt
        const match = prompt.match(/for the (.+?) page/i);
        const timestamp = new Date().toISOString().replace(/[:.-]/g, '');  // Marca de tiempo para evitar sobrescrituras
        if (match && match[1]) {
            return `${match[1].replace(/\s+/g, '').toLowerCase()}Test_${timestamp}.feature`;  // Añadir la marca de tiempo
        }
        return `generatedTest_${timestamp}.feature`;  // Nombre por defecto con timestamp
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

    // Método para generar el código automatizado a partir del Gherkin
    private async generateAutomatedTest(gherkinTest: string): Promise<string> {
        const requestData = {
            model: "jamba-instruct",
            messages: [
                {
                    role: "user",
                    content: `
                    Based on the following Gherkin test:
                    "${gherkinTest}"
                    Generate automated test code using Playwright and TypeScript. The test should include web elements, interactions, and validations.
                    `
                }
            ],
            max_tokens: 300
        };

        try {
            const response = await axios.post(this.apiUrl, requestData, {
                headers: {
                    'Authorization': `Bearer ${process.env.AI21_API_KEY}`,
                    'Content-Type': 'application/json'
                }
            });

            // Validación del código automatizado
            if (response.data && response.data.choices && response.data.choices.length > 0) {
                const automatedTest = response.data.choices[0].message.content;

                if (!automatedTest || automatedTest.trim().length === 0) {
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
