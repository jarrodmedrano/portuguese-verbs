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

  parser.on('end', function () {
    // eslint-disable-next-line no-console
    console.log('verbs', VERB_NAMES);

    Promise.all(
      VERB_NAMES.map((verb: Verb) => {
        prisma.verb.create({
          data: verb,
        });
      }),
    )
      // eslint-disable-next-line no-console
      .then(() => console.info('[SEED] Successfully seeded verbs'))
      // eslint-disable-next-line no-console
      .catch((e) => console.error('[SEED] Error seeding verbs', e));
  });
};

seedVerbs();
