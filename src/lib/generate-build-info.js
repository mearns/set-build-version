const os = require("os");
const getRepoInfo = require("./repo-info");

/**
 * Return an object containing information about the context of this build, such as
 * the current branch (or other git ref), the git commit ID, whether or not the repo
 * is currently dirty with respect to git, etc. For github actions this will be pulled
 * from the CI environment variables. Otherwise, we will call out to the "git" command
 * to get it.
 */
module.exports = async function getAdditionalRepoInfo({ env, exec }) {
    const repoInfo = getRepoInfo({ env, exec });
    const buildInfo = {
        date: new Date().toISOString(),
        ...(await repoInfo.getAdditionInfo())
    };
    await Promise.all([
        addGitRef(buildInfo, repoInfo),
        addGitCommit(buildInfo, { env, exec }),
        addIsDirty(buildInfo, { env, exec })
    ]);
    return buildInfo;
};

async function addGitRef(buildInfo, repoInfo) {
    const [refType, refName] = await repoInfo.getRef();
    if (refType === "heads") {
        buildInfo.branch = refName;
    } else if (refType === "tags") {
        buildInfo.tag = refName;
    }
}

async function addGitCommit(buildInfo, repoInfo) {
    buildInfo.commit = await repoInfo.getCommitId();
}

async function addIsDirty(buildInfo, repoInfo) {
    buildInfo.dirty = await repoInfo.isDirty();
}
