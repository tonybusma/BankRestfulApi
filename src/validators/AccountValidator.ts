import GenericValidator from "./GenericValidator";

interface MissingParams {
  cpf?: string;
  password?: string;
  name?: string;
  birthdate?: string;
}

class AccountValidator extends GenericValidator {
  private EMAIL_REGEX: RegExp = /[a-z0-9]+@[a-z]+\.[a-z]+(\.[a-z]+)?/;
  private NAME_REGEX: RegExp =
    /^[A-Za-z][A-Za-z\'\-]+([\ A-Za-z][A-Za-z\'\-]+)*/;
  private PHONE_NUMBER_REGEX: RegExp =
    /\+? ?([0-9]{2})?[- ]?(\([0-9]{2}\)|[0-9]{2})?[- ]?[0-9]{4,5}[- ]?[0-9]{4}/;
  private YEARS_18: number = 1000 * 60 * 60 * 24 * 365 * 18;

  checkRequiredParams(
    cpf: string,
    password: string,
    name: string,
    birthdate: string
  ): Object {
    let missingParams: MissingParams = {};
    if (!cpf) {
      missingParams.cpf = "Cpf must be sent.";
    }
    if (!password) {
      missingParams.password = "Password must be sent.";
    }
    if (!name) {
      missingParams.name = "Name must be sent.";
    }
    if (!birthdate) {
      missingParams.birthdate = "Birthdate must be sent.";
    }
    return missingParams;
  }

  validateBirthdate(birthdate: string): Date | undefined {
    let validDate = new Date(birthdate);
    if (validDate instanceof Date && !isNaN(validDate.getTime())) {
      if (Date.now() - validDate.getTime() > this.YEARS_18) {
        return validDate;
      }
    }
    return undefined;
  }

  validateName(name: string): string | undefined {
    let regex: RegExpExecArray | null = this.NAME_REGEX.exec(name);
    if (regex && regex[0] === regex["input"]) {
      return name;
    }
    return undefined;
  }

  validateEmail(email: string): string | undefined {
    let regex: RegExpExecArray | null = this.EMAIL_REGEX.exec(email);
    if (regex && regex[0] === regex["input"]) {
      return email;
    }
    return undefined;
  }

  validatePhoneNumber(phoneNumber: string): string | undefined {
    let regex: RegExpExecArray | null =
      this.PHONE_NUMBER_REGEX.exec(phoneNumber);
    if (regex && regex[0] === regex["input"]) {
      let validPhoneNumber = phoneNumber.replace(/[+ -]/g, "");
      return validPhoneNumber;
    }
    return undefined;
  }
}

export default AccountValidator;
