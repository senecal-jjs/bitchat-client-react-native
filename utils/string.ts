export function uint8ArrayToHexString(uint8Array: Uint8Array): string {
  return Array.from(uint8Array)
    .map((byte) => byte.toString(16).padStart(2, "0"))
    .join("");
}

export function hexStringToUint8Array(hexString: string): Uint8Array {
  if (hexString.length % 2 !== 0) {
    throw new Error("Hex string must have an even number of characters");
  }

  const bytes = hexString.match(/.{1,2}/g);
  if (!bytes) {
    return new Uint8Array(0);
  }

  return new Uint8Array(bytes.map((byte) => parseInt(byte, 16)));
}
