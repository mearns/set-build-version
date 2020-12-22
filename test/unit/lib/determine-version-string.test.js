// Module under test
const determineVersion = require("../../../src/lib/determine-version-string");

describe("The determineVersionString function", () => {
    it("should generate a dev version for master", async () => {
        const version = await determineVersion(
            { version: "6.3.2" },
            {
                core: mockCore(),
                exec: mockExec(),
                env: {
                    GITHUB_ACTIONS: "true",
                    GITHUB_REF: "refs/heads/master",
                    GITHUB_RUN_NUMBER: "17"
                }
            }
        );
        expect(String(version)).toEqual("6.3.2-dev.17");
    });

    it("should generate a blood version for non-master branch", async () => {
        const version = await determineVersion(
            { version: "6.3.2" },
            {
                core: mockCore(),
                exec: mockExec(),
                env: {
                    GITHUB_ACTIONS: "true",
                    GITHUB_REF: "refs/heads/feature/my-branch",
                    GITHUB_RUN_NUMBER: "32"
                }
            }
        );
        expect(String(version)).toEqual(
            "6.3.2-blood.branch-feature-my-branch.32"
        );
    });

    it.each`
        tagPrefix
        ${"version/"}
        ${"versions/"}
        ${"v"}
        ${"v/"}
        ${"v."}
    `("should use the version specified in a tag", async ({ tagPrefix }) => {
        const version = await determineVersion(
            { version: "4.8.3" },
            {
                core: mockCore(),
                exec: mockExec(),
                env: {
                    GITHUB_ACTIONS: "true",
                    GITHUB_REF: `refs/tags/${tagPrefix}4.8.3`
                }
            }
        );
        expect(String(version)).toEqual("4.8.3");
    });
});

function mockCore() {
    const outputs = {};
    const logs = {
        info: []
    };
    return {
        info: message => {
            logs.info.push(message);
        },
        setOutput: (name, value) => {
            outputs[name] = value;
        },
        _logs: logs,
        _outputs: outputs
    };
}

function mockExec() {
    return {
        exec: () => {}
    };
}
