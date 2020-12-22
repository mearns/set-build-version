/**
 * This is the entry point for the github-action.
 */
const core = require("@actions/core");
const exec = require("@actions/exec");
const run = require("./index");

async function main() {
    try {
        await run({ core, exec });
    } catch (error) {
        core.setFailed(error.message);
    }
}

main();
