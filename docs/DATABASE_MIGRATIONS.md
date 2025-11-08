# Database Migrations

## Overview

AIWhisper uses SQLite for local data storage and includes an automatic migration system to handle schema changes without data loss.

## How It Works

The migration system is built into `backend/app/db.py` and runs automatically on application startup.

### Migration Process

1. **Startup Check**: When the backend starts, `init_db()` is called
2. **Migration Run**: `migrate_schema()` checks for schema changes
3. **Column Detection**: Compares existing database schema with model definitions
4. **Safe Updates**: Adds missing columns using `ALTER TABLE` (preserves existing data)
5. **Logging**: Reports successful migrations or errors

### Code Location

```python
# backend/app/db.py

def migrate_schema():
    """Handle database migrations for existing databases"""
    # Checks for missing columns
    # Adds them safely with ALTER TABLE
    # Preserves all existing data
```

## Recent Migrations

### November 2024 - Enhanced Recent Chats

**Added columns to `mindmap` table:**
- `last_message_preview` (TEXT): Preview of last chat message (truncated to 100 chars)
- `ai_model` (TEXT): AI model used for the conversation
- `message_count` (INTEGER): Total number of messages in chat history

**Purpose:** Display richer metadata in sidebar recent chats for better UX

**Migration Output:**
```
✅ Database migration successful! Added columns: last_message_preview, ai_model, message_count
```

## Adding New Migrations

When you add new fields to a model, update the `migrate_schema()` function:

```python
def migrate_schema():
    # ... existing code ...
    
    # Add your new column check
    if 'your_new_column' not in columns:
        cursor.execute("ALTER TABLE your_table ADD COLUMN your_new_column TYPE DEFAULT value")
        migrations.append("your_new_column")
```

### Best Practices

1. **Always provide DEFAULT values** for new columns
2. **Use appropriate data types** (TEXT, INTEGER, REAL, BLOB)
3. **Test locally first** before deploying
4. **Document the migration** in this file
5. **Handle errors gracefully** (wrap in try/catch)

## Troubleshooting

### Migration Failed

If you see `❌ Database migration failed`, check:

1. **Database file permissions**: Ensure the backend can write to `/app/data/data.db`
2. **Valid SQL syntax**: Check your ALTER TABLE statement
3. **Database locked**: Ensure no other process is using the database
4. **Disk space**: Ensure sufficient space for database operations

### Manual Migration

If automatic migration fails, you can manually update the database:

```bash
# Connect to the database
docker-compose exec backend sqlite3 /app/data/data.db

# Add missing columns manually
ALTER TABLE mindmap ADD COLUMN last_message_preview TEXT DEFAULT '';
ALTER TABLE mindmap ADD COLUMN ai_model TEXT DEFAULT '';
ALTER TABLE mindmap ADD COLUMN message_count INTEGER DEFAULT 0;

# Exit sqlite3
.exit
```

### Reset Database (DESTRUCTIVE)

If migrations are causing issues, you can reset the database (⚠️ **all data will be lost**):

```bash
# Stop containers
docker-compose down

# Remove database file
rm -rf backend/data/data.db

# Restart (fresh database will be created)
docker-compose up -d
```

## Current Schema

### `mindmap` table

| Column | Type | Description |
|--------|------|-------------|
| `id` | INTEGER | Primary key |
| `folder_id` | INTEGER | Foreign key to folder |
| `title` | TEXT | Project title |
| `template_id` | TEXT | Template used (saas-app, api-service, blank) |
| `nodes_json` | TEXT | JSON string of mind map nodes |
| `edges_json` | TEXT | JSON string of mind map edges |
| `chat_history` | TEXT | JSON string of chat messages |
| `last_message_preview` | TEXT | Preview of last message |
| `ai_model` | TEXT | AI model used |
| `message_count` | INTEGER | Number of messages |
| `created_at` | DATETIME | Creation timestamp |
| `updated_at` | DATETIME | Last update timestamp |

### `folder` table

| Column | Type | Description |
|--------|------|-------------|
| `id` | INTEGER | Primary key |
| `name` | TEXT | Folder name |
| `icon` | TEXT | Emoji icon |
| `color` | TEXT | Hex color code |
| `created_at` | DATETIME | Creation timestamp |
| `updated_at` | DATETIME | Last update timestamp |

### `note` table

| Column | Type | Description |
|--------|------|-------------|
| `id` | INTEGER | Primary key |
| `mindmap_id` | INTEGER | Foreign key to mindmap |
| `title` | TEXT | Note title |
| `content_md` | TEXT | Markdown content |
| `tags` | TEXT | Comma-separated tags |
| `created_at` | DATETIME | Creation timestamp |
| `updated_at` | DATETIME | Last update timestamp |

### `blueprint` table

| Column | Type | Description |
|--------|------|-------------|
| `id` | INTEGER | Primary key |
| `title` | TEXT | Blueprint title |
| `spec_text` | TEXT | YAML/Markdown specification |
| `rationale_md` | TEXT | Rationale in Markdown |
| `created_at` | DATETIME | Creation timestamp |
| `updated_at` | DATETIME | Last update timestamp |

## Future Enhancements

Potential improvements to the migration system:

- [ ] Version tracking for migrations
- [ ] Rollback capability
- [ ] Migration history table
- [ ] Support for complex schema changes (rename columns, etc.)
- [ ] Support for PostgreSQL/MySQL migrations
- [ ] Pre-migration database backups

## Related Files

- `backend/app/db.py` - Migration logic and database initialization
- `backend/app/models.py` - SQLModel definitions (source of truth for schema)
- `backend/app/routes/mindmaps.py` - Mind map CRUD operations
- `backend/app/routes/folders.py` - Folder CRUD operations

## Support

For migration-related issues:
1. Check backend logs: `docker-compose logs backend`
2. Verify database file exists: `docker-compose exec backend ls -la /app/data/`
3. Test manual SQL: Connect with `sqlite3` and try ALTER TABLE commands
4. Reset database as last resort (see "Reset Database" above)

