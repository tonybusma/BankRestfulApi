interface MissingParams {
  amount?: string;
}

class WithdrawValidator {
  checkRequiredParams(amount: number): Object {
    let missingParams: MissingParams = {};
    if (!amount) {
      missingParams.amount = "Amount must be sent.";
    }
    return missingParams;
  }

  validateAmount(amount: string): number | undefined {
    let validAmount: number = parseFloat(amount);
    if (!isNaN(validAmount)) {
      return validAmount;
    }
    return undefined;
  }
}

export default WithdrawValidator;
