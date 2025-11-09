# RAG System Architecture Specification

**Document:** 12_RAG_SYSTEM_ARCHITECTURE.md  
**Version:** 1.0  
**Purpose:** Specification for RAG-based AI documentation system with vector storage and Git integration

---

## Overview

The AI Whisper RAG (Retrieval-Augmented Generation) system provides intelligent specification document management, version control, and AI-assisted documentation. It enables:

1. **Vector-based document storage** for semantic search
2. **Project-specific document collections** with flexible association
3. **Git repository integration** for version control and collaboration
4. **AI-assisted specification generation** using established patterns
5. **Document archival and retrieval** for completed projects

---

## System Architecture

### High-Level Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                    AI Whisper Frontend                       │
│  - Document Upload Interface                                 │
│  - Specification Editor                                      │
│  - Git Repository Manager                                    │
└────────────────┬────────────────────────────────────────────┘
                 │
                 ↓
┌─────────────────────────────────────────────────────────────┐
│                    Backend API Layer                         │
│  - Document Processing Service                               │
│  - RAG Query Service                                         │
│  - Git Integration Service                                   │
└────────────┬──────────────┬──────────────┬──────────────────┘
             │              │              │
             ↓              ↓              ↓
    ┌────────────┐  ┌──────────────┐  ┌──────────────┐
    │  Vector DB │  │ Document DB  │  │  Git Client  │
    │  (Chroma/  │  │ (PostgreSQL) │  │  (GitHub/    │
    │  Pinecone) │  │              │  │  GitLab API) │
    └────────────┘  └──────────────┘  └──────────────┘
```

---

## Component Specifications

### 1. Document Storage Architecture

#### Document Storage Unit

```typescript
interface DocumentStorageUnit {
  id: string;                          // UUID
  name: string;                        // "Project X Specifications"
  description: string;                 // User description
  type: 'project' | 'template' | 'archive' | 'reference';
  created_at: Date;
  updated_at: Date;
  owner_id: string;                    // User who created it
  access_level: 'private' | 'team' | 'public';
  metadata: {
    document_count: number;
    total_size: number;               // bytes
    last_accessed: Date;
    tags: string[];
  };
}
```

**Storage Unit Types:**

1. **Project Storage** - Active project specifications
2. **Template Storage** - Reusable spec templates (like our UI/UX specs)
3. **Archive Storage** - Completed project specs (read-only)
4. **Reference Storage** - External documentation, best practices

#### Document Model

```typescript
interface SpecificationDocument {
  id: string;                          // UUID
  storage_unit_id: string;             // Parent storage unit
  title: string;                       // "Theme System Specification"
  filename: string;                    // "01_THEME_SYSTEM.md"
  content: string;                     // Full markdown content
  content_hash: string;                // SHA-256 for change detection
  file_type: 'markdown' | 'code' | 'diagram' | 'reference';
  
  // Metadata
  version: string;                     // "1.0.2"
  status: 'draft' | 'review' | 'approved' | 'archived';
  created_at: Date;
  updated_at: Date;
  author_id: string;
  
  // Categorization
  tags: string[];                      // ['theme', 'ui', 'styling']
  category: string;                    // 'architecture' | 'component' | 'integration'
  dependencies: string[];              // IDs of related documents
  
  // Vector embeddings
  embedding_ids: string[];             // References to vector DB entries
  chunk_count: number;                 // Number of text chunks
  
  // Git integration
  git_info?: {
    repository_id: string;
    branch: string;
    file_path: string;                 // Path in repo
    last_commit_sha: string;
    last_synced: Date;
  };
}
```

#### Project-Document Association

```typescript
interface ProjectDocumentLink {
  id: string;
  project_id: number;                  // Links to existing project
  storage_unit_id: string;             // Storage unit to associate
  linked_at: Date;
  linked_by: string;                   // User ID
  access_mode: 'read' | 'write';
  
