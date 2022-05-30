import { Request, Response, NextFunction } from "express";
import Controller from "./Controller";
import Account from "../schemas/Account";
import Operation from "../schemas/Operation";

class DebugController extends Controller {
  constructor() {
    super("/debug");
  }

  protected configureRoutes(): void {
    this.router.get(this.route, this.getAllAccounts);
  }

  private async getAllAccounts(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<Response> {
    let allAccounts = new Array();
    let accounts = await Account.find();
    if (accounts) {
      for (let i = 0; i < accounts.length; i++) {
        let { cpf, password, name, email, phoneNumber, birthdate, balance } =
          accounts[i];
        let operationsHistory = new Array();
        for (let j = 0; j < accounts[i].operationsHistory.length; j++) {
          let operation = await Operation.findById(
            accounts[i].operationsHistory[j]
          ).exec();
          let { operationType, amount, operationDate, to, from } = operation!;
          operationsHistory.push({
            operationType,
            amount,
            operationDate,
            to,
            from,
          });
        }
        allAccounts.push({
          cpf,
          password,
          name,
          email,
          phoneNumber,
          birthdate,
          balance,
          operationsHistory,
        });
      }
    }
    return res.send(allAccounts);
  }
}

export default DebugController;
