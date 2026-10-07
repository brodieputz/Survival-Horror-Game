// Keyboard / mouse state with pointer lock.

export class Input {
  constructor(canvas) {
    this.canvas = canvas;
    this.keys = new Set();
    this.pressed = new Set(); // keys pressed since last frame
    this.mouseDX = 0;
    this.mouseDY = 0;
    this.mouseDown = false;
    this.clicked = false;
    this.aimDown = false; // right mouse: aim down the sights
    this.wheel = 0;
    this.locked = false;
    this.sensitivity = 1;
    this.onLockChange = null;
    this.onKey = null;

    window.addEventListener('keydown', (e) => {
      if (['Space', 'Tab', 'ArrowUp', 'ArrowDown'].includes(e.code)) e.preventDefault();
      if (!e.repeat) this.pressed.add(e.code);
      this.keys.add(e.code);
      this.onKey?.(e);
    });
    window.addEventListener('keyup', (e) => this.keys.delete(e.code));
    window.addEventListener('blur', () => this.keys.clear());
    document.addEventListener('mousemove', (e) => {
      if (!this.locked) return;
      // ignore occasional huge spikes some browsers emit when locking
      if (Math.abs(e.movementX) > 400 || Math.abs(e.movementY) > 400) return;
      this.mouseDX += e.movementX;
      this.mouseDY += e.movementY;
    });
    document.addEventListener('mousedown', (e) => {
      if (e.button === 0 && this.locked) {
        this.mouseDown = true;
        this.clicked = true;
      }
      if (e.button === 2 && this.locked) this.aimDown = true;
    });
    document.addEventListener('contextmenu', (e) => {
      if (this.locked || e.target === this.canvas) e.preventDefault();
    });
    document.addEventListener(
      'wheel',
      (e) => {
        if (this.locked && Math.abs(e.deltaY) > 2) this.wheel = Math.sign(e.deltaY);
      },
      { passive: true }
    );
    document.addEventListener('mouseup', (e) => {
      if (e.button === 0) this.mouseDown = false;
      if (e.button === 2) this.aimDown = false;
    });
    document.addEventListener('pointerlockchange', () => {
      this.locked = document.pointerLockElement === this.canvas;
      if (!this.locked) {
        this.keys.clear();
        this.aimDown = false;
        this.mouseDown = false;
      }
      this.onLockChange?.(this.locked);
    });
    document.addEventListener('pointerlockerror', () => {
      this.locked = false;
      this.onLockChange?.(false);
    });
  }

  lock() {
    try {
      const p = this.canvas.requestPointerLock();
      if (p && p.catch) p.catch(() => this.onLockChange?.(false));
    } catch (e) {
      this.onLockChange?.(false);
    }
  }
  unlock() {
    if (document.pointerLockElement) document.exitPointerLock();
  }

  down(code) {
    return this.keys.has(code);
  }
  wasPressed(code) {
    return this.pressed.has(code);
  }
  endFrame() {
    this.pressed.clear();
    this.mouseDX = 0;
    this.mouseDY = 0;
    this.clicked = false;
    this.wheel = 0;
  }
}
