export class Download {
  from: ReadableStream<Uint8Array>;

  constructor (from: ReadableStream<Uint8Array>) {
    this.from = from;
  }

  pipeThrough (transform: {
    writable: WritableStream<Uint8Array>;
    readable: ReadableStream<Uint8Array>;
  }, options?: PipeOptions) {
    return new Download(
      this.from.pipeThrough(
        transform, options
      )
    )
  }

  to (to: WritableStream<Uint8Array>) {
    return this.from.pipeTo(to);
  }

  async downloadTo (to: string | URL) {
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
