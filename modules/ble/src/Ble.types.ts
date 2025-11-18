export type BleModuleEvents = {
  // received a characterstic update from a peripheral the central is subscribed to
  onPeripheralNotify: (ch: BleCharacteristic) => void;
};

export type BleCharacteristic = {
  value: string;
};
