abstract class GenericValidator {
  private CPF_REGEX: RegExp =
    /([0-9]{3}(\-?|\.?)[0-9]{3}(\-?|\.?)[0-9]{3}(\-?|\.?)[0-9]{2}){1}/;

  validateCpf(cpf: string): string {
    if (this.CPF_REGEX.test(cpf)) {
      let validCpf: string = cpf.replace(/[.-]/g, "");
      return validCpf;
    }
    return undefined;
  }
}

export default GenericValidator;
