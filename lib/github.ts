/**
 * GitHub API utilities for forking repositories
 */

const GITHUB_TOKEN = process.env.GITHUB_TOKEN;
const GITHUB_ORG = process.env.GITHUB_ORG;

interface ForkResult {
  success: boolean;
  forkedUrl?: string;
  error?: string;
}

/**
 * Extract owner and repo name from a GitHub URL
 * Supports: https://github.com/owner/repo, github.com/owner/repo, owner/repo
 */
function parseGitHubUrl(url: string): { owner: string; repo: string } | null {
  try {
    // Remove trailing slashes and .git
    const cleaned = url.trim().replace(/\.git$/, "").replace(/\/$/, "");
    
    // Try to match github.com URLs
    const urlMatch = cleaned.match(/github\.com\/([^\/]+)\/([^\/]+)/);
    if (urlMatch) {
      return { owner: urlMatch[1], repo: urlMatch[2] };
    }
    
    // Try to match owner/repo format
    const shortMatch = cleaned.match(/^([^\/]+)\/([^\/]+)$/);
    if (shortMatch) {
      return { owner: shortMatch[1], repo: shortMatch[2] };
    }
    
    return null;
  } catch {
    return null;
  }
}

/**
 * Fork a GitHub repository to the configured organization
 */
export async function forkRepository(repoUrl: string): Promise<ForkResult> {
  if (!GITHUB_TOKEN) {
    return { success: false, error: "GitHub token not configured" };
  }
  
  if (!GITHUB_ORG) {
    return { success: false, error: "GitHub organization not configured" };
  }
  
  const parsed = parseGitHubUrl(repoUrl);
  if (!parsed) {
    return { success: false, error: "Invalid GitHub URL" };
  }
  
  const { owner, repo } = parsed;
  
  try {
    // Fork the repository
    const response = await fetch(
      `https://api.github.com/repos/${owner}/${repo}/forks`,
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${GITHUB_TOKEN}`,
          Accept: "application/vnd.github+json",
          "X-GitHub-Api-Version": "2022-11-28",
        },
        body: JSON.stringify({
          organization: GITHUB_ORG,
          name: `${repo}-submission`, // Add suffix to avoid conflicts
          default_branch_only: true, // Only fork the default branch
        }),
      }
    );
    
    if (!response.ok) {
      const error = await response.json();
      return { 
        success: false, 
        error: error.message || `GitHub API error: ${response.status}` 
      };
    }
    
    const data = await response.json();
    return {
      success: true,
      forkedUrl: data.html_url,
    };
  } catch (error) {
    console.error("Fork error:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Failed to fork repository",
    };
  }
}