  // Optional filtering
  filters?: {
    include_tags?: string[];           // Only include docs with these tags
    exclude_tags?: string[];
    include_categories?: string[];
  };
}
```

**Use Cases:**
- Link template specs to new project
- Link reference docs to multiple projects
- Archive completed project specs
- Share specs across team projects

---

### 2. Vector Database Integration

#### Vector Storage Architecture

```typescript
interface VectorChunk {
  id: string;                          // UUID
  document_id: string;                 // Parent document
  storage_unit_id: string;             // For filtering queries
  
  // Content
  content: string;                     // Text chunk (500-1000 chars)
  chunk_index: number;                 // Position in document
  heading_context: string[];           // ["Section", "Subsection"]
  
  // Vector embedding
  embedding: number[];                 // 1536-dim vector (OpenAI) or 768-dim (sentence-transformers)
  
  // Metadata for filtering
  metadata: {
    document_title: string;
    file_type: string;
    tags: string[];
    category: string;
    created_at: Date;
  };
}
```

#### Chunking Strategy

```python
# Document chunking for optimal RAG retrieval
def chunk_document(content: str, metadata: dict) -> List[VectorChunk]:
    """
    Split document into semantic chunks with context preservation.
    
    Strategy:
    1. Split by markdown headings (##, ###)
    2. Keep heading hierarchy as context
    3. Split large sections by paragraphs (max 1000 chars)
    4. Maintain code blocks intact
    5. Overlap chunks by 100 chars for continuity
    """
    chunks = []
    
    # Parse markdown structure
    sections = parse_markdown_sections(content)
    
    for section in sections:
        heading_context = section.heading_path  # ["Overview", "Architecture"]
        
        if len(section.content) <= 1000:
            # Small section - single chunk
            chunks.append(create_chunk(
                content=section.content,
                heading_context=heading_context,
                metadata=metadata
            ))
        else:
            # Large section - split by paragraphs
            paragraphs = split_by_paragraphs(section.content)
            
            for i, paragraph in enumerate(paragraphs):
                # Add overlap from previous paragraph
                if i > 0:
                    overlap = paragraphs[i-1][-100:]
                    paragraph = overlap + paragraph
                
                chunks.append(create_chunk(
                    content=paragraph,
                    heading_context=heading_context,
                    metadata=metadata
                ))
    
    return chunks
```

#### Vector Database Options

**Option 1: ChromaDB (Recommended for MVP)**
```python
import chromadb
from chromadb.config import Settings

# Initialize ChromaDB
client = chromadb.Client(Settings(
    chroma_db_impl="duckdb+parquet",
    persist_directory="./chroma_db"
))

# Create collection per storage unit
collection = client.create_collection(
    name=f"storage_unit_{storage_unit_id}",
    metadata={"type": "specifications"},
    embedding_function=embedding_function
)

# Add documents
collection.add(
    ids=[chunk.id for chunk in chunks],
    documents=[chunk.content for chunk in chunks],
    metadatas=[chunk.metadata for chunk in chunks],
    embeddings=[chunk.embedding for chunk in chunks]
)

# Query
results = collection.query(
    query_texts=["How does the theme system work?"],
    n_results=5,
    where={"category": "architecture"}
)
```

**Option 2: Pinecone (Production Scale)**
```python
import pinecone

# Initialize Pinecone
pinecone.init(
    api_key="your-api-key",
    environment="us-west1-gcp"
)

# Create index
index = pinecone.Index("aiwhisper-specs")

# Upsert vectors
index.upsert(vectors=[
    (chunk.id, chunk.embedding, chunk.metadata)
    for chunk in chunks
])

# Query
results = index.query(
    vector=query_embedding,
    top_k=5,
    filter={"storage_unit_id": storage_unit_id},
    include_metadata=True
)
```

**Recommendation:** Start with ChromaDB for simplicity, migrate to Pinecone for scale.

---

### 3. RAG Query System

#### Query Pipeline

```typescript
interface RAGQuery {
  query: string;                       // User question
  project_id?: number;                 // Filter by project
  storage_unit_ids?: string[];         // Filter by storage units
  filters?: {
    tags?: string[];
    categories?: string[];
    date_range?: { start: Date; end: Date };
  };
  top_k?: number;                      // Number of results (default: 5)
  similarity_threshold?: number;        // Min similarity score (0-1)
}

