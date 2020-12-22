# set-build-version

This is currently the only versioning supported:

1. Master branch is built as a "beta" version, using the next patch version above what is specified in package.json.
   The version number takes the form 1.2.3-alpha.$buildId. Package.json should include "dev" as a component in the pre-release
   version component, or an error is generated, failing the build. The "dev" component is replaced with the pair of "alpha.$buildId"
   components. Any other pre-release components are kept.
2. Non-master branches are built as "alpha" versions, using the next patch version above what is specified in package.json.
   The version number takes the form 1.2.3-beta.branch-$branchSlug.$buildId. Package.json should include "dev" as a component in the pre-release
   version component, or an error is generated, failing the build. The "dev" component is replaced with the triplet of "beta.branch-$branchSlug.$buildId"
   components. Any other pre-release components are kept.

Typical work flow is:

1. Create a new branch for each work item. If there is an issue or other ticket for the work item, the branch name would be of the form
   "ticket/\${id}" with an optional short identifier like "ticket/123-fix-timeouts".
2. Once your work is ready to promote, get it merged into master. This merge should include an appropriate change to the version number. If
   there is a conflict with the change to the version number, it likely indicates a conflict in the code as well.
3. When master is ready to release, merge it into the "release" branch, make one more commit on that branch with the correct version string,
   (i.e., remove the "-dev" pre-release component) and push it. The github actions pipeline for the "release" branch will run the build and
   verification on it, then create a tag for it, and publish it.

## Publishing From Branches

Release versions should be published from the "release" branch. This should only include releases and release-candidates, i.e., no pre-release
component of the version string, or a pre-release component that starts with an "RC" element, followed by a numeric element.

If you want to publish from other branches, you can configure branch name patterns to publish from.
