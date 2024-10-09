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

// Definir la ubicación correcta del archivo .txt
const promptFilePath = path.join(__dirname, '..', 'config', 'gherkin_prompt.txt');

// Leer el contenido del archivo prompt.txt
const prompt = readPromptFile(promptFilePath);

// Función para guardar los archivos generados (Gherkin y código automatizado)
function saveGeneratedFile(fileContent: string, fileName: string, folderPath: string) {
  const filePath = path.join(folderPath, `${fileName}.ts`);

  try {
    // Asegurarse de que el directorio exista
    if (!fs.existsSync(folderPath)) {
      fs.mkdirSync(folderPath, { recursive: true });
    }

    // Guardar el archivo
    fs.writeFileSync(filePath, fileContent, 'utf8');
    console.log(`${fileName} saved successfully at: ${filePath}`);
  } catch (err) {
    console.error('Error saving file:', err);
  }
}

// Ejecutar el generador de pruebas y guardar los archivos
async function runTestGeneration() {
  try {
    // Genera el test usando el prompt leído desde el archivo .txt
    const { gherkin, automatedTest } = await aiTestGenerator.generateTest(prompt);

    // Define el nombre de los archivos y la carpeta donde se guardarán
    const gherkinFileName = 'generatedTestFeature';  // Nombre del archivo Gherkin
    const testFileName = 'generatedAutomatedTest';    // Nombre del archivo automatizado
    const folderPath = path.join(__dirname, '..', 'tests', 'ui', 'features');

    // Asegúrate de que la carpeta exista
    if (!fs.existsSync(folderPath)) {
      fs.mkdirSync(folderPath, { recursive: true });
    }

    // Guarda el archivo Gherkin
    saveGeneratedFile(gherkin, gherkinFileName, folderPath);

    // Guarda el archivo de código automatizado
    const automatedTestFolderPath = path.join(__dirname, '..', 'tests', 'ui','automatedScripts');
    saveGeneratedFile(automatedTest, testFileName, automatedTestFolderPath);
  } catch (error) {
    console.error('Error generating or saving the test:', error);
  }
}

// Ejecutar la función para generar y guardar el test
runTestGeneration();
