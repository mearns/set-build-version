const getRef = require("./get-ref");

const semverRegex = /([0-9]+)\.([0-9]+)\.([0-9]+)(-[^+]+)?(\+.*)?$/;
const versionTagRegex = new RegExp(
    /^(?:v(?:er(?:s(?:ion)?)?)?\s*\.?\s*\/?\s*)?/.source + semverRegex.source,
    "i"
);

async function determineVersionString(packageData, { core, exec, env }) {
    const baseVersion = getBaseVersion(packageData);

    const [refType, refName] = await getRef({ env, exec });

    if (refType === "tags") {
        const tagVersion = getVersionFromTag(refName);
        if (tagVersion) {
            if (!tagVersion.equivalent(baseVersion)) {
                throw new Error(
                    `Your tag "${refName}" does not match the version in package.json: "${baseVersion}"`
                );
            }
            core.info(`Using version from tag: ${refName}`);
            return tagVersion;
        }
    }

    if (refType === "heads" && refName === "master") {
        core.info(
            `Building dev version string for master branch from: ${baseVersion}`
        );
        return baseVersion.appendPreRelease("dev", env.GITHUB_RUN_NUMBER);
    } else {
        core.info(
            "Building bleeding-edge version string for non-master branch"
        );
        const bloodType = refType === "heads" ? "branch" : refType;
        const slug = slugify(refName);
        return baseVersion.appendPreRelease(
            "blood",
            `${bloodType}-${slug}`,
            env.GITHUB_RUN_NUMBER
        );
    }
}

function slugify(string) {
    return string.replace(/[^a-z0-9_-]+/gi, "-");
}

function getBaseVersion(packageData) {
    const baseVersion = packageData.version;
    const versionMatch = semverRegex.exec(baseVersion);
    if (!versionMatch) {
        throw new Error(`Version number did not patch semver: ${baseVersion}`);
    }
    return new Version(...versionMatch.slice(1));
}

class Version {
    constructor(
        major,
        minor = "0",
        patch = "0",
        preRelease = null,
        meta = null
    ) {
        this.major = parseInt(major, 10);
        this.minor = parseInt(minor, 10);
        this.patch = parseInt(patch, 10);
        console.log(preRelease);
        this.preRelease = preRelease
            ? Array.isArray(preRelease)
                ? preRelease
                : preRelease.split(".")
            : [];
        this.meta = meta;
    }

    equivalent(other) {
        return Boolean(
            other &&
                this.major === other.major &&
                this.minor === other.minor &&
                this.patch === other.patch &&
                this.preRelease === other.preRelease
        );
    }

    toString() {
        return `${this.major}.${this.minor}.${this.patch}${
            this.preRelease.length ? `-${this.preRelease.join(".")}` : ""
        }${this.meta ? `+${this.meta}` : ""}`;
    }

    bumpPatch() {
        return new Version(
            this.major,
            this.minor,
            this.patch + 1,
            this.preRelease,
            this.meta
        );
    }

    appendPreRelease(...components) {
        return new Version(
            this.major,
            this.minor,
            this.patch,
            [...this.preRelease, ...components.filter(Boolean)],
            this.meta
        );
    }
}

function getVersionFromTag(tag) {
    const tagVersionMatch = versionTagRegex.exec(tag);
    if (tagVersionMatch) {
        return new Version(...tagVersionMatch);
    }
    return null;
}

module.exports = determineVersionString;
