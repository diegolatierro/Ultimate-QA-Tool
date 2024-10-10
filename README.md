
# Instrucciones para la Generación Automática de Tests

## Requisitos previos

1. Asegúrate de tener instalado **Node.js** y **npm** (Node Package Manager) en tu sistema. Puedes verificar si están instalados ejecutando los siguientes comandos en tu terminal:

```bash
node -v
npm -v
```

Si no están instalados, descárgalos desde [https://nodejs.org](https://nodejs.org) y sigue las instrucciones para tu sistema operativo.

2. Instalar las dependencias necesarias. Navega hasta el directorio raíz de tu proyecto y ejecuta:

```bash
npm init -y
npm install playwright @types/node ts-node typescript
```

Esto instalará **Playwright**, **TypeScript**, **ts-node**, y las definiciones de tipo necesarias.

## Estructura del proyecto

El proyecto tiene la siguiente estructura de carpetas:

```
/config
    /prompts         --> Contiene los archivos .txt con los prompts
/scripts
    runAITestGenerator.ts  --> Script para generar casos de prueba en formato Gherkin y código automatizado
/tests
    /ui
        /features         --> Se almacenan los archivos .feature generados (Gherkin)
        /automatedScripts --> Se almacenan los archivos .spec.ts generados (código automatizado)
/services
    aiTestGenerator.ts     --> Servicio para generar las pruebas usando IA
```

## Ejecución de los scripts

### 1. Generar los casos de prueba en Gherkin

Para generar los casos de prueba en formato **Gherkin** basado en los archivos `.txt` de la carpeta **prompts**, ejecuta el siguiente comando:

```bash
npx ts-node src/scripts/runAITestGenerator.ts runGherkinTestGeneration
```

### 2. Generar el código automatizado

Para generar los archivos de código automatizado **.spec.ts** desde los mismos prompts, ejecuta el siguiente comando:

```bash
npx ts-node src/scripts/runAITestGenerator.ts runAutomatedTestGeneration
```

### 3. Ejecutar los tests

Si deseas ejecutar los tests generados con **Playwright**, utiliza el siguiente comando:

```bash
npx playwright test
```

Asegúrate de que los archivos generados de código automatizado estén en la carpeta **/tests/ui/automatedScripts** y que tengan la extensión `.spec.ts`.

## Consideraciones adicionales

- Los prompts en formato `.txt` deben estar en la carpeta **/config/prompts**.
- El archivo **runAITestGenerator.ts** es responsable de leer los prompts y generar tanto los archivos Gherkin como el código automatizado.
- Los archivos **.feature** se guardarán en **/tests/ui/features** y los archivos **.spec.ts** en **/tests/ui/automatedScripts**.

