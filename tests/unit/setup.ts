// Minimal DOM / canvas shims to keep Excalibur imports happy in jsdom
const canvas = document.createElement('canvas');
canvas.width = 800;
canvas.height = 600;
document.body.appendChild(canvas);

HTMLCanvasElement.prototype.getContext = function () {
  // Very small 2D context shim for tests that won't render
  return {
    fillRect: () => { },
    clearRect: () => { },
    getImageData: () => ({ data: [] }),
    putImageData: () => { },
    createImageData: () => ([] as any),
    setTransform: () => { },
    drawImage: () => { },
    save: () => { },
    restore: () => { },
    fillText: () => { },
    measureText: () => ({ width: 0 }),
    translate: () => { },
    scale: () => { },
    rotate: () => { },
    beginPath: () => { },
    closePath: () => { },
    moveTo: () => { },
    lineTo: () => { },
    stroke: () => { },
    strokeRect: () => { },
    setLineDash: () => { },
  } as any;
};

(globalThis as any).requestAnimationFrame = (cb: FrameRequestCallback) => setTimeout(cb, 16);
(globalThis as any).devicePixelRatio = 1;