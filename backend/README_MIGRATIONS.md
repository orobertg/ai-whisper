# Database Migrations

## Issue: Notes not saving

### Problem
The database schema was out of sync with the code. The `note` table was missing the `mindmap_id` column that the application expected.

### Symptoms
- Notes appeared to save but weren't visible in the UI
- Backend logs showed: `sqlite3.OperationalError: table note has no column named mindmap_id`

### Solution
Run the migration script to update the database schema:

```bash
# Copy migration script to container
docker cp backend/migrate_db.py aiwhisper-backend-1:/app/migrate_db.py

# Run migration
docker exec aiwhisper-backend-1 python /app/migrate_db.py
```

## Future Migrations

If you need to reset the database completely:

```bash
# Stop containers
docker compose down

# Remove the database volume
docker volume rm aiwhisper_backend_data

# Start containers (database will be recreated with correct schema)
docker compose up -d
```

## Schema Changes

When adding new fields to models:
1. Update the model in `backend/app/models.py`
2. Either run a migration script or reset the database
3. For production, use proper migration tools like Alembic

