function parseRef(ref) {
    const refMatch = /refs\/([^/]+)\/(.*)/.exec(ref);
    if (!refMatch) {
        throw new Error(`Ref did not match expected pattern: ${ref}`);
    }
    const [, refType, refName] = refMatch;
    return [refType, refName];
}

class RepoInfo {
    /**
     * Get the git ref. For github actions, it uses the GITHUB_REF env var. Otherwise it
     * calls out to the "git" command to get the symbolic-ref that HEAD refers to.
     * Returns a two-tuple, `[refType, refName]`. The `refType` will be something like
     * "heads" (for branches), remotes, or tags.
     */
    async getRef({ env, exec }) {
        throw new Error("Not Implemented");
    }
}

module.exports = {
    parseRef,
    RepoInfo
};
