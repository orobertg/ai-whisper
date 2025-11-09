# RAG Implementation Guide

**Document:** 13_RAG_IMPLEMENTATION_GUIDE.md  
**Version:** 1.0  
**Purpose:** Step-by-step implementation guide for the RAG system

---

## Quick Start Guide

### Prerequisites

```bash
# Python dependencies
pip install chromadb==0.4.18
pip install langchain==0.1.0
pip install openai==1.3.0
pip install sentence-transformers==2.2.2
pip install PyGithub==2.1.1
pip install python-dotenv==1.0.0

# Or use requirements.txt
pip install -r requirements-rag.txt
```

### Minimal Working Example

```python
# minimal_rag.py
import chromadb
from sentence_transformers import SentenceTransformer
from typing import List

class MinimalRAG:
    def __init__(self):
        # Initialize embedding model
        self.embedder = SentenceTransformer('all-MiniLM-L6-v2')
        
        # Initialize ChromaDB
        self.client = chromadb.Client()
        self.collection = self.client.create_collection(
            name="specs",
            metadata={"description": "Specification documents"}
        )
    
    def add_document(self, doc_id: str, content: str, metadata: dict):
        """Add document to vector store."""
        # Generate embedding
        embedding = self.embedder.encode(content).tolist()
        
        # Store in ChromaDB
        self.collection.add(
            ids=[doc_id],
            documents=[content],
            embeddings=[embedding],
            metadatas=[metadata]
        )
    
    def query(self, query_text: str, top_k: int = 5) -> List[dict]:
        """Query for relevant documents."""
        # Generate query embedding
        query_embedding = self.embedder.encode(query_text).tolist()
        
        # Query ChromaDB
        results = self.collection.query(
            query_embeddings=[query_embedding],
            n_results=top_k
        )
        
        return [{
            'content': results['documents'][0][i],
            'metadata': results['metadatas'][0][i],
            'score': 1 - results['distances'][0][i]  # Convert distance to similarity
        } for i in range(len(results['ids'][0]))]

# Usage
rag = MinimalRAG()

# Add document
rag.add_document(
    doc_id="theme-system-1",
    content="The theme system supports three modes: light, dark, and translucent...",
    metadata={"title": "Theme System", "category": "architecture"}
)

# Query
results = rag.query("How does the theme system work?")
for result in results:
    print(f"Score: {result['score']:.2f}")
    print(f"Content: {result['content'][:100]}...")
```

---

## Backend Implementation

### 1. Document Processing Service

