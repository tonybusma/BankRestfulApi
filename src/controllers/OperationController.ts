import { Request, Response, NextFunction } from "express";
import Controller from "./Controller";
import Operation from "../schemas/Operation";
import Account from "../schemas/Account";
import OperationValidator from "../validators/OperationValidator";

class OperationController extends Controller {
  constructor() {
    super("/operation");
  }

  protected configureRoutes(): void {
    this.router.post(this.route, this.jwtValidation, this.createOperation);
  }

  private async createOperation(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<Response> {
    const cpf = req["cpf"];
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

    if (cpf === receivingAccount) {
      return res.status(400).send({
        message:
          "Transfer operation available only between different accounts.",
      });
    }

    if (amount <= 0) {
      return res.status(400).send({ message: "Amount must be over 0" });
    }

    let accountDestiny = await Account.findOne({ cpf: receivingAccount });
    if (!accountDestiny) {
      return res.status(404).send({ message: "Receiving account not found." });
    }

    let accountSource = await Account.findOne({ cpf: cpf });
    if (accountSource.balance < amount) {
      return res.status(400).send({ message: "Insufficient funds." });
    }

    try {
      const operationOut = await Operation.create({
        operationType: "transferOut",
        amount: amount,
      });
      const operationIn = await Operation.create({
        operationType: "transferIn",
        amount: amount,
      });
      accountSource.balance = Number(accountSource.balance) - amount;
      // accountSource.balance -= amount;
      accountDestiny.balance += amount;
      accountSource.operationsHistory.push(operationOut);
      accountDestiny.operationsHistory.push(operationIn);
      await accountSource.save();
      await accountDestiny.save();
      return res.status(201).send({ message: "Transfer successful." });
    } catch (error) {
      res.status(500).send({
        message: `Transfer error: ${error.message}.`,
      });
    }
  }
}

export default OperationController;
