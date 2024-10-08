import { purchaseOfferByClubCoin } from "./api";
import { NotSufficientClubCoins } from "../lib/exception";
import { useMutation } from "@tanstack/react-query";
import { OfferData } from "@wwe-portal/data/offers";
import { VERIFY_DURATION_MS } from "../constants/offers.constants";
import { useTranslation } from "react-i18next";
import { useInvalidateExclusiveItems } from "../query/clubStoreQueries";
import { useProcessingDialog } from "../modals/ProcessingDialog";

import { useGetClubCoins, useInvalidateBalance } from "../lib/useCurrency";
// import { useClubcoinTransactionAnalytics } from "analytics/offer";
import { isAPIError, useHandleCommonError } from "../utils/error.util";
import { errorCodes } from "../constants/errorCode.constants";
import { NotEnoughClubCoinDialog } from "../modals/NotEnoughClubCoinDialog";
import { showDialog } from "@wwe-portal/ui/components";
import { AxiosResponse } from "axios";

interface UsePurchaseByClubCoinProps {
  onError?: () => void;
  onPaymentSuccess?: (
    data: AxiosResponse<any>,
    variables: { offerData: OfferData }
  ) => void;
}
const usePurchaseByClubCoins = ({
  onError,
  onPaymentSuccess,
}: UsePurchaseByClubCoinProps) => {
  const handleCommonError = useHandleCommonError();
  const { t } = useTranslation();
  const invalidateExclusiveItems = useInvalidateExclusiveItems();
  const invalidateBalance = useInvalidateBalance();
  const { amount } = useGetClubCoins();
  // const { sendPurchaseSuccessEvent } = useClubcoinTransactionAnalytics();

  const { showProcess, showSuccess } = useProcessingDialog({
    progressData: {
      duration: VERIFY_DURATION_MS,
      title: t("clubCoin.title.load"),
      description: t("clubCoin.description.load"),
    },
    successData: {
      title: t("clubCoin.title.successful"),
      description: t("clubCoin.description.successful"),
    },
    onClose: () => {
      reset();
    },
  });

  const handleOnError = (error) => {
    console.log({ error });
    if (NotSufficientClubCoins.NotSufficientClubCoins(error)) {
      showDialog(NotEnoughClubCoinDialog);
    } else {
      handleCommonError(error);
    }
    onError?.();
    reset();
  };

  const isNotEnoughClubCoins = (offerData) => {
    return (
      amount == null ||
      (offerData.AlternativeCostAmount != null &&
        amount < offerData.AlternativeCostAmount)
    );
  };

  const verifyAfterPurchase = (purchaseResult) => {
    const paymentInfo = purchaseResult.data;
    if (
      NotSufficientClubCoins.NotSufficientClubCoins(purchaseResult) ||
      !paymentInfo.success
    ) {
      console.log({ verifyAfterPurchase: paymentInfo });
      throw new Error(paymentInfo.message);
    }
  };

  const handleOnSuccess = (
    purchaseResult: any,
    params: { offerData: OfferData }
  ) => {
    console.log({ purchaseResult });
    if (!purchaseResult?.data?.success) {
      console.log({ handleOnSuccess: purchaseResult });
      throw Error(purchaseResult.message);
    }
    verifyAfterPurchase(purchaseResult);
    invalidateBalance();
    invalidateExclusiveItems();
    showProcess();
    setTimeout(() => {
      onPaymentSuccess?.(purchaseResult, params);
      // sendPurchaseSuccessEvent(params.offerData);
      showSuccess();
    }, VERIFY_DURATION_MS);
  };

  const {
    mutate: purchaseItemsByClubCoins,
    isLoading,
    variables,
    reset,
  } = useMutation(
    ({ offerData }: { offerData: OfferData }) => {
      if (isNotEnoughClubCoins(offerData)) {
        throw new NotSufficientClubCoins();
      }
      return purchaseOfferByClubCoin({ offerId: offerData.OffersID ?? "" });
    },
    {
      onSuccess: handleOnSuccess,
      onError: handleOnError,
    }
  );

  return {
    purchasingOffer: variables,
    purchaseItemsByClubCoins,
    isLoading,
  };
};

export default usePurchaseByClubCoins;