```python
# backend/services/document_service.py
import hashlib
import re
from typing import List, Dict
from dataclasses import dataclass

@dataclass
class DocumentChunk:
    content: str
    heading_context: List[str]
    chunk_index: int
    start_char: int
    end_char: int

class DocumentProcessor:
    """Process documents for RAG storage."""
    
    def __init__(self, chunk_size: int = 1000, chunk_overlap: int = 100):
        self.chunk_size = chunk_size
        self.chunk_overlap = chunk_overlap
    
    def process_markdown(self, content: str) -> List[DocumentChunk]:
        """
        Process markdown document into semantic chunks.
        
        Strategy:
        1. Parse markdown structure
        2. Split by headings
        3. Keep code blocks intact
        4. Add overlap between chunks
        """
        chunks = []
        sections = self._parse_markdown_sections(content)
        
        chunk_index = 0
        for section in sections:
            if len(section['content']) <= self.chunk_size:
                # Small section - single chunk
                chunks.append(DocumentChunk(
                    content=section['content'],
                    heading_context=section['heading_path'],
                    chunk_index=chunk_index,
                    start_char=section['start_pos'],
                    end_char=section['end_pos']
                ))
                chunk_index += 1
            else:
                # Large section - split with overlap
                section_chunks = self._split_with_overlap(
                    content=section['content'],
                    heading_context=section['heading_path'],
                    start_index=chunk_index,
                    start_pos=section['start_pos']
                )
                chunks.extend(section_chunks)
                chunk_index += len(section_chunks)
        
        return chunks
    
    def _parse_markdown_sections(self, content: str) -> List[Dict]:
        """Parse markdown into hierarchical sections."""
        sections = []
        lines = content.split('\n')
        
        current_section = {
            'heading_path': [],
            'content': '',
            'start_pos': 0,
            'end_pos': 0,
            'level': 0
        }
        
        heading_stack = []  # Track heading hierarchy
        pos = 0
        
        for line in lines:
            line_length = len(line) + 1  # +1 for newline
            
            # Check if line is a heading
            heading_match = re.match(r'^(#{1,6})\s+(.+)$', line)
            
            if heading_match:
                # Save previous section if it has content
                if current_section['content'].strip():
                    current_section['end_pos'] = pos
                    sections.append(current_section.copy())
                
                # Parse new heading
                level = len(heading_match.group(1))
                heading_text = heading_match.group(2).strip()
                
                # Update heading stack
                heading_stack = heading_stack[:level-1]  # Pop deeper levels
                heading_stack.append(heading_text)
                
                # Start new section
                current_section = {
                    'heading_path': heading_stack.copy(),
                    'content': line + '\n',
                    'start_pos': pos,
                    'end_pos': 0,
                    'level': level
                }
            else:
                current_section['content'] += line + '\n'
            
            pos += line_length
        
        # Add final section
        if current_section['content'].strip():
            current_section['end_pos'] = pos
            sections.append(current_section)
        
        return sections
    
    def _split_with_overlap(
        self,
        content: str,
        heading_context: List[str],
        start_index: int,
        start_pos: int
    ) -> List[DocumentChunk]:
        """Split large content with overlap."""
        chunks = []
        paragraphs = self._split_by_paragraphs(content)
        
        current_chunk = ""
        current_start = start_pos
        chunk_index = start_index
        
        for i, para in enumerate(paragraphs):
            # Add paragraph to current chunk
            test_chunk = current_chunk + para + "\n\n"
            
            if len(test_chunk) > self.chunk_size and current_chunk:
                # Current chunk is full, save it
                chunks.append(DocumentChunk(
                    content=current_chunk.strip(),
                    heading_context=heading_context,
                    chunk_index=chunk_index,
                    start_char=current_start,
                    end_char=current_start + len(current_chunk)
                ))
                chunk_index += 1
                
                # Start new chunk with overlap
                overlap_text = current_chunk[-self.chunk_overlap:] if len(current_chunk) > self.chunk_overlap else current_chunk
                current_chunk = overlap_text + para + "\n\n"
                current_start += len(current_chunk) - len(overlap_text)
            else:
                current_chunk = test_chunk
        
        # Add final chunk
        if current_chunk.strip():
            chunks.append(DocumentChunk(
                content=current_chunk.strip(),
                heading_context=heading_context,
                chunk_index=chunk_index,
                start_char=current_start,
                end_char=current_start + len(current_chunk)
            ))
        
        return chunks
    
    def _split_by_paragraphs(self, content: str) -> List[str]:
        """Split content by paragraphs, keeping code blocks intact."""
        # Split by double newlines, but preserve code blocks
        in_code_block = False
        paragraphs = []
        current_para = ""
        
        for line in content.split('\n'):
            if line.strip().startswith('```'):
                in_code_block = not in_code_block
            
            if not in_code_block and not line.strip():
                if current_para.strip():
                    paragraphs.append(current_para.strip())
                    current_para = ""
            else:
                current_para += line + '\n'
        
        if current_para.strip():
            paragraphs.append(current_para.strip())
        
        return paragraphs
    
    def generate_content_hash(self, content: str) -> str:
        """Generate SHA-256 hash of content."""
        return hashlib.sha256(content.encode('utf-8')).hexdigest()
```

### 2. Vector Store Service

```python
# backend/services/vector_store.py
import chromadb
from chromadb.config import Settings
from sentence_transformers import SentenceTransformer
from typing import List, Dict, Optional
import os

