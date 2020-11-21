#!/usr/bin/env node

const updatePackageJson = require("./commands/update-package-json");
const preCommit = require("./commands/pre-commit");

async function main() {
    const [, , command] = process.argv;
    switch (command) {
        case "update-package-json":
            await updatePackageJson();
            return;

        case "pre-commit":
            await preCommit();
            return;

        default:
            console.error(`Unknown command: ${command}`);
            process.exitCode = 1;
    }
}

main();
