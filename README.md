
# Instrucciones para Ejecutar los Scripts de Generación Automática de Pruebas

### 1. Instalar Dependencias

Primero, necesitas instalar todas las dependencias necesarias para que el script funcione. Para ello, asegúrate de tener un proyecto Node.js en funcionamiento. Si aún no tienes un `package.json`, ejecuta el siguiente comando para inicializar uno:

```bash
npm init -y
```

#### Instalar las dependencias necesarias:

- **`ts-node`**: Para ejecutar el código TypeScript directamente.
- **`typescript`**: El compilador de TypeScript.
- **`@types/node`**: Los tipos para trabajar con Node.js y archivos.
- **`fs`** y **`path`**: Son módulos core de Node.js, no necesitas instalarlos por separado.

Ejecuta el siguiente comando para instalar las dependencias necesarias:

```bash
npm install ts-node typescript @types/node
```

#### Estructura de directorios
Asegúrate de que tu estructura de carpetas sea algo similar a esto:

```
/project-root
  ├── /config
  │   └── /prompts
  ├── /src
  │   └── /scripts
  │       └── runAITestGenerator.ts
  ├── /tests
  │   └── /ui
  │       ├── /features
  │       └── /automatedScripts
  └── package.json
```

### 2. Configuración de TypeScript

Crea un archivo `tsconfig.json` en la raíz del proyecto, si no lo tienes ya, con el siguiente contenido básico:

```json
{
  "compilerOptions": {
    "target": "ES2020",
    "module": "CommonJS",
    "strict": true,
    "esModuleInterop": true,
    "skipLibCheck": true,
    "outDir": "./dist",
    "rootDir": "./src",
    "resolveJsonModule": true
  },
  "include": ["src/**/*.ts"]
}
```

### 3. Instrucciones para ejecutar los scripts

Puedes ejecutar cualquiera de las dos funciones por separado usando `npx ts-node` como se indica a continuación.

#### Para generar los archivos Gherkin:

```bash
npx ts-node src/scripts/runAITestGenerator.ts runGherkinTestGeneration
```

#### Para generar los archivos de test automatizado:

```bash
npx ts-node src/scripts/runAITestGenerator.ts runAutomatedTestGeneration
```

### 4. Confirmar que los resultados se guardan

Una vez ejecutados los scripts, los archivos generados se guardarán en las carpetas correspondientes dentro de la estructura de directorios, es decir:

- Gherkin: `tests/ui/features/`
- Tests automatizados: `tests/ui/automatedScripts/`
