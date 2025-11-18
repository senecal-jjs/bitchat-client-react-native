import { NativeModule, requireNativeModule } from "expo";

import Base64String from "@/utils/Base64String";
import { BleModuleEvents } from "./Ble.types";

declare class BleModule extends NativeModule<BleModuleEvents> {
  PI: number;
  hello(): string;
  setValueAsync(value: string): Promise<void>;
  // when acting as a peripheral, set the value on the data characteristic
  setCharactersticValueAsync(value: Base64String): Promise<void>;
}

// This call loads the native module object from the JSI.
export default requireNativeModule<BleModule>("Ble");
