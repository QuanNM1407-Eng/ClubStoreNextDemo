import {
  SubscriptionTier,
  OfferCardProps,
  OfferProvider,
  offerToProps,
} from "@wwe-portal/ui/features";
import { ExclusiveItemsSectionRevamp as ExclusiveItemsSectionUI } from "@wwe-portal/widget/club-store";
// import usePurchaseByClubCoins from 'store/payment/usePurchaseByClubCoins';

import { isBlockOffer, subCategoryTypeToTier } from "./lib/mapper.offer";
import { useEffectOnceWhen } from "./hooks/common/useEffectOnceWhen";
import { getCardStatus } from "./lib/mapper.revamp";
import { ExclusiveItemResponse } from "./lib/type";
import {
  SyntheticEvent,
  useCallback,
  useEffect,
  useMemo,
  useState,
} from "react";
import { OfferData } from "@wwe-portal/data/offers";
import { useExclusiveDialogRevamp } from "./lib/useExclusiveDialogRevamp";
import { useExclusiveStoreData } from "./lib/useExclusiveStoreData";
import useIsAuthenticated from "./hooks/global/useIsAuthenticated";
import usePurchaseByClubCoins from "./payment/usePurchaseByClubCoins";
// import { globalSel } from "store/global";
// import { useSelector } from "react-redux";

const selectOfferData = ({ offerData }: ExclusiveItemResponse) => offerData;

export const ExclusiveItemSectionRevamp = () => {
  // Redux selector hooks
  const { isAuthenticated } = useIsAuthenticated();
  console.log({ isAuthenticated });
  const { purchaseItemsByClubCoins, isLoading } = usePurchaseByClubCoins({
    onError: () => {
      closeExclusiveDialog();
    },
    onPaymentSuccess: () => {
      closeExclusiveDialog();
    },
  });

  const handleOfferBuy = (data: {
    tier: SubscriptionTier;
    offerData: OfferData | OfferCardProps;
  }) => {
    getValidationPurchase({
      tier: data.tier,
      offerData: data.offerData as OfferData,
      onFailedCallback: () => {
        closeExclusiveDialog();
      },
    });
  };

  const {
    exclusiveDialog,
    setExclusiveDialogData,
    closeDialog: closeExclusiveDialog,
  } = useExclusiveDialogRevamp({
    isLoading: false,
    handleBuy: handleOfferBuy,
  });

  const {
    titles,
    descriptions,
    enabled,
    getValidationPurchase,
    currentPlan,
    exclusiveItemResponse,
  } = useExclusiveStoreData({
    closeExclusiveDialog,
    purchaseItemsByClubCoins,
  });
  const findOffer = ({ OffersID }: { OffersID: string }) =>
    exclusiveItemResponse?.data?.find(
      (item) => item.offerData.OffersID === OffersID
    );

  const handlePurchaseClick = (
    { OffersID }: { OffersID: string },
    e: SyntheticEvent
  ) => {
    const offer = findOffer({ OffersID });
    if (!offer) return;
    const { quantity } = getCardStatus(offer.offerData);
    if (quantity) {
      const offerData = offer.offerData;
      const tier = subCategoryTypeToTier(offer.subCategoryType);
      const isBlocked = isBlockOffer(offer.subCategoryType, currentPlan);
      setExclusiveDialogData({
        offerData,
        tier,
        isBlocked,
      });
      if (!isAuthenticated) {
        e["isCancelledClickOffer"] = true;
      }
      getValidationPurchase({
        tier,
        offerData,
        onFailedCallback: () => {
          closeExclusiveDialog();
        },
      });
    }
  };

  const handleOfferClick = (
    { OffersID }: { OffersID: string },
    e: SyntheticEvent
  ) => {
    if (e["isCancelledClickOffer"]) return;
    const offer = findOffer({ OffersID });
    if (!offer) return;
    const offerData = offer.offerData;
    const tier = subCategoryTypeToTier(offer.subCategoryType);
    const isBlocked = isBlockOffer(offer.subCategoryType, currentPlan);
    setExclusiveDialogData({
      offerData,
      tier,
      isBlocked,
    });
  };

  const originOffers = useMemo(
    () => exclusiveItemResponse?.data ?? [],
    [exclusiveItemResponse]
  );

  const exclusiveItemData = useMemo(() => {
    const itemsByTier = {
      [SubscriptionTier.GOLD]: originOffers
        .filter((offer) => offer.subCategoryType === 3)
        .map(selectOfferData),
      [SubscriptionTier.SILVER]: originOffers
        .filter((offer) => offer.subCategoryType === 2)
        .map(selectOfferData),
      [SubscriptionTier.BRONZE]: originOffers
        .filter((offer) => offer.subCategoryType === 1)
        .map(selectOfferData),
    };
    const offerIdsByTier = new Map<string, SubscriptionTier>();
    Object.values(SubscriptionTier).forEach((tier) => {
      itemsByTier[tier].forEach((offerData) => {
        offerIdsByTier.set(offerData.OffersID, tier);
      });
    });
    return {
      itemsByTier,
      offerIdsByTier,
    };
  }, [originOffers]);

  const parseExclusiveItemToRevampProps = useCallback(
    (offerData: OfferData) => {
      const tier = exclusiveItemData.offerIdsByTier.get(offerData.OffersID);

      const parsedOffer = offerToProps(offerData);

      const props: OfferCardProps = {
        ...parsedOffer,
        soldOut: parsedOffer.quantity === 0,
        isBlocked: isBlockOffer(tier, currentPlan),
      };
      return props;
    },
    [currentPlan, exclusiveItemData]
  );
  console.log({ exclusiveItemData });

  // useEffectOnceWhen(() => {
  //   sendExclusiveItemsRevampLoadedEvent(exclusiveItemData.itemsByTier);
  // }, originOffers != null);

  return (
    <OfferProvider
      offerToProps={parseExclusiveItemToRevampProps}
      onBannerClick={function (): void {
        throw new Error("Function not implemented.");
      }}
      onBannerMoreClick={function (): void {
        throw new Error("Function not implemented.");
      }}
      onOfferClick={handleOfferClick}
      onOfferPriceClick={handlePurchaseClick}
    >
      <ExclusiveItemsSectionUI
        exclusiveItems={exclusiveItemData.itemsByTier}
        titles={titles}
        enabled={enabled}
        descriptions={descriptions}
      />
      {exclusiveDialog}
    </OfferProvider>
  );
};
