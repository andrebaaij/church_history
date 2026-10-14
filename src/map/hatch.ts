/** 8×8 diagonal hatch used for client kingdoms. */
export function hatchImage(): { width: number; height: number; data: Uint8Array } {
  const size = 8;
  const data = new Uint8Array(size * size * 4);
  for (let y = 0; y < size; y++) {
    for (let x = 0; x < size; x++) {
      if ((x + y) % size === 0 || (x + y) % size === 1) {
        const i = (y * size + x) * 4;
        data.set([40, 30, 20, 140], i);
      }
    }
  }
  return { width: size, height: size, data };
}
