const fetch = require("./fetch");

if (!process.env.GITHUB_TOKEN) {
  console.error("🔴 no GITHUB_TOKEN found. pass `GITHUB_TOKEN` as env");
  process.exitCode = 1;
  return;
}
const GITHUB_TOKEN = process.env.GITHUB_TOKEN;

if (!process.env.GITHUB_REPOSITORY) {
  console.error(
    "🔴 no GITHUB_REPOSITORY found. pass `GITHUB_REPOSITORY` as env"
  );
  process.exitCode = 1;
  return;
}

if (!process.env.INPUT_REPO) {
  console.warn("💬  no `repo` name given. fall-ing back to this repo");
}

const [owner, repo] = (
  process.env.INPUT_REPO || process.env.GITHUB_REPOSITORY
).split("/");

if (!owner || !repo) {
  console.error("☠️  either owner or repo name is empty. exiting...");
  process.exitCode = 1;
  return;
}

if (!process.env.INPUT_KEEP_LATEST) {
  console.error("✋🏼  no `keep_latest` given. exiting...");
  process.exitCode = 1;
  return;
}

const keepLatest = Number(process.env.INPUT_KEEP_LATEST);

if (Number.isNaN(keepLatest) || keepLatest < 0) {
  console.error("🤮  invalid `keep_latest` given. exiting...");
  process.exitCode = 1;
  return;
}

if (keepLatest === 0) {
  console.error("🌶  given `keep_latest` is 0, this will wipe out all releases");
}

const shouldDeleteTags = process.env.INPUT_DELETE_TAGS === "true";

if (shouldDeleteTags) {
  console.log("🔖  corresponding tags also will be deleted");
}

let deletePattern = process.env.INPUT_DELETE_TAG_PATTERN;
if (deletePattern === undefined) {
  console.log("all releases will be targeted");
  deletePattern = "";
} else {
  console.log(`releases containing ${deletePattern} will be targeted`);
}

const commonOpts = {
  host: "api.github.com",
  port: 443,
  protocol: "https:",
  auth: `user:${GITHUB_TOKEN}`,
  headers: {
    "Content-Type": "application/json",
    "User-Agent": "node.js",
  },
};

async function deleteOlderReleases(keepLatest) {
  let releaseIdsAndTags = [];
  try {
    let data = await fetch({
      ...commonOpts,
      path: `/repos/${owner}/${repo}/releases?per_page=100`,
      method: "GET",
    });
    data = data || [];
    // filter for delete_pattern
    data = data.filter(
      (release) => release.tag_name.indexOf(deletePattern) !== -1
    );

    const activeReleases = data.filter(({ draft }) => !draft);
    if (activeReleases.length === 0) {
      console.log(`😕  no active releases found. exiting...`);
      return;
    }
    console.log(
      `💬  found total of ${activeReleases.length} active release(s)`
    );
    releaseIdsAndTags = activeReleases
      .map(({ id, tag_name: tagName }) => ({ id, tagName }))
      .slice(keepLatest);
  } catch (error) {
    console.error(`🌶  failed to get list of releases <- ${error.message}`);
    console.error(`exiting...`);
    process.exitCode = 1;
    return;
  }

  if (releaseIdsAndTags.length === 0) {
    console.error(`😕  no older releases found. exiting...`);
    return;
  }
  console.log(`🍻  found ${releaseIdsAndTags.length} older release(s)`);

  let hasError = false;
  for (let i = 0; i < releaseIdsAndTags.length; i++) {
    const { id: releaseId, tagName } = releaseIdsAndTags[i];

    try {
      console.log(`starting to delete ${tagName} with id ${id}`);

      const _ = await fetch({
        ...commonOpts,
        path: `/repos/${owner}/${repo}/releases/${releaseId}`,
        method: "DELETE",
      });

      if (shouldDeleteTags) {
        try {
          const _ = await fetch({
            ...commonOpts,
            path: `/repos/${owner}/${repo}/git/refs/tags/${tagName}`,
            method: "DELETE",
          });
        } catch (error) {
          console.error(
            `🌶  failed to delete tag "${tagName}"  <- ${error.message}`
          );
          hasError = true;
          break;
        }
      }
    } catch (error) {
      console.error(
        `🌶  failed to delete release with id "${releaseId}"  <- ${error.message}`
      );
      hasError = true;
      break;
    }
  }

  if (hasError) {
    process.exitCode = 1;
    return;
  }

  console.log(
    `👍🏼  ${releaseIdsAndTags.length} older release(s) deleted successfully!`
  );
}

async function run() {
  await deleteOlderReleases(keepLatest);
}

run();
