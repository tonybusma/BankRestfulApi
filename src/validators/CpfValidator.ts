abstract class CpfValidator {
  private CPF_REGEX: RegExp =
    /([0-9]{3}(\-?|\.?)[0-9]{3}(\-?|\.?)[0-9]{3}(\-?|\.?)[0-9]{2}){1}/;

  validateCpf(cpf: string): string | undefined {
    let regex: RegExpExecArray | null = this.CPF_REGEX.exec(cpf);
    if (regex && regex[0] === regex["input"]) {
      let validCpf: string = cpf.replace(/[.-]/g, "");
      return validCpf;
    }
    return undefined;
  }
}

export default CpfValidator;
