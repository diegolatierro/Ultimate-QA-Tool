"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const path_1 = __importDefault(require("path"));
const aiTestGenerator_1 = require("../services/aiTestGenerator");
// Inicializa la clase AITestGenerator
const aiTestGenerator = new aiTestGenerator_1.AITestGenerator();
console.log(`Using AI Provider: ${process.env.AI_PROVIDER}`);
// Resto del código de lectura de archivos y generación de tests...
async function runTestGeneration(generateGherkin, generateAutomatedTest) {
    try {
        for (const prompt of prompts) {
            const { gherkin, automatedTest } = await aiTestGenerator.generateTest(prompt);
            // Guardar los archivos generados según corresponda
            if (generateGherkin) {
                const gherkinFileName = generateFileName('gherkinTest');
                const gherkinFolderPath = path_1.default.join(__dirname, '..', 'tests', 'ui', 'features');
                saveGeneratedFile(gherkin, gherkinFileName, gherkinFolderPath, 'feature');
            }
            if (generateAutomatedTest) {
                const testFileName = generateFileName('automatedTest', true);
                const automatedTestFolderPath = path_1.default.join(__dirname, '..', 'tests', 'ui', 'automatedScripts');
                saveGeneratedFile(automatedTest, testFileName, automatedTestFolderPath, 'ts');
            }
        }
    }
    catch (error) {
        console.error('Error generating tests:', error);
    }
}
