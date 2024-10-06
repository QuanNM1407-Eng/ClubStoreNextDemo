import {
  OfferReviewDialogProps,
  OfferReviewDialog,
  OfferReviewProps,
  PurchaseButton,
} from "@wwe-portal/ui/features";
import { OfferData } from "../types/type.offer";

import { useState } from "react";
import {
  cardStatusLabel,
  getCardStatus,
  getRewardItems,
  parseOfferDataPrice,
} from "../lib/mapper.revamp";
import { DIALOG_ID_SPECIAL_OFFER_PREVIEW } from "../constants/key.constant";
// import { useGetCurrencies, useOfferMap } from "../query";
import {
  Button,
  createPortableDialog,
  removeDialog,
  showDialogById,
  usePortableDialog,
} from "@wwe-portal/ui/components";

// import { usePipStore } from "../usePipStore";
import { daysToMs } from "@wwe-portal/ui/lib";
import { PointRule } from "../types/type.event";
import useGetCurrentUser from "./global/useGetCurrentUser";

export enum OfferRevampTypes {
  Feature = "Feature",
  Daily = "Daily",
  Rubies = "Rubies",
  CashPacks = "Cash Packs",
  Reward = "Reward",
  Webcoin = "Web Coin",
}

const MAXIMUM_END_TIME_DAYS = 10;

interface SelectedOfferProps {
  offerData: OfferData;
  pointRule: PointRule | undefined;
}

export const OfferPreviewContent = createPortableDialog(
  ({ data }: { data: OfferReviewDialogProps["data"] }) => {
    const modal = usePortableDialog();
    return (
      <OfferReviewDialog
        onClose={modal.remove}
        open={modal.visible}
        data={{ ...data }}
      />
    );
  }
);

const QUANTITY_SHORTED_THRESHOLD = 10_000;

export const formatQuantity = (quantity: string | number | undefined) => {
  const quanNumber = Number(quantity);
  if (
    isNaN(quanNumber) ||
    quanNumber < QUANTITY_SHORTED_THRESHOLD ||
    quanNumber % QUANTITY_SHORTED_THRESHOLD !== 0
  )
    return String(quantity);
  return Intl.NumberFormat("en", {
    notation: "compact",
    compactDisplay: "short",
  }).format(quanNumber);
};

export const getDescriptionItem = (
  quantity: string | number | undefined,
  name: string | undefined
) => {
  if (!quantity) return name;
  return `${formatQuantity(quantity)} ${name}`;
};

export const getEndDate = (endTime: string | undefined) => {
  if (!endTime) return "";

  if (
    new Date(endTime).getTime() - new Date().getTime() >
    daysToMs(MAXIMUM_END_TIME_DAYS)
  )
    return "";

  return endTime;
};

export const useOfferPreviewDialog = ({
  onPurchase,
  isPreparingPayment,
  isClaiming,
}: {
  onPurchase: (offerData: OfferData) => void;
  isPreparingPayment?: boolean;
  isClaiming?: boolean;
}) => {
  const [selectedOffer, setSelectedOffer] = useState<SelectedOfferProps>();
  const { currentUser } = useGetCurrentUser();
  const stockMap = new Map();
  // const { stockMap } = useOfferMap();
  const currencies = {} as any;
  // const { data: currencies } = useGetCurrencies();

  const parseOfferPreview = (offer: SelectedOfferProps) => {
    const { offerData, pointRule } = offer;
    const usdPrice = offerData.Price?.USD;
    const { isComingSoon, isNotReady } = getCardStatus(offerData, stockMap);
    const statusLabel = cardStatusLabel({
      isComingSoon,
      isNotReady,
    });

    const firstRewardAmount =
      usdPrice && pointRule
        ? `${pointRule.rate * Math.round(usdPrice) * pointRule.value}`
        : "";

    const result: OfferReviewProps = {
      title: offerData?.StoreItemName ?? "",
      items:
        offerData?.offerItems?.map((item) => ({
          dynamicImageUrl: item.url ?? "",
          id: item.itemID,
          itemId: item.itemID,
          text: formatQuantity(item.quantity),
          description: getDescriptionItem(item.quantity, item.itemName),
        })) ?? [],
      rewardItems: getRewardItems(offerData, currencies?.data.data),
      rewards: firstRewardAmount
        ? [
            `${firstRewardAmount} Points towards ALL active Store Bonus Reward Events!`,
          ]
        : undefined,
      endDate: getEndDate(offerData.EndDate),
      id: offerData?.OffersID ?? "",
      vipPoints:
        offerData.VipPoint ??
        0 + (currentUser?.pointBoost ?? 0) * (offerData.VipPoint ?? 0),
      disabled: false,
      storeItemDescription: offerData.StoreItemDescription,
      actionBtn: statusLabel ? (
        <Button className="wwe-w-full" disabled size="large">
          {statusLabel}
        </Button>
      ) : (
        <PurchaseButton
          {...parseOfferDataPrice({
            ...offerData,
            amount: offerData?.Price?.USD ?? offerData?.AlternativeCostAmount,
          })}
          onClick={() => {
            onPurchase(offerData);
          }}
          loading={isPreparingPayment || isClaiming}
          className="wwe-w-full"
        />
      ),
    };
    return result;
  };

  const previewDialog = selectedOffer ? (
    <OfferPreviewContent
      data={{
        ...parseOfferPreview(selectedOffer),
        onClose: () => setSelectedOffer(undefined),
      }}
      id={DIALOG_ID_SPECIAL_OFFER_PREVIEW}
    />
  ) : null;

  // const markViewedOffers = usePipStore((state) => state.viewOffers);

  const selectOffer = (offer: SelectedOfferProps) => {
    setSelectedOffer(offer);
    showDialogById(DIALOG_ID_SPECIAL_OFFER_PREVIEW);

    // if (currentUser?.userId) {
    //   markViewedOffers(currentUser.userId, [
    //     {
    //       id: offer.offerData.OffersID,
    //       endDate: offer.offerData.EndDate
    //         ? new Date(offer.offerData.EndDate)
    //         : undefined,
    //     },
    //   ]);
    // }
  };

  return {
    selectedOffer,
    selectOffer,
    previewDialog,
    closePreview: () => removeDialog(DIALOG_ID_SPECIAL_OFFER_PREVIEW),
  };
};
