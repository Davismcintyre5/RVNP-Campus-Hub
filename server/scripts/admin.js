require('./dnsSet.js');

const readline = require('readline');
const prisma = require('../config/database.js');
const bcrypt = require('bcryptjs');

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

const question = (query) => {
  return new Promise((resolve) => {
    rl.question(query, resolve);
  });
};

const listAdmins = async () => {
  console.log('\n=== LIST ADMINS ===\n');

  const admins = await prisma.user.findMany({
    where: {
      role: {
        in: ['ADMIN', 'SUPER_ADMIN'],
      },
    },
    select: {
      id: true,
      fullName: true,
      email: true,
      phoneNumber: true,
      role: true,
      accountStatus: true,
      createdAt: true,
    },
  });

  if (admins.length === 0) {
    console.log('No admins found.');
    return;
  }

  admins.forEach((admin, index) => {
    console.log(`[${index + 1}]`);
    console.log(`  ID: ${admin.id}`);
    console.log(`  Name: ${admin.fullName}`);
    console.log(`  Email: ${admin.email}`);
    console.log(`  Phone: ${admin.phoneNumber}`);
    console.log(`  Role: ${admin.role}`);
    console.log(`  Status: ${admin.accountStatus}`);
    console.log(`  Created: ${admin.createdAt.toISOString()}`);
    console.log('');
  });
};

const createAdmin = async () => {
  console.log('\n=== CREATE ADMIN ===\n');

  const fullName = await question('Full Name: ');
  const email = await question('Email: ');
  const phoneNumber = await question('Phone Number: ');
  const password = await question('Password: ');
  const role = await question('Role (ADMIN/SUPER_ADMIN): ');

  if (!fullName || !email || !phoneNumber || !password) {
    console.log('All fields are required.');
    return;
  }

  const adminRole = role === 'SUPER_ADMIN' ? 'SUPER_ADMIN' : 'ADMIN';

  const existing = await prisma.user.findUnique({ where: { email } });

  if (existing) {
    console.log('Email already exists.');
    return;
  }

  const passwordHash = await bcrypt.hash(password, 10);

  const admin = await prisma.user.create({
    data: {
      fullName,
      email,
      phoneNumber,
      passwordHash,
      role: adminRole,
      verificationStatus: 'VERIFIED',
      accountStatus: 'ACTIVE',
    },
  });

  console.log(`\nAdmin created successfully!`);
  console.log(`  ID: ${admin.id}`);
  console.log(`  Name: ${admin.fullName}`);
  console.log(`  Email: ${admin.email}`);
  console.log(`  Role: ${admin.role}`);
};

const manageAdmins = async () => {
  console.log('\n=== MANAGE ADMINS ===\n');

  const admins = await prisma.user.findMany({
    where: {
      role: {
        in: ['ADMIN', 'SUPER_ADMIN'],
      },
    },
    select: {
      id: true,
      fullName: true,
      email: true,
      role: true,
      accountStatus: true,
    },
  });

  if (admins.length === 0) {
    console.log('No admins found.');
    return;
  }

  admins.forEach((admin, index) => {
    console.log(`[${index + 1}] ${admin.fullName} (${admin.email}) - ${admin.role} - ${admin.accountStatus}`);
  });

  const choice = await question('\nSelect admin number: ');
  const admin = admins[parseInt(choice) - 1];

  if (!admin) {
    console.log('Invalid selection.');
    return;
  }

  console.log('\n1. Suspend');
  console.log('2. Reactivate');
  console.log('3. Delete');
  console.log('4. Change Role');
  console.log('5. Back');

  const action = await question('Select action: ');

  switch (action) {
    case '1':
      await prisma.user.update({
        where: { id: admin.id },
        data: { accountStatus: 'SUSPENDED' },
      });
      console.log('Admin suspended.');
      break;

    case '2':
      await prisma.user.update({
        where: { id: admin.id },
        data: { accountStatus: 'ACTIVE' },
      });
      console.log('Admin reactivated.');
      break;

    case '3':
      await prisma.user.update({
        where: { id: admin.id },
        data: { accountStatus: 'DELETED' },
      });
      console.log('Admin deleted.');
      break;

    case '4':
      const newRole = await question('New Role (ADMIN/SUPER_ADMIN): ');
      await prisma.user.update({
        where: { id: admin.id },
        data: { role: newRole === 'SUPER_ADMIN' ? 'SUPER_ADMIN' : 'ADMIN' },
      });
      console.log('Role updated.');
      break;

    default:
      console.log('Back to main menu.');
  }
};

const listCollections = async () => {
  console.log('\n=== DATABASE COLLECTIONS ===\n');

  const tables = await prisma.$queryRaw`
    SELECT tablename FROM pg_tables WHERE schemaname = 'public' ORDER BY tablename;
  `;

  tables.forEach((table, index) => {
    console.log(`[${index + 1}] ${table.tablename}`);
  });

  console.log(`\nTotal: ${tables.length} tables`);
};

const dropCollection = async () => {
  console.log('\n=== DROP COLLECTION ===\n');

  const tables = await prisma.$queryRaw`
    SELECT tablename FROM pg_tables WHERE schemaname = 'public' ORDER BY tablename;
  `;

  tables.forEach((table, index) => {
    console.log(`[${index + 1}] ${table.tablename}`);
  });

  const choice = await question('\nSelect table number to drop: ');
  const table = tables[parseInt(choice) - 1];

  if (!table) {
    console.log('Invalid selection.');
    return;
  }

  const confirm = await question(`Are you sure you want to drop "${table.tablename}"? (yes/no): `);

  if (confirm.toLowerCase() === 'yes') {
    await prisma.$executeRawUnsafe(`DROP TABLE IF EXISTS "${table.tablename}" CASCADE;`);
    console.log(`Dropped: ${table.tablename}`);
  } else {
    console.log('Cancelled.');
  }
};

const dropEntireDatabase = async () => {
  console.log('\n=== DROP ENTIRE DATABASE ===\n');

  const confirm = await question('WARNING: This will delete ALL data. Type "DELETE" to confirm: ');

  if (confirm !== 'DELETE') {
    console.log('Cancelled.');
    return;
  }

  const tables = await prisma.$queryRaw`
    SELECT tablename FROM pg_tables WHERE schemaname = 'public';
  `;

  for (const table of tables) {
    await prisma.$executeRawUnsafe(`DROP TABLE IF EXISTS "${table.tablename}" CASCADE;`);
    console.log(`Dropped: ${table.tablename}`);
  }

  console.log('\nEntire database dropped successfully.');
};

const showMenu = () => {
  console.log('\n=== RVNP CAMPUS HUB ADMIN CLI ===\n');
  console.log('1. List Admins');
  console.log('2. Create Admin');
  console.log('3. Manage Admins');
  console.log('4. List DB Collections');
  console.log('5. Drop Collection');
  console.log('6. Drop Entire Database');
  console.log('0. Exit');
};

const main = async () => {
  while (true) {
    showMenu();

    const choice = await question('\nSelect option: ');

    switch (choice) {
      case '1':
        await listAdmins();
        break;

      case '2':
        await createAdmin();
        break;

      case '3':
        await manageAdmins();
        break;

      case '4':
        await listCollections();
        break;

      case '5':
        await dropCollection();
        break;

      case '6':
        await dropEntireDatabase();
        break;

      case '0':
        console.log('Exiting...');
        await prisma.$disconnect();
        rl.close();
        return;

      default:
        console.log('Invalid option.');
    }
  }
};

main().catch(async (error) => {
  console.error('Error:', error.message);
  await prisma.$disconnect();
  rl.close();
});