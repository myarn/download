import {
  wasmDigestAlgorithms,
  instantiateWasm,
  toHashString
} from '../deps/std.ts';

export type WasmDigestAlgorithms = typeof wasmDigestAlgorithms[number];

export class Hasher {
  context: InstanceType<ReturnType<typeof instantiateWasm>['DigestContext']>

  constructor (
    _algorithm: WasmDigestAlgorithms
  ) {
    const algorithm = _algorithm.toUpperCase();

    const wasmCrypto = instantiateWasm();
    this.context = new wasmCrypto.DigestContext(algorithm);
  }

  update (data: Uint8Array) {
    this.context.update(data);
  }

  digest () {
    return this.context.digestAndDrop(undefined);
  }
}

export class HashTransformer implements Transformer<Uint8Array, Uint8Array> {
  hasher: Hasher;

  constructor (
    algorithm: WasmDigestAlgorithms
  ) {
    this.hasher = new Hasher(algorithm);
  }

  start() {}

  transform (chunk: Uint8Array, collector: TransformStreamDefaultController<Uint8Array>) {
    this.hasher.update(chunk);
    collector.enqueue(chunk);
  }
}

export class HashTransformStream extends TransformStream {
  transformer: HashTransformer;
  constructor (algorithm: WasmDigestAlgorithms) {
    const transformer = new HashTransformer(algorithm);
    super(
      transformer
    );

    this.transformer = transformer;
  }

  digest () {
    return this.transformer.hasher.digest();
  }

  digestWithHex () {
    return toHashString(this.transformer.hasher.digest());
  }
}