class VectorStoreService:
    """Manage vector embeddings in ChromaDB."""
    
    def __init__(self, persist_directory: str = "./chroma_db"):
        # Initialize embedding model
        self.embedder = SentenceTransformer('all-MiniLM-L6-v2')  # 384-dim
        # For better quality, use: 'sentence-transformers/all-mpnet-base-v2'  # 768-dim
        
        # Initialize ChromaDB with persistence
        self.client = chromadb.Client(Settings(
            chroma_db_impl="duckdb+parquet",
            persist_directory=persist_directory
        ))
    
    def get_or_create_collection(
        self,
        storage_unit_id: str,
        storage_unit_name: str
    ):
        """Get or create collection for storage unit."""
        collection_name = f"storage_{storage_unit_id}"
        
        try:
            collection = self.client.get_collection(name=collection_name)
        except:
            collection = self.client.create_collection(
                name=collection_name,
                metadata={
                    "storage_unit_id": storage_unit_id,
                    "storage_unit_name": storage_unit_name
                }
            )
        
        return collection
    
    def add_document_chunks(
        self,
        storage_unit_id: str,
        document_id: str,
        chunks: List[Dict],
        document_metadata: Dict
    ) -> List[str]:
        """Add document chunks to vector store."""
        collection = self.get_or_create_collection(
            storage_unit_id=storage_unit_id,
            storage_unit_name=document_metadata.get('storage_unit_name', 'Unknown')
        )
        
        # Generate embeddings for all chunks
        chunk_texts = [chunk['content'] for chunk in chunks]
        embeddings = self.embedder.encode(chunk_texts).tolist()
        
        # Prepare data for ChromaDB
        ids = []
        metadatas = []
        
        for i, chunk in enumerate(chunks):
            chunk_id = f"{document_id}_chunk_{i}"
            ids.append(chunk_id)
            
            # Combine chunk metadata with document metadata
            metadata = {
                'document_id': document_id,
                'storage_unit_id': storage_unit_id,
                'chunk_index': i,
                'heading_context': ' > '.join(chunk['heading_context']),
                **document_metadata
            }
            metadatas.append(metadata)
        
        # Add to collection
        collection.add(
            ids=ids,
            embeddings=embeddings,
            documents=chunk_texts,
            metadatas=metadatas
        )
        
        return ids
    
    def query(
        self,
        query_text: str,
        storage_unit_ids: Optional[List[str]] = None,
        filters: Optional[Dict] = None,
        top_k: int = 5
    ) -> List[Dict]:
        """Query across storage units."""
        # Generate query embedding
        query_embedding = self.embedder.encode([query_text])[0].tolist()
        
        # Determine which collections to query
        if storage_unit_ids:
            collections = [
                self.get_or_create_collection(sid, "")
                for sid in storage_unit_ids
            ]
        else:
            # Query all collections
            collections = self.client.list_collections()
        
        # Query each collection
        all_results = []
        for collection in collections:
            # Build where clause from filters
            where_clause = {}
            if filters:
                if 'tags' in filters:
                    where_clause['tags'] = {'$in': filters['tags']}
                if 'category' in filters:
                    where_clause['category'] = filters['category']
            
            results = collection.query(
                query_embeddings=[query_embedding],
                n_results=top_k,
                where=where_clause if where_clause else None
            )
            
            # Format results
            if results['ids'][0]:
                for i in range(len(results['ids'][0])):
                    all_results.append({
                        'chunk_id': results['ids'][0][i],
                        'content': results['documents'][0][i],
                        'metadata': results['metadatas'][0][i],
                        'similarity_score': 1 - results['distances'][0][i]
                    })
        
        # Sort by similarity and return top_k
        all_results.sort(key=lambda x: x['similarity_score'], reverse=True)
        return all_results[:top_k]
    
    def delete_document(self, storage_unit_id: str, document_id: str):
        """Delete all chunks of a document."""
        collection = self.get_or_create_collection(storage_unit_id, "")
        
        # Query for all chunks of this document
        results = collection.get(
            where={"document_id": document_id}
        )
        
        if results['ids']:
            collection.delete(ids=results['ids'])
```

### 3. RAG Query Service

```python
# backend/services/rag_service.py
from typing import List, Dict, Optional
import openai
import os

