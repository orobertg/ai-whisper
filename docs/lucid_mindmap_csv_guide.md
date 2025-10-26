# Lucid Mind Map CSV Import Guide

This document explains how to create, structure, and optimize **CSV files** for importing **mind maps** into **Lucidchart** or **Lucidspark**. It also includes formatting guidelines and best practices for achieving visually rich, native-quality results inside Lucid.

---

## 1. Overview

Lucid supports **CSV import** to automatically generate **mind maps**. Each CSV row represents a branch of the mind map, while each column represents a hierarchy level.

Using the right CSV structure ensures Lucid:
- Builds true mind map nodes (not generic text boxes)
- Automatically arranges branches radially
- Maintains a clear visual hierarchy

---

## 2. CSV File Structure

### ✅ Basic Format

Each column represents a deeper level of the hierarchy.

```csv
Topic,Subtopic,Sub-Subtopic
Main Idea,Branch 1,Detail 1
Main Idea,Branch 1,Detail 2
Main Idea,Branch 2,
```

- **Column 1** → Root topic (center node)
- **Column 2** → First-level branches
- **Column 3+** → Sub-branches

Lucid automatically interprets these relationships when importing.

### 💡 Example: Project Plan Mind Map

```csv
Main Topic,Subtopic,Sub-Subtopic,Details
Project Alpha,Planning,Milestones,
Project Alpha,Planning,Resources,
Project Alpha,Execution,Data Pipeline,
Project Alpha,Execution,AI Assistant,Architecture
Project Alpha,Testing,Unit Tests,
Project Alpha,Testing,Load Tests,
Project Alpha,Deployment,Staging,
Project Alpha,Deployment,Production,
```

**Result:**
- "Project Alpha" becomes the central node.
- Branches like *Planning*, *Execution*, *Testing*, and *Deployment* radiate outward.
- Subtopics (e.g., *Milestones*, *Resources*) appear as children nodes.

---

## 3. Importing into Lucid

### In **Lucidchart** or **Lucidspark**:
1. Open a **Mind Map** document (or create a blank one).
2. Go to **File → Import Data → Mind Map (CSV)**.
3. Upload your CSV file.
4. Confirm that the hierarchy preview looks correct.

Lucid will automatically generate a full mind map using the hierarchy in your CSV.

---

## 4. Formatting & Optimization Tips

| Tip | Description |
|-----|--------------|
| **Keep hierarchy ≤ 4 levels** | Avoid overcrowding; Lucid’s auto-layout works best with 3–4 layers. |
| **Use concise text** | Node size auto-scales with label length; shorter text = cleaner look. |
| **Group logically related nodes** | Helps Lucid’s layout engine cluster related branches neatly. |
| **Avoid commas in text** | CSV interprets commas as column separators — use semicolons (;) or quotes if needed. |
| **Use UTF-8 encoding** | Ensures Lucid properly displays special characters, symbols, and emojis. |
| **Add header row (optional)** | Lucid ignores it safely; keeps CSVs more readable in spreadsheets. |
| **No duplicate root names** | Avoid confusion; Lucid treats the first column as a single root topic. |

---

## 5. Advanced Visual Design

Lucid’s CSV import focuses on structure, not style. However, once imported, you can use Lucid’s built-in styling tools:

- **Color Branches:** Select a branch and use the color palette to group topics.
- **Icons & Emojis:** You can use emojis directly in your CSV (e.g., "🚀 Launch Plan").
- **Auto-Layout:** Use *Mind Map → Auto Layout → Radial* for balanced designs.
- **Custom Start Point:** If needed, rearrange the root to be center or left-aligned.

---

## 6. Example: CSV Template for Exporting from Custom Tool

If you’re generating CSV files programmatically (e.g., from your own mind mapping app), follow this pattern:

```csv
Root,Branch,Sub-Branch,Detail
Product Roadmap,Vision,Key Goals,
Product Roadmap,Features,AI Assistant,LLM Integration
Product Roadmap,Features,UI Improvements,Streamlit Dashboard
Product Roadmap,Launch,Marketing,Pre-Launch Campaign
Product Roadmap,Launch,Distribution,App Store + Web Release
```

This produces a clean, auto-arranged Lucid mind map upon import.

---

## 7. Troubleshooting

| Issue | Likely Cause | Fix |
|--------|---------------|------|
| **All nodes appear flat (same level)** | Missing commas or indentation | Verify each hierarchy level has its own column. |
| **Lucid can’t read file** | Wrong encoding | Save file as **UTF-8 CSV**. |
| **Nodes are jumbled or misaligned** | Inconsistent parent-child patterns | Ensure every sub-node has a valid parent in the previous column. |
| **Text truncated** | Long labels | Shorten text or manually resize nodes in Lucid. |

---

## 8. Summary

For **Lucid mind maps**, **CSV** is the best import format — lightweight, open, and perfectly suited for hierarchical structures. Follow these guidelines for optimal results:

- Use clear, hierarchical columns.
- Keep text concise and encoding consistent.
- Let Lucid’s layout engine handle visuals.
- Enhance styling once imported (colors, emojis, alignment).

By following this format, you ensure your exported mind maps will look and function like native Lucid diagrams — with minimal cleanup required.

