import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

const campuses = [
  { name: 'Main Campus', location: 'Njoro Road, Nakuru', type: 'MAIN' },
  { name: 'Nakuru City Campus', location: 'Nakuru City', type: 'TOWN' },
  { name: 'Kericho Campus', location: 'Kericho Town', type: 'TOWN' },
  { name: 'Mwachon Campus', location: 'Mwachon', type: 'SATELLITE' },
  { name: 'Kureisoi Campus', location: 'Kureisoi', type: 'SATELLITE' },
];

const departments = [
  { name: 'Agriculture and Mechanical Engineering', campus: 'Main Campus' },
  { name: 'Building and Civil Engineering', campus: 'Main Campus' },
  { name: 'Electrical and Electronics', campus: 'Main Campus' },
  { name: 'ICT & Computer Studies', campus: 'Main Campus' },
  { name: 'Hospitality and Tourism', campus: 'Main Campus' },
  { name: 'Health and Applied Sciences', campus: 'Main Campus' },
  { name: 'Business and Liberal Studies', campus: 'Main Campus' },
];

async function main() {
  console.log('Seeding campuses...');
  for (const campus of campuses) {
    await prisma.campus.upsert({
      where: { id: campus.name.toLowerCase().replace(/[^a-z0-9]/g, '-') },
      update: {},
      create: {
        id: campus.name.toLowerCase().replace(/[^a-z0-9]/g, '-'),
        name: campus.name,
        location: campus.location,
        type: campus.type,
      },
    });
  }

  console.log('Seeding departments...');
  for (const dept of departments) {
    const campus = await prisma.campus.findFirst({
      where: { name: dept.campus },
    });

    if (campus) {
      await prisma.department.create({
        data: {
          name: dept.name,
          campusId: campus.id,
        },
      });
    }
  }

  console.log('Seeding super admin...');
  const passwordHash = await bcrypt.hash('Admin@123', 10);

  await prisma.user.upsert({
    where: { email: 'admin@rvnp.ac.ke' },
    update: {},
    create: {
      fullName: 'RVNP Super Admin',
      email: 'admin@rvnp.ac.ke',
      phoneNumber: '+254700000000',
      passwordHash,
      role: 'SUPER_ADMIN',
      verificationStatus: 'VERIFIED',
      accountStatus: 'ACTIVE',
    },
  });

  console.log('Seed completed successfully!');
}

main()
  .catch((e) => {
    console.error('Seed error:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });