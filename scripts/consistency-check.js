#!/usr/bin/env node
/**
 * DogLife Repository Consistency Check
 *
 * 全リポジトリを巡回して不整合を検出
 */

const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

const REPOS = {
  uxDesign: 'doglife-one/doglife-ux-design',
  projectManagement: 'doglife-one/doglife-project-management',
  app: 'doglife-one/doglife-app'
};

const problems = [];
const warnings = [];

// ========== Helper Functions ==========

function ghApi(endpoint) {
  try {
    const result = execSync(`gh api ${endpoint}`, { encoding: 'utf-8' });
    return JSON.parse(result);
  } catch (e) {
    console.error(`API Error: ${endpoint}`);
    return null;
  }
}

function ghRepoContent(repo, path) {
  try {
    const result = execSync(
      `gh api repos/${repo}/contents/${path}`,
      { encoding: 'utf-8' }
    );
    return JSON.parse(result);
  } catch {
    return null;
  }
}

function listFiles(repo, dir) {
  const content = ghRepoContent(repo, dir);
  if (!content || !Array.isArray(content)) return [];
  return content.map(f => f.name);
}

function fileExists(repo, filePath) {
  return ghRepoContent(repo, filePath) !== null;
}

// ========== Check Functions ==========

/**
 * 1. Epic ID整合性チェック
 * EPIC_IDS.md の定義 vs GitHub Issues
 */
async function checkEpicIds() {
  console.log('Checking Epic IDs...');

  // 定義されたEpic ID (EPIC_IDS.mdから)
  const definedEpics = [
    'AUTH-01', 'SEC-01', 'SEARCH-01', 'FACILITY-01', 'BOOK-01',
    'PAY-01', 'DOG-01', 'USER-01', 'NOTIFY-01', 'SEO-01', 'SUPPORT-01',
    'PARTNER-01', 'OPS-01',
    'TMS-01', 'TMS-02', 'TMS-03', 'TMS-04',
    'B01', 'B02', 'B03', 'B04'
  ];

  // GitHub Issuesから取得
  const issues = ghApi(`repos/${REPOS.projectManagement}/issues?labels=epic&state=all&per_page=100`);
  if (!issues) return;

  const issueEpics = issues.map(i => {
    const match = i.title.match(/^([A-Z]+-\d+|[A-Z]\d+):/);
    return match ? match[1] : null;
  }).filter(Boolean);

  // 定義にあるがIssueにない
  for (const epic of definedEpics) {
    if (!issueEpics.includes(epic)) {
      warnings.push(`Epic ${epic} は定義されているがIssueが存在しない`);
    }
  }

  // Issueにあるが定義にない
  for (const epic of issueEpics) {
    if (!definedEpics.includes(epic)) {
      problems.push(`Epic ${epic} はIssueにあるがEPIC_IDS.mdに未定義`);
    }
  }
}

/**
 * 2. Journey YAML↔MD整合性チェック
 */
async function checkJourneyFiles() {
  console.log('Checking Journey files...');

  const categories = ['user', 'admin', 'partner'];

  for (const cat of categories) {
    const dir = `journeys/travel/${cat}`;
    const files = listFiles(REPOS.uxDesign, dir);

    const yamlFiles = files.filter(f => f.endsWith('.yaml')).map(f => f.replace('.yaml', ''));
    const mdFiles = files.filter(f => f.endsWith('.md') && f !== 'README.md').map(f => f.replace('.md', ''));

    // YAMLはあるがMDがない
    for (const yaml of yamlFiles) {
      // J001_xxx.yaml → J001_xxx_diagram.md or J001_xxx.md のパターン
      const hasMatchingMd = mdFiles.some(md =>
        md === yaml || md === `${yaml}_diagram` || md.startsWith(yaml.split('_')[0])
      );
      if (!hasMatchingMd) {
        problems.push(`Journey ${yaml}.yaml に対応する .md がない (${cat}/)`);
      }
    }
  }
}

/**
 * 3. Blueprint整合性チェック
 */
async function checkBlueprintFiles() {
  console.log('Checking Blueprint files...');

  const categories = ['user', 'admin', 'partner'];

  for (const cat of categories) {
    const dir = `blueprints/travel/${cat}`;
    const files = listFiles(REPOS.uxDesign, dir);

    if (files.length === 0 && cat !== 'user') {
      // user以外で空は警告
      if (!fileExists(REPOS.uxDesign, `${dir}/README.md`)) {
        warnings.push(`Blueprint ${cat}/ ディレクトリにREADME.mdがない`);
      }
    }
  }
}

