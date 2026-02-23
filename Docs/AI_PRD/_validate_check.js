const fs = require('fs');
const path = require('path');

const SPECS_ROOT = 'c:/workspace/PRD/Docs/AI_PRD/specs';
const TASKS_ROOT = 'c:/workspace/PRD/Docs/AI_PRD/tasks';

function walkDir(dir, fileList = []) {
    fs.readdirSync(dir).forEach((f) => {
        const fp = path.join(dir, f);
        if (fs.statSync(fp).isDirectory()) walkDir(fp, fileList);
        else if (f.endsWith('.md') && f !== 'README.md' && f !== 'INDEX.md') fileList.push(fp);
    });
    return fileList;
}

const allFiles = walkDir(SPECS_ROOT);

function parseFM(fp) {
    const content = fs.readFileSync(fp, 'utf8');
    const m = content.match(/^---\r?\n([\s\S]*?)\r?\n---/);
    if (!m) return { raw: content, fm: null };
    return { raw: content, fm: m[1] };
}

function extractRelated(fmStr) {
    const refs = [];
    if (!fmStr) return refs;
    for (const line of fmStr.split(/\r?\n/)) {
        const m = line.match(/^\s+-\s+specs\/(.+)$/);
        if (m) refs.push('specs/' + m[1]);
    }
    return refs;
}

function specExists(relPath) {
    return fs.existsSync(path.join(path.dirname(SPECS_ROOT), relPath));
}

const deadLinks = [],
    missingFM = [],
    tables = {},
    dupTables = [];

allFiles.forEach((fp) => {
    const { raw, fm } = parseFM(fp);
    const rel = path.relative(SPECS_ROOT, fp).replace(/\\/g, '/');
    if (!fm) {
        missingFM.push({ file: rel, issue: 'No frontmatter' });
        return;
    }
    const typeM = fm.match(/^type:\s*(.+)/m);
    const phaseM = fm.match(/^phase:\s*(.+)/m);
    if (!typeM) missingFM.push({ file: rel, issue: 'Missing type' });
    if (!phaseM) missingFM.push({ file: rel, issue: 'Missing phase' });
    const type = typeM ? typeM[1].trim() : '';
    if (type === 'db') {
        const tableM = fm.match(/^table:\s*(.+)/m);
        if (!tableM) missingFM.push({ file: rel, issue: 'Missing table' });
        else {
            const t = tableM[1].trim();
            if (!tables[t]) tables[t] = [];
            tables[t].push(rel);
        }
    }
    if (type === 'api') {
        const m2 = fm.match(/^endpoint:\s*(.+)/m);
        if (!m2) missingFM.push({ file: rel, issue: 'Missing endpoint' });
    }
    if (type === 'ui') {
        const m2 = fm.match(/^screen:\s*(.+)/m);
        if (!m2) missingFM.push({ file: rel, issue: 'Missing screen' });
    }
    extractRelated(fm).forEach((r) => {
        if (!specExists(r)) deadLinks.push({ file: rel, ref: r });
    });
});

Object.entries(tables).forEach(([t, files]) => {
    if (files.length > 1) dupTables.push({ table: t, files });
});

// Bidirectional
let bidirCount = 0;
allFiles.forEach((fp) => {
    const { fm } = parseFM(fp);
    if (!fm) return;
    const rel = path.relative(SPECS_ROOT, fp).replace(/\\/g, '/');
    const myPath = 'specs/' + rel;
    extractRelated(fm).forEach((r) => {
        const abs = path.join(path.dirname(SPECS_ROOT), r);
        if (!fs.existsSync(abs)) return;
        const { fm: tfm } = parseFM(abs);
        if (!tfm) return;
        if (!extractRelated(tfm).includes(myPath)) bidirCount++;
    });
});

// UI sections
const uiIssues = [];
allFiles
    .filter((f) => f.includes('/ui/') && !f.includes('_shared'))
    .forEach((fp) => {
        const { raw } = parseFM(fp);
        const rel = path.relative(SPECS_ROOT, fp).replace(/\\/g, '/');
        ['## 개요', '## 레이아웃', '## 컴포넌트', '## 상호작용', '## 상태'].forEach((sec) => {
            if (!raw.includes(sec)) uiIssues.push({ file: rel, missing: sec });
        });
    });

// Tasks
const taskFiles = walkDir(TASKS_ROOT);
const specRefsInTasks = new Set();
const taskIssues = [];
taskFiles.forEach((fp) => {
    const content = fs.readFileSync(fp, 'utf8');
    const rel = path.relative(TASKS_ROOT, fp).replace(/\\/g, '/');
    const m = content.match(/^---\r?\n([\s\S]*?)\r?\n---/);
    if (!m) return;
    const fm = m[1];
    const phaseM = fm.match(/^phase:\s*(.+)/m);
    if (phaseM && !rel.startsWith(phaseM[1].trim() + '/')) taskIssues.push({ file: rel, issue: 'Phase mismatch' });
    fm.split(/\r?\n/).forEach((line) => {
        const sm = line.match(/^\s+-\s+(.+\.md)$/);
        if (sm) specRefsInTasks.add(sm[1].trim());
    });
});

// Orphans
let orphanCount = 0;
allFiles.forEach((fp) => {
    const rel = path.relative(SPECS_ROOT, fp).replace(/\\/g, '/');
    const parts = rel.split('/');
    if (parts.length < 3) return;
    const file = parts.slice(1).join('/');
    if (![...specRefsInTasks].some((r) => r.endsWith(file) || r === file)) orphanCount++;
});

console.log(
    JSON.stringify(
        {
            total: allFiles.length,
            dup_tables: dupTables,
            dead_links: deadLinks,
            bidir_missing: bidirCount,
            missing_fm: missingFM,
            ui_issues: uiIssues,
            task_issues: taskIssues,
            orphan_count: orphanCount,
        },
        null,
        2,
    ),
);
