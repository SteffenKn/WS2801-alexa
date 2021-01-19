# WS2801-alexa

WS2801-alexa is a package that controls led strips via WS2801-pi on alexa voice commands.

## Wiring

The wiring of the Pi is described here.

## SinricPro

A [SinricPro](https://sinric.pro/) account is required to use this module.
[SinricPro](https://sinric.pro/) is free for up to three devices.

## Usage

There are basically two ways to use WS2801-alexa:

### Using this repository

- Clone this repository
- Edit the config file as described [here](#configuration)
- Run the build script: npm run build
- Run the start script: npm start

### Using the npm module

- Create a new npm project folder
- Install this module: `npm i ws2801-alexa`

```typescript
import {AlexaDeviceHandler, Config} from './src/index';

const config: Config = {
  appKey: '<your-sinricpro-app-key>',
  secretKey: '<your-sinricpro-secret-key>',
  deviceId: '<your-sinricpro-device-id>',
  ledAmount: 10,
};

const alexaDeviceHandler: AlexaDeviceHandler = new AlexaDeviceHandler(config);

alexaDeviceHandler.start();
```

## Configuration

The config can be specified when initializing the AlexaDeviceHandler.
If no config was specified or if the repository is used, the defaultConfig which is stored [here](./src/config/config.ts).

### Sinric Pro

Before the configuration can be done, a Sinric Pro device must be created.

1. Open [Sinric Pro](https://sinric.pro/).
2. Login
3. Open the devices view and click on the Add button.
4. Enter a name (e.g. LedController) and a description.
5. Select `Smart Light Bulb` as device type.
6. Click on the Continue buttons and the Save Button

### WS2801-alexa

The config can look like this:
```typescript
{
  appKey: '<your-sinricpro-app-key>',
  secretKey: '<your-sinricpro-secret-key>',
  deviceId: '<your-sinricpro-device-id>',
  ledAmount: 10,
};
```

- `appKey` your sinric app key. The app key can be found [here](https://portal.sinric.pro/credential/list).
- `secretKey` your sinric secret key. The secret key can be found [here](https://portal.sinric.pro/credential/list).
- `deviceId` the device ID of the Sinric device that is used to trigger the coal heating. The device id can be found [here](https://portal.sinric.pro/device/list).
- `ledAmount` is used to specify how many leds are connected to the Pi. This is only necessary if no other ledController is specified in the constructor.

## Functions

### constructor

#### Parameters:

- `config`
  - optional
  - Type: [Config](./src/types/config.ts)
  - The config for this module, as described [here](#Configuration). If no value is set, the [default config](./src/config/config.ts) is used.

- `ledController`
  - optional
  - Type: [LedController](https://github.com/SteffenKn/WS2801-PI/blob/develop/src/index.ts#L44)
  - The led controller that controls the leds of the connected led strip. If no value is specified, WS2801-webserver will create its own LedController with the LedAmount that is configured in the [default config](./src/config/config.ts).
    - To avoid rendering problems, there should be only one LedController instance.

### start

Starts the AlexaDeviceHandler.

### stop

Stops the AlexaDeviceHandler.
