import App from "./app";
import AccountController from "./controllers/AccountController";
import OperationController from "./controllers/OperationController";
import LoginController from "./controllers/LoginController";
import BalanceController from "./controllers/BalanceController"
import StatementController from "./controllers/StatementController";

const app = new App([
  new AccountController(),
  new OperationController(),
  new LoginController(),
  new BalanceController(),
  new StatementController()
]);
const PORT: Number = parseInt(process.env.PORT!) || 3000;

app.startListening(PORT);
