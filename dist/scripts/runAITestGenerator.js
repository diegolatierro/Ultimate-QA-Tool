import fs from 'fs';
import path from 'path';
import { AITestGenerator } from '../services/aiTestGenerator';
// Inicializa la clase AITestGenerator
const aiTestGenerator = new AITestGenerator();
// Crear el prompt para generar el test
const prompt = `
  Generate a UI test for the login functionality on conduit.com.
  The user should use the email: "test@example.com" and the password: "password123".
  The test should be written in Gherkin format and include automated code in TypeScript using Playwright.
`;
// Función para guardar el archivo generado
function saveGeneratedTest(testContent, testName, folderPath) {
    const filePath = path.join(folderPath, `${testName}.ts`);
    try {
        fs.writeFileSync(filePath, testContent, 'utf8');
        console.log(`Test saved successfully at: ${filePath}`);
    }
    catch (err) {
        console.error('Error saving test file:', err);
    }
}
// Ejecutar el generador de pruebas y guardar el archivo
async function runTestGeneration() {
    try {
        // Genera el test usando OpenAI
        const generatedTest = await aiTestGenerator.generateTest(prompt);
        // Define el nombre del test y la carpeta donde se guardará
        const testName = 'generatedLoginTest';
        const folderPath = path.join(__dirname, '..', 'tests', 'ui');
        // Asegúrate de que la carpeta exista
        if (!fs.existsSync(folderPath)) {
            fs.mkdirSync(folderPath, { recursive: true });
        }
        // Guarda el test en un archivo
        saveGeneratedTest(generatedTest, testName, folderPath);
    }
    catch (error) {
        console.error('Error generating or saving the test:', error);
    }
}
// Ejecutar la función para generar y guardar el test
runTestGeneration();
