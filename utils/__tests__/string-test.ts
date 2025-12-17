import { getRandomBytes } from "expo-crypto";
import { hexStringToUint8Array, uint8ArrayToHexString } from "../string";

test("bytes to hex conversion", () => {
  const bytes = getRandomBytes(32);
  const hex = uint8ArrayToHexString(bytes);
  const decodedBytes = hexStringToUint8Array(hex);

  expect(decodedBytes).toEqual(bytes);
});
