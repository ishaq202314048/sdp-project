import { Database } from '@sqlitecloud/drivers';

const db = new Database('sqlitecloud://cnmxfagodk.g5.sqlite.cloud:8860/auth.sqlitecloud?apikey=jOL95vqFRQe0HEJSHPzpJWbxuGINhRLkvkJPaNJMAjU');

async function check() {
  const userId = '467fc84d-74ac-4d4a-aa60-b66ef975e0ae';
  const acked = await db.sql`SELECT alertId FROM AcknowledgedAlert WHERE acknowledgedBy = ${userId}`;
  const ackedIds = new Set(acked.map(r => r.alertId));
  console.log('Acknowledged:', [...ackedIds]);
  
  let unacked = [];
  
  const unfit = await db.sql`SELECT COUNT(*) as count FROM User WHERE userType = 'soldier' AND fitnessStatus = 'Unfit'`;
  console.log('Unfit count:', unfit[0]?.count);
  if (unfit[0]?.count > 0 && !ackedIds.has('unfit-soldiers')) unacked.push('unfit-soldiers');
  
  const noBmi = await db.sql`SELECT COUNT(*) as count FROM User WHERE userType = 'soldier' AND (bmi IS NULL OR bmi = 0)`;
  console.log('Missing BMI count:', noBmi[0]?.count);
  if (noBmi[0]?.count > 0 && !ackedIds.has('missing-bmi')) unacked.push('missing-bmi');
  
  const noMed = await db.sql`SELECT COUNT(*) as count FROM User WHERE userType = 'soldier' AND (medicalCategory IS NULL OR medicalCategory = '')`;
  console.log('Missing medcat count:', noMed[0]?.count);
  if (noMed[0]?.count > 0 && !ackedIds.has('missing-medcat')) unacked.push('missing-medcat');
  
  const ipft = await db.sql`SELECT date FROM IpftDate ORDER BY createdAt DESC LIMIT 1`;
  console.log('IPFT:', ipft);
  if (ipft.length === 0 && !ackedIds.has('no-ipft')) unacked.push('no-ipft');
  
  const fitPlans = await db.sql`SELECT COUNT(*) as count FROM FitnessPlan WHERE status = 'Fit'`;
  console.log('Fit plans count:', fitPlans[0]?.count);
  if (fitPlans[0]?.count === 0 && !ackedIds.has('no-fit-plan')) unacked.push('no-fit-plan');
  
  const unfitPlans = await db.sql`SELECT COUNT(*) as count FROM FitnessPlan WHERE status = 'Unfit'`;
  console.log('Unfit plans count:', unfitPlans[0]?.count);
  if (unfitPlans[0]?.count === 0 && !ackedIds.has('no-unfit-plan')) unacked.push('no-unfit-plan');
  
  console.log('\nUnacknowledged alerts:', unacked);
  console.log('Total count:', unacked.length);
}

check().catch(console.error);
