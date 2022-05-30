import CpfValidator from "./CpfValidator";

interface MissingParams {
  cpf?: string;
  password?: string;
}

class LoginValidator extends CpfValidator {
  checkRequiredParams(cpf: string, password: string): Object {
    let missingParams: MissingParams = {};
    if (!cpf) {
      missingParams.cpf = "Cpf must be sent.";
    }
    if (!password) {
      missingParams.password = "Password must be sent.";
    }
    return missingParams;
  }
}

export default LoginValidator;
