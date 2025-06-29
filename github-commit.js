// github-commit.js
const fetch = require("node-fetch");

async function commitToGitHub({ filePath, content, message }) {
  const repo = "changocdog/BossAI";
  const branch = "gh-pages";
  const token = process.env.GITHUB_TOKEN;

  const url = `https://api.github.com/repos/${repo}/contents/${filePath}?ref=${branch}`;

  const getRes = await fetch(url, {
    headers: { Authorization: `Bearer ${token}` }
  });

  const getData = await getRes.json();
  const sha = getData.sha;

  const commitRes = await fetch(url, {
    method: "PUT",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      message,
      content: Buffer.from(content).toString("base64"),
      sha,
      branch
    })
  });

  const commitData = await commitRes.json();
  return commitData;
}

module.exports = { commitToGitHub };