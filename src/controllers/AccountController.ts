import { Request, Response, NextFunction } from "express";
import Controller from "./Controller";
import Account from "../schemas/Account";
import AccountValidator from "../validators/AccountValidator";
import bcrypt from "bcrypt";

class AccountController extends Controller {
  constructor() {
    super("/account");
  }

  protected configureRoutes(): void {
    this.router.post(this.route, this.createAccount);
  }

  private async createAccount(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<Response> {
    let { cpf, password, name, email, phoneNumber, birthdate } = req.body;
    if (!cpf) cpf = req.query.cpf;
    if (!password) password = req.query.password;
    if (!name) name = req.query.name;
    if (!email) email = req.query.email;
    if (!phoneNumber) phoneNumber = req.query.phoneNumber;
    if (!birthdate) birthdate = req.query.birthdate;

    const validator: AccountValidator = new AccountValidator();

    const missingParams: Object = validator.checkRequiredParams(
      cpf,
      password,
      name,
      birthdate
    );
    if (JSON.stringify(missingParams) !== "{}") {
      return res.status(400).send(missingParams);
    }

    cpf = validator.validateCpf(cpf.toString());
    if (!cpf) {
      return res.status(400).send({ message: "Invalid cpf." });
    }

    birthdate = validator.validateBirthdate(birthdate.toString());
    if (!birthdate) {
      return res.status(400).send({ message: "Invalid birth date." });
    }

    if (email) {
      email = validator.validateEmail(email.toString());
      if (!email) {
        return res.status(400).send({ message: "Invalid email." });
      }
    }

    name = validator.validateName(name.toString());
    if (!name) {
      return res.status(400).send({ message: "Invalid name." });
    }

    if (phoneNumber) {
      phoneNumber = validator.validatePhoneNumber(phoneNumber.toString());
      if (!phoneNumber) {
        return res.status(400).send({ message: "Invalid phone number." });
      }
    }

    const accountExists = await Account.findOne({ cpf: cpf });
    if (accountExists) {
      return res.status(409).send({ message: "Cpf already registered." });
    }

    try {
      password = await bcrypt.hash(password, 10);
      await Account.create({
        ...(cpf && { cpf }),
        ...(password && { password }),
        ...(name && { name }),
        ...(email && { email }),
        ...(phoneNumber && { phoneNumber }),
        ...(birthdate && { birthdate }),
      });
      res.status(201).send({ message: "Account created successfully." });
    } catch (error) {
      res.status(500).send({
        message: "Error while creating new account",
      });
    }
    return res.status(500).send({});
  }
}

export default AccountController;
