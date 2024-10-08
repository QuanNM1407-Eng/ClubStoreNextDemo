// import { useDispatch, useSelector } from "react-redux";
// import globalSel from "./selectors";
// import globalOp from "./operations";
import useIsAuthenticated from "../hooks/global/useIsAuthenticated";

export const useGetWebcoins = () => {
  // const currentUserWebCoin: number | null = useSelector(
  //   globalSel.currentUserWebCoinSelector
  // );
  // const currentUserLoading = useSelector(globalSel.currentUserLoadingSelector);
  // const currentUserEnergyWebCoinLoading = useSelector(
  //   globalSel.currentUserEnergyWebCoinLoadingSelector
  // );

  // const isLoading = currentUserLoading || currentUserEnergyWebCoinLoading;
  const isLoading = false;
  return {
    amount: isLoading ? null : 1234,
    isLoading,
  };
};

export const useInvalidateBalance = () => {
  //todo
  return () => {};
};

export const useGetClubCoins = () => {
  const isAuthenticated = useIsAuthenticated();
  const amount = 1000;

  return {
    amount: isAuthenticated ? amount : undefined,
  };
};
