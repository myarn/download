import { assert, assertEquals } from 'https://deno.land/std@0.185.0/testing/asserts.ts';
import { Download } from '../Download.ts';
import { HashTransformStream } from '../mod.ts';

const targetResource = 'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf';

const TEST_FILE_DIRECTORY = './test/test.pdf';
const TEST_FILE_HASH = 'f3b3ab3e6351e25b5c1882bea8d37efaddc0ea72bf153bb067688f775a26810d32b54f014bf1cebc7fe93042d85b18b5b453e322d154bc55d5cc2754b0dfb4b2';

Deno.test('Pipe file', async () => {
  const response = await fetch(targetResource);
  const to = await Deno.open(TEST_FILE_DIRECTORY, {
    write: true,
    createNew: true
  })

  await new Download(response.body!)
    .to(to.writable);

  assertEquals((await Deno.stat(TEST_FILE_DIRECTORY)).isFile, true);

  await Deno.remove(TEST_FILE_DIRECTORY);
});

// Download file with tmp directory
Deno.test('Download file', async () => {
  const response = await fetch(targetResource);

  await new Download(response.body!)
    .downloadTo(TEST_FILE_DIRECTORY);

  assertEquals((await Deno.stat(TEST_FILE_DIRECTORY)).isFile, true);

  await Deno.remove(TEST_FILE_DIRECTORY);
});

Deno.test('Download file and hash', async () => {
  const response = await fetch(targetResource);
  const hashStream = new HashTransformStream('SHA-512');

  await new Download(response.body!)
    .pipeThrough(hashStream)
    .downloadTo(TEST_FILE_DIRECTORY);

  assertEquals(hashStream.digestWithHex(), TEST_FILE_HASH);

  await Deno.remove(TEST_FILE_DIRECTORY);
});
