import { Request, Response, NextFunction } from "express";
import Controller from "./Controller";
import Operation from "../schemas/Operation";
import Account from "../schemas/Account";

class OperationController extends Controller {
  constructor() {
    super("/operation");
  }

  protected configureRoutes(): void {
    this.router.post(this.route, this.createOperation);
  }

  private async createOperation(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<Response> {
    let { operationType, amount } = req.body;
    if (!operationType) operationType = req.query.operationType;
    if (!amount) amount = req.query.amount;

    const operation = await Operation.create({ operationType, amount });

    let account = await Account.findOne({ cpf: "12345678901" });
    account.operationsHistory.push(operation);
    await account.save();

    return res.send({});
  }
}

export default OperationController;
