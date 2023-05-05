import { Line, ProgressBar, LoadingIndicator, Projector, toTemplateText } from '../../deps/projector.ts';
import { FilesizeText } from './FilesizeText.ts';

export class DownloadProgress extends Line {
  progressBar: ProgressBar;
  loadingIngicator: LoadingIndicator;
  nowSize: FilesizeText;
  filesize: FilesizeText;

  constructor (
    projector: Projector,
    protected filename: string,
    value: number,
    filesize: number) {
    super(projector);

    this.progressBar = new ProgressBar(value, filesize, 20);
    this.loadingIngicator = new LoadingIndicator();
    this.nowSize = new FilesizeText(value);
    this.filesize = new FilesizeText(filesize);

    this.addText(toTemplateText`[${this.progressBar}] ${this.loadingIngicator} ${filename} (${this.nowSize}/${this.filesize})`);
  }

  updateSize (size: number) {
    this.progressBar.value = size;
    this.nowSize.value = size;
  }

  updateFilesize (filesize: number) {
    this.progressBar.max = filesize;
    this.filesize.value = filesize;
  }

  stop () {
    this.loadingIngicator.complete();
  }
}
