import * as fs from 'fs';
import * as path from 'path';
import { PrismaClient } from '@prisma/client';
import { parse } from 'csv-parse';

const prisma = new PrismaClient();

type Verb = {
  name: string;
};

const seedVerbs = async () => {
  const VERB_NAMES: Verb[] = [];

  const filePath = path.join(__dirname, 'common_verbs.csv');

  const fileContent = fs.readFileSync(filePath, 'utf8');

  const parser = parse(fileContent, { columns: ['name'], skip_empty_lines: true });

  parser.on('readable', function () {
    let record: Verb;
    while ((record = parser.read()) !== null) {
      VERB_NAMES.push(record);
    }
  });

  parser.on('error', function (err) {
    // eslint-disable-next-line no-console
    console.error(err.message);
  });

  parser.on('end', async function () {
    // eslint-disable-next-line no-console
    console.log('verbs', VERB_NAMES);

    for (const v of VERB_NAMES) {
      const verb = await prisma.verb.create({
        data: v,
      });
      // eslint-disable-next-line no-console
      console.log(`Created verb with id: ${verb.id}`);
    }
  });
};

const main = async () => {
  try {
    await seedVerbs();
    // eslint-disable-next-line no-console
    console.info('[SEED] Successfully seeded database');
  } catch (error) {
    // eslint-disable-next-line no-console
    console.error('[SEED] Error seeding verbs', error);
    await prisma.$disconnect();
    process.exit(1);
  }
  await prisma.$disconnect();
  // eslint-disable-next-line no-console
  console.info('Disconnected from database');
};

main();
