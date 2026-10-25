// Pixel size of a PNG or GIF, read from its header (the formats the site's
// local images use). Throws for anything else.
export function imageSize(bytes: Uint8Array): { width: number; height: number } {
  const b = Buffer.from(bytes.buffer, bytes.byteOffset, bytes.byteLength);
  if (b.toString('latin1', 1, 4) === 'PNG') return { width: b.readUInt32BE(16), height: b.readUInt32BE(20) };
  if (b.toString('latin1', 0, 3) === 'GIF') return { width: b.readUInt16LE(6), height: b.readUInt16LE(8) };
  throw new Error('not a PNG or GIF');
}
