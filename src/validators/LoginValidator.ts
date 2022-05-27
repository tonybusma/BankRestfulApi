import GenericValidator from "./genericValidator";

class AccountValidator extends GenericValidator {
  checkRequiredParams(
    cpf: string,
    password: string,
  ): Object {
    let missingParams: Object = {};
    if (!cpf) {
      missingParams["cpf"] = "Cpf must be sent.";
    }
    if (!password) {
      missingParams["password"] = "password must be sent.";
    }
    return missingParams;
  }
}

export default AccountValidator;
