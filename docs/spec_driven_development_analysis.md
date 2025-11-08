# Spec-Driven Development (SDD)
### Based on the GitHub Spec-Kit Repository

---

## Overview

**Spec-Driven Development (SDD)** is a methodology where **specifications, not code, are the primary source of truth**.  
Code, tests, and artifacts are *regenerable by-products* of those specifications.

Traditional software processes treat specifications (PRDs, design docs) as temporary scaffolding that becomes outdated once code exists.  
SDD **inverts that model**: the **specification defines everything**, and the **code exists to serve the spec**, not replace it.

The **Spec-Kit** project formalizes this philosophy with structured documents, templates, and a constitutional framework that allows human developers and AI systems to collaborate around an evolving body of specifications.

---

## 1. Core Principles of Spec-Driven Development

### 1.1 Specs as the Primary Artifact
- Specifications are the single source of truth.  
- Code is a *reproduction* of the spec in a programming language.  
- All changes to functionality begin by modifying the spec, not the implementation.

### 1.2 Executable Specifications
- Specs are written with enough precision that they can be *executed* by an AI agent to produce working systems.  
- Specs contain unambiguous requirements, measurable acceptance criteria, and structured context.

### 1.3 Intent-Driven Development
- Developer intent, reasoning, and design goals live *in the spec*.  
- Code is the final form of that intent.  
- Specifications serve as the shared communication medium between humans and AI systems.

### 1.4 Continuous Refinement
- SDD is iterative, not waterfall.  
- Specifications evolve as the product evolves.  
- AI agents perform consistency checks, detect ambiguities, and enforce constraints as the project changes.

### 1.5 Research-Driven Context
- Research is part of specification, not a separate activity.  
- Alternatives, trade-offs, and benchmarks are documented inside the spec repository (`research.md` files).  
- This ensures future iterations remain informed by historical context.

### 1.6 Feedback from Production
- Observations, metrics, and incidents in production feed back into specifications as new constraints or requirements.  
- This closes the loop between *intent*, *implementation*, and *operation*.

### 1.7 Branching and Exploration
- Each spec defines an isolated feature branch with a numeric prefix (`001-feature-name`).  
- Multiple implementation approaches may coexist, allowing experimentation while maintaining a unified spec history.

---

## 2. The Constitutional Framework

SDD projects operate under a **Constitution** — a persistent, project-wide file (`memory/constitution.md`) that defines invariant principles governing all specs and implementations.

### 2.1 Key Articles (from Spec-Kit)
1. **Library-First Principle**  
   - Each feature begins as a modular library before integration into applications.

2. **CLI Mandate**  
   - Every library must expose a text-based interface (stdin/stdout or JSON) for testing and observability.

3. **Test-First Imperative**  
   - Tests are written and approved before code; they must fail (“red”) prior to implementation.

4. **Simplicity & Anti-Abstraction**  
   - Favor minimal frameworks and direct implementation.  
   - Avoid abstractions that hide complexity without necessity.

5. **Integration-First Testing**  
   - Test against real environments and data sources before mocks or fakes.

6. **Gatekeeping Mechanism**  
   - Constitutional “phase gates” enforce rules such as simplicity, test coverage, and modularity before implementation begins.

The constitution acts as a **guardrail** for every generation phase.  
An AI assistant should always include it as contextual input when generating or modifying plans.

---

## 3. Structural Methodology

### 3.1 Separation of Concerns
- **Specification (`spec.md`)** — Defines *what* and *why*.  
- **Implementation Plan (`plan.md`)** — Defines *how*.  
- **Tasks (`tasks.md`)** — Defines *who does what, in what order*.  
- **Constitution (`constitution.md`)** — Defines *the immutable rules*.  

### 3.2 Workflow Pipeline

| Step | Description | Command (Spec-Kit) |
|------|--------------|-------------------|
| 1 | Establish or update constitution | `/speckit.constitution` |
| 2 | Create feature specification (WHAT, WHY) | `/speckit.specify` |
| 3 | Create implementation plan (HOW) | `/speckit.plan` |
| 4 | Generate executable tasks | `/speckit.tasks` |
| 5 | Implement & test | `/speckit.implement` |

