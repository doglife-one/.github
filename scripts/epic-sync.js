#!/usr/bin/env node
/**
 * Epic Sync: ux-design/epics/*.yaml → app Issues
 *
 * ux-designのEpic定義からappリポジトリにIssueを作成/更新
 */

const { execSync } = require('child_process');
const fs = require('fs');
const yaml = require('yaml');

const UX_REPO = 'doglife-one/doglife-ux-design';
const APP_REPO = 'doglife-one/doglife-app';

const dryRun = process.env.DRY_RUN === 'true';
const targetEpicId = process.env.EPIC_ID || null;

const results = {
  created: [],
  updated: [],
  skipped: [],
  errors: []
};

// ========== Helper Functions ==========

function ghApi(endpoint, method = 'GET', data = null) {
  try {
    let cmd = `gh api ${endpoint}`;
    if (method !== 'GET') {
      cmd = `gh api -X ${method} ${endpoint}`;
    }
    if (data) {
      cmd += ` -f ${Object.entries(data).map(([k, v]) => `${k}='${v}'`).join(' -f ')}`;
    }
    const result = execSync(cmd, { encoding: 'utf-8' });
    return JSON.parse(result);
  } catch (e) {
    return null;
  }
}

function getEpicFiles() {
  try {
    const result = execSync(
      `gh api repos/${UX_REPO}/contents/epics --jq '[.[] | select(.name | endswith(".yaml")) | .name]'`,
      { encoding: 'utf-8' }
    );
    return JSON.parse(result);
  } catch {
    return [];
  }
}

function getEpicContent(filename) {
  try {
    const result = execSync(
      `gh api repos/${UX_REPO}/contents/epics/${filename} --jq '.content' | base64 -d`,
      { encoding: 'utf-8', shell: true }
    );
    return yaml.parse(result);
  } catch (e) {
    console.error(`Failed to get ${filename}:`, e.message);
    return null;
  }
}

function findExistingIssue(epicId) {
  try {
    const result = execSync(
      `gh issue list --repo ${APP_REPO} --search "in:title ${epicId}:" --json number,title --limit 1`,
      { encoding: 'utf-8' }
    );
    const issues = JSON.parse(result);
    return issues.length > 0 ? issues[0] : null;
  } catch {
    return null;
  }
}

function createIssueBody(epic) {
  let body = `## 概要\n\n${epic.description}\n\n`;

  body += `## 対象ロール\n\n`;
  for (const t of epic.target || []) {
    body += `- ${t}\n`;
  }
  body += '\n';

  if (epic.acceptance_criteria && epic.acceptance_criteria.length > 0) {
    body += `## 受け入れ基準\n\n`;
    for (const ac of epic.acceptance_criteria) {
      body += `- [ ] ${ac}\n`;
    }
    body += '\n';
  }

  if (epic.stories && epic.stories.length > 0) {
    body += `## 関連Story\n\n`;
    for (const s of epic.stories) {
      body += `- ${s}\n`;
    }
    body += '\n';
  }

  if (epic.dependencies && epic.dependencies.length > 0) {
    body += `## 依存関係\n\n`;
    for (const d of epic.dependencies) {
      body += `- ${d}\n`;
    }
    body += '\n';
  }

  body += `---\n\n`;
  body += `📎 Source: [ux-design/epics/${epic.id}.yaml](https://github.com/${UX_REPO}/blob/main/epics/${epic.id}.yaml)\n`;
  body += `🤖 Auto-synced by Epic Sync\n`;

  return body;
}

function createOrUpdateIssue(epic) {
  const title = `${epic.id}: ${epic.title}`;
  const body = createIssueBody(epic);
  const labels = (epic.labels || ['epic']).join(',');

  const existing = findExistingIssue(epic.id);

  if (dryRun) {
    console.log(`[DRY RUN] Would ${existing ? 'update' : 'create'}: ${title}`);
    results.skipped.push(epic.id);
    return;
  }

  try {
    if (existing) {
      // Update existing issue
      execSync(
        `gh issue edit ${existing.number} --repo ${APP_REPO} --title "${title}" --body "${body.replace(/"/g, '\\"')}"`,
        { encoding: 'utf-8' }
      );
      console.log(`Updated: ${title} (#${existing.number})`);
      results.updated.push(epic.id);
    } else {
      // Create new issue
      execSync(
        `gh issue create --repo ${APP_REPO} --title "${title}" --body "${body.replace(/"/g, '\\"')}" --label "${labels}"`,
        { encoding: 'utf-8' }
      );
      console.log(`Created: ${title}`);
      results.created.push(epic.id);
    }
  } catch (e) {
    console.error(`Error with ${epic.id}:`, e.message);
    results.errors.push(epic.id);
  }
}

// ========== Main ==========

async function main() {
  console.log('🔄 Starting Epic Sync...\n');
  console.log(`Source: ${UX_REPO}/epics/`);
  console.log(`Target: ${APP_REPO}/issues`);
  console.log(`Dry Run: ${dryRun}\n`);

  const files = getEpicFiles();
  console.log(`Found ${files.length} Epic files\n`);

  for (const file of files) {
    const epicId = file.replace('.yaml', '');

    // 特定のEpic IDが指定されている場合はそれだけ処理
    if (targetEpicId && epicId !== targetEpicId) {
      continue;
    }

    console.log(`Processing: ${file}`);
    const epic = getEpicContent(file);

    if (!epic) {
      results.errors.push(epicId);
      continue;
    }

    createOrUpdateIssue(epic);
  }

  // Generate report
  let report = `# Epic Sync Report\n\n`;
  report += `実行日時: ${new Date().toISOString()}\n`;
  report += `Dry Run: ${dryRun}\n\n`;

  if (results.created.length > 0) {
    report += `## ✅ Created (${results.created.length})\n`;
    results.created.forEach(id => report += `- ${id}\n`);
    report += '\n';
  }

  if (results.updated.length > 0) {
    report += `## 🔄 Updated (${results.updated.length})\n`;
    results.updated.forEach(id => report += `- ${id}\n`);
    report += '\n';
  }

  if (results.skipped.length > 0) {
    report += `## ⏭️ Skipped (${results.skipped.length})\n`;
    results.skipped.forEach(id => report += `- ${id}\n`);
    report += '\n';
  }

  if (results.errors.length > 0) {
    report += `## ❌ Errors (${results.errors.length})\n`;
    results.errors.forEach(id => report += `- ${id}\n`);
    report += '\n';
  }

  fs.writeFileSync('sync-report.md', report);
  console.log('\n' + report);
}

main().catch(e => {
  console.error(e);
  process.exit(1);
});
