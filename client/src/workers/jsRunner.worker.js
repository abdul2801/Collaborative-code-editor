self.onmessage = (e) => {
  const code = e.data;

  const logs = [];

  const fakeConsole = {
    log: (...args) => logs.push(args.join(' ')),
    error: (...args) => logs.push('[error] ' + args.join(' ')),
    warn: (...args) => logs.push('[warn] ' + args.join(' ')),
  };

  try {
    const wrappedCode = `
      "use strict";
      const console = arguments[0];
      ${code}
    `;

    const fn = new Function(wrappedCode);
    fn(fakeConsole);

    self.postMessage({ logs });
  } catch (err) {
    self.postMessage({
      logs,
      error: err.message
    });
  }
};
