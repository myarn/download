import { filesize } from '../../deps/filesize.ts';
import { Text } from '../../deps/projector.ts';

export class FilesizeText extends Text {
  #value: number;

  constructor (
    value: number = 0
  ) {
    super();

    this.#value = value;
  }

  set value (val: number) {
    this.#value = val;
    this.render();
  }

  get value (): number {
    return this.#value;
  }

  get renderedText(): string {
      return filesize(this.value).toString();
  }
}
