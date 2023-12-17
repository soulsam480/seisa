/// <reference types="node" />
import * as path from 'node:path'
import { ensureDir, ensureFile, readFile, writeFile } from 'fs-extra'
import { camel, pascal, snake } from 'radash'
import colors from 'tiny-colors'
import portfinder from 'portfinder'

function getMigration(name: string) {
  const migrationName = `Migration${pascal(camel(name))}`

  return {
    migrationName,
    content: `import type { Kysely, Migration } from 'kysely';

export const ${migrationName}: Migration = {
  async up(db: Kysely<any>) {
    //
  },
  async down(db: Kysely<any>) {
    //
  },
};
`,
  }
}

const INSERT_IMPORT_MARKER = '//IMPORT'
const INSERT_ITEM_MARKER = '//REGISTER'

async function updateMigrationRegistry(
  filePath: string,
  exportName: string,
  key: number,
) {
  const registryPath = path.join(__dirname, '../src/migrations/index.ts')

  await ensureFile(registryPath)

  let registryContent = await readFile(registryPath, 'utf8')

  if (registryContent.length === 0) {
    registryContent = `import { Migration } from 'kysely';
//IMPORT

export const migrations: Record<string, Migration> = {
  //REGISTER
};
`

    await writeFile(registryPath, registryContent, 'utf8')
  }

  registryContent = registryContent.replace(
    new RegExp(INSERT_IMPORT_MARKER, 'gm'),
    `import { ${exportName} } from './${filePath}';
${INSERT_IMPORT_MARKER}`,
  )

  registryContent = registryContent.replace(
    new RegExp(INSERT_ITEM_MARKER, 'gm'),
    `${key}: ${exportName},
  ${INSERT_ITEM_MARKER}`,
  )

  await writeFile(registryPath, registryContent, {
    encoding: 'utf8',
    flag: 'w',
  })
}

async function main() {
  // eslint-ignore-next-line
  const name = process.argv[2]

  let isDevRunning = false

  try {
    await portfinder.getPortPromise({ port: 5173, stopPort: 5173 })
  } catch (error) {
    isDevRunning = true
  }

  if (isDevRunning) {
    console.error(colors.bgRed.white.bold('\n--------- STOP DEV SERVER FIRST ---------\n'))
    process.exit(1)
  }

  if (!name) {
    console.error(colors.bgRed.white.bold('NAME IS REQUIRED'))
    process.exit(1)
  }

  const folderPath = path.join(__dirname, '../src/migrations')

  ensureDir(folderPath)

  const timestamp = Date.now()

  const fileName = `${timestamp}_${snake(name)}`

  const { content, migrationName } = getMigration(fileName)

  await ensureFile(`${folderPath}/${fileName}.ts`)
  await writeFile(`${folderPath}/${fileName}.ts`, content, 'utf8')

  await updateMigrationRegistry(fileName, migrationName, timestamp)
  
  console.info(colors.bgBlue.white.bold(`\nMigration ${fileName} created.\n Run dev server after migration is implemented.\n`))
}

void main()
