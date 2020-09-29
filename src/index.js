const core = require('@actions/core');
const fs = require('fs');
const util = require('util');
const readFileAsync = util.promisify(fs.readFile);

async function run() {
  const target = core.getInput('github.event.inputs.target');
  const keyName = core.getInput('keyName');
  try {
    const buffer = await readFileAsync('package.json');
    const json = JSON.parse(buffer.toString());
    console.log('json', json);
    const targetConf = json[keyName][target];
    if (!targetConf) {
      core.setFailed('configuration not found :-(');
      return;
    }
    Object.keys(targetConf).forEach((key) => core.setOutput(key, targetConf[key]));
  } catch (error) {
    core.setFailed(error.message);
  }
}

run();
