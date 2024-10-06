import { OfferCardProps } from "@wwe-portal/ui/features";
import { CurrencyData } from "../types/type.offer";
import { OfferData } from "@wwe-portal/data/offers";
import {
  CATEGORY_IDS,
  CurrencyIcon,
  CurrencyIconProps,
  LayoutTypeEnum,
  OfferRewardItem,
  OfferTypeEnum,
} from "@wwe-portal/ui/features/offer";

import { NOT_READY } from "../constants/offers.constants";
import { daysToMs } from "@wwe-portal/ui/lib";
import { isRubyOffer, isWebcoinOffer } from "../utils/offer.util";
import { CurrencyType } from "../types/type.subscription";
import { RubiesIcon, WebCoinIcon } from "@wwe-portal/ui/components";

export const offerToItemProps = (offerData: Partial<OfferData>) => {
  return (
    offerData?.OfferItemImage?.map((image, index) => ({
      imageUrl: image,
      id: index,
      itemId: index.toString(),
      text: offerData?.OfferItemTexts?.[index]?.trim() || "",
      description: offerData?.OfferItemContent?.[index] ?? "",
      dynamicImageUrl: offerData?.OfferItemImageResize?.[index],
      offerType: offerData?.OfferItemTypes?.[index],
    })) ?? []
  );
};

const MAXIMUM_END_TIME_DAYS = 10;

const formatPrice = (price: number | undefined) => {
  if (price == null || isNaN(price)) return null;
  return Number.isInteger(price) ? price : price.toFixed(2);
};

const getPriceComponent = (
  priceNum: number | undefined,
  currentIconProps: CurrencyIconProps
) => {
  if (priceNum === 0) return <>Claim</>;

  return (
    <>
      {currentIconProps.offerType === OfferTypeEnum.AlternativeCurrency && (
        <CurrencyIcon {...currentIconProps} />
      )}
      {formatPrice(priceNum)}
      {currentIconProps.offerType === OfferTypeEnum.Standard && " USD"}
    </>
  );
};
export const parseOfferDataPrice = (
  offerData: Pick<OfferData, "OfferType" | "AlternativeCostID"> & {
    amount?: number;
  }
) => {
  const currentIconProps = {
    offerType: offerData?.OfferType as never,
    alternativeCostID: offerData?.AlternativeCostID as never,
  };
  return {
    currentIconProps,
    price: getPriceComponent(offerData.amount, currentIconProps),
    priceNum: offerData.amount,
  };
};

export const getCardStatus = (
  offerData: Partial<OfferData>,
  stockMap?: Map<string, number>
) => {
  const id = offerData?.OffersID ?? "";
  return {
    isComingSoon:
      !offerData.PortalAvailability &&
      offerData.categoryId === CATEGORY_IDS.DAILY,
    isNotReady: offerData.Availability === NOT_READY,
    quantity: stockMap?.get(id) ?? offerData?.StockQuantity,
  };
};

export const cardStatusLabel = ({ isComingSoon, isNotReady }) => {
  if (isComingSoon) {
    return "COMING SOON";
  }
  if (isNotReady) {
    return "NOT READY";
  }

  return null;
};

export const offerToProps = (
  offerData: Partial<OfferData>,
  options?: {
    stockMap?: Map<string, number>;
    extendFn?: (offer: OfferCardProps) => OfferCardProps;
    currencies?: CurrencyData[];
  }
) => {
  const { stockMap, currencies, extendFn } = options ?? {};
  if (typeof offerData === "string") {
    offerData = JSON.parse(offerData);
  }

  const id = offerData?.OffersID ?? "";
  const getEndDate = (endTime: string | undefined) => {
    if (!endTime) return undefined;

    if (
      new Date(endTime).getTime() - new Date().getTime() >
      daysToMs(MAXIMUM_END_TIME_DAYS)
    )
      return undefined;

    return new Date(endTime);
  };

  const items = offerToItemProps(offerData);
  const { isComingSoon, isNotReady } = getCardStatus(offerData);

  const statusLabel = cardStatusLabel({
    isComingSoon,
    isNotReady,
  });

  const quantity = stockMap?.get(id) ?? offerData?.StockQuantity;
  const rewards = getRewardItems(offerData, currencies);
  const props: OfferCardProps = {
    id,
    backgroundImage: offerData?.OfferBackgroundImage,
    dynamicBackgroundImage: offerData?.OfferBackgroundImageResize,
    title: offerData?.StoreItemName,
    strikethroughPrice: offerData?.StrikeThroughPrice
      ? parseOfferDataPrice({
          ...offerData,
          amount: offerData.StrikeThroughPrice,
        }).price
      : undefined,
    maxQuantity: offerData?.StockMax,
    quantity,
    type: offerData?.CombinationType as never,
    items,
    endDate: getEndDate(offerData?.EndDate),
    hasPip: false,
    hasContest: offerData.badgeType === "multiple",
    badgeIcon:
      offerData.badgeType === "single" ? offerData.badgeIcon : undefined,
    showStock: offerData.ShowStock,
    price:
      statusLabel ??
      parseOfferDataPrice({
        ...offerData,
        amount: offerData?.Price?.USD ?? offerData?.AlternativeCostAmount,
      }).price,
    currentIconProps: undefined,
    priceNum: undefined,
    soldOut: quantity !== undefined && quantity <= 0,
    totalItems: (offerData?.offerItems?.length ?? 0) + rewards.length + 1, // TODO: remove +1 when we have a better solution
    layoutType: offerData.LayoutType as LayoutTypeEnum,
    storeItemDescription: offerData.StoreItemDescription,
    offerDescriptionText: offerData.OfferDescriptionText,
    bonusPercent: offerData.BonusPercentage,
    badgeText: offerData.badgeText,
  };

  if (extendFn) {
    return extendFn(props);
  }

  return props;
};

const getDescriptionItem = (
  quantity: string | number | undefined,
  name: string | undefined
) => {
  if (!quantity) return name;

  return `${quantity}x ${name}`;
};

export const getRewardItems = (
  offerData: Partial<OfferData>,
  currencies: CurrencyData[] | undefined
) => {
  const usdPrice = offerData.Price?.USD;
  if (!usdPrice || !currencies) return [];
  const rewardItems: OfferRewardItem[] = [];
  const webcoinData = currencies.find(
    (item) => item.name === CurrencyType.WebCoin
  );
  const rubyData = currencies.find((item) => item.name === CurrencyType.Ruby);
  if (!isWebcoinOffer(offerData) && webcoinData) {
    rewardItems.push({
      itemId: CurrencyType.WebCoin,
      quantity: Math.round(webcoinData.rate * usdPrice),
      text: CurrencyType.WebCoin,
      description: getDescriptionItem(
        Math.round(webcoinData.rate * usdPrice),
        CurrencyType.WebCoin
      ),
      iconElement: (
        <WebCoinIcon
          className="wwe-size-full"
          style={{
            color: "deepskyblue",
          }}
        />
      ),
    });
  }

  if (!isRubyOffer(offerData) && rubyData) {
    rewardItems.push({
      itemId: CurrencyType.Ruby,
      quantity: Math.round(rubyData.rate * usdPrice),
      text: CurrencyType.Ruby,
      description: getDescriptionItem(
        Math.round(rubyData.rate * usdPrice),
        CurrencyType.Ruby
      ),
      iconElement: (
        <RubiesIcon
          className="wwe-size-full"
          style={{
            color: "#c055ff",
          }}
        />
      ),
    });
  }

  return rewardItems;
};