class RAGQueryService:
    """Handle RAG queries with LLM generation."""
    
    def __init__(
        self,
        vector_store: VectorStoreService,
        llm_provider: str = "openai",
        model: str = "gpt-4"
    ):
        self.vector_store = vector_store
        self.llm_provider = llm_provider
        self.model = model
        
        if llm_provider == "openai":
            openai.api_key = os.getenv("OPENAI_API_KEY")
    
    async def query(
        self,
        query_text: str,
        storage_unit_ids: Optional[List[str]] = None,
        filters: Optional[Dict] = None,
        top_k: int = 5,
        temperature: float = 0.3
    ) -> Dict:
        """
        Execute RAG query: retrieve + generate.
        """
        # 1. Retrieve relevant chunks
        retrieved_chunks = self.vector_store.query(
            query_text=query_text,
            storage_unit_ids=storage_unit_ids,
            filters=filters,
            top_k=top_k
        )
        
        if not retrieved_chunks:
            return {
                'chunks': [],
                'generated_response': "I couldn't find relevant information in the documentation to answer this question.",
                'sources': [],
                'confidence_score': 0.0
            }
        
        # 2. Build context for LLM
        context = self._build_context(retrieved_chunks)
        
        # 3. Generate response
        response = await self._generate_response(
            query=query_text,
            context=context,
            temperature=temperature
        )
        
        # 4. Extract sources
        sources = self._extract_sources(retrieved_chunks)
        
        # 5. Calculate confidence
        confidence = self._calculate_confidence(retrieved_chunks)
        
        return {
            'chunks': retrieved_chunks,
            'generated_response': response,
            'sources': sources,
            'confidence_score': confidence
        }
    
    def _build_context(self, chunks: List[Dict]) -> str:
        """Build context string from retrieved chunks."""
        context_parts = []
        
        for i, chunk in enumerate(chunks, 1):
            metadata = chunk['metadata']
            
            # Build source header
            header = f"[Source {i}: {metadata.get('title', 'Unknown')}"
            if metadata.get('heading_context'):
                header += f" > {metadata['heading_context']}"
            header += f"] (Relevance: {chunk['similarity_score']:.2f})"
            
            # Add content
            context_parts.append(f"{header}\n{chunk['content']}\n")
        
        return "\n".join(context_parts)
    
    async def _generate_response(
        self,
        query: str,
        context: str,
        temperature: float
    ) -> str:
        """Generate LLM response using retrieved context."""
        
        system_prompt = """You are an AI assistant specializing in software specification documents.

Your role is to:
1. Answer questions based ONLY on the provided documentation
2. Be precise and technical in your responses
3. Cite specific sections when referencing information
4. Format code examples properly with syntax highlighting
5. If the documentation doesn't contain the answer, say so clearly
6. Provide actionable guidance when appropriate

Guidelines:
- Use the exact terminology from the documentation
- Preserve code structure and formatting
- Mention document names and sections when citing
- If multiple sources conflict, note the discrepancy
- Be concise but complete in your answers"""

        user_prompt = f"""Based on the following documentation excerpts, please answer the question.

Question: {query}

Documentation:
{context}

Please provide a detailed answer based on the documentation above. If the documentation doesn't fully answer the question, indicate what information is missing."""

        if self.llm_provider == "openai":
            response = await openai.ChatCompletion.acreate(
                model=self.model,
                messages=[
                    {"role": "system", "content": system_prompt},
                    {"role": "user", "content": user_prompt}
                ],
                temperature=temperature,
                max_tokens=1000
            )
            return response.choices[0].message.content
        else:
            raise ValueError(f"Unsupported LLM provider: {self.llm_provider}")
    
    def _extract_sources(self, chunks: List[Dict]) -> List[Dict]:
        """Extract unique document sources."""
        sources_dict = {}
        
        for chunk in chunks:
            metadata = chunk['metadata']
            doc_id = metadata.get('document_id')
            
            if doc_id not in sources_dict:
                sources_dict[doc_id] = {
                    'document_id': doc_id,
                    'title': metadata.get('title', 'Unknown'),
                    'filename': metadata.get('filename', ''),
                    'category': metadata.get('category', ''),
                    'relevant_sections': set()
                }
            
            # Add heading context if available
            if metadata.get('heading_context'):
                sources_dict[doc_id]['relevant_sections'].add(
                    metadata['heading_context']
                )
        
        # Convert sets to lists
        sources = []
        for source in sources_dict.values():
            source['relevant_sections'] = list(source['relevant_sections'])
            sources.append(source)
        
        return sources
    
    def _calculate_confidence(self, chunks: List[Dict]) -> float:
        """Calculate confidence score based on retrieval quality."""
        if not chunks:
            return 0.0
        
        # Average similarity score of top chunks
        avg_similarity = sum(c['similarity_score'] for c in chunks) / len(chunks)
        
        # Penalize if top score is low
        top_score = chunks[0]['similarity_score'] if chunks else 0
        
        # Confidence is weighted average
        confidence = (0.7 * top_score) + (0.3 * avg_similarity)
        
        return round(confidence, 2)
