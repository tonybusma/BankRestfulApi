import App from "./app";
import AccountController from "./controllers/AccountController";
import OperationController from "./controllers/OperationController";
import LoginController from "./controllers/LoginController";
import BalanceController from "./controllers/BalanceController"
import StatementController from "./controllers/StatementController";
import DepositController from "./controllers/Depositcontroller";
import WithdrawController from "./controllers/WithdrawController";
import DebugController from "./controllers/DebugController";

const app = new App([
  new AccountController(),
  new OperationController(),
  new LoginController(),
  new BalanceController(),
  new StatementController(),
  new DepositController(),
  new WithdrawController,
  new DebugController()
]);
const PORT: Number = parseInt(process.env.PORT!) || 3000;

app.startListening(PORT);
