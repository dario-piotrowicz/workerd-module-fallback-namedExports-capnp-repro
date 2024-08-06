import { createServer } from 'node:http';

export class ModuleFallbackServer {
  #server;
  #port;

  constructor(port) {
    this.#port = port;
    this.#server = createServer((req, res) => {
      const resolveMethod = req.headers['x-resolve-method']
      const url = new URL(req.url, "http://example.org");
      const specifier = url.searchParams.get('specifier');
      const referrer = url.searchParams.get('referrer');

      if (specifier == "/a.cjs") {
        res.end(`{
          "name": "a.cjs",
          "commonJsModule": "
            // exports declared as named ones
            exports.foo = '__foo__';
            exports.bar = '__bar__';
  
            // exports NOT declared
            exports.baz = '__baz__';
          ",
          "namedExports": ["foo", "bar"]
        }`);
        return;
      }

      res.writeHead(404);
      res.end();
      return;
    });
  }

  start() {
    let resolveStart;
    const startPromise = new Promise(resolve => resolveStart = resolve);
    this.#server.listen(this.#port, () => {
      resolveStart();
    });
    return startPromise;
  }

  stop() {
    let resolveStop;
    const stopPromise = new Promise(resolve => resolveStop = resolve);
    this.#server.close(() => resolveStop());
    return stopPromise;
  }
}
