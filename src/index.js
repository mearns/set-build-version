const determineVersionString = require("./lib/determine-version-string");
const generateBuildInfo = require("./lib/generate-build-info");
const fs = require("fs").promises;
const updateJsonFile = require("update-json-file");

async function run({ core, exec }) {
    const packageData = await getPackageData();
    const [version, buildInfo] = await Promise.all([
        determineVersionString(packageData, {
            core,
            exec,
            env: process.env
        }),
        generateBuildInfo({ env: process.env, exec })
    ]);
    core.info(`Determined build version: ${version}`);
    core.info(`Generated build info: ${JSON.stringify(buildInfo, null, 4)}`);
    core.setOutput("version", version.toString());
    core.setOutput("buildVersion", JSON.stringify(buildInfo));

    await overwritePackageData(version, buildInfo);
}

async function getPackageData() {
    return JSON.parse(await fs.readFile("package.json", "utf-8"));
}

async function overwritePackageData(version, buildInfo) {
    await updateJsonFile(
        "package.json",
        data => {
            data.version = version;
            data.buildInfo = buildInfo;
            return data;
        },
        { detectIndent: true }
    );
}

module.exports = run;
