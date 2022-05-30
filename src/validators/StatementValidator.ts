class StatementValidator {
  validateMonth(month: string): number | undefined {
    let validMonth: number | string = this.formatTextMonth(month);
    validMonth = parseInt(validMonth.toString());
    if (!isNaN(validMonth) && validMonth >= 1 && validMonth <= 12) {
      return validMonth;
    }
    return undefined;
  }

  private formatTextMonth(month: string): number | string {
    switch (month.toLowerCase()) {
      case "january":
        return 1;
      case "february":
        return 2;
      case "march":
        return 3;
      case "april":
        return 4;
      case "may":
        return 5;
      case "june":
        return 6;
      case "july":
        return 7;
      case "august":
        return 8;
      case "september":
        return 9;
      case "october":
        return 10;
      case "november":
        return 11;
      case "december":
        return 12;
    }
    return month;
  }
}

export default StatementValidator;
