import WS2801Controller, {LedStrip} from 'ws2801-pi';

import {defaultConfig} from './config/config';

import {Config, RgbColor} from './types/index';

export class LedController {
  private ledController: WS2801Controller;

  private lastLedStripState: LedStrip;

  constructor(ledController?: WS2801Controller, config?: Config) {
    config = config ? config : defaultConfig;

    this.ledController = ledController ? ledController : new WS2801Controller(config.ledAmount);

    this.setLastLedStripState();
  }

  public async on(): Promise<void> {
    for (let ledIndex: number = 0; ledIndex < this.lastLedStripState.length; ledIndex++) {
      this.ledController.setLed(ledIndex, this.lastLedStripState[ledIndex]);
    }

    await this.ledController.show();
  }

  public async off(): Promise<void> {
    this.setLastLedStripState();

    await this.ledController.clearLeds().show();
  }

  public async setBrightness(brightness: number): Promise<void> {
    await this.ledController.setBrightness(brightness).show();
  }

  public async setColor(color: RgbColor): Promise<void> {
    await this.ledController.fillLeds(color).show();
  }

  private setLastLedStripState(): void {
    this.lastLedStripState = this.ledController.getLedStrip();
  }
}
