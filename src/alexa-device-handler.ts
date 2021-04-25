import {SinricPro, SinricProActions} from 'sinricpro';
import WS2801Controller, {LedColor} from 'ws2801-pi';

import {defaultConfig} from './config/config';
import {LedController} from './led-controller';

import {colorTemperature, Config} from './types/index';

// tslint:disable: no-any
export class AlexaDeviceHandler {
  private ledController: LedController;
  private sinric: SinricPro;

  private config: Config;

  private running: boolean = false;

  constructor(config?: Config, ledController?: WS2801Controller) {
    this.config = config ? config : defaultConfig;
    this.ledController = new LedController(ledController, config);
  }

  public start(): void {
    if (this.running) {
      return;
    }

    this.running = true;
    this.connect();
  }

  public stop(): void {
    this.running = false;
  }

  private connect(): void {
    this.sinric = new SinricPro(this.config.appKey, [this.config.deviceId], this.config.secretKey, true);

    const callbacks: any = {
      setPowerState: this.setPowerState.bind(this),
      setBrightness: this.setBrightness.bind(this),
      setColor: this.setColor.bind(this),
      setColorTemperature: this.setColorTemperature.bind(this),
      onDisconnect: this.handleDisconnect.bind(this),
    };

    SinricProActions(this.sinric, callbacks);
  }

  private setPowerState(deviceId: string, data: 'On' | 'Off'): boolean {
    if (!this.running) {
      return false;
    }

    if (this.config.logCommands) {
      console.log(`Command 'setPowerState' received for device '${deviceId}': ${data}`);
    }

    if (data.toLowerCase() === 'Off'.toLowerCase()) {
      this.ledController.off();
    } else if (data.toLowerCase() === 'On'.toLowerCase()) {
      this.ledController.on();
    } else {
      console.error(`Could not setPowerState. (Data: '${data}')`);

      return false;
    }

    return true;
  }

  private setBrightness(deviceId: string, data: number): boolean {
    if (!this.running) {
      return false;
    }

    if (this.config.logCommands) {
      console.log(`Command 'setBrightness' received for device '${deviceId}': ${data}`);
    }

    this.ledController.setBrightness(data);

    return true;
  }

  private setColor(deviceId: string, data: {r: number, g: number, b: number}): boolean {
    if (!this.running) {
      return false;
    }

    if (this.config.logCommands) {
      console.log(`Command 'setColor' received for device '${deviceId}': ${JSON.stringify(data, null, 2)}`);
    }

    const color: LedColor = {
      red: data.r,
      green: data.g,
      blue: data.b,
    };

    this.ledController.setColor(color);

    return true;
  }

  private setColorTemperature(deviceId: string, data: number): boolean {
    if (!this.running) {
      return false;
    }

    if (this.config.logCommands) {
      console.log(`Command 'setColorTemperature' received for device '${deviceId}': ${data}`);
    }

    const rgbColor: LedColor = colorTemperature[data];

    this.ledController.setColor(rgbColor);

    return true;
  }

  private handleDisconnect(): void {
    console.log('Connection to SinricPro lost. Reconnecting...');

    this.connect();
  }
}
