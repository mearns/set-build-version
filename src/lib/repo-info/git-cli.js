const os = require("os");
const { parseRef, RepoInfo } = require("./__common__");

class GitCliRepoInfo extends RepoInfo {
    constructor({ exec }) {
        super();
        this._exec = exec;
    }

    async getAdditionalRepoInfo() {
        return {
            user: os.userInfo().username,
            host: os.hostname()
        };
    }

    async getRefFromGit() {
        const output = [];
        await this._exec.exec("git", ["symbolic-ref", "HEAD"], {
            listeners: {
                stdout: chunk => {
                    output.push(chunk);
                }
            }
        });
        return Buffer.concat(output)
            .toString("utf8")
            .trim();
    }

    async getRef() {
        return parseRef(await this.getRefFromGit());
    }

    async getCommitId() {
        const output = [];
        await this._exec.exec("git", ["rev-parse", "HEAD"], {
            listeners: {
                stdout: chunk => {
                    output.push(chunk);
                }
            }
        });
        return Buffer.concat(output).toString("utf-8");
    }

    async isDirty() {
        const output = [];
        await this._exec.exec("git", ["diff", "--stat"], {
            listeners: {
                stdout: chunk => {
                    output.push(chunk);
                }
            }
        });
        return (
            Buffer.concat(output)
                .toString("utf-8")
                .trim().length !== 0
        );
    }
}

module.exports = GitCliRepoInfo;
