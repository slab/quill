/**
 * Fetch the latest release from GitHub and prepend it to the CHANGELOG.md
 * Nothing will happen if the latest release is already in the CHANGELOG.md
 */
import { execa } from "execa";
import { readFile, writeFile } from "node:fs/promises";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";

const changelogFilename = "CHANGELOG.md";

const changeLogFilePath = join(
  dirname(fileURLToPath(import.meta.url)),
  "..",
  changelogFilename
);

const currentChangeLog = await readFile(changeLogFilePath, "utf-8");

const { stdout } = await execa("gh", [
  "release",
  "list",
  "--exclude-drafts",
  "--json=tagName,publishedAt,name,isLatest",
]);

const release = JSON.parse(stdout).find((release) => release.isLatest);

if (currentChangeLog.includes(`# ${release.tagName}`)) {
  process.exit(0);
}

const filteredReleaseNote = (note) => {
  const ignoreSections = [
    "## new contributors",
    "## all changes",
    "## other changes",
  ];
  ignoreSections.forEach((section) => {
    const index = note.toLowerCase().indexOf(section);
    if (index > -1) {
      note = note.slice(0, index).replace(/#\s*$/, "");
    }
  });
  return note.trim();
};

const formatDate = (date) => {
  const str = date.toISOString();
  return str.substring(0, str.indexOf("T"));
};

const { body } = JSON.parse(
  (await execa("gh", ["release", "view", release.tagName, "--json=body"]))
    .stdout
);

const note = `# ${release.tagName} (${formatDate(new Date(release.publishedAt))})\n\n${filteredReleaseNote(body)}\n\n[All changes](https://github.com/quilljs/quill/releases/tag/${release.tagName})\n`;

await writeFile(changeLogFilePath, `${note}\n${currentChangeLog}`);

await execa("git", ["add", changelogFilename]);
await execa("git", [
  "commit",
  "-m",
  `Update ${changelogFilename}: ${release.tagName}`,
]);
await execa("git", ["push", "origin", "main"]);
