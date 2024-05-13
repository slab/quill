import { $ } from "execa";

async function configGit() {
  await $`git config --global user.name ${"Zihua Li"}`;
  await $`git config --global user.email ${"635902+luin@users.noreply.github.com"}`;
}

export default configGit;
