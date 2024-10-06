export interface StepupInfo {
  stepsUpId: number;
  name: string;
  description: string;
  isPublished: boolean;
  startDate: string;
  endDate: string;
  imageUrl: string;
  launchTimes: number;
  slotTimer: number;
  updatedAt: string;
  createdAt: string;
}

export interface LatestStepUpResponse {
  data: Partial<StepupInfo>;
}

export interface Gifts {}

export interface Price {
  USD?: number;
}
export interface AnalyticsItem {
  itemName?: string;
  quantity?: string;
  itemID?: string;
  shardID?: string;
}

export interface OfferData {
  AlternativeCostAmount?: number;
  AlternativeCostID?: string;
  StoreItemDescription?: string;
  HardCurrencyPackageID?: string;
  Global_Offer?: boolean;
  StockMax?: number;
  SubsPurchase?: any[];
  DiscountPercentage?: number;
  SkipEndScaling?: boolean;
  ServerScaling?: string;
  IsClicked?: boolean;
  EndDate?: string;
  GiftSubject?: string;
  Bonus3?: string;
  Gifts?: Gifts;
  Platform_Type?: string;
  PortalAvailability?: boolean;
  SubscriptionRequired?: string;
  gate?: string;
  CombinationType?: string;
  ShowInStore?: boolean;
  HighlightOfferCount?: number;
  Version?: string;
  StoreItemName?: string;
  StartDate?: string;
  IsNested?: boolean;
  EventCarousel_ID?: string;
  Magnet?: boolean;
  OfferWeight?: number;
  StoreItemTagline?: string;
  schedules?: Array<Array<boolean | string>>;
  OfferType?: string;
  OfferSectionID?: string;
  StockQuantity?: number;
  ShowStock?: boolean;
  OffersID: string;
  Bonus1?: string;
  Featured?: boolean;
  Bonus2?: string;
  Bonus5?: string;
  Bonus4?: string;
  Bonus7?: string;
  Bonus6?: string;
  Bonus9?: string;
  Bonus8?: string;
  StoreItemImage?: string;
  GiftMessage?: string;
  OfferDisplayID?: string;
  Availability?: string;
  OfferItemContent?: string[];
  OfferItemImage?: string[];
  OfferItemImageResize?: string[];

  analyticsItems?: AnalyticsItem[];
  OfferBackgroundImage?: string;
  OfferBackgroundImageResize?: string;
  OfferItemTexts?: any[];
  LayoutType?: string;
  Price?: Price;
  InitialPrice?: Price;
  defaultCurrency?: string;
  XsollaID?: string;
  StrikeThroughPrice?: number;
  BonusPercentage?: number;
  categoryId?: string;
  status?: number | string;
  Web_StepUp?: boolean;
  VipPoint?: number;
  badgeType?: 'multiple' | 'single';
  badgeIcon?: string;
  badgeText?: string;
  offerItems: {
    itemID: string;
    itemName?: string;
    quantity?: string;
    url?: string;
  }[];
}

export interface OfferSectionResponse {
  sectionId: string;
  sectionBackgroundColor: string;
  sectionHeaderColor: string;
  sectionSubTitle: string;
  sectionTexture?: string;
  sectionTitle: string;
  sectionTooltip: string;
  sectionWeight: number;
  sectionData: any;
  updatedAt: string;
  createdAt: string;
}

export interface SectionOfferResponse {
  offers: OfferData[];
  section: OfferSectionResponse;
}

export interface MobileOfferResponse {
  statusCode: number;
  error: number;
  message: string;
  data: {
    featured: SectionOfferResponse[];
    rubies: OfferData[];
    daily: OfferData[];
    cashPacks: OfferData[];
    rewards: OfferData[];
    special: OfferData[];
    webCoins: OfferData[];
  };
}

export interface DesktopOfferResponse {
  statusCode: number;
  error: number;
  message: string;
  data: {
    featured: OfferData[];
    rubies: OfferData[];
    daily: OfferData[];
    cashPacks: OfferData[];
    rewards: OfferData[];
    special: OfferData[];
    webCoins: OfferData[];
  };
}

export interface StockResponse {
  data: {
    OffersID: string;
    StockQuantity: number;
  }[];
}

export interface RedeemCouponResponse {
  data: {
    items: OfferData[];
    externalId: string;
  };
}

export interface CurrencyData {
  id: number;
  name: string;
  rate: number;
  isActive: boolean;
  typeId: number;
  globalType: number;
}
export interface CurrencyResponse {
  data: CurrencyData[];
}

export type SegmentedOffers = {
  [variation: string]: string;
} & {
  OfferAll?: string;
  OfferVarsFieldList?: string;
  NonLogin?: string;
};

export interface SegmentedOffersResponse {
  success: boolean;
  data: {
    offers: string[];
  };
}
