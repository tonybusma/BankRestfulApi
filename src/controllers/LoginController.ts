import { Request, Response, NextFunction } from "express";
import Controller from "./Controller";
import LoginValidator from "../validators/LoginValidator";
import Account from "../schemas/Account";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

class LoginController extends Controller {
  constructor() {
    super("/login");
  }

  protected configureRoutes(): void {
    this.router.post(this.route, this.authenticate);
  }

  private async authenticate(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<Response> {
    let { cpf, password } = req.body;
    if (!cpf) cpf = req.query.cpf;
    if (!password) password = req.query.password;

    const validator: LoginValidator = new LoginValidator();

    const missingParams: Object = validator.checkRequiredParams(cpf, password);
    if (JSON.stringify(missingParams) !== "{}") {
      return res.status(400).send(missingParams);
    }

    cpf = validator.validateCpf(cpf.toString());
    if (!cpf) {
      return res.status(400).send({ message: "Invalid cpf." });
    }

    const account = await Account.findOne({ cpf: cpf });
    if (!account) {
      return res.status(404).send({ message: "Cpf not found." });
    }

    try {
      if (!(await bcrypt.compare(password, account.password))) {
        return res.status(401).send({ message: "Wrong password" });
      }
    } catch (error) {
      return res.status(500).send({ message: "Authentication failed" });
    }

    const accessToken = jwt.sign({ cpf }, process.env.JWT_SECRET!, {
      expiresIn: "15m",
    });
    return res.send({ accessToken });
  }
}

export default LoginController;
