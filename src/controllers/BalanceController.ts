import { Request, Response, NextFunction } from "express";
import Controller from "./Controller";
import Account from "../schemas/Account";

class BalanceController extends Controller {
  constructor() {
    super("/balance");
  }
  protected configureRoutes(): void {
    this.router.post(this.route, this.jwtValidation, this.checkBalance);
  }
  private async checkBalance(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<Response> {
    let cpf = req.body.cpf;

    const account = await Account.findOne({ cpf: cpf });

    if (account) {
      return res.send({ balance: account.balance });
    }
    return res.status(500).send({});
  }
}
export default BalanceController;
