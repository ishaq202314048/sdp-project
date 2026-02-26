const { Database } = require('@sqlitecloud/drivers');
const bcrypt = require('bcryptjs');

const db = new Database('sqlitecloud://cnmxfagodk.g5.sqlite.cloud:8860/auth.sqlitecloud?apikey=jOL95vqFRQe0HEJSHPzpJWbxuGINhRLkvkJPaNJMAjU');

async function testLogin() {
  try {
    // Get a user with their password hash
    const users = await db.sql`SELECT id, email, password, userType, approved FROM User WHERE email = 'sadia@gmail.com' LIMIT 1`;
    console.log('User found:', users[0] ? 'Yes' : 'No');
    
    if (users[0]) {
      const user = users[0];
      console.log('Email:', user.email);
      console.log('UserType:', user.userType);
      console.log('Approved:', user.approved);
      console.log('Password hash exists:', !!user.password);
      console.log('Password hash (first 20 chars):', user.password?.substring(0, 20));
      
      // Test password comparison with common test passwords
      const testPasswords = ['test123', 'password', '123456', 'sadia123', 'sadia', '1234'];
      for (const pw of testPasswords) {
        const match = await bcrypt.compare(pw, user.password);
        console.log('Password "' + pw + '" matches:', match);
        if (match) break;
      }
    }
  } catch (e) {
    console.error('Error:', e.message);
    console.error('Stack:', e.stack);
  }
}

testLogin();
