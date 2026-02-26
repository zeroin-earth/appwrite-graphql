/**
 * Teardown script for integration tests.
 * Stops and removes Appwrite Docker containers.
 * Run: `bun run tests/setup/teardown.ts`
 */
import { $ } from 'bun'

async function main() {
  console.log('Stopping Appwrite containers...')
  await $`docker compose -f tests/docker-compose.yml --env-file tests/.env down -v`.quiet()
  console.log('Containers stopped and volumes removed.')

  // Clean up config file
  try {
    const { unlinkSync } = await import('node:fs')
    unlinkSync('tests/.test-config.json')
    console.log('Cleaned up .test-config.json')
  } catch {
    // File may not exist
  }
}

main().catch((e) => {
  console.error('Teardown failed:', e)
  process.exit(1)
})
