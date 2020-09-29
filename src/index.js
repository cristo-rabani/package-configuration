const core = require('@actions/core');
const get = require('lodash.get');
const fs = require('fs');
const util = require('util');
const readFileAsync = util.promisify(fs.readFile);

async function run() {
  const keyName = core.getInput('keyName');
  try {
    const buffer = await readFileAsync('package.json');
    const json = JSON.parse(buffer.toString());
    console.log('keys', keyName);
    const targetConf = get(keyName, json);
    console.log('Configuration', targetConf);
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
