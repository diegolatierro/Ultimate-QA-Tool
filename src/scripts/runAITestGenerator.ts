import fs from 'fs';
import path from 'path';
import { AITestGenerator } from '../services/aiTestGenerator';

// Ruta al archivo JSON que contiene el prompt
const promptFilePath = path.join(__dirname, '../config/testPrompt.json');

// Leer el archivo JSON y extraer el prompt
function readPromptFromFile(filePath: string): string {
  try {
    const fileContent = fs.readFileSync(filePath, 'utf8');
    const jsonContent = JSON.parse(fileContent);
    return jsonContent.prompt;
  } catch (error) {
    console.error('Error reading the prompt file:', error);
    throw new Error('Failed to read the prompt from file.');
  }
}

// Inicializa la clase AITestGenerator
const aiTestGenerator = new AITestGenerator();

// Ejecutar el generador de pruebas y guardar el archivo
async function runTestGeneration() {
  try {
    // Lee el prompt desde el archivo JSON
    const prompt = readPromptFromFile(promptFilePath);

    // Genera el test usando la clase AITestGenerator
    const generatedTest = await aiTestGenerator.generateTest(prompt);

    console.log('Test generated and saved successfully');
  } catch (error) {
    console.error('Error generating or saving the test:', error);
  }
}

// Ejecutar la función para generar y guardar el test
runTestGeneration();
