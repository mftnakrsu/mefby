import { test } from 'node:test';
import assert from 'node:assert/strict';
import { imageSize } from './helpers/imageSize.ts';

test('reads PNG and GIF sizes from their headers', () => {
  const png = Buffer.alloc(24);
  png.write('\x89PNG\r\n\x1a\n', 0, 'latin1');
  png.writeUInt32BE(1255, 16);
  png.writeUInt32BE(640, 20);
  assert.deepEqual(imageSize(png), { width: 1255, height: 640 });

  const gif = Buffer.alloc(10);
  gif.write('GIF89a', 0, 'latin1');
  gif.writeUInt16LE(1100, 6);
  gif.writeUInt16LE(400, 8);
  assert.deepEqual(imageSize(gif), { width: 1100, height: 400 });

  assert.throws(() => imageSize(Buffer.from('not an image')), /PNG or GIF/);
});
