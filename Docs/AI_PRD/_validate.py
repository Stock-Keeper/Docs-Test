"""PRD Validation Script - Full Specs Check"""
import os, re, glob, json
from pathlib import Path
from collections import defaultdict

SPECS_DIR = r'c:\workspace\PRD\Docs\AI_PRD\specs'
TASKS_DIR = r'c:\workspace\PRD\Docs\AI_PRD\tasks'

def parse_frontmatter(filepath):
    """Parse YAML-like frontmatter from a markdown file."""
    with open(filepath, 'r', encoding='utf-8') as f:
        content = f.read()
    
    fm = {}
    if not content.startswith('---'):
        return fm, content
    
    parts = content.split('---', 2)
    if len(parts) < 3:
        return fm, content
    
    yaml_text = parts[1]
    body = parts[2]
    
    # Simple YAML parser for our needs
    current_key = None
    current_subkey = None
    for line in yaml_text.split('\n'):
        line = line.rstrip('\r')
        stripped = line.strip()
        if not stripped or stripped.startswith('#'):
            continue
        
        # Top-level key: value
        m = re.match(r'^(\w[\w_-]*)\s*:\s*(.*)', line)
        if m and not line.startswith(' '):
            key, val = m.group(1), m.group(2).strip()
            current_key = key
            current_subkey = None
            if val:
                fm[key] = val
            else:
                fm[key] = {}
            continue
        
        # Sub-key (4 spaces)
        m = re.match(r'^    (\w[\w_-]*)\s*:\s*(.*)', line)
        if m:
            subkey, val = m.group(1), m.group(2).strip()
            current_subkey = subkey
            if isinstance(fm.get(current_key), dict):
                if val:
                    fm[current_key][subkey] = val
                else:
                    fm[current_key][subkey] = []
            continue
        
        # List item (8 spaces)
        m = re.match(r'^        - (.*)', line)
        if m:
            val = m.group(1).strip()
            if current_key and current_subkey:
                if isinstance(fm.get(current_key), dict):
                    if isinstance(fm[current_key].get(current_subkey), list):
                        fm[current_key][current_subkey].append(val)
            continue
        
        # List item (4 spaces, for simple lists)
        m = re.match(r'^    - (.*)', line)
        if m:
            val = m.group(1).strip()
            if current_key and isinstance(fm.get(current_key), list):
                fm[current_key].append(val)
            elif current_key and isinstance(fm.get(current_key), dict) and current_subkey:
                pass  # Already handled
            continue
    
    return fm, body

def get_spec_type(relpath):
    """Determine spec type from path."""
    if relpath.startswith('api\\') or relpath.startswith('api/'):
        return 'api'
    elif relpath.startswith('db\\') or relpath.startswith('db/'):
        return 'db'
    elif relpath.startswith('ui\\') or relpath.startswith('ui/'):
        return 'ui'
    return 'unknown'

# ============================================================================
# 1. Collect all spec files
# ============================================================================
print("=" * 70)
print("PHASE 1: Collecting spec files")
print("=" * 70)

all_specs = {}
for root, dirs, files in os.walk(SPECS_DIR):
    for f in files:
        if f.endswith('.md') and f != 'INDEX.md':
            fullpath = os.path.join(root, f)
            relpath = os.path.relpath(fullpath, SPECS_DIR)
            fm, body = parse_frontmatter(fullpath)
            all_specs[relpath] = {
                'fullpath': fullpath,
                'relpath': relpath,
                'fm': fm,
                'body': body,
                'type': get_spec_type(relpath)
            }

print(f"Total spec files: {len(all_specs)}")
api_count = sum(1 for s in all_specs.values() if s['type'] == 'api')
db_count = sum(1 for s in all_specs.values() if s['type'] == 'db')
ui_count = sum(1 for s in all_specs.values() if s['type'] == 'ui')
print(f"  API: {api_count}, DB: {db_count}, UI: {ui_count}")

# ============================================================================
# 2. Frontmatter Validation
# ============================================================================
print("\n" + "=" * 70)
print("PHASE 2: Frontmatter validation")
print("=" * 70)

