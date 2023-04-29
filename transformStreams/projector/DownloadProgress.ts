import { Line, ProgressBar, LoadingIndicator, Projector, toTemplateText } from '../../deps/projector.ts';
import { filesize } from '../../deps/filesize.ts';
import { FilesizeText } from './FilesizeText.ts';

export class DownloadProgress extends Line {
  progressBar: ProgressBar;
  loadingIngicator: LoadingIndicator;
  nowSize: FilesizeText;

  constructor (
    projector: Projector,
    protected filename: string,
    value: number,
    protected max: number) {
    super(projector);

    this.progressBar = new ProgressBar(value, max, 20);
    this.loadingIngicator = new LoadingIndicator();
    this.nowSize = new FilesizeText(value);

    this.addText(toTemplateText`[${this.progressBar}] ${this.loadingIngicator} ${filename} (${this.nowSize}/${filesize(this.max)})`);
  }

  updateSize (size: number) {
    this.progressBar.value = size;
    this.nowSize.value = size;
  }

  stop () {
    this.loadingIngicator.complete();
  }
}
