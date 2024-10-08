import { AxiosResponse } from "axios";

export class NotSufficientClubCoins extends Error {
  constructor() {
    super("not sufficient club coins");
  }

  static NotSufficientClubCoins(apiResponse: AxiosResponse) {
    return (
      apiResponse.data?.message === "Insufficient balance" ||
      apiResponse?.message === "Insufficient balance"
    );
  }
}