interface RAGResult {
  chunks: RetrievedChunk[];
  generated_response: string;
  sources: DocumentReference[];
  confidence_score: number;
}

interface RetrievedChunk {
  content: string;
  document_title: string;
  document_id: string;
  heading_context: string[];
  similarity_score: number;
  metadata: any;
}

interface DocumentReference {
  document_id: string;
  title: string;
  filename: string;
  relevant_sections: string[];         // Heading paths
}
```

#### RAG Service Implementation

```python
class RAGService:
    """
    Retrieval-Augmented Generation service for specification documents.
    """
    
    def __init__(self, vector_db, llm_client):
        self.vector_db = vector_db
        self.llm_client = llm_client
    
    async def query(self, query: RAGQuery) -> RAGResult:
        """
        Execute RAG query: retrieve relevant chunks, generate response.
        """
        # 1. Generate query embedding
        query_embedding = await self.embed_text(query.query)
        
        # 2. Retrieve relevant chunks from vector DB
        retrieved_chunks = await self.retrieve_chunks(
            embedding=query_embedding,
            filters=self._build_filters(query),
            top_k=query.top_k or 5
        )
        
        # 3. Filter by similarity threshold
        if query.similarity_threshold:
            retrieved_chunks = [
                chunk for chunk in retrieved_chunks
                if chunk.similarity_score >= query.similarity_threshold
            ]
        
        # 4. Rank and deduplicate chunks
        ranked_chunks = self.rank_chunks(retrieved_chunks, query.query)
        
        # 5. Build context for LLM
        context = self.build_context(ranked_chunks)
        
        # 6. Generate response using LLM
        response = await self.generate_response(
            query=query.query,
            context=context
        )
        
        # 7. Extract document references
        sources = self.extract_sources(ranked_chunks)
        
        return RAGResult(
            chunks=ranked_chunks,
            generated_response=response,
            sources=sources,
            confidence_score=self.calculate_confidence(ranked_chunks)
        )
    
    def build_context(self, chunks: List[RetrievedChunk]) -> str:
        """
        Build context string for LLM from retrieved chunks.
        """
        context_parts = []
        
        for i, chunk in enumerate(chunks, 1):
            # Include document and section context
            header = f"[Source {i}: {chunk.document_title}"
            if chunk.heading_context:
                header += f" > {' > '.join(chunk.heading_context)}"
            header += "]"
            
            context_parts.append(f"{header}\n{chunk.content}\n")
        
        return "\n".join(context_parts)
    
    async def generate_response(self, query: str, context: str) -> str:
        """
        Generate LLM response using retrieved context.
        """
        prompt = f"""You are an AI assistant helping with software specification documents.
        
User Question: {query}

Relevant Documentation:
{context}

Instructions:
1. Answer the question based ONLY on the provided documentation
2. If the documentation doesn't contain the answer, say so
3. Cite specific sections when referencing information
4. Be precise and technical in your response
5. Format code examples properly

Answer:"""
        
        response = await self.llm_client.generate(
            prompt=prompt,
            max_tokens=1000,
            temperature=0.3  # Low temperature for factual responses
        )
        
        return response
```

---

### 4. Git Repository Integration

#### Git Configuration

```typescript
interface GitRepository {
  id: string;                          // UUID
  name: string;                        // "aiwhisper-specs"
  provider: 'github' | 'gitlab' | 'bitbucket';
  
  // Connection
  url: string;                         // "https://github.com/user/repo"
  owner: string;                       // "username" or "org"
  repo_name: string;                   // "aiwhisper-specs"
  
