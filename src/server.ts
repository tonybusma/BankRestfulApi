import App from "./app";
import AccountController from "./controllers/AccountController";
import OperationController from "./controllers/OperationController";

const app = new App([new AccountController(), new OperationController()]);
const PORT: Number = parseInt(process.env.PORT) || 3000;

app.startListening(PORT);
