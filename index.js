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
  console.warn("💬 no `repo` name given. fall-ing back to this repo");
}

const [owner, repo] = (
  process.env.INPUT_REPO || process.env.GITHUB_REPOSITORY
).split("/");

if (!owner || !repo) {
  console.error("☠️ either owner or repo name is empty. exiting...");
  process.exitCode = 1;
  return;
}

let keepLatest = 0;

if (Number.isNaN(Number(process.env.INPUT_KEEP_LATEST))) {
  console.error("💣 invalid `keep_latest` given. exiting...");
  process.exitCode = 1;
  return;
} else {
  keepLatest = Number(process.env.INPUT_KEEP_LATEST);
}

if (keepLatest === 0) {
  console.error("🌶  no `keep_latest` given, will delete all releases");
}

const shouldDeleteTags = !process.env.INPUT_KEEP_TAGS;

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