  // Authentication
  auth_type: 'token' | 'oauth' | 'ssh';
  credentials: {
    token?: string;                    // Personal access token
    oauth_token?: string;              // OAuth access token
    ssh_key?: string;                  // SSH private key
  };
  
  // Configuration
  default_branch: string;              // "main" or "master"
  specs_directory: string;             // "docs/specifications"
  auto_sync: boolean;                  // Auto-push on save
  require_pr: boolean;                 // Create PR instead of direct push
  
  // Metadata
  created_at: Date;
  last_synced: Date;
  sync_status: 'connected' | 'syncing' | 'error';
  sync_error?: string;
}
```

#### Document-Git Sync

```typescript
interface GitSyncOperation {
  id: string;
  operation_type: 'push' | 'pull' | 'create_pr';
  status: 'pending' | 'in_progress' | 'completed' | 'failed';
  
  // Target
  repository_id: string;
  branch: string;
  
  // Documents
  documents: {
    document_id: string;
    file_path: string;                 // Path in repo
    action: 'create' | 'update' | 'delete';
    content_hash: string;              // For change detection
  }[];
  
  // Git details
  commit_message: string;
  commit_sha?: string;                 // After completion
  pr_url?: string;                     // If PR created
  
  // Metadata
  initiated_by: string;                // User ID
  initiated_at: Date;
  completed_at?: Date;
  error_message?: string;
}
```

#### Git Sync Service

```python
class GitSyncService:
    """
    Service for syncing specification documents with Git repositories.
    """
    
    def __init__(self, git_provider: GitProvider):
        self.git_provider = git_provider
    
    async def push_documents(
        self,
        repository: GitRepository,
        documents: List[SpecificationDocument],
        commit_message: str,
        create_pr: bool = False
    ) -> GitSyncOperation:
        """
        Push specification documents to Git repository.
        """
        operation = GitSyncOperation(
            operation_type='create_pr' if create_pr else 'push',
            status='in_progress',
            repository_id=repository.id,
            branch=repository.default_branch,
            documents=[],
            commit_message=commit_message
        )
        
        try:
            # 1. Create temporary branch if PR requested
            if create_pr:
                branch_name = f"specs-update-{datetime.now().strftime('%Y%m%d-%H%M%S')}"
                await self.git_provider.create_branch(
                    repository=repository,
                    branch_name=branch_name,
                    from_branch=repository.default_branch
                )
                operation.branch = branch_name
            
            # 2. Prepare file changes
            file_changes = []
            for doc in documents:
                file_path = self._get_file_path(repository, doc)
                
                # Check if file exists and has changes
                existing_content = await self.git_provider.get_file_content(
                    repository=repository,
                    file_path=file_path,
                    branch=operation.branch
                )
                
                if existing_content:
                    existing_hash = hashlib.sha256(existing_content.encode()).hexdigest()
                    if existing_hash == doc.content_hash:
                        continue  # No changes
                    action = 'update'
                else:
                    action = 'create'
                
                file_changes.append({
                    'path': file_path,
                    'content': doc.content,
                    'action': action
                })
                
                operation.documents.append({
                    'document_id': doc.id,
                    'file_path': file_path,
                    'action': action,
                    'content_hash': doc.content_hash
                })
            
            if not file_changes:
                operation.status = 'completed'
                operation.completed_at = datetime.now()
                return operation
            
            # 3. Commit changes
            commit_sha = await self.git_provider.commit_files(
                repository=repository,
                branch=operation.branch,
                files=file_changes,
                message=commit_message
            )
            
            operation.commit_sha = commit_sha
            
            # 4. Create PR if requested
            if create_pr:
                pr_url = await self.git_provider.create_pull_request(
                    repository=repository,
                    source_branch=operation.branch,
                    target_branch=repository.default_branch,
                    title=commit_message,
                    description=self._generate_pr_description(operation)
                )
                operation.pr_url = pr_url
            
            # 5. Update document git_info
            for doc_info in operation.documents:
                await self.update_document_git_info(
                    document_id=doc_info['document_id'],
                    repository_id=repository.id,
                    branch=operation.branch,
                    file_path=doc_info['file_path'],
                    commit_sha=commit_sha
                )
            
            operation.status = 'completed'
            operation.completed_at = datetime.now()
            
        except Exception as e:
            operation.status = 'failed'
            operation.error_message = str(e)
            logging.error(f"Git sync failed: {e}")
        
        return operation
    
    async def pull_documents(
        self,
        repository: GitRepository,
        storage_unit_id: string
    ) -> List[SpecificationDocument]:
        """
        Pull specification documents from Git repository.
        """
        # 1. List files in specs directory
        files = await self.git_provider.list_files(
            repository=repository,
            directory=repository.specs_directory,
            branch=repository.default_branch
        )
        
        # 2. Download and process each file
        documents = []
        for file_info in files:
            if not file_info['path'].endswith('.md'):
                continue
            
            content = await self.git_provider.get_file_content(
                repository=repository,
                file_path=file_info['path'],
                branch=repository.default_branch
            )
            
            # Check if document already exists
            existing_doc = await self.find_document_by_git_path(
                repository_id=repository.id,
                file_path=file_info['path']
            )
            
            content_hash = hashlib.sha256(content.encode()).hexdigest()
            
            if existing_doc:
                # Update existing document if changed
                if existing_doc.content_hash != content_hash:
                    existing_doc.content = content
                    existing_doc.content_hash = content_hash
                    existing_doc.updated_at = datetime.now()
                    existing_doc.git_info.last_commit_sha = file_info['sha']
                    existing_doc.git_info.last_synced = datetime.now()
                    await self.save_document(existing_doc)
                documents.append(existing_doc)
            else:
                # Create new document
                doc = SpecificationDocument(
                    storage_unit_id=storage_unit_id,
                    title=self._extract_title(content),
                    filename=os.path.basename(file_info['path']),
                    content=content,
                    content_hash=content_hash,
                    file_type='markdown',
                    status='approved',
                    git_info={
                        'repository_id': repository.id,
                        'branch': repository.default_branch,
                        'file_path': file_info['path'],
                        'last_commit_sha': file_info['sha'],
                        'last_synced': datetime.now()
                    }
                )
                await self.save_document(doc)
                documents.append(doc)
        
        return documents
