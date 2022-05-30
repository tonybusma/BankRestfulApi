import { Request, Response, NextFunction } from "express";
import Controller from "./Controller";
import Account from "../schemas/Account";
import Operation from "../schemas/Operation";
import StatementValidator from "../validators/StatementValidator";

class StatementController extends Controller {
  constructor() {
    super("/statement");
  }

  protected configureRoutes(): void {
    this.router.post(this.route, this.jwtValidation, this.checkStatement);
  }

  protected async checkStatement(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<Response> {
    let cpf = req.body.cpf;
    let { month } = req.body;
    if (!month) month = req.query.month;

    const validator: StatementValidator = new StatementValidator();

    if (month) {
      month = validator.validateMonth(month.toString());
      if (!month) {
        return res.status(400).send({ message: "Invalid month." });
      }
    }

    const account = await Account.findOne({ cpf: cpf });

    if (account) {
      let operationsHistory = new Array();
      for (let i = 0; i < account.operationsHistory.length; i++) {
        let id = account.operationsHistory[i].toString();

        const operation = await Operation.findById(id).exec();

        if (operation) {
          let { operationType, amount, operationDate, to, from } = operation;

          let nowDate: Date = new Date();
          let startDate: Date = new Date(`${month}/01/${nowDate.getFullYear()}`);
          let endDate: Date = new Date(`${month + 1}/01/${nowDate.getFullYear()}`);

          let objectReturn = {
            ...(operationType && { operationType }),
            ...(amount && { amount }),
            ...(operationDate && { operationDate }),
            ...(to && { to }),
            ...(from && { from }),
          };

          if (!month) {
            operationsHistory.push(objectReturn);
          } else {
            if (
              operationDate.getTime() < endDate.getTime() &&
              operationDate.getTime() >= startDate.getTime()
            ) {
              operationsHistory.push(objectReturn);
            }
          }
        }
      }

      let totalStatement = {
        operationsHistory: operationsHistory,
        balance: account.balance,
      };
      return res.send(totalStatement);
    }

    return res.status(500).send({});
  }
}

export default StatementController;
