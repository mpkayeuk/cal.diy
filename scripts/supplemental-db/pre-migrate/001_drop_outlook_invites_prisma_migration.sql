-- Fork-only Prisma history cleanup. Safe if the row is already gone.
DELETE FROM "_prisma_migrations"
WHERE "migration_name" = '20260820203100_add_send_outlook_calendar_invites';
