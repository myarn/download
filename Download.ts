import { Projector } from './deps/projector.ts';
import { DownloadProgressStream } from './transfromStreams/DownloadProgressStream.ts';
import { HashTransformStream, WasmDigestAlgorithms } from './transfromStreams/HashTransformStream.ts';

export class Download {
  from: ReadableStream<Uint8Array>;

  constructor (from: ReadableStream<Uint8Array>) {
    this.from = from;
  }

  withHash (algorithm: WasmDigestAlgorithms): HashTransformStream {
    const hashTransformeStream = new HashTransformStream(algorithm)
    this.from.pipeThrough(hashTransformeStream);

    return hashTransformeStream;
  }

  withProgressBar (
    filename: string,
    value: number,
    max: number,
    projector: Projector = new Projector()
  ) {
    this.from.pipeThrough(new DownloadProgressStream(
      filename, value, max, projector
    ));
  }

  to (to: WritableStream<Uint8Array>) {
    return this.from.pipeTo(to);
  }

  async downloadTo (to: string) {
    const tempPath = await Deno.makeTempFile({
      suffix: '.jar'
    });

    const tempTo = await Deno.open(tempPath, {
      write: true,
      create: true
    });

    await this.to(tempTo.writable);
    await Deno.rename(tempPath, to);
  }
}
