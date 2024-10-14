import fs from 'fs';
import path from 'path';
import { AITestGenerator } from '../services/aiTestGenerator';

// Inicializa la clase AITestGenerator
const aiTestGenerator = new AITestGenerator();
console.log(`Using AI Provider: ${process.env.AI_PROVIDER}`);

// Ruta del directorio donde están los prompts
const promptsFolderPath = path.join(__dirname, '..', 'config', 'prompts');

// Función para leer todos los archivos .txt de la carpeta de prompts
function loadPrompts(): string[] {
  const files = fs.readdirSync(promptsFolderPath);
  return files
    .filter((file) => file.endsWith('.txt'))
    .map((file) => fs.readFileSync(path.join(promptsFolderPath, file), 'utf8'));
}

// Crea nombres únicos para los archivos generados
function generateFileName(prefix: string, isTS: boolean = false): string {
  const timestamp = new Date().toISOString().replace(/[-:.]/g, '');
  const extension = isTS ? 'ts' : 'feature';
  return `${prefix}_${timestamp}.${extension}`;
}

// Guarda un archivo generado en la ruta específica
function saveGeneratedFile(fileContent: string, fileName: string, folderPath: string) {
  const filePath = path.join(folderPath, fileName);
  
  try {
    if (!fs.existsSync(folderPath)) {
      fs.mkdirSync(folderPath, { recursive: true });
    }

    fs.writeFileSync(filePath, fileContent, 'utf8');
    console.log(`${fileName} saved successfully at: ${filePath}`);
  } catch (err) {
    console.error('Error saving file:', err);
  }
}


// Función principal para ejecutar la generación de tests
async function runTestGeneration(generateGherkin: boolean, generateAutomatedTest: boolean) {
  const prompts = loadPrompts();

  for (const prompt of prompts) {
    try {
      const { gherkin, automatedTest } = await aiTestGenerator.generateTest(prompt);

      if (generateGherkin) {
        const gherkinFileName = generateFileName('gherkinTest');
        const gherkinFolderPath = path.join(__dirname, '..', 'tests', 'ui', 'features');
        saveGeneratedFile(gherkin, gherkinFileName, gherkinFolderPath);
      }

      if (generateAutomatedTest) {
        const testFileName = generateFileName('automatedTest', true);
        const automatedTestFolderPath = path.join(__dirname, '..', 'tests', 'ui', 'automatedScripts');
        saveGeneratedFile(automatedTest, testFileName, automatedTestFolderPath);
      }
    } catch (error) {
      console.error('Error generating test:', error);
    }
  }
}

// Ejecuta la función principal con los parámetros que necesites
const args = process.argv.slice(2);
const generateGherkin = args.includes('gherkin');
const generateAutomatedTest = args.includes('automatedTest');

runTestGeneration(generateGherkin, generateAutomatedTest);
