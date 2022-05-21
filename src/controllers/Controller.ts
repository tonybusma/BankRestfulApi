import { Router } from "express";

abstract class Controller {
  public router: Router;
  public route: string;

  constructor(route: string) {
    this.router = Router();
    this.route = route;

    setTimeout(() => this.configureRoutes(), 0);
  }

  protected abstract configureRoutes(): void;
}

export default Controller;