fm_issues = []
for relpath, spec in all_specs.items():
    fm = spec['fm']
    stype = spec['type']
    
    # Check required fields
    if 'type' not in fm:
        fm_issues.append(f"  {relpath}: missing 'type'")
    if 'phase' not in fm:
        fm_issues.append(f"  {relpath}: missing 'phase'")
    
    if stype == 'api':
        for field in ['method', 'endpoint', 'auth']:
            if field not in fm:
                fm_issues.append(f"  {relpath}: missing '{field}'")
    elif stype == 'db':
        if 'table' not in fm:
            fm_issues.append(f"  {relpath}: missing 'table'")
    elif stype == 'ui':
        if 'screen' not in fm:
            fm_issues.append(f"  {relpath}: missing 'screen'")

if fm_issues:
    print(f"Frontmatter issues: {len(fm_issues)}")
    for issue in fm_issues:
        print(issue)
else:
    print("Frontmatter: All OK")

# ============================================================================
# 3. Dead Link Detection
# ============================================================================
print("\n" + "=" * 70)
print("PHASE 3: Dead link detection")
print("=" * 70)

dead_links = []
for relpath, spec in all_specs.items():
    fm = spec['fm']
    related = fm.get('related', {})
    
    if isinstance(related, dict):
        for category, refs in related.items():
            if isinstance(refs, list):
                for ref in refs:
                    # Normalize the reference path
                    ref_normalized = ref.replace('/', '\\')
                    # Check if it starts with specs/
                    if ref_normalized.startswith('specs\\'):
                        ref_normalized = ref_normalized[6:]  # Remove 'specs\'
                    
                    ref_fullpath = os.path.join(SPECS_DIR, ref_normalized)
                    if not os.path.exists(ref_fullpath):
                        dead_links.append(f"  {relpath} -> {ref} (NOT FOUND)")
    
    # Also check body for relative links
    body = spec['body']
    for m in re.finditer(r'`\.\./.*?\.md`|`\.\.\\.*?\.md`', body):
        link = m.group(0).strip('`')
        link_abs = os.path.normpath(os.path.join(os.path.dirname(spec['fullpath']), link))
        if not os.path.exists(link_abs):
            dead_links.append(f"  {relpath} (body) -> {link} (NOT FOUND)")

if dead_links:
    print(f"Dead links: {len(dead_links)}")
    for dl in dead_links:
        print(dl)
else:
    print("Dead links: None found")

# ============================================================================
# 4. Duplicate Detection
# ============================================================================
print("\n" + "=" * 70)
print("PHASE 4: Duplicate detection")
print("=" * 70)

# Duplicate table names
table_map = defaultdict(list)
for relpath, spec in all_specs.items():
    if spec['type'] == 'db':
        table = spec['fm'].get('table', '')
        if table:
            table_map[table].append(relpath)

dup_tables = {t: paths for t, paths in table_map.items() if len(paths) > 1}
if dup_tables:
    print(f"Duplicate tables: {len(dup_tables)}")
    for table, paths in dup_tables.items():
        print(f"  {table}: {', '.join(paths)}")
else:
    print("Duplicate tables: None")

# Duplicate endpoints
endpoint_map = defaultdict(list)
for relpath, spec in all_specs.items():
    if spec['type'] == 'api':
        method = spec['fm'].get('method', '')
        endpoint = spec['fm'].get('endpoint', '')
        if method and endpoint:
            key = f"{method} {endpoint}"
            endpoint_map[key].append(relpath)

dup_endpoints = {e: paths for e, paths in endpoint_map.items() if len(paths) > 1}
if dup_endpoints:
    print(f"Duplicate endpoints: {len(dup_endpoints)}")
    for ep, paths in dup_endpoints.items():
        print(f"  {ep}: {', '.join(paths)}")
else:
    print("Duplicate endpoints: None")

# ============================================================================
# 5. Bidirectional Reference Check
# ============================================================================
print("\n" + "=" * 70)
print("PHASE 5: Bidirectional reference check")
print("=" * 70)

missing_bidir = []
for relpath, spec in all_specs.items():
    fm = spec['fm']
    related = fm.get('related', {})
    
    if isinstance(related, dict):
        for category, refs in related.items():
            if isinstance(refs, list):
                for ref in refs:
                    ref_normalized = ref.replace('/', '\\')
                    if ref_normalized.startswith('specs\\'):
                        ref_normalized = ref_normalized[6:]
                    
                    # Check if the target file references back
                    if ref_normalized in all_specs:
                        target = all_specs[ref_normalized]
                        target_related = target['fm'].get('related', {})
                        
                        # Build full path for current spec
                        my_ref_variants = [
                            f"specs/{relpath.replace(chr(92), '/')}",
                            relpath.replace('\\', '/'),
                        ]
                        
                        found_back = False
                        if isinstance(target_related, dict):
                            for tcat, trefs in target_related.items():
                                if isinstance(trefs, list):
                                    for tref in trefs:
                                        tref_normalized = tref.replace('\\', '/')
                                        for variant in my_ref_variants:
                                            if tref_normalized == variant or tref_normalized.endswith(variant):
                                                found_back = True
                                                break
                                        if found_back:
                                            break
                                if found_back:
                                    break
                        
                        if not found_back:
                            missing_bidir.append(f"  {relpath} -> {ref} (no back-reference)")

