import fs from 'fs';
import path from 'path';
import { AITestGenerator } from '../services/aiTestGenerator';

// Inicializa la clase AITestGenerator
const aiTestGenerator = new AITestGenerator();

// Leer el archivo prompt.txt
function readPromptFile(filePath: string): string {
  try {
    const prompt = fs.readFileSync(filePath, 'utf8'); // Lee el archivo .txt
    return prompt;
  } catch (error) {
    console.error('Error reading prompt file:', error);
    throw new Error('Failed to read prompt file.');
  }
}

// Definir la ubicación del archivo .txt
const promptFilePath = path.join(__dirname, '..', 'prompt.txt');

// Leer el contenido del archivo prompt.txt
const prompt = readPromptFile(promptFilePath);

// Función para guardar el archivo generado
function saveGeneratedTest(testContent: string, testName: string, folderPath: string) {
  const filePath = path.join(folderPath, `${testName}.ts`);

  try {
    fs.writeFileSync(filePath, testContent, 'utf8');
    console.log(`Test saved successfully at: ${filePath}`);
  } catch (err) {
    console.error('Error saving test file:', err);
  }
}

// Ejecutar el generador de pruebas y guardar el archivo
async function runTestGeneration() {
  try {
    // Genera el test usando el prompt leído desde el archivo .txt
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
  } catch (error) {
    console.error('Error generating or saving the test:', error);
  }
}

// Ejecutar la función para generar y guardar el test
runTestGeneration();
