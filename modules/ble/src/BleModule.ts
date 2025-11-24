import { NativeModule, requireNativeModule } from "expo";

import { BleModuleEvents } from "./Ble.types";

declare class BleModule extends NativeModule<BleModuleEvents> {
  broadcastPacketAsync(value: Uint8Array): Promise<void>;
}

// This call loads the native module object from the JSI.
export default requireNativeModule<BleModule>("Ble");
