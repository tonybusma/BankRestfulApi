import { Request, Response, NextFunction } from "express";
import Controller from "./Controller";
import Operation from "../schemas/Operation";
import Account from "../schemas/Account";
import OperationValidator from "../validators/OperationValidator";

class DepositController extends Controller {
  constructor() {
    super("/deposit");
  }

  protected configureRoutes(): void {
    this.router.post(this.route, this.createOperation);
  }

  private async createOperation(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<Response> {
    let { receivingAccount, amount } = req.body;
    if (!receivingAccount) receivingAccount = req.query.receivingAccount;
    if (!amount) amount = req.query.amount;

    const validator: OperationValidator = new OperationValidator();

    const missingParams = validator.checkRequiredParams(
      receivingAccount,
      amount
    );
    if (JSON.stringify(missingParams) !== "{}") {
      return res.status(400).send(missingParams);
    }

    receivingAccount = validator.validateCpf(receivingAccount.toString());
    if (!receivingAccount) {
      return res
        .status(400)
        .send({ message: "Invalid receiving account's cpf." });
    }

    amount = validator.validateAmount(amount.toString());
    if (!amount) {
      return res.status(400).send({ message: "Invalid amount." });
    }

    if (amount <= 0) {
      return res.status(400).send({ message: "Amount must be over 0" });
    }

    let account = await Account.findOne({ cpf: receivingAccount });
    if (!account) {
      return res.status(404).send({ message: "Receiving account not found." });
    }

    try {
      if (account) {
        const operation = await Operation.create({
          operationType: "deposit",
          amount: amount,
        });
        account.balance += amount;
        account.operationsHistory.push(operation);
        await account.save();
        return res.status(201).send({ message: "Deposit successful." });
      }
    } catch (error) {
      res.status(500).send({
        message: "Deposit error",
      });
    }
    return res.status(500).send({});
  }
}

export default DepositController;