```

---

## Database Schema

### PostgreSQL Tables

```sql
-- Storage units
CREATE TABLE storage_units (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(255) NOT NULL,
    description TEXT,
    type VARCHAR(50) NOT NULL CHECK (type IN ('project', 'template', 'archive', 'reference')),
    created_at TIMESTAMP NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMP NOT NULL DEFAULT NOW(),
    owner_id VARCHAR(255) NOT NULL,
    access_level VARCHAR(20) NOT NULL CHECK (access_level IN ('private', 'team', 'public')),
    metadata JSONB DEFAULT '{}'::jsonb,
    CONSTRAINT valid_type CHECK (type IN ('project', 'template', 'archive', 'reference'))
);

-- Documents
CREATE TABLE specification_documents (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    storage_unit_id UUID NOT NULL REFERENCES storage_units(id) ON DELETE CASCADE,
    title VARCHAR(500) NOT NULL,
    filename VARCHAR(255) NOT NULL,
    content TEXT NOT NULL,
    content_hash VARCHAR(64) NOT NULL,
    file_type VARCHAR(50) NOT NULL,
    version VARCHAR(20) DEFAULT '1.0.0',
    status VARCHAR(20) NOT NULL CHECK (status IN ('draft', 'review', 'approved', 'archived')),
    created_at TIMESTAMP NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMP NOT NULL DEFAULT NOW(),
    author_id VARCHAR(255) NOT NULL,
    tags TEXT[] DEFAULT ARRAY[]::TEXT[],
    category VARCHAR(100),
    dependencies UUID[] DEFAULT ARRAY[]::UUID[],
    embedding_ids TEXT[] DEFAULT ARRAY[]::TEXT[],
    chunk_count INTEGER DEFAULT 0,
    git_info JSONB,
    CONSTRAINT unique_storage_filename UNIQUE (storage_unit_id, filename)
);