```

---

## Frontend Implementation

### Document Manager Component

```typescript
// frontend/components/DocumentManager.tsx
'use client';

import { useState, useEffect } from 'react';
import { useTheme } from '@/contexts/ThemeContext';

interface StorageUnit {
  id: string;
  name: string;
  type: 'project' | 'template' | 'archive' | 'reference';
  document_count: number;
}

interface Document {
  id: string;
  title: string;
  filename: string;
  status: string;
  tags: string[];
  updated_at: Date;
}

export default function DocumentManager() {
  const { isLight } = useTheme();
  const [storageUnits, setStorageUnits] = useState<StorageUnit[]>([]);
  const [selectedUnit, setSelectedUnit] = useState<StorageUnit | null>(null);
  const [documents, setDocuments] = useState<Document[]>([]);
  const [loading, setLoading] = useState(true);
  
  useEffect(() => {
    loadStorageUnits();
  }, []);
  
  const loadStorageUnits = async () => {
    try {
      const response = await fetch('/api/storage-units');
      const data = await response.json();
      setStorageUnits(data.storage_units);
    } catch (error) {
      console.error('Failed to load storage units:', error);
    } finally {
      setLoading(false);
    }
  };
  
  const loadDocuments = async (unitId: string) => {
    try {
      const response = await fetch(`/api/storage-units/${unitId}/documents`);
      const data = await response.json();
      setDocuments(data.documents);
    } catch (error) {
      console.error('Failed to load documents:', error);
    }
  };
  
  const handleUpload = async (files: FileList) => {
    if (!selectedUnit) return;
    
    const formData = new FormData();
    for (let i = 0; i < files.length; i++) {
      formData.append('files', files[i]);
    }
    
    try {
      const response = await fetch(
        `/api/storage-units/${selectedUnit.id}/documents`,
        {
          method: 'POST',
          body: formData
        }
      );
      
      if (response.ok) {
        loadDocuments(selectedUnit.id);
      }
    } catch (error) {
      console.error('Upload failed:', error);
    }
  };
  
  return (
    <div className="flex h-screen">
      {/* Sidebar - Storage Units */}
      <div className={`w-64 border-r ${isLight ? 'bg-zinc-50 border-zinc-200' : 'bg-zinc-900 border-zinc-800'} p-4`}>
        <h2 className="text-lg font-semibold mb-4">Storage Units</h2>
        
        {loading ? (
          <div>Loading...</div>
        ) : (
          <div className="space-y-2">
            {storageUnits.map(unit => (
              <button
                key={unit.id}
                onClick={() => {
                  setSelectedUnit(unit);
                  loadDocuments(unit.id);
                }}
                className={`
                  w-full text-left p-3 rounded-lg transition-colors
                  ${selectedUnit?.id === unit.id
                    ? (isLight ? 'bg-blue-50 text-blue-700' : 'bg-zinc-800 text-white')
                    : (isLight ? 'hover:bg-zinc-100' : 'hover:bg-zinc-800')
                  }
                `}
              >
                <div className="font-medium">{unit.name}</div>
                <div className="text-xs opacity-60">
                  {unit.document_count} documents
                </div>
              </button>
            ))}
          </div>
        )}
      </div>
      
      {/* Main Content - Documents */}
      <div className="flex-1 p-6">
        {selectedUnit ? (
          <>
            <div className="flex items-center justify-between mb-6">
              <h1 className="text-2xl font-bold">{selectedUnit.name}</h1>
              
              <label className="px-4 py-2 bg-blue-500 text-white rounded-lg cursor-pointer hover:bg-blue-600">
                Upload Documents
                <input
                  type="file"
                  multiple
                  accept=".md,.txt"
                  className="hidden"
                  onChange={(e) => e.target.files && handleUpload(e.target.files)}
                />
              </label>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {documents.map(doc => (
                <div
                  key={doc.id}
                  className={`
                    p-4 rounded-lg border transition-all
                    ${isLight
                      ? 'bg-white border-zinc-200 hover:shadow-md'
                      : 'bg-zinc-900 border-zinc-800 hover:shadow-lg'
                    }
                  `}
                >
                  <h3 className="font-medium mb-2">{doc.title}</h3>
                  <div className="text-sm opacity-60 mb-2">{doc.filename}</div>
                  <div className="flex flex-wrap gap-1">
                    {doc.tags.map(tag => (
                      <span
                        key={tag}
                        className="px-2 py-0.5 bg-blue-500/20 text-blue-600 text-xs rounded"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </>
        ) : (
          <div className="text-center text-gray-500 mt-20">
            Select a storage unit to view documents
          </div>
        )}
      </div>
    </div>
  );
}
```

### RAG Query Component

```typescript
// frontend/components/RAGQuery.tsx
'use client';

import { useState } from 'react';
import { useTheme } from '@/contexts/ThemeContext';

interface RAGResult {
  generated_response: string;
  sources: {
    title: string;
    relevant_sections: string[];
  }[];
  confidence_score: number;
}

export default function RAGQuery({ projectId }: { projectId: number }) {
  const { isLight } = useTheme();
  const [query, setQuery] = useState('');
  const [result, setResult] = useState<RAGResult | null>(null);
  const [loading, setLoading] = useState(false);
  
  const handleQuery = async () => {
    if (!query.trim()) return;
    
    setLoading(true);
    try {
      const response = await fetch('/api/rag/query', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          query,
          project_id: projectId,
          top_k: 5
        })
      });
      
      const data = await response.json();
      setResult(data);
    } catch (error) {
      console.error('Query failed:', error);
    } finally {
      setLoading(false);
    }
  };
  
  return (
    <div className="max-w-4xl mx-auto p-6">
      <h2 className="text-2xl font-bold mb-4">Ask About Specifications</h2>
      
      {/* Query Input */}
      <div className="mb-6">
        <textarea
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Ask a question about the specifications..."
          className={`
            w-full p-4 rounded-lg border resize-none
            ${isLight
              ? 'bg-white border-zinc-300'
              : 'bg-zinc-900 border-zinc-700 text-white'
            }
          `}
          rows={3}
        />
        <button
          onClick={handleQuery}
          disabled={loading || !query.trim()}
          className="mt-2 px-6 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 disabled:opacity-50"
        >
          {loading ? 'Searching...' : 'Ask'}
        </button>
      </div>
      
      {/* Results */}
      {result && (
        <div className="space-y-6">
          {/* Answer */}
          <div className={`
            p-6 rounded-lg border
            ${isLight
              ? 'bg-white border-zinc-200'
              : 'bg-zinc-900 border-zinc-800'
            }
          `}>
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-semibold">Answer</h3>
              <span className={`
                px-3 py-1 rounded-full text-sm
                ${result.confidence_score > 0.7
                  ? 'bg-green-500/20 text-green-600'
                  : result.confidence_score > 0.4
                  ? 'bg-yellow-500/20 text-yellow-600'
                  : 'bg-red-500/20 text-red-600'
                }
              `}>
                Confidence: {(result.confidence_score * 100).toFixed(0)}%
              </span>
            </div>
            <div className="prose max-w-none">
              {result.generated_response}
            </div>
          </div>
          
          {/* Sources */}
          <div className={`
            p-6 rounded-lg border
            ${isLight
              ? 'bg-zinc-50 border-zinc-200'
              : 'bg-zinc-900/50 border-zinc-800'
            }
          `}>
            <h3 className="font-semibold mb-3">Sources</h3>
            <div className="space-y-3">
              {result.sources.map((source, i) => (
                <div key={i} className="text-sm">
                  <div className="font-medium">{source.title}</div>
                  {source.relevant_sections.length > 0 && (
                    <div className="text-xs opacity-60 mt-1">
                      Sections: {source.relevant_sections.join(', ')}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
```

---

## Testing Strategy

### Unit Tests

```python
# tests/test_document_processor.py
import pytest
from services.document_service import DocumentProcessor

def test_parse_markdown_sections():
    processor = DocumentProcessor()
    
    content = """# Main Title

Some intro text.

## Section 1

Content for section 1.

### Subsection 1.1

Nested content.

## Section 2

Content for section 2."""

    sections = processor._parse_markdown_sections(content)
    
    assert len(sections) == 4
    assert sections[0]['heading_path'] == ['Main Title']
    assert sections[1]['heading_path'] == ['Main Title', 'Section 1']
    assert sections[2]['heading_path'] == ['Main Title', 'Section 1', 'Subsection 1.1']
    assert sections[3]['heading_path'] == ['Main Title', 'Section 2']

def test_chunk_with_overlap():
    processor = DocumentProcessor(chunk_size=100, chunk_overlap=20)
    
    content = "A" * 150  # Long content
    chunks = processor._split_with_overlap(
        content=content,
        heading_context=['Test'],
        start_index=0,
        start_pos=0
    )
    
    assert len(chunks) >= 2
    # Check overlap exists
    assert chunks[0].content[-20:] == chunks[1].content[:20]
```

### Integration Tests

```python
# tests/test_rag_integration.py
import pytest
from services.vector_store import VectorStoreService
from services.rag_service import RAGQueryService

@pytest.mark.asyncio
async def test_end_to_end_rag():
    # Setup
    vector_store = VectorStoreService(persist_directory="./test_chroma")
    rag_service = RAGQueryService(vector_store)
    
    # Add test document
    chunks = [
        {
            'content': 'The theme system supports three modes: light, dark, and translucent.',
            'heading_context': ['Theme System', 'Overview'],
            'chunk_index': 0
        }
    ]
    
    vector_store.add_document_chunks(
        storage_unit_id='test-unit',
        document_id='test-doc',
        chunks=chunks,
        document_metadata={'title': 'Theme System'}
    )
    
    # Query
    result = await rag_service.query(
        query_text='What theme modes are supported?',
        storage_unit_ids=['test-unit']
    )
    
    # Assertions
    assert result['confidence_score'] > 0.5
    assert 'light' in result['generated_response'].lower()
    assert len(result['sources']) > 0
```

---

## Deployment Guide

### Docker Setup

```dockerfile
# Dockerfile.rag
FROM python:3.11-slim

WORKDIR /app

# Install dependencies
COPY requirements-rag.txt .
RUN pip install --no-cache-dir -r requirements-rag.txt

# Copy application
COPY backend/ ./backend/
COPY .env .

# Create ChromaDB directory
RUN mkdir -p ./chroma_db

EXPOSE 5000

CMD ["uvicorn", "backend.main:app", "--host", "0.0.0.0", "--port", "5000"]
```

### Environment Variables

```bash
# .env
OPENAI_API_KEY=sk-...
CHROMA_PERSIST_DIR=./chroma_db
EMBEDDING_MODEL=all-MiniLM-L6-v2
LLM_MODEL=gpt-4
LLM_TEMPERATURE=0.3

# Database
DATABASE_URL=postgresql://user:pass@localhost:5432/aiwhisper

# Git Integration
GITHUB_TOKEN=ghp_...
```

---

## Performance Optimization

### 1. Batch Processing

```python
# Process multiple documents in parallel
async def process_documents_batch(documents: List[Document]):
    tasks = [process_single_document(doc) for doc in documents]
    return await asyncio.gather(*tasks)
```

### 2. Caching

```python
# Cache embeddings
from functools import lru_cache

@lru_cache(maxsize=1000)
def get_cached_embedding(text: str) -> List[float]:
    return embedder.encode(text).tolist()
```

### 3. Indexing

```sql
-- Add indexes for fast queries
CREATE INDEX idx_docs_storage_tags ON specification_documents USING GIN(tags);
CREATE INDEX idx_docs_category ON specification_documents(category);
```

---

## Next Steps

1. **Implement Core RAG** - Follow minimal example
2. **Add Document Upload** - Implement document manager UI
3. **Test with Real Specs** - Use our UI/UX specs as test data
4. **Add Git Integration** - Start with GitHub
5. **Iterate on Quality** - Tune chunking and retrieval

This implementation guide provides everything needed to build the RAG system incrementally!

