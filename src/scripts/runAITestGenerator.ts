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

// Función para generar tanto el Gherkin como el test automatizado
async function runTestGeneration(generateGherkin: boolean, generateAutomatedTest: boolean) {
  try {
    for (const prompt of prompts) {
      const { gherkin, automatedTest } = await aiTestGenerator.generateTest(prompt);

      // Si se quiere generar el archivo Gherkin
      if (generateGherkin) {
        const gherkinFileName = generateFileName('gherkinTest');
        const gherkinFolderPath = path.join(__dirname, '..', 'tests', 'ui', 'features');
        saveGeneratedFile(gherkin, gherkinFileName, gherkinFolderPath, 'feature');
      }

      // Si se quiere generar el archivo de test automatizado
      if (generateAutomatedTest) {
        const testFileName = generateFileName('automatedTest', true);
        const automatedTestFolderPath = path.join(__dirname, '..', 'tests', 'ui', 'automatedScripts');
        saveGeneratedFile(automatedTest, testFileName, automatedTestFolderPath, 'ts');
      }
    }
  } catch (error) {
    console.error('Error generating tests:', error);
  }
}

// Ejecuta la función según el argumento recibido
const args = process.argv.slice(2);

if (args.length > 0) {
  const action = args[0];

  // Determina si generar Gherkin o automatización (o ambos)
  const generateGherkin = args.includes('gherkin');
  const generateAutomatedTest = args.includes('automatedTest');

  // Ejecutar la función solo si alguna opción es verdadera
  if (generateGherkin || generateAutomatedTest) {
    runTestGeneration(generateGherkin, generateAutomatedTest);
  } else {
    console.log('Please provide an action: "gherkin", "automatedTest", or both.');
  }
} else {
  console.log('Please provide an action: "gherkin", "automatedTest", or both.');
}