---

## 4. Enforced Quality Standards

### 4.1 Clarification and QA
- Ambiguities are explicitly marked as `[NEEDS CLARIFICATION]`.  
- The assistant cannot proceed until each ambiguity is resolved.  
- Specifications must pass internal checklists before advancing to planning or implementation.

### 4.2 Phase-1 Gates
Each plan includes constitutional “gates” to maintain simplicity and integrity:
- **Simplicity Gate** – Can this feature be implemented in fewer steps?  
- **Anti-Abstraction Gate** – Is any abstraction justified?  
- **Integration Gate** – Has real-world testing been considered first?

### 4.3 Test-Driven Hierarchy
- Implementation follows **tests → code → verification** sequence.  
- Contracts are written before functionality.

### 4.4 Scope Control
- Each spec forbids unvalidated “might need” features.  
- All tasks trace back to user stories or explicit acceptance criteria.

---

## 5. Directory Structure Standard

```
specs/
  001-feature-name/
    spec.md          # Business requirements (WHAT/WHY)
    plan.md          # Technical approach (HOW)
    data-model.md    # Entities and relationships
    contracts/       # APIs, events, interfaces
      http.md
      websocket.md
    research.md      # Supporting evidence and options
    quickstart.md    # Validation and QA guide
    tasks.md         # Ordered implementation list
memory/
  constitution.md     # Global architecture and rules
  glossary.md         # Domain-specific terminology
```

This structure ensures both humans and AI systems can navigate the project deterministically.

---

## 6. Practices for AI-Integrated Development

To make specifications consumable by AI agents (e.g., Cursor, Copilot, MCP servers):

1. **Role Separation**
   - Agents operate in stages: Spec Engineer → Planner → Implementer.
2. **Self-Verification**
   - Each generation step includes checklists and auto-validation logic.
3. **Clarification Loop**
   - Unclear specs trigger automatic clarifying questions before code generation.
4. **Constitutional Context**
   - Every AI agent includes the `constitution.md` context when generating code or plans.
5. **Version-Controlled Specs**
   - All changes are versioned via Git branches named after the feature ID.
6. **Test-First Contract Generation**
   - AI generates or updates tests and API contracts before writing any implementation.
7. **Research Integration**
   - Agents store decisions, trade-offs, and rejected options in `research.md` for long-term traceability.

---

## 7. Guiding Philosophy

> “Specifications are executable truth.  
> Code is a temporary reflection of that truth.”  

Under Spec-Driven Development:
- Documentation is not separate from the system — it *is* the system.
- Every architectural or behavioral change begins and ends with the spec.
- AI enables instant regeneration of the implementation from those specs, preserving clarity, reproducibility, and alignment with intent.

---

## 8. Relevance for AI Coding Assistants

AI models like Cursor or MCP-based agents can act as:
- **Spec Interpreters:** Parse and validate `spec.md` documents.  
- **Planners:** Convert specs into `plan.md` and `tasks.md`.  
- **Implementers:** Generate and test code strictly under constitutional and plan constraints.  
- **Researchers:** Automatically enrich `research.md` and propose optimizations.

This architecture transforms AI from “autocomplete engines” into disciplined collaborators in the software development lifecycle.

---

## 9. Summary of Key Advantages

| Benefit | Description |
|----------|-------------|
| **Clarity** | Shared language between humans and AI. |
| **Traceability** | Every decision documented in specs. |
| **Reproducibility** | Code can be regenerated deterministically. |
| **Quality Assurance** | Continuous validation through gates and checklists. |
| **Scalability** | Specs evolve independently from implementation. |
| **AI Readiness** | Structured markdown enables agent reasoning and context persistence. |

---

### References
- GitHub Spec-Kit Repository — [https://github.com/github/spec-kit](https://github.com/github/spec-kit)
- GitHub Spec-Driven Development Principles — Core documentation and constitution files.
- “Intent-Driven Development” — A guiding design philosophy of Spec-Kit.
- TDD & Integration-First Testing — Articles III & IX of the Spec-Kit Constitution.

---

**Document prepared for:**  
**AI Specification Assistant Project**  
_Enabling automated spec validation and code generation through Spec-Driven Development._
