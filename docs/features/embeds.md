# Embed Expansion

MergDown2TeX recursively expands `![[Note]]` into your LaTeX document.

---

## How it works

```mermaid
graph TD
    A[Main Note] --> B[![[Note A]]]
    A --> C[![[Note B]]]
    B --> D[![[Sub Note 1]]]
    B --> E[![[Sub Note 2]]]
    C --> F[![[Sub Note 3]]]
```

---

## Syntax

### Basic embed

**Input:**
```markdown
![[Important Note]]
```

**Output:**
```latex
\input{important_note}
```

### Embed with heading

**Input:**
```markdown
![[Important Note#Methods]]
```

**Output:**
```latex
\input{important_note#methods}
```

### Embed with block

**Input:**
```markdown
![[Important Note#^block-id]]
```

**Output:**
```latex
\input{important_note#^block-id}
```

---

## Resolution

MergDown2TeX resolves embeds in two steps:

```mermaid
graph TD
    A[![[Note]]] --> B{Same folder?}
    B -->|Yes| C[Use file]
    B -->|No| D{Vault root?}
    D -->|Yes| C
    D -->|No| E[Error]
```

### Step 1: Same folder

Check the same folder as the current note:

```
folder/
├── main.md
├── note.md      ← Found!
└── subfolder/
    └── other.md
```

### Step 2: Vault root

If not found, check the vault root:

```
vault/
├── main.md
├── note.md      ← Found!
└── folder/
    └── other.md
```

---

## Depth limit

MergDown2TeX limits recursion depth to prevent infinite loops:

```mermaid
graph TD
    A[Depth 0: Main Note] --> B[Depth 1: ![[Note A]]]
    B --> C[Depth 2: ![[Sub Note 1]]]
    C --> D[Depth 3: ![[Sub Sub Note]]]
    D --> E[Depth 4: ...]
    E --> F[Max Depth: 10]
```

**Default:** 10 levels

**Configuration:**
```yaml
---
embedDepthLimit: 10
---
```

---

## Circular reference detection

MergDown2TeX detects and prevents circular references:

```mermaid
graph TD
    A[Main Note] --> B[![[Note A]]]
    B --> C[![[Note B]]]
    C --> A[![[Main Note]]]
    style A fill:#f96,stroke:#333
```

**Result:** Circular reference is skipped with a warning.

---

## Examples

### Example 1: Simple embed

**Note A.md:**
```markdown
---
title: "Methods"
---

# Methods

We used the following approach:

1. Data collection
2. Analysis
3. Results
```

**Main.md:**
```markdown
---
title: "Paper"
---

# Paper

![[Methods]]
```

**Output:**
```latex
\documentclass[12pt]{report}
\title{Paper}

\begin{document}

\section{Paper}

\input{methods}

\end{document}
```

### Example 2: Nested embeds

**Sub Note.md:**
```markdown
![[Sub Sub Note]]
```

**Note A.md:**
```markdown
![[Sub Note]]
```

**Main.md:**
```markdown
![[Note A]]
```

**Result:** All notes are recursively expanded.

---

## Image embeds

### Markdown syntax

**Input:**
```markdown
![[image.png]]
```

**Output:**
```latex
\includegraphics{figures/image.png}
```

### Image resolution

```mermaid
graph TD
    A[![[image.png]]] --> B{Same folder?}
    B -->|Yes| C[Use image]
    B -->|No| D{Vault root?}
    D -->|Yes| C
    D -->|No| E[Download if URL]
```

---

## Troubleshooting

### Embed not found

**Error:**
```
Embed not found: [[Note]]
```

**Solution:**
- Check file exists in same folder or vault root
- Verify filename (case-sensitive)
- Check for typos

### Circular reference

**Error:**
```
Circular reference detected: [[Note A]] → [[Note B]] → [[Note A]]
```

**Solution:**
- Restructure notes to avoid circular references
- Use heading/block references instead

### Depth limit exceeded

**Error:**
```
Embed depth limit exceeded (10)
```

**Solution:**
- Reduce nesting depth
- Increase limit: `embedDepthLimit: 15`

---

## Next steps

- [Citations](citations.md) - Citation features
- [Cross-References](cross-references.md) - Navigation arrows
- [Configuration](../getting-started/configuration.md) - Customize settings
