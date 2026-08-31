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

const seedAll = async () => {
  await seedSettings();
  await seedLegals();
  await seedDemoUsers();
};

const seedSettings = async () => {
  console.log('\n=== SEED SETTINGS ===\n');

  const campuses = [
    { name: 'Main Campus', location: 'Njoro Road, Nakuru', type: 'MAIN' },
    { name: 'Nakuru City Campus', location: 'Nakuru City', type: 'TOWN' },
    { name: 'Kericho Campus', location: 'Kericho Town', type: 'TOWN' },
    { name: 'Mwachon Campus', location: 'Mwachon', type: 'SATELLITE' },
    { name: 'Kureisoi Campus', location: 'Kureisoi', type: 'SATELLITE' },
  ];

  for (const campus of campuses) {
    const existing = await prisma.campus.findFirst({ where: { name: campus.name } });

    if (!existing) {
      await prisma.campus.create({ data: campus });
      console.log(`Created campus: ${campus.name}`);
    } else {
      console.log(`Campus exists: ${campus.name}`);
    }
  }

  const departments = [
    { name: 'Agriculture and Mechanical Engineering', campusName: 'Main Campus' },
    { name: 'Building and Civil Engineering', campusName: 'Main Campus' },
    { name: 'Electrical and Electronics', campusName: 'Main Campus' },
    { name: 'ICT & Computer Studies', campusName: 'Main Campus' },
    { name: 'Hospitality and Tourism', campusName: 'Main Campus' },
    { name: 'Health and Applied Sciences', campusName: 'Main Campus' },
    { name: 'Business and Liberal Studies', campusName: 'Main Campus' },
  ];

  for (const dept of departments) {
    const campus = await prisma.campus.findFirst({ where: { name: dept.campusName } });

    if (campus) {
      const existing = await prisma.department.findFirst({
        where: { name: dept.name, campusId: campus.id },
      });

      if (!existing) {
        await prisma.department.create({
          data: {
            name: dept.name,
            campusId: campus.id,
          },
        });
        console.log(`Created department: ${dept.name}`);
      } else {
        console.log(`Department exists: ${dept.name}`);
      }
    }
  }

  console.log('\nSettings seeded successfully.');
};

const seedLegals = async () => {
  console.log('\n=== SEED LEGALS ===\n');

  const superAdmin = await prisma.user.findFirst({
    where: { role: 'SUPER_ADMIN' },
  });

  if (!superAdmin) {
    const passwordHash = await bcrypt.hash('Admin@123', 10);

    const admin = await prisma.user.create({
      data: {
        fullName: 'RVNP Super Admin',
        email: 'admin@rvnp.ac.ke',
        phoneNumber: '+254700000000',
        passwordHash,
        role: 'SUPER_ADMIN',
        verificationStatus: 'VERIFIED',
        accountStatus: 'ACTIVE',
      },
    });

    console.log(`Created Super Admin: ${admin.email}`);
  } else {
    console.log(`Super Admin exists: ${superAdmin.email}`);
  }

  console.log('\nLegals seeded successfully.');
};

const seedDemoUsers = async () => {
  console.log('\n=== SEED DEMO USERS ===\n');

  const mainCampus = await prisma.campus.findFirst({ where: { name: 'Main Campus' } });
  const ictDept = await prisma.department.findFirst({ where: { name: 'ICT & Computer Studies' } });

  if (!mainCampus || !ictDept) {
    console.log('Campus or department not found. Seed settings first.');
    return;
  }

  const demoUsers = [
    {
      fullName: 'Davis Okoth',
      email: 'davis@rvnp.ac.ke',
      phoneNumber: '+254711111111',
      password: 'Demo@123',
      role: 'STAFF',
      campusId: mainCampus.id,
      departmentId: ictDept.id,
    },
    {
      fullName: 'Jane Wanjiku',
      email: 'jane@student.rvnp.ac.ke',
      phoneNumber: '+254722222222',
      password: 'Demo@123',
      role: 'STUDENT',
      campusId: mainCampus.id,
      departmentId: ictDept.id,
      course: 'Diploma in ICT',
      yearOfStudy: 2,
    },
    {
      fullName: 'John Kimani',
      email: 'john@student.rvnp.ac.ke',
      phoneNumber: '+254733333333',
      password: 'Demo@123',
      role: 'STUDENT',
      campusId: mainCampus.id,
      departmentId: ictDept.id,
      course: 'Certificate in ICT',
      yearOfStudy: 1,
    },
    {
      fullName: 'Mary Achieng',
      email: 'mary@student.rvnp.ac.ke',
      phoneNumber: '+254744444444',
      password: 'Demo@123',
      role: 'STUDENT',
      campusId: mainCampus.id,
      departmentId: ictDept.id,
      course: 'Higher Diploma in ICT',
      yearOfStudy: 1,
    },
  ];

  for (const user of demoUsers) {
    const existing = await prisma.user.findUnique({ where: { email: user.email } });

    if (!existing) {
      const passwordHash = await bcrypt.hash(user.password, 10);

      await prisma.user.create({
        data: {
          fullName: user.fullName,
          email: user.email,
          phoneNumber: user.phoneNumber,
          passwordHash,
          role: user.role,
          campusId: user.campusId,
          departmentId: user.departmentId,
          course: user.course,
          yearOfStudy: user.yearOfStudy,
          verificationStatus: 'VERIFIED',
          accountStatus: 'ACTIVE',
        },
      });

      console.log(`Created user: ${user.fullName} (${user.email})`);
    } else {
      console.log(`User exists: ${user.email}`);
    }
  }

  console.log('\nDemo users seeded successfully.');
};

const showMenu = () => {
  console.log('\n=== RVNP CAMPUS HUB SEED CLI ===\n');
  console.log('1. Seed All');
  console.log('2. Seed Settings (Campuses & Departments)');
  console.log('3. Seed Legals (Super Admin)');
  console.log('4. Seed Demo Users');
  console.log('0. Exit');
};

const main = async () => {
  while (true) {
    showMenu();

    const choice = await question('\nSelect option: ');

    switch (choice) {
      case '1':
        await seedAll();
        break;

      case '2':
        await seedSettings();
        break;

      case '3':
        await seedLegals();
        break;

      case '4':
        await seedDemoUsers();
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