import { $ } from "execa";

async function configGit() {
  await $`git config --global user.name ${"SagarTrimukhe"}`;
  await $`git config --global user.email ${"sagarltrimukhe@gmail.com"}`;
}

export default configGit;