if missing_bidir:
    print(f"Missing bidirectional references: {len(missing_bidir)}")
    for mb in missing_bidir[:30]:  # Limit output
        print(mb)
    if len(missing_bidir) > 30:
        print(f"  ... and {len(missing_bidir) - 30} more")
else:
    print("Bidirectional references: All OK")

# ============================================================================
# 6. UI Required Sections Check
# ============================================================================
print("\n" + "=" * 70)
print("PHASE 6: UI required sections")
print("=" * 70)

ui_section_issues = []
required_sections = ['개요', '레이아웃', '컴포넌트', '상호작용', '상태']

for relpath, spec in all_specs.items():
    if spec['type'] != 'ui':
        continue
    body = spec['body']
    missing_sections = []
    for section in required_sections:
        if f'## {section}' not in body and f'# {section}' not in body:
            missing_sections.append(section)
    if missing_sections:
        ui_section_issues.append(f"  {relpath}: missing [{', '.join(missing_sections)}]")

if ui_section_issues:
    print(f"UI section issues: {len(ui_section_issues)}")
    for issue in ui_section_issues:
        print(issue)
else:
    print("UI required sections: All OK")

# ============================================================================
# 7. Tasks Spec Reference Validation
# ============================================================================
print("\n" + "=" * 70)
print("PHASE 7: Tasks spec reference validation")
print("=" * 70)

task_issues = []
task_specs = set()

for root, dirs, files in os.walk(TASKS_DIR):
    for f in files:
        if f.endswith('.md') and f != 'README.md':
            taskpath = os.path.join(root, f)
            task_relpath = os.path.relpath(taskpath, TASKS_DIR)
            fm, body = parse_frontmatter(taskpath)
            
            specs_refs = fm.get('specs', {})
            if isinstance(specs_refs, dict):
                for category, refs in specs_refs.items():
                    if isinstance(refs, list):
                        for ref in refs:
                            # task refs use format like "community/feed-list.md"
                            # which maps to specs/{category}/{ref}
                            full_ref = f"{category}\\{ref.replace('/', chr(92))}"
                            task_specs.add(full_ref)
                            
                            ref_fullpath = os.path.join(SPECS_DIR, category, ref.replace('/', '\\'))
                            if not os.path.exists(ref_fullpath):
                                task_issues.append(f"  {task_relpath}: {category}/{ref} (NOT FOUND)")

if task_issues:
    print(f"Task dead references: {len(task_issues)}")
    for issue in task_issues:
        print(issue)
else:
    print("Task spec references: All OK")

# Orphan specs (specs not referenced by any task)
all_spec_paths = set()
for relpath in all_specs:
    all_spec_paths.add(relpath)

# Normalize task_specs    
task_specs_normalized = set()
for ts in task_specs:
    task_specs_normalized.add(ts.replace('/', '\\'))

orphan_specs = all_spec_paths - task_specs_normalized
# Filter out _shared/common files
orphan_specs = {s for s in orphan_specs if '_shared' not in s}

print(f"\nOrphan specs (not in any task): {len(orphan_specs)}")
for orphan in sorted(orphan_specs):
    print(f"  {orphan}")

# ============================================================================
# SUMMARY
# ============================================================================
print("\n" + "=" * 70)
print("SUMMARY")
print("=" * 70)
print(f"Total spec files: {len(all_specs)} (API: {api_count}, DB: {db_count}, UI: {ui_count})")
print(f"Frontmatter issues: {len(fm_issues)}")
print(f"Dead links: {len(dead_links)}")
print(f"Duplicate tables: {len(dup_tables)}")
print(f"Duplicate endpoints: {len(dup_endpoints)}")
print(f"Missing bidirectional refs: {len(missing_bidir)}")
print(f"UI section issues: {len(ui_section_issues)}")
print(f"Task dead references: {len(task_issues)}")
print(f"Orphan specs: {len(orphan_specs)}")
