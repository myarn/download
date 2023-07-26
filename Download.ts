export class Download {
  constructor (
    public from: ReadableStream<Uint8Array>,
    public to: string | URL | WritableStream<Uint8Array>
  ) {
  }

  pipeThrough (transform: {
    writable: WritableStream<Uint8Array>;
    readable: ReadableStream<Uint8Array>;
  }, options?: PipeOptions) {
    return new Download(
      this.from.pipeThrough(
        transform, options
      ),
      this.to
    );
  }

  /**
   * Start dowlonad task
   * 
   * If the `to` parameter is `WritableStream<Uint8Array>`, write directly to it.
   * If `string | URL` is passed, it will be downloaded to the tmp directory and then moved to `to`.
   * @param to Donwload Location/WritableStream<UintArray>
   */
  async start (to = this.to): Promise<void> {
    if (to instanceof WritableStream) {
      await this.from.pipeTo(to);
    } else {
      const tempPath = await Deno.makeTempFile({
        suffix: '.jar'
      });
  
      const tempTo = await Deno.open(tempPath, {
        write: true,
        create: true
      });
  
      await this.from.pipeTo(tempTo.writable);
      await Deno.rename(tempPath, to); 
    }
  }
}
