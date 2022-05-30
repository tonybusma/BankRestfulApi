import { Request, Response, NextFunction } from "express";
import Controller from "./Controller";
import Operation from "../schemas/Operation";
import Account from "../schemas/Account";
import WithdrawValidator from "../validators/WithdrawValidator";

class WithdrawController extends Controller {
  constructor() {
    super("/withdraw");
  }

  protected configureRoutes(): void {
    this.router.post(this.route, this.jwtValidation, this.createOperation);
  }

  private async createOperation(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<Response> {
    const cpf = req.body.cpf;
    let { amount } = req.body;
    if (!amount) amount = req.query.amount;

    const validator: WithdrawValidator = new WithdrawValidator();

    const missingParams = validator.checkRequiredParams(amount);
    if (JSON.stringify(missingParams) !== "{}") {
      return res.status(400).send(missingParams);
    }

    amount = validator.validateAmount(amount.toString());
    if (!amount) {
      return res.status(400).send({ message: "Invalid amount." });
    }

    if (amount <= 0) {
      return res.status(400).send({ message: "Amount must be over 0" });
    }

    let account = await Account.findOne({ cpf: cpf });
    if (account && account.balance < amount) {
      return res.status(422).send({ message: "Insufficient funds." });
    }

    try {
      if (account) {
        const operation = await Operation.create({
          operationType: "withdraw",
          amount: amount,
        });
        account.balance = Number(account.balance) - amount;
        account.operationsHistory.push(operation);
        await account.save();
        return res.status(201).send({ message: "Withdraw successful." });
      }
    } catch (error) {
      res.status(500).send({
        message: "Withdraw error",
      });
    }
    return res.status(500).send({});
  }
}

export default WithdrawController;
