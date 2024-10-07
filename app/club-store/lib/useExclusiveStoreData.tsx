import { SubscriptionTier } from "@wwe-portal/ui/features";
import { useEffect, useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
// import { useSelector } from "react-redux";
// import { globalSel } from "store/global";
// import { useGetClubCoins } from "store/global/useCurrency";
// import { useEnabledFlags } from "views/components/FeatureFlag";
// import { useSubscriptionQuery } from "views/pages/Subscription/lib/query";
// import { useExclusiveItems } from "./query";
import { OfferData } from "@wwe-portal/data/offers";
import { NotEnoughClubCoinDialog } from "../modals/NotEnoughClubCoinDialog";
import { ReferSubscriptionDialog } from "../modals/ReferSubscriptionDialog";
import { isBetterTier } from "../types/type.subscription";
import { subscriptionMap } from "./mapper.offer";
import { showDialog } from "@wwe-portal/ui/components";
import { LoginDialog } from "../modals/LoginDialog";
import useExclusiveItems from "../query/useExclusiveItems";
import useIsAuthenticated from "../hooks/global/useIsAuthenticated";
import { useSubscriptionQuery } from "../query/subscriptionQueries";

interface UseExclusiveStoreDataProps {
  closeExclusiveDialog: () => void;
  purchaseItemsByClubCoins: (payload: { offerData: OfferData }) => void;
}
export const useExclusiveStoreData = ({
  closeExclusiveDialog,
  purchaseItemsByClubCoins,
}: UseExclusiveStoreDataProps) => {
  const { t } = useTranslation();
  // const [premiumOfferEnabled, prestigeOfferEnabled, superVIPEnabled] =
  //   useEnabledFlags([
  //     "clubStore.offers.premium",
  //     "clubStore.offers.prestige",
  //     "clubStore.offers.super_vip",
  //   ]);
  const premiumOfferEnabled = true,
    prestigeOfferEnabled = true,
    superVIPEnabled = true;
  const { isAuthenticated } = useIsAuthenticated();
  // const { amount: currentUserClubCoin } = useGetClubCoins();
  const currentUserClubCoin = 0;
  const { currentPlan } = useSubscriptionQuery();
  const { data: exclusiveItemResponse } = useExclusiveItems();
  // const exclusiveItemResponse = {};
  // const getExclusiveItems = async () => {
  //   const data = await fetch(
  //     "https://dev-api.wwechampions.com/club/offers/all"
  //   );
  //   return await data.json();
  // };
  // const exclusiveItemResponse = (async() => return await getExclusiveItems());

  const getValidationPurchase = (data: {
    tier: SubscriptionTier | undefined;
    offerData: OfferData;
    onFailedCallback?: () => void;
  }) => {
    const { tier } = data;

    // if user is not logged in
    if (!isAuthenticated) {
      closeExclusiveDialog();
      showDialog(LoginDialog, {
        title: "Login To Subscribe",
        isAuthenticated,
        loginButtons: <div>Login Popup</div>,
      });
      return;
    }

    // if user did not subscribe a plan
    if (!currentPlan) {
      closeExclusiveDialog();
      showDialog(ReferSubscriptionDialog, {
        description: (
          <>
            Please go to subscription page
            <br />
            subscribe the {subscriptionMap[tier!].name} plan
          </>
        ),
      });
      return;
    }

    // if user subscribed a lower plan
    if (isBetterTier(data, currentPlan)) {
      closeExclusiveDialog();
      showDialog(ReferSubscriptionDialog, {
        description: (
          <>
            Please go to subscription page
            <br />
            and subscribe higher plan
            <br />
            to purchase items
          </>
        ),
      });
      return;
    }

    // if user does not have enough club coins
    if (
      (data.offerData.AlternativeCostAmount ?? 0) > (currentUserClubCoin ?? 0)
    ) {
      closeExclusiveDialog();
      showDialog(NotEnoughClubCoinDialog);
      return;
    }

    const offerData = exclusiveItemResponse.data?.find(
      (item) => item.offerData.OffersID === data.offerData.OffersID
    )?.offerData;

    if (offerData == null) return;

    purchaseItemsByClubCoins({
      offerData,
    });
  };
  const titles = useMemo(
    () => ({
      [SubscriptionTier.BRONZE]: t("Exclusive Premium Drops"),
      [SubscriptionTier.SILVER]: t("Exclusive Prestige Drops"),
      [SubscriptionTier.GOLD]: t("Exclusive SuperVip Drops"),
    }),
    [t]
  );

  const enabled = useMemo(
    () => ({
      [SubscriptionTier.BRONZE]: Boolean(premiumOfferEnabled),
      [SubscriptionTier.SILVER]: Boolean(prestigeOfferEnabled),
      [SubscriptionTier.GOLD]: Boolean(superVIPEnabled),
    }),
    [premiumOfferEnabled, prestigeOfferEnabled, superVIPEnabled]
  );
  const descriptions = useMemo(
    () => ({
      [SubscriptionTier.BRONZE]: t(
        "Check back often for unexpected Items to appear!"
      ),
      [SubscriptionTier.SILVER]: t(
        "Check back often for unexpected Items to appear!"
      ),
      [SubscriptionTier.GOLD]: t(
        "Check back often for unexpected Items to appear!"
      ),
    }),
    [t]
  );

  return {
    titles,
    descriptions,
    enabled,
    getValidationPurchase,
    currentPlan,
    exclusiveItemResponse,
  };
};
