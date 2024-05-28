/**
 * Fetch the latest release from GitHub and prepend it to the CHANGELOG.md
 * Nothing will happen if the latest release is already in the CHANGELOG.md
 */
import { $ } from "execa";
import { readFile, writeFile } from "node:fs/promises";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";
import configGit from "./utils/configGit.mjs";

const changelogFilename = "CHANGELOG.md";

const changeLogFilePath = join(
  dirname(fileURLToPath(import.meta.url)),
  "..",
  changelogFilename
);

const currentChangeLog = await readFile(changeLogFilePath, "utf-8");

const { stdout } =
  await $`gh release list --exclude-drafts --json=tagName,publishedAt,name,isLatest`;

const release = JSON.parse(stdout).find((release) => release.isLatest);

if (currentChangeLog.includes(`# ${release.tagName}`)) {
  process.exit(0);
}

await configGit();

const normalizeReleaseNote = (note) => {
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

  return note
    .replace(/by @([-\w]+)/g, (_, username) => {
      return `by [@${username}](https://github.com/${username})`;
    })
    .trim();
};

const formatDate = (date) => {
  const str = date.toISOString();
  return str.substring(0, str.indexOf("T"));
};

const { body } = JSON.parse(
  (await $`gh release view ${release.tagName} --json=body`).stdout
);

const note = `# ${release.tagName} (${formatDate(new Date(release.publishedAt))})\n\n${normalizeReleaseNote(body)}\n\n[All changes](https://github.com/slab/quill/releases/tag/${release.tagName})\n`;

await writeFile(changeLogFilePath, `${note}\n${currentChangeLog}`);

await $`git add ${changelogFilename}`;
const message = `Update ${changelogFilename}: ${release.tagName}`;
await $`git commit -m ${message}`;
await $`git push origin main`;
