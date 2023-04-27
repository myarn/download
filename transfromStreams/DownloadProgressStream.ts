import { Projector } from '../deps/projector.ts';
import { DownloadProgress } from './projector/DownloadProgress.ts';

export class DownloadProgressTransformer implements Transformer<Uint8Array, Uint8Array> {
  projector: Projector;
  progress: DownloadProgress;
  nowSize = 0;

  constructor (
    projector: Projector,
    filename: string,
    value: number,
    max: number
  ) {
    this.projector = projector;
    this.progress = new DownloadProgress(projector, filename, value, max);
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
  constructor (
    filename: string,
    value: number,
    max: number,
    projector: Projector = new Projector(),
  ) {
    super(new DownloadProgressTransformer(projector, filename, value, max));
  }
}