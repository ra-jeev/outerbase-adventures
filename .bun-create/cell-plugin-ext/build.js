import { program } from "commander";
import { createInterface } from "readline";
import fs from "fs";
import path from "path";

const TMP_PATH = "./.tmp";

const collectPairs = (value, previous) => {
  return previous.concat(value);
};

const processKeyValues = (replacements) => {
  const pairs = {};
  replacements.forEach((pair) => {
    const [key, value] = pair.split("=");
    if (key && value) {
      pairs[key] = value;
    }
  });

  return pairs;
};

const handleCliArgs = () => {
  program
    .name("bun build.js")
    .version("1.0.0")
    .option(
      "-r, --replace <keyValue...>",
      "Specify key=value pairs to replace key identifier with the asset path",
      collectPairs,
      []
    )
    .parse(process.argv);

  const { replace } = program.opts();

  const { args } = program;
  if (args.length) {
    console.error("Invalid options:", args);
    program.help();
  }

  if (replace.length === 0) {
    const rl = createInterface({
      input: process.stdin,
      output: process.stdout,
    });

    rl.question(
      "No key-value pairs provided with --replace. Continue build (Y/n)? ",
      (answer) => {
        rl.close();

        if (answer.trim().toLowerCase() === "n") {
          console.log("Exiting...");
          process.exit(1);
        } else {
          console.log("Continuing build...");
          bundle();
        }
      }
    );
  } else {
    bundle(processKeyValues(replace));
  }
};

const createTmpResources = (fileText) => {
  const filePath = `${TMP_PATH}/index.js`;
  const directoryPath = path.dirname(filePath);
  if (!fs.existsSync(directoryPath)) {
    fs.mkdirSync(directoryPath, { recursive: true });
  }

  fs.writeFileSync(filePath, fileText);

  return filePath;
};

const cleanUp = () => {
  const filePath = `${TMP_PATH}/index.js`;
  if (fs.existsSync(filePath)) {
    fs.unlinkSync(filePath);
    fs.rmdirSync(TMP_PATH);
  }
};

const createOutput = (dir, fileText) => {
  const filePath = `${dir}/index.js`;
  const directoryPath = path.dirname(filePath);
  if (!fs.existsSync(directoryPath)) {
    fs.mkdirSync(directoryPath, { recursive: true });
  }

  fs.writeFileSync(filePath, fileText);
};

const bundle_old = async (replacements) => {
  const buildConfig = {
    entrypoints: ["index.js"],
    outdir: "./out",
  };

  if (replacements) {
    const indexFile = Bun.file("index.js");
    let indexFileText = await indexFile.text();

    for (const key in replacements) {
      const file = Bun.file(replacements[key]);
      const fileExists = await file.exists();

      if (fileExists) {
        const fText = await file.text();
        indexFileText = indexFileText.replace(key, fText);
      }
    }

    const entryPoint = createTmpResources(indexFileText);
    buildConfig.entrypoints = [entryPoint];
  }

  const res = await Bun.build(buildConfig);
  for (const result of res.outputs) {
    console.log(`final bundle size: ${result.size / 1024}KB`);
  }

  cleanUp();
};

const bundle = async (replacements) => {
  if (replacements) {
    const indexFile = Bun.file("index.js");
    let indexFileText = await indexFile.text();

    for (const key in replacements) {
      const res = await fetch(replacements[key]);
      const fText = await res.text();

      indexFileText = indexFileText.replace(key, fText);
    }

    createOutput("out", indexFileText);
  } else {
    fs.cpSync("index.js", "out/index.js");
  }
};

handleCliArgs();
