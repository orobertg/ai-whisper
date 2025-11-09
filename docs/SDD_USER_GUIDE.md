# Specification-Driven Development in AI Whisper
**Feature**: SDD-Powered Mind-Mapping  
**Status**: Active  
**Version**: 1.0  

---

## Overview

AI Whisper integrates **Specification-Driven Development (SDD)** directly into the mind-mapping experience. Instead of jumping straight to code, users create specifications first, guided by an AI that understands constitutional principles and enforces quality gates.

**Philosophy**:
> "Specifications are executable truth. Code is a temporary reflection of that truth."

---

## What is Specification-Driven Development?

Traditional software development treats specifications as temporary scaffolding—write a PRD, build the code, and forget the document. **SDD inverts this model**: the specification is the primary artifact, and code exists to serve the spec.

### Key Principles

1. **Spec-First**: All features begin with a specification, not implementation
2. **Clarity**: Specifications must be unambiguous and executable
3. **Test-Driven**: Acceptance tests are part of the spec, not an afterthought
4. **Constitutional Gates**: Quality checkpoints ensure simplicity and completeness
5. **Research-Driven**: Technical decisions are informed by research and trade-offs
6. **User Control**: AI suggests, never dictates—users have final say

---

## The AI Whisper Constitution

AI Whisper follows a **constitution** (see `memory/constitution.md`) that defines immutable principles for how AI assists in specification creation. This isn't just documentation—it's *enforceable* through AI prompts and validation.

### The Four Gates

Every specification must pass these gates before implementation:

#### 1. **Simplicity Gate**
- **Question**: Can this be implemented more simply?
- **AI Action**: Challenges unnecessary features, suggests simplification
- **Example**: "Do we really need a custom framework, or can we use existing libraries?"

#### 2. **Anti-Abstraction Gate**
- **Question**: Is any abstraction justified?
- **AI Action**: Questions abstractions, proposes concrete alternatives
- **Example**: "Instead of an abstract 'Data Layer,' consider direct database calls first"

#### 3. **Integration Gate**
- **Question**: Has real-world testing been considered?
- **AI Action**: Suggests integration tests before mocks
- **Example**: "Let's test against a real database instead of mocked responses"

#### 4. **Scope Control Gate**
- **Question**: Do all requirements trace to user needs?
- **AI Action**: Challenges "might need" features, asks for validation
- **Example**: "Why is this feature needed? Can you describe the user problem it solves?"

---

## The 7-Phase Workflow

AI Whisper guides users through a structured 7-phase workflow:

### **Phase 1: Constitution** 📜
**Purpose**: Define project principles  
**Node Type**: Notes  
**AI asks**: "What are the core principles guiding this project?"

**Example Principles**:
- User privacy is paramount
- Response time < 200ms
- Mobile-first design
- Test coverage > 80%
- Zero-downtime deployments

**AI won't proceed** until at least 2-3 principles are defined.

---

### **Phase 2: Research** 🔬
**Purpose**: Validate technology choices  
**Node Type**: Notes  
**AI asks**: "What technologies are you considering?"

**Format**:
```
Technology: React
Rationale: Large ecosystem, component reusability
Alternatives: Vue (simpler), Angular (enterprise)
Trade-offs:
  Pros: Huge community, many libraries, job market
  Cons: Steeper learning curve, frequent updates
  Impact: 45KB min bundle, moderate learning curve
```

**AI won't proceed** until tech stack is validated.

---

### **Phase 3: Specification** 📝
**Purpose**: Define WHAT to build  
**Node Types**: User Story → Feature  
**AI asks**: "Who is this for and what problem does it solve?"

**User Story Format**:
```
As a [user type]
I want [action/feature]
So that [benefit/value]
```