-- Project-document links
CREATE TABLE project_document_links (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    project_id INTEGER NOT NULL REFERENCES projects(id) ON DELETE CASCADE,
    storage_unit_id UUID NOT NULL REFERENCES storage_units(id) ON DELETE CASCADE,
    linked_at TIMESTAMP NOT NULL DEFAULT NOW(),
    linked_by VARCHAR(255) NOT NULL,
    access_mode VARCHAR(10) NOT NULL CHECK (access_mode IN ('read', 'write')),
    filters JSONB DEFAULT '{}'::jsonb,
    CONSTRAINT unique_project_storage UNIQUE (project_id, storage_unit_id)
);

-- Git repositories
CREATE TABLE git_repositories (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(255) NOT NULL,
    provider VARCHAR(50) NOT NULL CHECK (provider IN ('github', 'gitlab', 'bitbucket')),
    url VARCHAR(500) NOT NULL,
    owner VARCHAR(255) NOT NULL,
    repo_name VARCHAR(255) NOT NULL,
    auth_type VARCHAR(20) NOT NULL CHECK (auth_type IN ('token', 'oauth', 'ssh')),
    credentials JSONB NOT NULL,  -- Encrypted
    default_branch VARCHAR(100) DEFAULT 'main',
    specs_directory VARCHAR(500) DEFAULT 'docs/specifications',
    auto_sync BOOLEAN DEFAULT false,
    require_pr BOOLEAN DEFAULT false,
    created_at TIMESTAMP NOT NULL DEFAULT NOW(),
    last_synced TIMESTAMP,
    sync_status VARCHAR(20) DEFAULT 'connected',
    sync_error TEXT,
    CONSTRAINT unique_repo UNIQUE (provider, owner, repo_name)
);

-- Git sync operations
CREATE TABLE git_sync_operations (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    operation_type VARCHAR(20) NOT NULL CHECK (operation_type IN ('push', 'pull', 'create_pr')),
    status VARCHAR(20) NOT NULL CHECK (status IN ('pending', 'in_progress', 'completed', 'failed')),
    repository_id UUID NOT NULL REFERENCES git_repositories(id) ON DELETE CASCADE,
    branch VARCHAR(100) NOT NULL,
    documents JSONB NOT NULL DEFAULT '[]'::jsonb,
    commit_message TEXT,
    commit_sha VARCHAR(40),
    pr_url VARCHAR(500),
    initiated_by VARCHAR(255) NOT NULL,
    initiated_at TIMESTAMP NOT NULL DEFAULT NOW(),
    completed_at TIMESTAMP,
    error_message TEXT
);

-- Indexes
CREATE INDEX idx_documents_storage_unit ON specification_documents(storage_unit_id);
CREATE INDEX idx_documents_content_hash ON specification_documents(content_hash);
CREATE INDEX idx_documents_status ON specification_documents(status);
CREATE INDEX idx_documents_tags ON specification_documents USING GIN(tags);
CREATE INDEX idx_project_links_project ON project_document_links(project_id);
CREATE INDEX idx_project_links_storage ON project_document_links(storage_unit_id);
CREATE INDEX idx_sync_operations_repo ON git_sync_operations(repository_id);
CREATE INDEX idx_sync_operations_status ON git_sync_operations(status);
```

---

## API Endpoints

### Storage Units

```typescript
// Create storage unit
POST /api/storage-units
Body: {
  name: string;
  description: string;
  type: 'project' | 'template' | 'archive' | 'reference';
  access_level: 'private' | 'team' | 'public';
}

// List storage units
GET /api/storage-units?type=project&access_level=team

// Get storage unit
GET /api/storage-units/:id

