const GitCliRepoInfo = require("./git-cli");
const GithubActionsRepoInfo = require("./github-actions");

module.exports = ({ env, exec }) => {
    if (env.GITHUB_ACTIONS === "true") {
        return new GithubActionsRepoInfo({ env, exec });
    } else {
        return new GitCliRepoInfo({ env, exec });
    }
};