**Feature Format** (includes acceptance criteria):
```
Feature: User Authentication

Description: Email/password login with JWT tokens

Acceptance Criteria:
Given I am a new user
When I fill out the signup form with valid email and password
Then I should receive a confirmation email within 30 seconds
And my account should be created in the database

Given I am a registered user
When I enter correct credentials
Then I should be logged in within 2 seconds
And receive a JWT token valid for 24 hours
```

**AI will NOT suggest implementation** until specs are approved.  
**AI marks** unclear requirements as `[NEEDS CLARIFICATION]`.

---

### **Phase 4: Planning** 🏗️
**Purpose**: Define HOW to build  
**Node Type**: Technical  
**AI asks**: "How should we implement [feature]?"

**Format**:
```
Component: JWT Authentication Service

Architecture: Stateless JWT with refresh tokens

Libraries:
- jsonwebtoken (JWT generation/validation)
- bcrypt (password hashing)
- express-rate-limit (brute-force protection)

Rationale:
- JWT allows horizontal scaling (no session store)
- Refresh tokens balance security and UX
- Rate limiting prevents credential stuffing

Alternatives Considered:
- Session-based auth: Requires sticky sessions or Redis
- OAuth only: Limits offline capability
- Passwordless: Higher friction for users

Trade-offs:
  Pros: Stateless, scalable, standard
  Cons: Token revocation complex, larger payload
```

**Constitutional Gates** check:
- Is this the simplest approach?
- Are abstractions justified?
- Have we considered real-world testing?
- Do all components trace to requirements?

---

### **Phase 5: Data Modeling** 💾
**Purpose**: Define data structures  
**Node Type**: Data Model  
**AI asks**: "What data needs to be stored?"

**Format**:
```
Entity: User

Fields:
- id: UUID (primary key)
- email: string (unique, indexed)
- password_hash: string (bcrypt, cost 12)
- created_at: timestamp
- last_login: timestamp (nullable)
- is_active: boolean (default true)
- is_verified: boolean (default false)

Relationships:
- has_many: Sessions
- has_many: Tokens (refresh tokens)

Indexes:
- email (unique, for login lookup)
- created_at (for analytics queries)

Validation:
- email: RFC 5322 format
- password: min 8 chars, 1 uppercase, 1 number, 1 special
```

---

### **Phase 6: Task Breakdown** ✅
**Purpose**: Break into implementation steps  
**Node Type**: To-Do  
**AI asks**: "Let's break this into implementation steps"

**Format** (ordered, atomic tasks):
```
☐ Setup
  ☐ Install dependencies (jsonwebtoken, bcrypt, express-rate-limit)
  ☐ Configure environment variables (JWT_SECRET, JWT_EXPIRY)
  
☐ Database
  ☐ Create User migration (fields: id, email, password_hash, ...)
  ☐ Create Sessions table for tracking
  ☐ Add database indexes (email unique, created_at)
  
☐ Backend
  ☐ Implement User model (validation, password hashing)
  ☐ Create /api/auth/signup endpoint
  ☐ Create /api/auth/login endpoint
  ☐ Create /api/auth/refresh endpoint
  ☐ Add JWT middleware for protected routes
  
☐ Testing
  ☐ Unit test: password hashing
  ☐ Unit test: JWT generation/validation
  ☐ Integration test: full signup flow
  ☐ Integration test: login with invalid credentials
  ☐ Load test: 100 concurrent logins
  
☐ Deployment
  ☐ Add rate limiting to endpoints (10 req/min per IP)
  ☐ Configure HTTPS certificates
  ☐ Deploy to staging
  ☐ Manual QA (test on real devices)
  ☐ Deploy to production
```

