# Blueprint Management

## Overview
Full CRUD operations for AI-generated specification blueprints.

## Backend API Endpoints

### List all blueprints
```bash
GET /blueprints/
```

### Get specific blueprint
```bash
GET /blueprints/{blueprint_id}
```

### Create blueprint
```bash
POST /blueprints/
Content-Type: application/json

{
  "title": "My Feature",
  "context_md": "Feature description here"
}
```

### Update blueprint
```bash
PUT /blueprints/{blueprint_id}
Content-Type: application/json

{
  "title": "Updated Title",
  "spec_text": "Updated YAML spec",
  "rationale_md": "Optional rationale"
}
```

### Delete blueprint
```bash
DELETE /blueprints/{blueprint_id}
```

## Frontend Component

**BlueprintsPanel** is located in `frontend/components/BlueprintsPanel.tsx` and provides:

### Features
- **List View**: Shows all blueprints with title and timestamp
- **View Mode**: Display blueprint details with full YAML spec
- **Edit Mode**: Edit title and spec content
- **Actions**:
  - ✏️ Edit - Modify blueprint title and content
  - ⬇️ Download - Save as YAML file
  - 📋 Copy - Copy to clipboard
  - 🗑️ Delete - Remove blueprint (with confirmation)

### Usage
The BlueprintsPanel is automatically displayed in the sidebar when viewing a mind map project.

## Testing

All CRUD operations have been tested and verified:
- ✅ CREATE - Generate new blueprints via AI
- ✅ READ - List all blueprints and view individual ones
- ✅ UPDATE - Edit titles and spec content
- ✅ DELETE - Remove blueprints with confirmation

## Next Steps

To enhance blueprint functionality:
1. Add filtering/search for blueprints
2. Link blueprints to specific mind maps
3. Add version history for blueprints
4. Export to multiple formats (Markdown, PDF, etc.)

