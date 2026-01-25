import 'dotenv/config';
import { neon } from '@neondatabase/serverless';

async function testConnection() {
  try {
    if (!process.env.DATABASE_URL) {
      throw new Error('DATABASE_URL not set in .env');
    }
    
    console.log('Testing Neon connection...');
    const sql = neon(process.env.DATABASE_URL);
    
    const result = await sql('SELECT NOW()');
    console.log('✅ Connection successful!');
    console.log('Server time:', result[0]);
  } catch (error) {
    console.error('❌ Connection failed:', error);
    process.exit(1);
  }
}

testConnection();
