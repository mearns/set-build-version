#!/usr/bin/env node
const fs = require("fs").promises;

async function main() {
    const packageInfo = JSON.parse(await fs.readFile("package.json", "utf-8"));
    if (Object.hasOwnProperty.call(packageInfo, "buildInfo")) {
        console.error("Error: do not commit buildInfo in package.json");
        process.exitCode = 1;
    }
}

module.exports = main;