**Dependencies** are respected (e.g., can't test endpoints before creating them).

---

### **Phase 7: Validation** ✅
**Purpose**: Ensure quality  
**Node Type**: To-Do (Testing)  
**AI asks**: "How will we validate this works?"

**Format**:
```
☐ Unit Tests
  ☐ Password hashing: bcrypt cost 12, salt unique
  ☐ JWT generation: valid signature, correct expiry
  ☐ Token validation: rejects expired/invalid tokens
  
☐ Integration Tests
  ☐ Signup flow: creates user, sends email, returns token
  ☐ Login flow: validates credentials, returns token, updates last_login
  ☐ Refresh flow: validates refresh token, issues new JWT
  
☐ Security Tests
  ☐ Brute-force protection: rate limit enforced
  ☐ SQL injection: parameterized queries prevent injection
  ☐ XSS protection: output sanitized
  
☐ Performance Tests
  ☐ Login latency: p95 < 200ms
  ☐ Concurrent logins: 100 users/sec without errors
  ☐ Token validation: < 10ms per request
  
☐ Manual QA
  ☐ Signup on mobile (iOS Safari, Android Chrome)
  ☐ Login persists across browser restart
  ☐ Token expiry shows friendly error message
```

---

## AI Roles

The AI acts in specific roles depending on the phase:

| Phase | AI Role | Responsibility |
|-------|---------|----------------|
| 1-2 | **Specification Engineer** | Clarify requirements, ask probing questions |
| 2 | **Research Assistant** | Find alternatives, assess trade-offs |
| 4 | **Architect/Planner** | Design technical approach |
| 5 | **Data Modeler** | Define entities, relationships, indexes |
| 6 | **Task Breaker** | Break plans into ordered, atomic tasks |
| 7 | **QA Validator** | Ensure quality, completeness, testability |

**The AI will NOT**:
- Skip phases (e.g., jump from Spec → Tasks without Planning)
- Suggest implementation before specification is approved
- Make assumptions (always asks for clarification)
- Override constitutional gates

---

## Benefits of SDD in AI Whisper

### 1. **Clarity & Communication**
- Specifications serve as shared language between stakeholders
- Visual mind maps make complex systems understandable
- AI asks questions until requirements are unambiguous

### 2. **Quality Assurance**
- Constitutional gates prevent over-engineering
- Test-first approach ensures features are testable
- Acceptance criteria define "done" before coding starts

### 3. **Reproducibility**
- Specifications can regenerate code if lost
- Mind maps serve as living documentation
- Export to Markdown preserves intent forever

### 4. **AI Collaboration**
- AI understands context and enforces best practices
- Suggestions are traceable to requirements
- Users remain in control (approval required)

### 5. **Scalability**
- Specifications evolve independently from code
- New team members onboard via visual mind maps
- Cross-project patterns identified and reused

---

## How to Use SDD in AI Whisper

### Starting a New Project

1. **Create a new mind map** from the home screen
2. **Select the "Spec-Driven Development" template** (or start blank)
3. **Answer AI's questions** phase by phase:
   - "What principles guide this project?"
   - "What technologies are you considering?"
   - "Who is this for and what problem does it solve?"
4. **Approve suggestions** as you go (explicit approval required)
5. **Pass constitutional gates** before implementation planning
6. **Export to Markdown** when ready to implement

### During Development

- **Update the mind map** as requirements change
- **Add new user stories** as features evolve
- **Document decisions** in Research notes
- **Track progress** by checking off To-Do tasks

### After Launch

- **Feedback loop**: Production issues update specifications
- **Retrospective**: "Did we hit our success metrics?"
- **Iterate**: New features follow the same workflow

---

## Example: Building a Chat Feature

**User**: "I want to add real-time chat to my app"

**AI (Phase 1 - Constitution)**:
> "Before we dive in, what are the core principles for this chat feature? For example:
> - Should messages be end-to-end encrypted?
> - What's your target message latency?
> - Should chat history persist?
> - Any bandwidth constraints?"

**User**: "E2E encryption, < 100ms latency, history persists, mobile-friendly"

**AI (Phase 2 - Research)**:
> "For real-time chat, I suggest researching these technologies:
>
> **WebSockets** (Socket.io, ws)  
> Rationale: Low latency, bidirectional  
> Alternatives: Long polling (fallback), WebRTC (peer-to-peer)  
> Trade-offs: Stateful (+scaling complexity), firewall issues (rare)
>
> **Encryption** (Signal Protocol, libsodium)  
> Rationale: Industry standard, battle-tested  
> Alternatives: Custom crypto (❌ don't roll your own)  
> Trade-offs: Key management complexity, library size
>
> Shall I add these as Research nodes?"

**User**: "Yes, use Socket.io and Signal Protocol"

**AI (Phase 3 - Specification)**:
> "Great! Let's define the requirements:
>
> **User Story**: As a user, I want to send instant messages, so that I can communicate with teammates in real-time.
>
> **Feature: Real-Time Messaging**
>
> Acceptance Criteria:
> - Given I am logged in and connected
> - When I send a message
> - Then the recipient should see it within 100ms
> - And the message should be end-to-end encrypted
> - And the message should persist in the database
>
> **[NEEDS CLARIFICATION]**: What's the max message size? (Text only? File attachments?)
>
> Shall I add this specification?"

---

## Export Formats

AI Whisper can export specifications to standard formats:

### Markdown (GitHub Spec-Kit Compatible)
```
specs/
  001-real-time-chat/
    spec.md          # From Feature nodes
    plan.md          # From Technical nodes
    tasks.md         # From To-Do nodes
    research.md      # From Research/Notes nodes
    data-model.md    # From Data Model nodes
```

### JSON (Reimportable)
```json
{
  "version": "1.0",
  "exported_at": "2025-11-08T...",
  "constitution": [...],
  "specifications": [...],
  "plans": [...],
  "tasks": [...]
}
```

### PDF (Presentation-Ready)
- Visual mind map as high-resolution image
- Preserves colors, connections, layout
- Suitable for stakeholder reviews

---

## Tips & Best Practices

### Do's ✅
- **Define principles first** - they guide all decisions
- **Ask AI for clarification** - "Why did you suggest this?"
- **Use templates** - they embed best practices
- **Export regularly** - specifications are backup
- **Iterate** - specs evolve, embrace change

### Don'ts ❌
- **Don't skip phases** - constitutional gates exist for a reason
- **Don't assume** - mark ambiguities as `[NEEDS CLARIFICATION]`
- **Don't over-engineer** - simplicity gate will catch you
- **Don't code before spec** - specification-first principle
- **Don't ignore AI questions** - they prevent issues later

---

## Constitutional Compliance Report

When exporting, AI Whisper generates a compliance report:

```
✅ Simplicity Gate: Passed
   - No unnecessary abstractions detected
   - Tech stack uses standard libraries

✅ Anti-Abstraction Gate: Passed
   - Direct implementations preferred
   - No custom frameworks

✅ Integration Gate: Passed
   - Integration tests defined before unit tests
   - Real data sources specified

✅ Scope Control Gate: Passed
   - All features trace to user stories
   - No unvalidated "might need" features

✅ Test-Driven: Passed
   - Acceptance criteria in Given/When/Then format
   - Test nodes linked to feature nodes

📊 Completeness:
   - User Stories: 5/5 ✅
   - Features: 8/8 ✅
   - Technical Plans: 8/8 ✅
   - Data Models: 3/3 ✅
   - Tasks: 45/45 ✅
   - Tests: 12/12 ✅

🎯 Clarity Score: 95/100
   - 2 items marked [NEEDS CLARIFICATION]
   - All acceptance criteria measurable
```

---

## Related Documentation

- [Constitution (memory/constitution.md)](../memory/constitution.md) - Immutable principles
- [Spec-Driven Development Analysis](./spec_driven_development_analysis.md) - Detailed methodology
- [GitHub Spec-Kit](https://github.com/github/spec-kit) - Inspiration and reference
- [Templates Guide](./COMPONENTS.md) - Available templates

---

**Version**: 1.0  
**Last Updated**: November 2025  
**Status**: Active in Production  
**Feedback**: This is a living document - suggest improvements via GitHub issues

