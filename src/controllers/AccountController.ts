import { Request, Response, NextFunction } from "express";
import Controller from "./Controller";
import Account from "../schemas/Account";

class AccountController extends Controller {
  constructor() {
    super("/account");
  }

  protected configureRoutes(): void {
    this.router.get(this.route, this.getAllAccounts);
    this.router.post(this.route, this.createAccount);
  }

  private async getAllAccounts(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<Response> {
    const accounts = await Account.find();
    return res.send(accounts);
  }

  private async createAccount(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<Response> {
    let { cpf, password, name, email, phoneNumber, birthDate } = req.body;
    if (!cpf) cpf = req.query.cpf;
    if (!password) password = req.query.password;
    if (!name) name = req.query.name;
    if (!email) email = req.query.email;
    if (!phoneNumber) phoneNumber = req.query.phoneNumber;
    if (!birthDate) birthDate = req.query.birthDate;

    const accountExists = await Account.findOne({ cpf });
    if (accountExists) {
      return res.status(400).send("Cpf already registered.");
    }

    try {
      await Account.create({
        cpf,
        password,
        name,
        email,
        phoneNumber,
        birthDate,
      });
      res.status(201).send("Account created sucefully.");
    } catch (error) {
      console.log("Error while creating new account", error);
      res.status(500).send("Error while creating new account.");
    }
    return res;
  }
}

export default AccountController;
