import { Projector } from '../deps/projector.ts';
import { DownloadProgress } from './projector/DownloadProgress.ts';

export class DownloadProgressTransformer implements Transformer<Uint8Array, Uint8Array> {
  progress: DownloadProgress;
  nowSize = 0;

  constructor (
    prgoress: DownloadProgress
  ) {
    this.progress = prgoress;
  }

  start() {}

  transform (chunk: Uint8Array, collector: TransformStreamDefaultController<Uint8Array>) {
    this.nowSize += chunk.length;
    this.progress.updateSize(this.nowSize);
    collector.enqueue(chunk);
  }

  flush () {
    this.progress.stop();
  }
}

export class DownloadProgressStream extends TransformStream {
  readonly progress: DownloadProgress;

  constructor (
    filename: string,
    value: number,
    max: number,
    projector: Projector = new Projector(),
  ) {
    const progress = new DownloadProgress(projector, filename, value, max);
    super(new DownloadProgressTransformer(progress));

    this.progress = progress;
  }
}