/**
 * 4. Story整合性チェック
 */
async function checkStoryFiles() {
  console.log('Checking Story files...');

  const categories = ['user', 'admin', 'partner'];

  for (const cat of categories) {
    const dir = `stories/travel/${cat}`;

    if (!fileExists(REPOS.uxDesign, `${dir}/README.md`)) {
      problems.push(`Story ${cat}/ にREADME.mdがない`);
    }
  }
}

/**
 * 5. ID命名規則チェック
 */
async function checkIdNaming() {
  console.log('Checking ID naming conventions...');

  // Journey IDs
  const journeyDirs = {
    'user': { min: 1, max: 99 },
    'admin': { min: 200, max: 299 },
    'partner': { min: 300, max: 399 }
  };

  for (const [cat, range] of Object.entries(journeyDirs)) {
    const dir = `journeys/travel/${cat}`;
    const files = listFiles(REPOS.uxDesign, dir);

    for (const file of files) {
      if (file === 'README.md') continue;
      const match = file.match(/^J(\d+)/);
      if (match) {
        const num = parseInt(match[1], 10);
        if (num < range.min || num > range.max) {
          problems.push(`Journey ${file} のIDが範囲外 (${cat}: ${range.min}-${range.max})`);
        }
      }
    }
  }
}

/**
 * 6. サイドバーリンク切れチェック
 */
async function checkSidebarLinks() {
  console.log('Checking sidebar links...');

  // _sidebar.md を取得
  const sidebarContent = ghRepoContent(REPOS.uxDesign, '_sidebar.md');
  if (!sidebarContent || !sidebarContent.content) return;

  const content = Buffer.from(sidebarContent.content, 'base64').toString('utf-8');
  const linkRegex = /\[.*?\]\((.*?)\)/g;
  let match;

  const links = [];
  while ((match = linkRegex.exec(content)) !== null) {
    const link = match[1];
    if (!link.startsWith('http') && !link.startsWith('/')) {
      links.push(link);
    }
  }

  // サンプルチェック（全件は時間がかかるので最初の20件）
  const sampleLinks = links.slice(0, 20);
  for (const link of sampleLinks) {
    if (!fileExists(REPOS.uxDesign, link)) {
      problems.push(`サイドバーのリンク切れ: ${link}`);
    }
  }
}

/**
 * 7. CLAUDE.md存在チェック
 */
async function checkClaudeMd() {
  console.log('Checking CLAUDE.md in repos...');

  for (const [name, repo] of Object.entries(REPOS)) {
    if (!fileExists(repo, 'CLAUDE.md')) {
      warnings.push(`${repo} にCLAUDE.mdがない`);
    }
  }
}

// ========== Main ==========

async function main() {
  console.log('🔍 Starting consistency check...\n');

  await checkEpicIds();
  await checkJourneyFiles();
  await checkBlueprintFiles();
  await checkStoryFiles();
  await checkIdNaming();
  await checkSidebarLinks();
  await checkClaudeMd();

  // レポート生成
  let report = `# 整合性チェックレポート\n\n`;
  report += `実行日時: ${new Date().toISOString()}\n\n`;

  if (problems.length === 0 && warnings.length === 0) {
    report += `## ✅ 問題なし\n\n`;
    report += `全てのチェックをパスしました。\n`;
    console.log('\n✅ All checks passed!');
  } else {
    if (problems.length > 0) {
      report += `## 🔴 問題 (${problems.length}件)\n\n`;
      for (const p of problems) {
        report += `- ${p}\n`;
      }
      report += '\n';
    }

    if (warnings.length > 0) {
      report += `## 🟡 警告 (${warnings.length}件)\n\n`;
      for (const w of warnings) {
        report += `- ${w}\n`;
      }
      report += '\n';
    }

    console.log(`\n🔴 Found ${problems.length} problems, ${warnings.length} warnings`);
  }

  report += `---\n\n`;
  report += `🤖 自動生成 by [Consistency Check](https://github.com/doglife-one/.github/actions)\n`;

  fs.writeFileSync('consistency-report.md', report);
  console.log('\nReport saved to consistency-report.md');

  // 問題があれば終了コード1
  if (problems.length > 0) {
    process.exit(1);
  }
}

main().catch(e => {
  console.error(e);
  process.exit(1);
});
