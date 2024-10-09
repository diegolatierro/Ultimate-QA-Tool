"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const fs_1 = __importDefault(require("fs"));
const path_1 = __importDefault(require("path"));
const aiTestGenerator_1 = require("../services/aiTestGenerator");
// Ruta al archivo JSON que contiene el prompt
const promptFilePath = path_1.default.join(__dirname, '../config/testPrompt.json');
// Leer el archivo JSON y extraer el prompt
function readPromptFromFile(filePath) {
    try {
        const fileContent = fs_1.default.readFileSync(filePath, 'utf8');
        const jsonContent = JSON.parse(fileContent);
        return jsonContent.prompt;
    }
    catch (error) {
        console.error('Error reading the prompt file:', error);
        throw new Error('Failed to read the prompt from file.');
    }
}
// Inicializa la clase AITestGenerator
const aiTestGenerator = new aiTestGenerator_1.AITestGenerator();
// Ejecutar el generador de pruebas y guardar el archivo
async function runTestGeneration() {
    try {
        // Lee el prompt desde el archivo JSON
        const prompt = readPromptFromFile(promptFilePath);
        // Genera el test usando la clase AITestGenerator
        const generatedTest = await aiTestGenerator.generateTest(prompt);
        console.log('Test generated and saved successfully');
    }
    catch (error) {
        console.error('Error generating or saving the test:', error);
    }
}
// Ejecutar la función para generar y guardar el test
runTestGeneration();