// Update storage unit
PATCH /api/storage-units/:id

// Delete storage unit
DELETE /api/storage-units/:id
```

### Documents

```typescript
// Upload document
POST /api/storage-units/:storageUnitId/documents
Body: FormData {
  file: File;
  title?: string;
  tags?: string[];
  category?: string;
}

// List documents in storage unit
GET /api/storage-units/:storageUnitId/documents

// Get document
GET /api/documents/:id

// Update document
PATCH /api/documents/:id
Body: {
  content?: string;
  title?: string;
  tags?: string[];
  status?: string;
}

// Delete document
DELETE /api/documents/:id

// Process document for RAG (create embeddings)
POST /api/documents/:id/process
```

### RAG Queries

```typescript
// Query documents
POST /api/rag/query
Body: {
  query: string;
  project_id?: number;
  storage_unit_ids?: string[];
  filters?: {
    tags?: string[];
    categories?: string[];
  };
  top_k?: number;
}

Response: {
  chunks: RetrievedChunk[];
  generated_response: string;
  sources: DocumentReference[];
  confidence_score: number;
}

// Get similar documents
POST /api/rag/similar
Body: {
  document_id: string;
  top_k?: number;
}
```

### Project-Document Links

```typescript
// Link storage unit to project
POST /api/projects/:projectId/document-links
Body: {
  storage_unit_id: string;
  access_mode: 'read' | 'write';
  filters?: {
    include_tags?: string[];
  };
}

// List linked storage units
GET /api/projects/:projectId/document-links

// Unlink storage unit
DELETE /api/projects/:projectId/document-links/:linkId

// Query project documents
POST /api/projects/:projectId/documents/query
Body: {
  query: string;
  filters?: any;
}
```

### Git Integration

```typescript
// Connect Git repository
POST /api/git/repositories
Body: {
  name: string;
  provider: 'github' | 'gitlab' | 'bitbucket';
  url: string;
  auth_type: 'token' | 'oauth';
  token: string;
  specs_directory?: string;
  auto_sync?: boolean;
  require_pr?: boolean;
}

// List repositories
GET /api/git/repositories

// Test connection
POST /api/git/repositories/:id/test-connection

// Push documents to Git
POST /api/git/repositories/:id/push
Body: {
  document_ids: string[];
  commit_message: string;
  create_pr?: boolean;
}

// Pull documents from Git
POST /api/git/repositories/:id/pull
Body: {
  storage_unit_id: string;
  branch?: string;
}

// Sync status
GET /api/git/operations/:operationId
```

---

## Frontend Components

### Document Manager UI

```typescript
// Storage unit list view
<StorageUnitList
  onSelect={(unit) => setSelectedUnit(unit)}
  onCreateNew={() => setShowCreateModal(true)}
  filterType={filterType}
  sortBy={sortBy}
/>

// Document upload interface
<DocumentUpload
  storageUnitId={selectedUnit.id}
  onUploadComplete={(doc) => handleDocumentAdded(doc)}
  acceptedFormats={['.md', '.txt', '.pdf']}
  autoProcess={true}
/>

// Document viewer/editor
<DocumentEditor
  document={selectedDocument}
  onSave={(content) => handleSave(content)}
  onTagsChange={(tags) => handleTagsUpdate(tags)}
  showGitStatus={true}
/>

// RAG query interface
<RAGQueryPanel
  projectId={currentProject.id}
  linkedStorageUnits={linkedUnits}
  onQuery={(query) => handleRAGQuery(query)}
/>

// Git sync manager
<GitSyncManager
  repositories={gitRepositories}
  onPush={(repoId, docIds) => handleGitPush(repoId, docIds)}
  onPull={(repoId) => handleGitPull(repoId)}
  showSyncHistory={true}
/>
```

---

## Use Case Scenarios

### Scenario 1: Create Project with Template Specs

```typescript
// 1. User creates new project
const project = await createProject({
  name: "New SaaS Application",
  template_id: "saas-app"
});

