const os = require("os");
const getRef = require("./get-ref");

module.exports = async function generateBuildInfo({ env, exec }) {
    const buildInfo = {
        date: new Date().toISOString()
    };
    await addGitRef(buildInfo, { env, exec });
    await addGitCommit(buildInfo, { env, exec });
    await addIsGitDirty(buildInfo, { env, exec });

    if (env.CI) {
        buildInfo.runId = env.GITHUB_RUN_ID;
        buildInfo.runNumber = env.GITHUB_RUN_NUMBER;
    } else {
        buildInfo.user = os.userInfo().username;
        buildInfo.host = os.hostname();
    }

    return buildInfo;
};

async function addGitRef(buildInfo, { env, exec }) {
    const [refType, refName] = await getRef({ env, exec });
    if (refType === "heads") {
        buildInfo.branch = refName;
    } else if (refType === "tags") {
        buildInfo.tag = refName;
    }
}

async function addGitCommit(buildInfo, { env, exec }) {
    if (env.CI) {
        buildInfo.commit = env.GITHUB_SHA;
    }
    const output = [];
    await exec.exec("git", ["rev-parse", "HEAD"], {
        listeners: {
            stdout: chunk => {
                output.push(chunk);
            }
        }
    });
    buildInfo.commit = Buffer.concat(output).toString("utf-8");
}

async function addIsGitDirty(buildInfo, { env, exec }) {
    if (env.CI) {
        return;
    }
    const output = [];
    await exec.exec("git", ["diff", "--stat"], {
        listeners: {
            stdout: chunk => {
                output.push(chunk);
            }
        }
    });
    buildInfo.dirty =
        Buffer.concat(output)
            .toString("utf-8")
            .trim().length !== 0;
}
