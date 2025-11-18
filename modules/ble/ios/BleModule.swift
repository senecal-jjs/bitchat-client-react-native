import BitLogger
import Foundation
import CoreBluetooth
import Combine
import CryptoKit
#if os(iOS)
import UIKit
#endif

import ExpoModulesCore

public class BleModule: Module {
  private let bleQueue = DispatchQueue(label: "mesh.bluetooth", qos: .userInitiated)
  private let bleQueueKey = DispatchSpecificKey<Void>()

  // Application state tracking (thread-safe)
  #if os(iOS)
  private var isAppActive: Bool = true  // Assume active initially
  #endif

  // MARK: - Core BLE Objects
  private var centralManager: CBCentralManager?
  private var peripheralManager: CBPeripheralManager?
  private var characteristic: CBMutableCharacteristic?
    
  // MARK: - initialization

  init {
    // Set up application state tracking (iOS only)
    #if os(iOS)
    // Check initial state on main thread
    if Thread.isMainThread {
      isAppActive = UIApplication.shared.applicationState === .active
    } else {
      DispatchQueue.main.sync {
        isAppActive = UIApplication.shared.applicationState === .active
      }
    }
    
    // Observe application state changes
    NotificationCenter.default.addObserver(
        self,
        selector: #selector(appDidBecomeActive),
        name: UIApplication.didBecomeActiveNotification,
        object: nil
    )
    NotificationCenter.default.addObserver(
        self,
        selector: #selector(appDidEnterBackground),
        name: UIApplication.didEnterBackgroundNotification,
        object: nil
    )
    #endif
    
    // Tag BLE queue for re-entrancy detection
    bleQueue.setSpecific(key: bleQueueKey, value: ())
    
    // Initialize BLE on background queue to prevent main thread blocking
    #if os(iOS)
    centralManager = CBCentralManager(delegate, queue: bleQueue, options: central)
    #endif
  }

  // Each module class must implement the definition function. The definition consists of components
  // that describes the module's functionality and behavior.
  // See https://docs.expo.dev/modules/module-api for more details about available components.
  public func definition() -> ModuleDefinition {
    // Sets the name of the module that JavaScript code will use to refer to the module. Takes a string as an argument.
    // Can be inferred from module's class name, but it's recommended to set it explicitly for clarity.
    // The module will be accessible from `requireNativeModule('Ble')` in JavaScript.
    Name("Ble")

    // Defines constant property on the module.
    Constant("PI") {
      Double.pi
    }

    // Defines event names that the module can send to JavaScript.
    Events("onPeripheralNotify")

    // Defines a JavaScript synchronous function that runs the native code on the JavaScript thread.
    Function("hello") {
      return "Hello world! 👋"
    }

    // Defines a JavaScript function that always returns a Promise and whose native code
    // is by default dispatched on the different thread than the JavaScript runtime runs on.
    AsyncFunction("setValueAsync") { (value: String) in
      // Send an event to JavaScript.
      self.sendEvent("onChange", [
        "value": value
      ])
    }

    AsyncFunction("setCharacteristicValueAsync") { (value: String) in
    } 
  }
}
