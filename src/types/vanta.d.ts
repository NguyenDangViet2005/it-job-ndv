// Type definitions for Vanta.js
declare module "vanta/dist/vanta.globe.min" {
  interface VantaEffect {
    destroy: () => void;
  }

  interface VantaOptions {
    el: HTMLElement | null;
    THREE: any;
    mouseControls?: boolean;
    touchControls?: boolean;
    gyroControls?: boolean;
    minHeight?: number;
    minWidth?: number;
    scale?: number;
    scaleMobile?: number;
    color?: number;
    color2?: number;
    size?: number;
    backgroundColor?: number;
  }

  function GLOBE(options: VantaOptions): VantaEffect;

  export default GLOBE;
}
