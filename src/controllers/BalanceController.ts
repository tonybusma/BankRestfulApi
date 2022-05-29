import { Request, Response, NextFunction } from "express";
import Controller from "./Controller";
import Account from "../schemas/Account";

class BallanceController extends Controller {
  constructor() {
    super("/balance");
  }
  protected configureRoutes(): void {
    this.router.post(this.route, this.jwtValidation, this.checkbalance);
  }
  private async checkbalance(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<Response> {
    let cpf = req["cpf"];

    const account = await Account.findOne({ cpf: cpf });

    console.log(account.balance);
    return res.send({balance: account.balance});
  }
}
export default BallanceController;