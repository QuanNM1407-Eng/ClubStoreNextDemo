import {
  OfferCardProps,
  OfferReviewDialog,
  PurchaseButton,
  SubscriptionTier,
} from "@wwe-portal/ui/features";
import React, { useState } from "react";
import { parseOfferPreview } from "../modals/OfferPreviewDialog";
import {
  cardStatusLabel,
  getCardStatus,
  parseOfferDataPrice,
} from "../lib/mapper.revamp";
import { OfferData } from "@wwe-portal/data/offers";

export interface UseExclusiveDialogProps {
  isLoading: boolean;
  handleBuy: (data: {
    offerData: OfferData | OfferCardProps;
    tier: SubscriptionTier;
  }) => void;
}

export const useExclusiveDialogRevamp = ({ isLoading, handleBuy }) => {
  const [data, setData] = useState<
    | {
        offerData: OfferData;
        tier?: SubscriptionTier;
        isBlocked?: boolean;
        endDate?: Date;
      }
    | undefined
  >();

  const getActionBtn = (
    offer: OfferData,
    tier?: SubscriptionTier,
    isBlocked?: boolean
  ) => {
    const { isComingSoon, isNotReady } = getCardStatus(offer);
    const statusLabel = cardStatusLabel({
      isComingSoon,
      isNotReady,
    });
    return (
      <PurchaseButton
        isBlocked={isBlocked}
        onClick={() => {
          offer.StockQuantity &&
            handleBuy({
              offerData: offer,
              tier: tier,
            });
        }}
        loading={isLoading}
        className="wwe-w-full"
        disabled={isComingSoon || isNotReady}
        price={
          statusLabel ??
          parseOfferDataPrice({
            ...offer,
            amount: offer?.Price?.USD ?? offer?.AlternativeCostAmount,
          }).price
        }
      />
    );
  };

  const exclusiveDialog = data ? (
    <OfferReviewDialog
      data={parseOfferPreview(
        data.offerData,
        getActionBtn(data.offerData, data.tier, data.isBlocked)
      )}
      open
      onClose={() => setData(undefined)}
    />
  ) : null;

  return {
    exclusiveDialog,
    setExclusiveDialogData: setData,
    closeDialog: () => setData(undefined),
  };
};
