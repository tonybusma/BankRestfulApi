abstract class GenericValidator {
  private CPF_REGEX: RegExp =
    /([0-9]{3}(\-?|\.?)[0-9]{3}(\-?|\.?)[0-9]{3}(\-?|\.?)[0-9]{2}){1}/;

  validateCpf(cpf: string): string {
    let regex: Array<any> = this.CPF_REGEX.exec(cpf);
    if (regex && regex[0] === regex["input"]) {
      let validCpf: string = cpf.replace(/[.-]/g, "");
      return validCpf;
    }
    return undefined;
  }
}

export default GenericValidator;
