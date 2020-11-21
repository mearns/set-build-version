function parseRef(ref) {
    const refMatch = /refs\/([^/]+)\/(.*)/.exec(ref);
    if (!refMatch) {
        throw new Error(`Ref did not match expected pattern: ${ref}`);
    }
    const [, refType, refName] = refMatch;
    return [refType, refName];
}

async function getRefFromGit({ exec }) {
    const output = [];
    await exec.exec("git", ["symbolic-ref", "HEAD"], {
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

async function getRef({ env, exec }) {
    return parseRef(env.GITHUB_REF || (await getRefFromGit({ exec })));
}

module.exports = getRef;
