const { parseRef, RepoInfo } = require("./__common__");

class GithubActionsRepoInfo extends RepoInfo {
    constructor({ env }) {
        super();
        this._env = env;
    }

    async getAdditionalRepoInfo() {
        return {
            runId: this._env.GITHUB_RUN_ID,
            runNumber: this._env.GITHUB_RUN_NUMBER
        };
    }

    async getRef() {
        return parseRef(this._env.GITHUB_REF);
    }

    async getCommitId() {
        return this._env.GITHUB_SHA;
    }

    async isDirty() {
        return false;
    }
}

module.exports = GithubActionsRepoInfo;
