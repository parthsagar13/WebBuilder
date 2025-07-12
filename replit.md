# MERN Stack App Builder - AI-Powered Web Application Generator

## Overview

This project has been successfully transformed from an HR Business Tool into a comprehensive AI-powered MERN stack application generator. The application now features both the original HR management functionality and a complete AI-driven code generation system that enables users to create full-stack applications through natural language prompts.

**Current Status**: ✅ Fully functional AI App Builder with working backend APIs, frontend interface, and integrated HR management tools.

## Recent Changes (January 12, 2025)

✓ Completely rebuilt data model to support AI app generation with User, Project, Template, and GenerationHistory entities
✓ Implemented comprehensive storage layer with full CRUD operations for all new entities  
✓ Added complete API routes for projects, templates, users, and AI generation endpoints
✓ Created modern React frontend with three main sections: AI Generator, My Projects, and Templates
✓ Integrated existing HR tools as a secondary feature set within the same application
✓ Built responsive UI with proper navigation, search, filtering, and project management features
✓ Added placeholder AI generation system (ready for OpenAI API integration)

## User Preferences

Preferred communication style: Simple, everyday language.

## Current Project Architecture

### Frontend Features
- **AI Generator**: Natural language prompt interface for generating MERN stack applications
- **My Projects**: Project management dashboard for viewing, organizing, and managing generated apps
- **Templates**: Pre-built application templates for quick-start development
- **HR Business Tools**: Integrated sales pipeline, revenue forecasting, and audit logging (legacy features)

### Backend API Structure
- `/api/generate` - AI-powered code generation endpoint (currently returns mock data, ready for OpenAI integration)
- `/api/projects/*` - Full CRUD operations for user projects
- `/api/templates/*` - Template management and discovery
- `/api/users/*` - User management and authentication
- Legacy HR APIs: `/api/deals/*`, `/api/revenue-projections/*`, `/api/audit-logs/*`

### Data Models
- **User**: Authentication, plan management, generation limits
- **Project**: Generated applications with code storage, status tracking, and metadata
- **Template**: Reusable application templates with categorization and popularity tracking
- **GenerationHistory**: AI generation audit trail and usage analytics
- Legacy models: Deal, RevenueProjection, AuditLog

## System Architecture

### Frontend Architecture
- **Framework**: React.js (part of MERN stack)
- **UI Libraries**: Support for multiple options including Tailwind CSS, Bootstrap, and Material UI
- **Live Preview**: Iframe or sandbox-based rendering system for real-time code preview
- **State Management**: Likely Redux or Context API for managing user projects and generated code

### Backend Architecture
- **Framework**: Node.js with Express.js
- **Database**: MongoDB for storing user projects, generated code templates, and user data
- **Authentication**: JWT-based authentication with optional Google OAuth integration
- **API Design**: RESTful APIs for project management, code generation, and file operations

### AI Integration Layer
- **Primary AI Service**: OpenAI GPT-4o API for code generation
- **Backup Services**: CodeGeeX (open-source), Replit Ghostwriter for code completions
- **Optional UI-to-Code**: Uizard Autodesigner or Builder.io integration

## Key Components

### 1. AI Code Generator
- **Purpose**: Transform natural language prompts into MERN stack code
- **Input**: User prompts describing desired application features
- **Output**: Complete frontend (React) and backend (Node.js/Express) code with MongoDB schemas
- **Integration**: OpenAI GPT-4o API with fallback to CodeGeeX

### 2. Component Library Manager
- **Purpose**: Allow users to choose and integrate different UI frameworks
- **Supported Libraries**: Tailwind CSS, Bootstrap, Material UI
- **Implementation**: Template-based code generation with library-specific components

### 3. Live Preview Engine
- **Purpose**: Provide real-time preview of generated applications
- **Implementation**: Iframe or sandboxed environment for safe code execution
- **Features**: Hot reload, responsive preview, error handling

### 4. Project Management System
- **Purpose**: Save, edit, and manage user projects
- **Storage**: MongoDB collections for project metadata and code
- **Features**: Version control, project sharing, template management

### 5. Export System
- **Purpose**: Package and export generated code
- **Options**: 
  - ZIP file download with complete project structure
  - Direct GitHub repository creation and push
- **Integration**: GitHub API for repository management

### 6. User Authentication
- **Purpose**: Secure user accounts and project ownership
- **Methods**: JWT tokens, Google OAuth
- **Storage**: User profiles and preferences in MongoDB

## Data Flow

1. **User Input**: User enters natural language prompt describing desired application
2. **AI Processing**: System sends prompt to OpenAI GPT-4o API for code generation
3. **Code Generation**: AI returns structured MERN stack code (React components, Express routes, MongoDB schemas)
4. **Template Integration**: System applies selected UI library and component templates
5. **Live Preview**: Generated code is rendered in sandbox environment
6. **User Review**: User can preview, modify, or regenerate code
7. **Storage**: Project is saved to MongoDB with user association
8. **Export**: User can download ZIP or export to GitHub repository

## External Dependencies

### AI Services
- **OpenAI GPT-4o API**: Primary code generation service
- **CodeGeeX API**: Backup open-source code generation
- **Replit Ghostwriter**: Code completion assistance

### Cloud Services
- **GitHub API**: Repository creation and code export
- **Google OAuth**: Alternative authentication method
- **MongoDB Atlas**: Cloud database hosting (recommended)

### UI/UX Tools
- **Uizard Autodesigner**: Optional UI-to-code conversion
- **Builder.io**: Alternative UI generation service

### Development Tools
- **Sandbox Environment**: CodeSandbox API or similar for live preview
- **File Compression**: JSZip or similar for ZIP file generation

## Deployment Strategy

### Development Environment
- **Local Setup**: MERN stack development environment
- **Database**: Local MongoDB instance or MongoDB Atlas
- **Environment Variables**: API keys for external services

### Production Deployment
- **Frontend**: Deployed on Vercel, Netlify, or similar static hosting
- **Backend**: Node.js server on Heroku, Railway, or DigitalOcean
- **Database**: MongoDB Atlas for production data
- **CDN**: For generated code templates and static assets

### Security Considerations
- **API Key Management**: Secure storage of AI service API keys
- **Code Sandboxing**: Secure execution environment for user-generated code
- **Rate Limiting**: Prevent abuse of AI generation services
- **Input Validation**: Sanitize user prompts and generated code

### Scalability
- **Caching**: Redis for frequently requested code templates
- **Queue System**: Background processing for large code generation tasks
- **Load Balancing**: Multiple server instances for high traffic
- **Database Optimization**: Indexing for fast project retrieval