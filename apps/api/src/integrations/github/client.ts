import crypto from "crypto";

import type {
  GitHubBranch,
  GitHubCommit,
  GitHubPullRequest,
  GitHubRepository,
} from "../../modules/projectGit/types.js";

const GITHUB_API_URL = "https://api.github.com";

const getRequiredEnv = (key: string) => {
  const value = process.env[key];

  if (!value) {
    throw new Error(`${key} is not configured.`);
  }

  return value;
};

const normalizePrivateKey = (value: string) => {
  return value
    .trim()
    .replace(/^["']|["']$/g, "")
    .replace(/\\n/g, "\n")
    .replace(/\r\n/g, "\n")
    .replace(/\r/g, "\n");
};

const base64UrlEncode = (value: string) => {
  return Buffer.from(value)
    .toString("base64")
    .replace(/\+/g, "-")
    .replace(/\//g, "_")
    .replace(/=+$/g, "");
};

const createGitHubAppJWT = () => {
  const appId = getRequiredEnv("GITHUB_APP_ID");

  const privateKey = normalizePrivateKey(
    getRequiredEnv("GITHUB_APP_PRIVATE_KEY"),
  );

  const now = Math.floor(Date.now() / 1000);

  const header = {
    alg: "RS256",
    typ: "JWT",
  };

  const payload = {
    iat: now - 60,
    exp: now + 9 * 60,
    iss: appId,
  };

  const encodedHeader = base64UrlEncode(JSON.stringify(header));

  const encodedPayload = base64UrlEncode(JSON.stringify(payload));

  const unsignedToken = `${encodedHeader}.${encodedPayload}`;

  const signer = crypto.createSign("RSA-SHA256");

  signer.update(unsignedToken);
  signer.end();

  const signature = signer
    .sign(privateKey)
    .toString("base64")
    .replace(/\+/g, "-")
    .replace(/\//g, "_")
    .replace(/=+$/g, "");

  return `${unsignedToken}.${signature}`;
};

const githubRequest = async <T>(path: string, options: RequestInit = {}) => {
  const response = await fetch(`${GITHUB_API_URL}${path}`, {
    ...options,
    headers: {
      Accept: "application/vnd.github+json",
      "X-GitHub-Api-Version": "2022-11-28",
      ...(options.headers ?? {}),
    },
  });

  if (!response.ok) {
    const errorText = await response.text();

    throw new Error(`GitHub API error (${response.status}): ${errorText}`);
  }

  return response.json() as Promise<T>;
};

export const githubClient = {
  async createInstallationToken(installationId: number) {
    const jwt = createGitHubAppJWT();

    const response = await githubRequest<{
      token: string;
      expires_at: string;
    }>(`/app/installations/${installationId}/access_tokens`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${jwt}`,
      },
    });

    return response;
  },

  async getInstallationRepositories(installationId: number) {
    const { token } = await this.createInstallationToken(installationId);

    return githubRequest<{
      total_count: number;
      repositories: GitHubRepository[];
    }>("/installation/repositories?per_page=100", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
  },

  async getBranches(installationId: number, owner: string, repository: string) {
    const { token } = await this.createInstallationToken(installationId);

    return githubRequest<GitHubBranch[]>(
      `/repos/${encodeURIComponent(owner)}/${encodeURIComponent(
        repository,
      )}/branches?per_page=100`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      },
    );
  },

  async getCommits(installationId: number, owner: string, repository: string) {
    const { token } = await this.createInstallationToken(installationId);

    return githubRequest<GitHubCommit[]>(
      `/repos/${encodeURIComponent(owner)}/${encodeURIComponent(
        repository,
      )}/commits?per_page=30`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      },
    );
  },

  async getPullRequests(
    installationId: number,
    owner: string,
    repository: string,
  ) {
    const { token } = await this.createInstallationToken(installationId);

    return githubRequest<GitHubPullRequest[]>(
      `/repos/${encodeURIComponent(owner)}/${encodeURIComponent(
        repository,
      )}/pulls?state=all&sort=updated&direction=desc&per_page=30`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      },
    );
  },
};
