# Mermaid Diagrams

MergDown2TeX renders Mermaid diagrams to PNG images for LaTeX.

---

## How it works

```mermaid
graph TD
    A[Mermaid Code] --> B[Render to PNG]
    B --> C[Save to Figures]
    C --> D[Include in LaTeX]
```

---

## Syntax

### Basic diagram

**Input:**
````
```mermaid
graph TD
    A[Input] --> B[Process]
    B --> C[Output]
```
````

**Output:**
```latex
\includegraphics{figures/diagram_1.png}
```

---

## Supported diagrams

### Flowchart

**Input:**
````
```mermaid
graph TD
    A[Start] --> B{Decision}
    B -->|Yes| C[Action 1]
    B -->|No| D[Action 2]
```
````

**Output:**
```latex
\includegraphics{figures/diagram_1.png}
```

### Sequence diagram

**Input:**
````
```mermaid
sequenceDiagram
    participant A as Alice
    participant B as Bob
    A->>B: Hello
    B-->>A: Hi
```
````

**Output:**
```latex
\includegraphics{figures/diagram_2.png}
```

### Class diagram

**Input:**
````
```mermaid
classDiagram
    Animal <|-- Duck
    Animal <|-- Fish
```
````

**Output:**
```latex
\includegraphics{figures/diagram_3.png}
```

### State diagram

**Input:**
````
```mermaid
stateDiagram-v2
    [*] --> Active
    Active --> Inactive
    Inactive --> Active
```
````

**Output:**
```latex
\includegraphics{figures/diagram_4.png}
```

### Gantt chart

**Input:**
````
```mermaid
gantt
    title Project Schedule
    section Phase 1
    Task 1: 2024-01-01, 30d
    Task 2: 2024-02-01, 20d
```
````

**Output:**
```latex
\includegraphics{figures/diagram_5.png}
```

### Pie chart

**Input:**
````
```mermaid
pie
    title Distribution
    "A" : 40
    "B" : 30
    "C" : 30
```
````

**Output:**
```latex
\includegraphics{figures/diagram_6.png}
```

---

## Configuration

### DPI setting

```yaml
---
mermaidDpi: 300
---
```

**Options:** `72`, `96`, `150`, `300`

### Image format

```yaml
---
mermaidFormat: png
---
```

**Options:** `png`, `svg`

---

## Image storage

### Default location

```
figures/
├── diagram_1.png
├── diagram_2.png
└── diagram_3.png
```

### Custom location

```yaml
---
imageFolder: assets/diagrams
---
```

---

## Troubleshooting

### Diagram not rendering

**Error:**
```
Mermaid render failed
```

**Solution:**
- Check Mermaid syntax
- Verify special characters are escaped
- Try simpler diagram first

### Image not found

**Error:**
```
File not found: figures/diagram_1.png
```

**Solution:**
- Check `figures/` folder exists
- Verify write permissions
- Check disk space

---

## Next steps

- [Cross-References](cross-references.md) - Navigation arrows
- [Configuration](../getting-started/configuration.md) - Customize settings
- [Compilation](../compilation/pdf.md) - PDF/DOCX options
