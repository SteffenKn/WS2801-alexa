import WebSocket from 'ws';
import WS2801Controller from 'ws2801-pi';

import {ColorConverter} from './color-converter';
import {defaultConfig} from './config/config';
import {LedController} from './led-controller';

import {AlexaCommand, colorTemperature, Config, RgbColor} from './types/index';

export class AlexaDeviceHandler {
  private webSocket: WebSocket;
  private ledController: LedController;

  private config: Config;

  private pingTimeout: NodeJS.Timeout;

  constructor(config?: Config, ledController?: WS2801Controller) {
    this.config = config ? config : defaultConfig;
    this.ledController = new LedController(ledController, config);
  }

  public start(): void {
    this.webSocket = new WebSocket('ws://iot.sinric.com', {
      headers: {
        Authorization : Buffer.from('apikey:' + this.config.apiKey).toString('base64'),
      },
    });

    this.webSocket.on('open', (): void => {
      console.log('Connected. Waiting for commands..');
    });

    this.webSocket.on('message', (data: string): void => {
      const command: AlexaCommand = JSON.parse(data);
      this.handleCommand(command);
    });

    this.webSocket.on('ping', (): void => {
      this.heartbeat();
    });
  }

  private handleCommand(command: AlexaCommand): void {
    if (command.deviceId !== this.config.deviceId) {
      return;
    }

    if (this.config.logCommands) {
      console.log(`Command received: ${JSON.stringify(command, null, 2)}`);
    }

    if (command.action === 'SetPowerState') {
      if (command.value.toLowerCase() === 'OFF'.toLowerCase()) {
        this.ledController.off();
      } else if (command.value.toLowerCase() === 'ON'.toLowerCase()) {
        this.ledController.on();
      } else {
        console.error(`Could not handle command for action '${command.action}' with value '${command.value}'`);
      }
    } else if (command.action.toLowerCase() === 'SetBrightness'.toLowerCase()) {
      this.ledController.setBrightness(command.value);
    } else if (command.action.toLowerCase() === 'SetColor'.toLowerCase()) {
      const rgbColor: RgbColor = ColorConverter.convertHueToRgb({
        hue: command.value.hue,
        saturation: command.value.saturation,
        brightness: command.value.brightness,
      });

      this.ledController.setColor(rgbColor);
    } else if (command.action.toLowerCase() === 'SetColorTemperature'.toLowerCase()) {
      const rgbColor: RgbColor = colorTemperature[command.value];

      this.ledController.setColor(rgbColor);
    } else {
      console.error(`Could not handle command for action '${command.action}' with value '${command.value}'`);
    }
  }

  private restart(): void {
    this.webSocket.terminate();

    this.start();
  }

  private heartbeat(): void {
    clearTimeout(this.pingTimeout);

    this.pingTimeout = setTimeout((): void => {
      console.log('Connection lost. Restarting...');

      this.restart();
    }, 30000 + 1000);
  }
}
