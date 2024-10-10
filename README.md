
# Instrucciones para la Generación de Casos de Prueba y Automatización

## Dependencias necesarias

Asegúrate de tener instaladas las siguientes dependencias:

- **TypeScript**: Lenguaje utilizado para los scripts.
- **ts-node**: Ejecuta archivos TypeScript sin tener que compilarlos explícitamente.
- **axios**: Utilizado para hacer solicitudes HTTP.
- **Playwright**: Framework utilizado para las pruebas automatizadas.
  
### Comandos para instalar las dependencias:

1. **TypeScript**:
```bash
npm install typescript --save-dev
```

2. **ts-node**:
```bash
npm install ts-node --save-dev
```

3. **axios**:
```bash
npm install axios
```

4. **Playwright**:
```bash
npm install @playwright/test
```

### Configuración adicional para Playwright

Si no tienes configurado Playwright en tu proyecto, puedes hacerlo ejecutando:

```bash
npx playwright install
```

Esto instalará los navegadores necesarios para ejecutar las pruebas.

## Estructura del Proyecto

Asegúrate de que tu proyecto tenga la siguiente estructura:

```plaintext
- src/
  - scripts/
    - runAITestGenerator.ts
  - services/
    - aiTestGenerator.ts
- config/
  - prompts/
    - (Archivos de texto .txt con prompts)
- tests/
  - ui/
    - features/
      - (Aquí se guardarán los archivos .feature)
    - automatedScripts/
      - (Aquí se guardarán los archivos .spec.ts)
```

## Scripts disponibles

### 1. Generación de casos de prueba en Gherkin

Para generar únicamente los casos de prueba en formato Gherkin, ejecuta:

```bash
npx ts-node src/scripts/runAITestGenerator.ts gherkin
```

### 2. Generación del código de automatización

Para generar únicamente el código de automatización en Playwright con TypeScript:

```bash
npx ts-node src/scripts/runAITestGenerator.ts automatedTest
```

### Ejecución de las pruebas

1. Una vez que hayas generado los tests automatizados, asegúrate de que los archivos terminen con `.spec.ts`.
2. Luego, puedes ejecutar todas las pruebas utilizando el comando:

```bash
npx playwright test
```

Si quieres ejecutar un archivo en específico, usa:

```bash
npx playwright test tests/ui/automatedScripts/<nombre_del_test>.spec.ts
```

### Notas adicionales

- Los prompts que deseas utilizar deben estar en la carpeta `config/prompts` en archivos `.txt`. Cada archivo de prompt generará tanto un archivo `.feature` como su correspondiente archivo `.spec.ts`.
- Si deseas agregar más prompts, simplemente coloca el nuevo archivo `.txt` en la carpeta de `prompts` y vuelve a ejecutar los scripts de generación.

