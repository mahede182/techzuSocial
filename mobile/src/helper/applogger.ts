export class AppLogger {
  name: string;

  constructor(name: string) {
    this.name = name;
  }

  d = (...args: any[]) => {
    if (__DEV__) {
      // biome-ignore lint/suspicious/noConsole: <explanation>
      console.log(`${this.name}(🪲) ∼`, ...args);
    }
  };

  warn = (...args: any[]) => {
    if (__DEV__) {
      // biome-ignore lint/suspicious/noConsole: <explanation>
      console.warn(`${this.name}(⚠️) ∼`, ...args);
    }
  };

  log = (...args: any[]) => {
    if (__DEV__) {
      // biome-ignore lint/suspicious/noConsole: <explanation>
      console.log(`${this.name}(🪵) ∼`, ...args);
    }
  };

  info = (...args: any[]) => {
    if (__DEV__) {
      // biome-ignore lint/suspicious/noConsole: <explanation>
      console.log(`${this.name}(ℹ) ∼`, ...args);
    }
  };

  err = (...args: any[]) => {
    if (__DEV__) {
      // biome-ignore lint/suspicious/noConsole: <explanation>
      console.log(`${this.name}(❌) ∼`, ...args);
    }
  };
  error = (...args: any[]) => {
    if (__DEV__) {
      // biome-ignore lint/suspicious/noConsole: <explanation>
      console.error(`${this.name}(❌) ∼`, ...args);
    }
  };

  static log = (...args: any[]) => {
    if (__DEV__) {
      // biome-ignore lint/suspicious/noConsole: <explanation>
      console.log('(🪵) ∼', ...args);
    }
  };
}
