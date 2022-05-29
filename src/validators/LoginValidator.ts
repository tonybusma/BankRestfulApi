import GenericValidator from "./GenericValidator";

interface MissingParams {
  cpf?: string;
  password?: string;
}

class LoginValidator extends GenericValidator {
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
