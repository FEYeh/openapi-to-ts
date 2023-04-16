const fs = require("fs");
const rollup = require("rollup");
const terser = require("terser");
const path = require("path");
const builds = require("./config").getAllConfig();

async function build(builds) {
  const funcs = [];
  for (let i = 0; i < builds.length; i++) {
    const be = buildEntry(builds[i])
    .catch(logError);
    funcs.push(be)
  }
  await Promise.all(funcs)
  console.log('finished.');
}

build(builds);

function buildEntry(config) {
  return new Promise((resolve) => {
    const { output } = config;
    const { file } = output;
    const isProd = /(min|prod)\.js$/.test(file);
    const watcher = rollup.watch(config);
    watcher.on("event", async (event) => {
      if ((event.code === "END")) {
        const bundle = await rollup.rollup(config);
        const {
          output: [{ code }],
        } = await bundle.generate(output);
        if (isProd) {
          const minified = (await terser.minify(code)).code;
          await write(file, minified);
        } else {
          await write(file, code);
        }
        resolve()
      }
    });
  })
}

function write(file, code) {
  return new Promise((resolve, reject) => {
    fs.writeFile(file, code, (err) => reject(err));
    report(file, code);
    resolve();
  });
}

function report(dist, code) {
  console.log(blue(path.relative(process.cwd(), dist)) + " " + getSize(code));
}

function getSize(code) {
  return (code.length / 1024).toFixed(2) + "kb";
}

function logError(e) {
  console.log(e);
}

function blue(str) {
  return "\x1b[1m\x1b[34m" + str + "\x1b[39m\x1b[22m";
}
