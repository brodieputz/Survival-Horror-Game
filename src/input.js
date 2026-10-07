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
    this.wheel = 0;
    this.locked = false;
    this.sensitivity = 1;
    this.onLockChange = null;
    this.onKey = null;
    // touch screens: there is no pointer lock, and movement is analog
    this.touchMode = false;
    this.stick = false;
    this.moveX = 0;
    this.moveY = 0;

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
    });
    document.addEventListener('pointerlockchange', () => {
      this.locked = document.pointerLockElement === this.canvas;
      if (!this.locked) this.keys.clear();
      this.onLockChange?.(this.locked);
    });
    document.addEventListener('pointerlockerror', () => {
      this.locked = false;
      this.onLockChange?.(false);
    });
  }

  lock() {
    if (this.touchMode) {
      if (!this.locked) {
        this.locked = true;
        this.onLockChange?.(true);
      }
      return;
    }
    try {
      const p = this.canvas.requestPointerLock();
      if (p && p.catch) p.catch(() => this.onLockChange?.(false));
    } catch (e) {
      this.onLockChange?.(false);
    }
  }
  unlock() {
    if (this.touchMode) {
      if (this.locked) {
        this.locked = false;
        this.onLockChange?.(false);
      }
      return;
    }
    if (document.pointerLockElement) document.exitPointerLock();
  }

  // a one-frame key press from an on-screen button
  tap(code) {
    this.pressed.add(code);
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
