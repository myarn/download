import { assertEquals } from 'https://deno.land/std@0.185.0/testing/asserts.ts';
import { stripColor } from "https://deno.land/std@0.185.0/fmt/colors.ts";

import { Projector } from '../deps/projector.ts';
import { DownloadProgress } from '../transformStreams/projector/DownloadProgress.ts';

const TEST_FILE_NAME = 'test.pdf';

Projector.prototype.write = () => {};

Deno.test('ProgressBar loading', () => {
  const progressBar = new DownloadProgress(
    new Projector(),
    TEST_FILE_NAME,
    0,
    100
  );

  assertEquals(stripColor(progressBar.renderedText), `[--------------------] ⠸ ${TEST_FILE_NAME} (0 B/100 B)`);

  progressBar.stop();
});

Deno.test('ProgressBar complete', () => {
  const progressBar = new DownloadProgress(
    new Projector(),
    TEST_FILE_NAME,
    0,
    100
  );

  progressBar.stop();

  assertEquals(stripColor(progressBar.renderedText), `[--------------------] ✔ ${TEST_FILE_NAME} (0 B/100 B)`);
});

Deno.test('ProgressBar full complete', () => {
  const progressBar = new DownloadProgress(
    new Projector(),
    TEST_FILE_NAME,
    0,
    100
  );

  progressBar.updateSize(100)

  progressBar.stop();

  assertEquals(stripColor(progressBar.renderedText), `[====================] ✔ ${TEST_FILE_NAME} (100 B/100 B)`);
});
