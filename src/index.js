const core = require('@actions/core');
const get = require('lodash.get');
const fs = require('fs');
const util = require('util');
const readFileAsync = util.promisify(fs.readFile);

async function run() {
  const mainKey = core.getInput('mainKey');
  const keyName = core.getInput('keyName');
  const keys = [];
  if (mainKey) {
    keys.push(mainKey);
  }
  if (keyName) {
    keys.push(keyName);
  }
  const key = keys.join('.');
  try {
    const buffer = await readFileAsync('package.json');
    const json = JSON.parse(buffer.toString());
    console.log('key', key);
    const targetConf = get(json, key);
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
