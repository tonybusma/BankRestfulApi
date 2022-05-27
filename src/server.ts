import App from "./app";
import AccountController from "./controllers/AccountController";
import OperationController from "./controllers/OperationController";
import LoginController from "./controllers/LoginController";

const app = new App([
  new AccountController(),
  new OperationController(),
  new LoginController(),
]);
const PORT: Number = parseInt(process.env.PORT) || 3000;

app.startListening(PORT);
