export class AppRouter {
    router;
    prefix;
    middlewares;
  
    constructor({ router, prefix, middlewares }) {
      this.prefix = prefix;
      this.router = router;
      this.middlewares = middlewares;
    }
  }
  