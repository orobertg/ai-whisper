import { Node, Edge } from 'reactflow';

export type Template = {
  id: string;
  name: string;
  description: string;
  category: string;
  icon?: string;
  nodes: Node[];
  edges: Edge[];
  requiredNodeTypes?: {
    type: string;
    label: string;
    minCount: number;
  }[];
};

export const templates: Template[] = [
  {
    id: 'saas-app',
    name: 'SaaS Application',
    description: 'Full-stack SaaS boilerplate with auth, dashboard, and billing',
    category: 'Product/SaaS',
    icon: '🚀',
    requiredNodeTypes: [
      { type: 'feature', label: 'Core Features', minCount: 3 },
      { type: 'datamodel', label: 'Data Models', minCount: 1 },
      { type: 'technical', label: 'Technical Specs', minCount: 2 },
    ],
    nodes: [
      {
        id: 'auth',
        type: 'feature',
        position: { x: 50, y: 200 },
        data: {
          label: 'Authentication',
          description: 'User login, signup, password reset',
          status: 'todo',
          priority: 'high'
        }
      },
      {
        id: 'dashboard',
        type: 'feature',
        position: { x: 350, y: 200 },
        data: {
          label: 'Dashboard',
          description: 'Main user interface and analytics',
          status: 'todo',
          priority: 'high'
        }
      },
      {
        id: 'settings',
        type: 'feature',
        position: { x: 650, y: 100 },
        data: {
          label: 'User Settings',
          description: 'Profile, preferences, account management',
          status: 'todo',
          priority: 'medium'
        }
      },
      {
        id: 'billing',
        type: 'feature',
        position: { x: 650, y: 300 },
        data: {
          label: 'Billing & Subscriptions',
          description: 'Payment processing and plan management',
          status: 'todo',
          priority: 'high'
        }
      },
      {
        id: 'database',
        type: 'datamodel',
        position: { x: 950, y: 100 },
        data: {
          label: 'User Model',
          description: 'Core user data structure',
          fields: ['id', 'email', 'password_hash', 'created_at', 'subscription_tier']
        }
      },
      {
        id: 'api',
        type: 'technical',
        position: { x: 950, y: 300 },
        data: {
          label: 'REST API',
          description: 'Backend API endpoints',
          technology: 'FastAPI / Express'
        }
      }
    ],
    edges: [
      { id: 'e1', source: 'auth', target: 'dashboard', label: 'requires', animated: true },
      { id: 'e2', source: 'dashboard', target: 'settings', label: 'links to' },
      { id: 'e3', source: 'dashboard', target: 'billing', label: 'links to' },
      { id: 'e4', source: 'settings', target: 'database', label: 'reads/writes' },
      { id: 'e5', source: 'billing', target: 'api', label: 'uses' }
    ]
  },
  {
    id: 'api-service',
    name: 'API Service',
    description: 'RESTful API with authentication and documentation',
    category: 'Backend',
    icon: '⚡',
    requiredNodeTypes: [
      { type: 'feature', label: 'API Endpoints', minCount: 2 },
      { type: 'technical', label: 'Technical Specs', minCount: 2 },
      { type: 'datamodel', label: 'Data Models', minCount: 1 },
    ],
    nodes: [
      {
        id: 'endpoints',
        type: 'feature',
        position: { x: 50, y: 200 },
        data: {
          label: 'API Endpoints',
          description: 'Define routes and handlers',
          status: 'todo',
          priority: 'high'
        }
      },
      {
        id: 'auth',
        type: 'technical',
        position: { x: 350, y: 100 },
        data: {
          label: 'Authentication',
          description: 'JWT or OAuth2',
          technology: 'JWT'
        }
      },
      {
        id: 'validation',
        type: 'technical',
        position: { x: 350, y: 200 },
        data: {
          label: 'Request Validation',
          description: 'Input validation and sanitization',
          technology: 'Pydantic / Joi'
        }
      },
      {
        id: 'docs',
        type: 'feature',
        position: { x: 350, y: 300 },
        data: {
          label: 'API Documentation',
          description: 'OpenAPI/Swagger docs',
          status: 'todo',
          priority: 'medium'
        }
      },
      {
        id: 'models',
        type: 'datamodel',
        position: { x: 650, y: 200 },
        data: {
          label: 'Data Models',
          description: 'Database schemas',
          fields: ['User', 'Resource', 'Session']
        }
      }
    ],
    edges: [
      { id: 'e1', source: 'endpoints', target: 'auth', label: 'protected by' },
      { id: 'e2', source: 'endpoints', target: 'validation', label: 'validates' },
      { id: 'e3', source: 'endpoints', target: 'docs', label: 'documented in' },
      { id: 'e4', source: 'validation', target: 'models', label: 'uses' }
    ]
  },
  {
    id: 'mobile-app',
    name: 'Mobile App',
    description: 'Cross-platform mobile application with navigation and state',
    category: 'Mobile',
    icon: '📱',
    requiredNodeTypes: [
      { type: 'feature', label: 'Screens', minCount: 3 },
      { type: 'technical', label: 'Technical Specs', minCount: 2 },
    ],
    nodes: [
      {
        id: 'splash',
        type: 'feature',
        position: { x: 50, y: 200 },
        data: {
          label: 'Splash Screen',
          description: 'App loading and initialization',
          status: 'todo',
          priority: 'low'
        }
      },
      {
        id: 'onboarding',
        type: 'feature',
        position: { x: 350, y: 200 },
        data: {
          label: 'Onboarding',
          description: 'First-time user experience',
          status: 'todo',
          priority: 'medium'
        }
      },
      {
        id: 'home',
        type: 'feature',
        position: { x: 650, y: 200 },
        data: {
          label: 'Home Screen',
          description: 'Main app interface',
          status: 'todo',
          priority: 'high'
        }
      },
      {
        id: 'navigation',
        type: 'technical',
        position: { x: 950, y: 100 },
        data: {
          label: 'Navigation',
          description: 'Screen routing',
          technology: 'React Navigation'
        }
      },
      {
        id: 'state',
        type: 'technical',
        position: { x: 950, y: 300 },
        data: {
          label: 'State Management',
          description: 'Global app state',
          technology: 'Redux / Zustand'
        }
      }
    ],
    edges: [
      { id: 'e1', source: 'splash', target: 'onboarding', animated: true },
      { id: 'e2', source: 'onboarding', target: 'home', animated: true },
      { id: 'e3', source: 'home', target: 'navigation', label: 'uses' },
      { id: 'e4', source: 'home', target: 'state', label: 'reads/writes' }
    ]
  },
  {
    id: 'spec-driven',
    name: 'Spec-Driven Development',
    description: 'Structured specification workflow inspired by GitHub Spec-Kit',
    category: 'Methodology',
    icon: '📋',
    requiredNodeTypes: [
      { type: 'notes', label: 'Constitution/Principles', minCount: 1 },
      { type: 'userstory', label: 'Requirements', minCount: 2 },
      { type: 'feature', label: 'Features', minCount: 2 },
      { type: 'todo', label: 'Implementation Tasks', minCount: 1 },
    ],
    nodes: [
      // Phase 1: Constitution & Principles
      {
        id: 'constitution',
        type: 'notes',
        position: { x: 100, y: 50 },
        data: {
          label: 'Constitution & Principles',
          content: 'Core principles:\n- User privacy first\n- Performance matters\n- Simple > Complex\n- Test-driven development'
        }
      },
      // Phase 2: Research
      {
        id: 'research',
        type: 'notes',
        position: { x: 100, y: 250 },
        data: {
          label: 'Research & Tech Stack',
          content: 'Tech stack decisions:\n- Framework: [TBD]\n- Database: [TBD]\n- Deployment: [TBD]'
        }
      },
      // Phase 3: User Stories & Requirements
      {
        id: 'user-story-1',
        type: 'userstory',
        position: { x: 100, y: 450 },
        data: {
          label: 'Core User Need',
          description: 'As a [user], I want to [action] so that [benefit]',
          persona: 'Primary User'
        }
      },
      // Phase 4: Specification
      {
        id: 'feature-spec-1',
        type: 'feature',
        position: { x: 400, y: 450 },
        data: {
          label: 'Feature Specification',
          description: 'Detailed feature requirements and acceptance criteria',
          status: 'todo',
          priority: 'high'
        }
      },
      // Phase 5: Technical Plan
      {
        id: 'tech-plan',
        type: 'technical',
        position: { x: 700, y: 450 },
        data: {
          label: 'Technical Implementation',
          description: 'Architecture, API design, data flow',
          technology: '[Framework]'
        }
      },
      // Phase 6: Data Model
      {
        id: 'data-model',
        type: 'datamodel',
        position: { x: 1000, y: 450 },
        data: {
          label: 'Data Schema',
          description: 'Database structure and relationships',
          fields: ['id', 'created_at', 'updated_at']
        }
      },
      // Phase 7: Implementation Tasks
      {
        id: 'impl-tasks',
        type: 'todo',
        position: { x: 100, y: 650 },
        data: {
          label: 'Implementation Checklist',
          description: 'Ordered tasks for implementation',
          todos: [
            { text: 'Setup project structure', completed: false },
            { text: 'Implement data models', completed: false },
            { text: 'Build core features', completed: false },
            { text: 'Write tests', completed: false },
            { text: 'Integration testing', completed: false },
            { text: 'Deploy to staging', completed: false }
          ]
        }
      },
      // Phase 8: Validation
      {
        id: 'validation',
        type: 'todo',
        position: { x: 400, y: 650 },
        data: {
          label: 'Validation & Testing',
          description: 'Quality assurance checklist',
          todos: [
            { text: 'Unit tests pass', completed: false },
            { text: 'Integration tests pass', completed: false },
            { text: 'Manual QA complete', completed: false },
            { text: 'Performance benchmarks met', completed: false }
          ]
        }
      }
    ],
    edges: [
      // Constitution influences everything
      { id: 'e1', source: 'constitution', target: 'user-story-1', label: 'guides', animated: true },
      { id: 'e2', source: 'constitution', target: 'research', label: 'informs' },
      
      // Research informs technical decisions
      { id: 'e3', source: 'research', target: 'tech-plan', label: 'determines' },
      
      // Spec-driven flow
      { id: 'e4', source: 'user-story-1', target: 'feature-spec-1', label: 'defines', animated: true },
      { id: 'e5', source: 'feature-spec-1', target: 'tech-plan', label: 'specifies' },
      { id: 'e6', source: 'tech-plan', target: 'data-model', label: 'requires' },
      
      // Implementation phase
      { id: 'e7', source: 'feature-spec-1', target: 'impl-tasks', label: 'breaks down into' },
      { id: 'e8', source: 'tech-plan', target: 'impl-tasks', label: 'guides' },
      { id: 'e9', source: 'data-model', target: 'impl-tasks', label: 'implements' },
      
      // Validation
      { id: 'e10', source: 'impl-tasks', target: 'validation', label: 'validates' },
      { id: 'e11', source: 'feature-spec-1', target: 'validation', label: 'acceptance criteria' }
    ]
  }
];

export const blankTemplate: Template = {
  id: 'blank',
  name: 'Blank Canvas',
  description: 'Start from scratch with an empty mind map',
  category: 'Custom',
  icon: '📄',
  nodes: [],
  edges: []
};

export const TEMPLATES = [...templates, blankTemplate];

