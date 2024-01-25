#!/usr/bin/env node

const exec = require("node:child_process").execSync;
const fs = require("node:fs");
const path = require("node:path");
const crypto = require("node:crypto");
const { parseArgs } = require("node:util");

const args = parseArgs({
  options: {
    version: { type: "string" },
    "dry-run": { type: "boolean", default: false },
  },
});

const dryRun = args.values["dry-run"];

if (dryRun) {
  console.log('Running in "dry-run" mode');
}

const exitWithError = (message) => {
  console.error(`Exit with error: ${message}`);
  process.exit(1);
};

if (!process.env.CI) {
  exitWithError("The script should only be run in CI");
}

exec('echo "//registry.npmjs.org/:_authToken=${NPM_TOKEN}" > ~/.npmrc');

exec('git config --global user.name "Zihua Li"');
exec('git config --global user.email "635902+luin@users.noreply.github.com"');

/*
 * Check that the git working directory is clean
 */
if (exec("git status --porcelain").length) {
  exitWithError(
    "Make sure the git working directory is clean before releasing"
  );
}

/*
 * Check that the version is valid. Also extract the dist-tag from the version.
 */
const [version, distTag] = (() => {
  const inputVersion = args.values.version;
  if (!inputVersion) {
    exitWithError('Missing required argument: "--version <version>"');
  }

  if (inputVersion === "experimental") {
    const randomId = crypto
      .randomBytes(Math.ceil(9 / 2))
      .toString("hex")
      .slice(0, 9);

    return [
      `0.0.0-experimental-${randomId}-${new Date()
        .toISOString()
        .slice(0, 10)
        .replace(/-/g, "")}`,
      "experimental",
    ];
  }

  const match = inputVersion.match(
    /^(?:[0-9]+\.){2}(?:[0-9]+)(?:-(dev|alpha|beta|rc)\.[0-9]+)?$/
  );
  if (!match) {
    exitWithError(`Invalid version: ${inputVersion}`);
  }

  return [inputVersion, match[1] || "latest"];
})();

/*
 * Get the current version
 */
const currentVersion = JSON.parse(
  fs.readFileSync("package.json", "utf-8")
).version;
console.log(
  `Releasing with version: ${currentVersion} -> ${version} and dist-tag: ${distTag}`
);

/*
 * Update version in CHANGELOG.md
 */
console.log("Updating CHANGELOG.md and bumping versions");
const changelog = fs.readFileSync("CHANGELOG.md", "utf8");
const UNRELEASED_PLACEHOLDER = "# [Unreleased]";

const index = changelog.indexOf(UNRELEASED_PLACEHOLDER);
if (index === -1) {
  exitWithError(`Could not find "${UNRELEASED_PLACEHOLDER}" in CHANGELOG.md`);
}
let nextVersionIndex = changelog.indexOf("\n# ", index);
if (nextVersionIndex === -1) {
  nextVersionIndex = changelog.length - 1;
}

const releaseNots = changelog
  .substring(index + UNRELEASED_PLACEHOLDER.length, nextVersionIndex)
  .trim();

fs.writeFileSync(
  "CHANGELOG.md",
  changelog.replace(
    UNRELEASED_PLACEHOLDER,
    `${UNRELEASED_PLACEHOLDER}\n\n# ${version}`
  )
);

/*
 * Bump npm versions
 */
exec("git add CHANGELOG.md");
exec(`npm version ${version} --workspaces --force`);
exec("git add **/package.json");
exec(`npm version ${version} --include-workspace-root --force`);

const pushCommand = `git push origin ${process.env.GITHUB_REF_NAME} --follow-tags`;
if (distTag === "experimental") {
  console.log(`Skipping: "${pushCommand}" for experimental version`);
} else {
  if (dryRun) {
    console.log(`Skipping: "${pushCommand}" in dry-run mode`);
  } else {
    exec(pushCommand);
  }
}

/*
 * Build Quill package
 */
console.log("Building Quill");
exec("npm run build:quill");

/*
 * Publish Quill package
 */
console.log("Publishing Quill");
const distFolder = "packages/quill/dist";
if (
  JSON.parse(fs.readFileSync(path.join(distFolder, "package.json"), "utf-8"))
    .version !== version
) {
  exitWithError("Version mismatch between package.json and dist/package.json");
}

exec(`npm publish --tag ${distTag}${dryRun ? " --dry-run" : ""}`, {
  cwd: distFolder,
});

/*
 * Create GitHub release
 */
if (distTag === "experimental") {
  console.log("Skipping GitHub release for experimental version");
} else {
  const filename = `release-note-${version}-${(Math.random() * 1000) | 0}.txt`;
  fs.writeFileSync(filename, releaseNots);
  try {
    const prereleaseFlag = distTag === "latest" ? "--latest" : " --prerelease";
    const releaseCommand = `gh release create v${version} ${prereleaseFlag} -t "Version ${version}" --notes-file "${filename}"`;
    if (dryRun) {
      console.log(`Skipping: "${releaseCommand}" in dry-run mode`);
      console.log(`Release note:\n${releaseNots}`);
    } else {
      exec(releaseCommand);
    }
  } finally {
    fs.unlinkSync(filename);
  }
}

/*
 * Create npm package tarball
 */
exec("npm pack", { cwd: distFolder });