// 2. Link UI/UX template storage unit
await linkStorageUnit({
  project_id: project.id,
  storage_unit_id: "ui-ux-template-storage-id",
  access_mode: "read",
  filters: {
    include_tags: ["ui", "theme", "component"]
  }
});

// 3. AI can now query template specs for guidance
const result = await queryRAG({
  query: "How should I implement the theme system?",
  project_id: project.id
});

// AI gets relevant chunks from UI/UX specs
// Returns: Theme system implementation details
```

### Scenario 2: Import External Specifications

```typescript
// 1. User uploads existing spec documents
const storageUnit = await createStorageUnit({
  name: "Legacy System Specs",
  type: "reference",
  access_level: "team"
});

// 2. Upload multiple documents
const documents = await Promise.all(
  files.map(file => uploadDocument({
    storage_unit_id: storageUnit.id,
    file: file,
    auto_process: true  // Generate embeddings
  }))
);

// 3. Link to current project
await linkStorageUnit({
  project_id: currentProject.id,
  storage_unit_id: storageUnit.id,
  access_mode: "read"
});

// 4. AI can now reference legacy specs
const result = await queryRAG({
  query: "How was authentication handled in the legacy system?",
  project_id: currentProject.id
});
```

### Scenario 3: Archive Project with Specs

```typescript
// 1. Project completed - archive it
const archiveStorage = await createStorageUnit({
  name: `${project.name} - Archive`,
  type: "archive",
  access_level: "team"
});

// 2. Copy all project documents to archive
const projectDocs = await getProjectDocuments(project.id);

for (const doc of projectDocs) {
  await copyDocument({
    source_document_id: doc.id,
    target_storage_unit_id: archiveStorage.id,
    preserve_metadata: true
  });
}

// 3. Push archive to Git for long-term storage
await pushToGit({
  repository_id: gitRepo.id,
  document_ids: projectDocs.map(d => d.id),
  commit_message: `Archive: ${project.name} specifications`,
  create_pr: false
});

// 4. Later, can retrieve archived specs
const archivedSpecs = await pullFromGit({
  repository_id: gitRepo.id,
  storage_unit_id: archiveStorage.id
});
```

### Scenario 4: Collaborate via Git

```typescript
// 1. Push specs to Git for review
const syncOp = await pushToGit({
  repository_id: gitRepo.id,
  document_ids: documentIds,
  commit_message: "Update: Theme system specifications",
  create_pr: true  // Create PR instead of direct push
});

// 2. Team reviews PR on GitHub
// (External process)

// 3. After merge, pull updates
const updated = await pullFromGit({
  repository_id: gitRepo.id,
  storage_unit_id: storageUnit.id
});

// 4. Documents auto-update with approved changes
// Embeddings regenerated for changed documents
```

---

## Implementation Roadmap

### Phase 1: Core RAG System (MVP)
- [ ] Storage unit management
- [ ] Document upload and storage
- [ ] ChromaDB integration
- [ ] Basic text chunking and embedding
- [ ] Simple RAG query endpoint
- [ ] PostgreSQL schema

### Phase 2: Project Integration
- [ ] Project-document linking
- [ ] Project-specific queries
- [ ] Document filtering and tagging
- [ ] UI for document management

### Phase 3: Git Integration
- [ ] GitHub connection
- [ ] Push documents to repo
- [ ] Pull documents from repo
- [ ] Sync status tracking

### Phase 4: Advanced Features
- [ ] Auto-sync on save
- [ ] PR creation workflow
- [ ] Document versioning
- [ ] Conflict resolution
- [ ] GitLab/Bitbucket support

### Phase 5: AI Enhancements
- [ ] Spec quality analysis
- [ ] Auto-categorization
- [ ] Similarity detection
- [ ] Specification templates
- [ ] Guided spec creation

---

## Next Document

Proceed to **13_RAG_IMPLEMENTATION_GUIDE.md** for detailed implementation steps and code examples.

