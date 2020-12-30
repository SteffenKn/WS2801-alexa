import {HueColor, RgbColor} from './types/index';

export class ColorConverter {
  public static convertHueToRgb(hueColor: HueColor): RgbColor {
    const c: number = hueColor.brightness * hueColor.saturation;
    const x: number = c * (1 - Math.abs((hueColor.hue / 60) % 2 - 1));
    const m: number = hueColor.brightness - c;

    let red1: number;
    let green1: number;
    let blue1: number;
    if (hueColor.hue >= 0 && hueColor.hue < 60) {
      red1 = c;
      green1 = x;
      blue1 = 0;
    } else if (hueColor.hue >= 60 && hueColor.hue < 120) {
      red1 = x;
      green1 = c;
      blue1 = 0;
    } else if (hueColor.hue >= 120 && hueColor.hue < 180) {
      red1 = 0;
      green1 = c;
      blue1 = x;
    } else if (hueColor.hue >= 180 && hueColor.hue < 240) {
      red1 = 0;
      green1 = x;
      blue1 = c;
    } else if (hueColor.hue >= 240 && hueColor.hue < 300) {
      red1 = x;
      green1 = 0;
      blue1 = c;
    } else if (hueColor.hue >= 300 && hueColor.hue < 360) {
      red1 = x;
      green1 = 0;
      blue1 = c;
    } else {
      throw new Error(`Hue value ${hueColor.hue} is not supported!`);
    }

    return {
      red: (red1 + m) * 255,
      green: (green1 + m) * 255,
      blue: (blue1 + m) * 255,
    };
  }

  public static convertRgbToHue(rgbColor: RgbColor): HueColor {
    const red1: number = rgbColor.red / 255;
    const green1: number = rgbColor.green / 255;
    const blue1: number = rgbColor.blue / 255;

    const cMax: number = Math.max(red1, green1, blue1);
    const cMin: number = Math.min(red1, green1, blue1);

    const delta: number = cMax - cMin;

    let hue: number;
    if (delta === 0) {
      hue = 0;
    } else if (cMax === red1) {
      hue = 60 * (((green1 - blue1) / delta) % 6);
    } else if (cMax === green1) {
      hue = 60 * ((blue1 - red1) / delta + 2);
    } else if (cMax === blue1) {
      hue = 60 * ((red1 - green1) / delta + 4);
    }

    const saturation: number = cMax === 0 ? 0 : delta / cMax;

    const brightness: number = cMax;

    return {
      hue: hue,
      saturation: saturation,
      brightness: brightness,
    };
  }
}
