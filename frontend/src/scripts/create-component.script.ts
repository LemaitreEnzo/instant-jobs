import fs from "fs";
import inquirer from "inquirer";
import ora from "ora";
import path from "path";
import { kebabCase, pascalCase } from "../utils/case.util.js";

const __filename: string = decodeURI(new URL(import.meta.url).pathname);
const __dirname: string = path.dirname(__filename);

async function main() {
  /**
   * Ask user for component configuration
   * - componentName: name of the component
   * - parentDir: target folder category
   */
  const answers = await inquirer.prompt([
    {
      type: "input",
      name: "componentName",
      message: "Component name?",
      validate: (input) => (input.trim() ? true : "Component name is required"),
    },
    {
      type: "select",
      name: "parentDir",
      message: "Parent folder name?",
      choices: [
        { name: "ui", value: "ui" },
        { name: "pages", value: "pages" },
        { name: "layout", value: "layout" },
        { name: "common", value: "common" },
      ],
    },
  ]);

  /**
   * Normalize and format user input
   * - PascalCase for component name (React convention)
   * - kebab-case for CSS class naming
   */
  const componentName = pascalCase(answers.componentName);
  const parentDir = answers.parentDir;
  const className = kebabCase(componentName);

  /**
   * Build target directory path
   * components/{parentDir}/{ComponentName}
   */
  const componentDir = path.join(
    __dirname,
    "..",
    "components",
    parentDir,
    componentName,
  );

  console.log("\n");

  /**
   * Create folder with spinner feedback
   */
  const folderSpinner = ora(`Creating folder ${componentName}`).start();

  /**
   * Prevent overwriting existing components
   */
  if (fs.existsSync(componentDir)) {
    folderSpinner.fail(
      `Component "${componentName}" already exists in ${parentDir}`,
    );
    process.exit(1);
  }

  /**
   * Create component directory recursively if needed
   */
  fs.mkdirSync(componentDir, { recursive: true });
  folderSpinner.succeed(`Folder ${componentName} created`);

  /**
   * Generate component files
   */
  const fileSpinner = ora(
    `Generating files ${componentName}.tsx and ${componentName}.css`,
  ).start();

  /**
   * React component template (TSX)
   */
  const tsxTemplate = `import "./${componentName}.css";
const ${componentName} = () => {
  return (
    <div className="${className}">
      ${componentName}
    </div>
  );
}
export default ${componentName}`;

  /**
   * CSS module template
   */
  const cssTemplate = `.${className} {

}`;

  /**
   * Write TSX file
   */
  fs.writeFileSync(
    path.join(componentDir, `${componentName}.tsx`),
    tsxTemplate,
  );

  /**
   * Write CSS file
   */
  fs.writeFileSync(
    path.join(componentDir, `${componentName}.css`),
    cssTemplate,
  );

  fileSpinner.succeed(
    `Files generated: ${componentName}.tsx and ${componentName}.css`,
  );

  /**
   * Final success logs
   */
  console.log("\n🚀 Component successfully created!");
  console.log("Component path:", componentDir);
}

// Run CLI script
main();
