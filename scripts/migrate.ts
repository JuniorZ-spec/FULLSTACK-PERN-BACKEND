import 'dotenv/config';
import fs from 'fs';
import path from 'path';
import { neon } from '@neondatabase/serverless';

async function runMigration() {
    try {
        if (!process.env.DATABASE_URL) {
            throw new Error('DATABASE_URL not set in .env');
        }
        const sql = neon(process.env.DATABASE_URL);

        // Read migration file
        const migrationPath = path.join(process.cwd(), 'drizzle', '0000_red_micromax.sql');
        const migrationSQL = fs.readFileSync(migrationPath, 'utf-8');

        // Split by statement breakpoint and execute
        const statements = migrationSQL.split('--> statement-breakpoint').filter(s => s.trim());

        console.log(`Executing ${statements.length} migration statements...`);

        await sql('BEGIN');
        try {
            for (const statement of statements) {
                const trimmed = statement.trim();
                if (trimmed) {
                    console.log('Executing:', trimmed.substring(0, 50) + '...');
                    await sql(trimmed);
                }
            }
            await sql('COMMIT');
        } catch (err) {
            await sql('ROLLBACK');
            throw err;
        }

        console.log('✅ Migration completed successfully!');
    } catch (error) {
        console.error('❌ Migration failed:', error);
        process.exit(1);
    }
    runMigration();
}
