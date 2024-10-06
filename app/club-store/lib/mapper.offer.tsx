import {
  ExclusiveItemResponse,
  FilterablePlayerRoster,
  RosterItemResponse,
} from "./type";
import {
  ExclusiveItemProps,
  LayoutTypeEnum,
  OfferCardProps,
  SubscriptionTier,
} from "@wwe-portal/ui/features";
import {
  RosterLevelEnum,
  RosterLevelType,
} from "@wwe-portal/ui/features/roster";
import { CurrentSubscriptionPlan } from "../types/type.subscription";
import { isBetterTier } from "../types/type.subscription";
import {
  cardStatusLabel,
  getCardStatus,
  offerToItemProps,
  parseOfferDataPrice,
} from "./mapper.revamp";
import { daysToMs } from "@wwe-portal/ui/lib";

const MAXIMUM_END_TIME_DAYS = 10;

export const getEndDate = (endTime: string | undefined) => {
  if (!endTime) return "";

  if (
    new Date(endTime).getTime() - new Date().getTime() >
    daysToMs(MAXIMUM_END_TIME_DAYS)
  )
    return "";

  return endTime;
};

export const offerToProps = (offer: ExclusiveItemResponse) => {
  const { isComingSoon, isNotReady } = getCardStatus(offer.offerData);
  const statusLabel = cardStatusLabel({
    isComingSoon,
    isNotReady,
  });
  const { price, priceNum } = parseOfferDataPrice({
    ...offer.offerData,
    amount:
      offer.offerData?.Price?.USD ?? offer.offerData?.AlternativeCostAmount,
  });

  if (typeof offer.offerData === "string") {
    offer.offerData = JSON.parse(offer.offerData);
  }
  const props: OfferCardProps = {
    ...offer.offerData,
    id: offer.offerId,
    dynamicBackgroundImage: offer.offerData?.OfferBackgroundImage,
    backgroundImage: offer.offerData?.OfferBackgroundImage,
    title: offer.offerData?.StoreItemName,
    strikethroughPrice: offer.offerData?.StrikeThroughPrice
      ? String(offer.offerData.StrikeThroughPrice)
      : undefined,
    maxQuantity: offer.offerData.StockMax,
    quantity: offer.offerData.StockQuantity,
    type: offer.offerData.CombinationType as never,
    items: offerToItemProps(offer.offerData),
    endDate: new Date(getEndDate(offer.offerData.EndDate)),
    price: statusLabel ?? price,
    priceNum,
    currentIconProps: undefined,
    layoutType: offer.offerData.LayoutType as LayoutTypeEnum,
    storeItemDescription: offer.offerData.StoreItemDescription,
    offerDescriptionText: offer.offerData.OfferDescriptionText,
    badgeText: offer.offerData.badgeText,
  };
  return props;
};

const validLevels = Object.values(RosterLevelEnum);
export const parseRosterItemToProps = ({
  solidStars,
  image,
  name,
  ID: id,
  level,
  rosterId,
  superstarId,
  tier,
  nickname,
  hollowStars,
  talent,
  title,
  class: _class,
  era,
  stable,
  e3,
}: RosterItemResponse) => {
  const props: FilterablePlayerRoster = {
    id,
    name: name ?? "-",
    star: solidStars,
    img: image,
    description: nickname,
    level: validLevels.includes(level as never)
      ? (level as RosterLevelType)
      : undefined,
    rosterId: rosterId ?? superstarId,
    tier,
    hollowStar: hollowStars ?? 0,
    title,
    class: _class,
    era,
    stable,
    price: talent,
    e3,
  };
  return props;
};

export const subscriptionMap = {
  [SubscriptionTier.BRONZE]: {
    name: "Premium",
  },
  [SubscriptionTier.SILVER]: {
    name: "Prestige",
  },
  [SubscriptionTier.GOLD]: {
    name: "SuperVIP",
  },
};

export const subCategoryTypeToTier = (
  type: number | SubscriptionTier | undefined
) => {
  if (typeof type === "number")
    return Object.values(SubscriptionTier)[type - 1];
  return type;
};

export const isBlockOffer = (
  type: number | SubscriptionTier | undefined,
  currentPlan: CurrentSubscriptionPlan | undefined
) => {
  if (!currentPlan) return false;

  return isBetterTier(
    {
      tier: subCategoryTypeToTier(type) ?? SubscriptionTier.BRONZE,
    },
    currentPlan
  );
};

export const parseExclusiveItemToProps = (
  rawOffer: ExclusiveItemResponse,
  currentPlan: CurrentSubscriptionPlan | undefined
) => {
  const props: ExclusiveItemProps & {
    isBlocked: boolean;
    tier: SubscriptionTier | undefined;
  } = {
    id: rawOffer.offerId,
    offerData: offerToProps(rawOffer),
    tier: Object.values(SubscriptionTier)[rawOffer.subCategoryType - 1],
    endDate: rawOffer.offerData.EndDate
      ? new Date(rawOffer.offerData.EndDate)
      : undefined,
    isBlocked: isBlockOffer(rawOffer.subCategoryType, currentPlan),
    moreInfoData: {
      detailsDescription: rawOffer.offerData?.StoreItemDescription ?? "",
      rewardList: rawOffer.offerData.OfferItemContent ?? [],
      actionBtn: undefined,
    },
  };

  return props;
};
