import GenericValidator from "./genericValidator";

class OperationValidator extends GenericValidator {
  checkRequiredParams(receivingAccount: string, amount: number): Object {
    let missingParams: Object = {};
    if (!receivingAccount) {
      missingParams["receivingAccount"] =
        "Receiving account's cpf must be sent.";
    }
    if (!amount) {
      missingParams["amount"] = "Amount must be sent.";
    }
    return missingParams;
  }

  validateAmount(amount: string): number {
    let validAmount: number = parseFloat(amount);
    if (!isNaN(validAmount)) {
      return validAmount;
    }
    return undefined;
  }
}

export default OperationValidator;
