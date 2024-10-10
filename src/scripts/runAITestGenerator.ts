import fs from 'fs';
import path from 'path';
import { AITestGenerator } from '../services/aiTestGenerator';

// Inicializa la clase AITestGenerator
const aiTestGenerator = new AITestGenerator();

// Función para leer archivos de prompt en formato .txt desde una carpeta
function readPromptFiles(folderPath: string): string[] {
  const prompts: string[] = [];

  try {
    const files = fs.readdirSync(folderPath);

    files.forEach(file => {
      const filePath = path.join(folderPath, file);
      const prompt = fs.readFileSync(filePath, 'utf8');
      prompts.push(prompt);
    });

    return prompts;
  } catch (error) {
    console.error('Error reading prompt files:', error);
    throw new Error('Failed to read prompt files.');
  }
}

// Definir la ubicación de la carpeta de archivos de prompt
const promptsFolderPath = path.join(__dirname, '..', 'config', 'prompts');

// Leer los archivos de prompt
const prompts = readPromptFiles(promptsFolderPath);

// Función para guardar los archivos generados (Gherkin y código automatizado)
function saveGeneratedFile(fileContent: string, fileName: string, folderPath: string, fileExtension: string) {
  const filePath = path.join(folderPath, `${fileName}.${fileExtension}`);

  try {
    // Asegurarse de que el directorio exista
    if (!fs.existsSync(folderPath)) {
      fs.mkdirSync(folderPath, { recursive: true });
    }

    // Guardar el archivo
    fs.writeFileSync(filePath, fileContent, 'utf8');
    console.log(`${fileName}.${fileExtension} saved successfully at: ${filePath}`);
  } catch (err) {
    console.error('Error saving file:', err);
  }
}

// Función para generar nombres de archivo basados en el tipo y la fecha
function generateFileName(baseName: string, isTest: boolean = false): string {
  const timestamp = new Date().toISOString().replace(/[:.]/g, '');
  return `${baseName}_${timestamp}${isTest ? '.spec' : ''}`;
}

// Ejecutar la generación de archivos Gherkin
async function runGherkinTestGeneration() {
  try {
    for (const prompt of prompts) {
      // Genera solo el archivo Gherkin usando cada prompt
      const { gherkin } = await aiTestGenerator.generateTest(prompt);

      // Define los nombres de los archivos de forma dinámica
      const gherkinFileName = generateFileName('gherkinTest');

      // Define la ruta de la carpeta para los archivos Gherkin
      const gherkinFolderPath = path.join(__dirname, '..', 'tests', 'ui', 'features');

      // Guarda el archivo Gherkin en formato .feature
      saveGeneratedFile(gherkin, gherkinFileName, gherkinFolderPath, 'feature');
    }
  } catch (error) {
    console.error('Error generating Gherkin test:', error);
  }
}

// Ejecutar la generación de archivos de test automatizado
async function runAutomatedTestGeneration() {
  try {
    for (const prompt of prompts) {
      // Genera el archivo de test automatizado usando cada prompt
      const { automatedTest } = await aiTestGenerator.generateTest(prompt);

      // Define los nombres de los archivos de forma dinámica
      const testFileName = generateFileName('automatedTest', true); // Añadir .spec.ts para el test automatizado

      // Define la ruta de la carpeta para los archivos automatizados
      const automatedTestFolderPath = path.join(__dirname, '..', 'tests', 'ui', 'automatedScripts');

      // Guarda el archivo de código automatizado en formato .spec.ts
      saveGeneratedFile(automatedTest, testFileName, automatedTestFolderPath, 'ts');
    }
  } catch (error) {
    console.error('Error generating automated test:', error);
  }
}

// Ejecuta la función según el argumento recibido
const args = process.argv.slice(2);

if (args.length > 0) {
  const action = args[0];

  if (action === 'runGherkinTestGeneration') {
    runGherkinTestGeneration();
  } else if (action === 'runAutomatedTestGeneration') {
    runAutomatedTestGeneration();
  } else {
    console.log('Unknown action. Use "runGherkinTestGeneration" or "runAutomatedTestGeneration".');
  }
} else {
  console.log('Please provide an action: "runGherkinTestGeneration" or "runAutomatedTestGeneration".');
}
