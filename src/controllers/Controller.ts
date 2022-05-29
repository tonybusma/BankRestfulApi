import { Router } from "express";
import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";

interface JwtPayload {
  cpf: string;
}

abstract class Controller {
  public router: Router;
  public route: string;

  constructor(route: string) {
    this.router = Router();
    this.route = route;

    setTimeout(() => this.configureRoutes(), 0);
  }

  protected abstract configureRoutes(): void;

  protected jwtValidation(req: Request, res: Response, next: NextFunction) {
    const authHeader: string = req.headers.authorization!;
    const token: string = authHeader && authHeader.split(" ")[1];
    if (!token) {
      return res.status(401).send({ message: "Unauthorized" });
    }
    jwt.verify(token, process.env.JWT_SECRET!, (error, tokenInfo) => {
      if (error) {
        return res.status(403).send({ message: "Invalid access token" });
      }
      let { cpf } = tokenInfo as JwtPayload;
      req.body.cpf = cpf;
      next();
    });
  }
}

export default Controller;
