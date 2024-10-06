import { SubscriptionTier } from "@wwe-portal/ui/features";
import { BaseSubscriptionPlan } from "@wwe-portal/ui/features";
import { OfferData } from "@wwe-portal/data/offers";
import {
  PlayerRoster,
  RosterLevelType,
  TierLevelEnum,
} from "@wwe-portal/ui/features/roster";

import { PlanBenefit } from "@wwe-portal/ui/features";

export interface PlanResponseData {
  id: number;
  external_id: string;
  name: {
    en: string;
  };
  description: {
    en: string;
  };
  localized_name: string;
  charge: {
    period: {
      value: number;
      type: string;
    };
    amount: number;
    currency: string;
  };
  status: {
    value: string;
  };
  benefits?: {
    name: SubscriptionBenefitType;
  }[];
}

export const SubscriptionBenefits = {
  freePull: "freePull",
  pullPity: "pullPity",
  mission: "mission",
  clubStoreAccess: "clubStoreAccess",
} as const;

export type SubscriptionBenefitType =
  (typeof SubscriptionBenefits)[keyof typeof SubscriptionBenefits];

export interface UserSubscriptionPlan {
  external_id: string;
  id: string;
  date_next_charge?: string;
  status: "active" | "non_renewing" | "canceled";
  benefits?: {
    name: SubscriptionBenefitType;
  }[];
}

export interface SubscriptionPlanResponse {
  data: PlanResponseData[];
}

export interface UserSubscriptionPlanResponse {
  data: UserSubscriptionPlan[];
}

export interface CheckoutResponse {
  data: { token: string };
}
export type SubscriptionPlanBlueprint = Record<
  SubscriptionTier,
  {
    benefits: PlanBenefit[];
    title: string;
    moreInfoItems: PlanBenefit[];
  }
>;

export interface SubscriptionPlanBlutprintResponse {
  data: SubscriptionPlanBlueprint;
}

export interface SubscriptionInterstitial {
  intersSubId: number;
  name: string;
  launchTimes: number;
  interval: number;
  description: string;
  updatedAt: string;
  createdAt: string;
  status: number;
}

export interface SubscriptionInterstitialResponse {
  data: SubscriptionInterstitial[];
}

export interface UserSubscriptionStat {
  view: number;
  lastViewAt?: string;
}

export interface UserSubscriptionStatResponse {
  data: UserSubscriptionStat;
}

export enum CurrencyType {
  Pickem = "Pickem",
  WebCoin = "Web Coin",
  ClubCoin = "Club Coin",
  Ruby = "Ruby",
}

const tierRank = Object.values(SubscriptionTier);
export const isBetterTier = (
  planA: { tier: SubscriptionTier | undefined },
  planB: { tier: SubscriptionTier }
) => {
  const planAIndex = tierRank.findIndex((tier) => tier === planA.tier);
  const planBIndex = tierRank.findIndex((tier) => tier === planB.tier);
  return planAIndex > planBIndex;
};

export const isBetterOrEqualTier = (
  planA: { tier: SubscriptionTier },
  planB: { tier: SubscriptionTier }
) => {
  return planA.tier === planB.tier || isBetterTier(planA, planB);
};

export interface EnhancedSubscriptionPlan extends BaseSubscriptionPlan {
  xsollaPlanId: number;
  priority: number;
  externalId: string;
  rawPlan: PlanResponseData;
  shortName: string;
}

export interface CurrentSubscriptionPlan extends EnhancedSubscriptionPlan {
  subscriptionId: string;
}

export interface ExclusiveItemResponse {
  offerData: OfferData;
  offerId: string;
  subCategoryType: number;
}

interface PoolProps {
  itemId: string;
  quantity: number;
  displayName: string;
  imageUrl: string;
}

export enum RewardTypes {
  WebCurrency = "Web Currency",
  InGameItem = "In Game Item",
}
export interface MissionItemResponse {
  subEventId: number;
  name: string;
  description: string;
  type: number;
  status: number;
  startDate: string;
  endDate: string;
  resetTimes: number;
  mission: {
    milestoneId: string;
    name: string;
    requirement: number;
    reward: {
      milestoneId: string;
      displayName: string;
      itemId: CurrencyType;
      quantity: number;
      imageUrl: string;
      pools: PoolProps[];
      rewardType: RewardTypes;
    };
  };
}

export interface MissionStatusResponse {
  id: number;
  userId: string;
  milestoneId: string;
  count: number;
  updatedAt: string;
}

export interface RosterItemResponse {
  level: string;
  levelId: number;
  stars: number;
  rosterId: number;
  roster: string;
  ID: string;
  class: string | null;
  era: string | null;
  stable: string[] | string | null;
  superstarId: number;
  image: string;
  imagePNG: string;
  tier: TierLevelEnum;
  name: string;
  nickname: string;
  hollowStars: number;
  talent: number;
  title: string;
  solidStars: number;
  e3?: string;
}

export interface ClaimAllStatusResponse {
  subEventId: number;
  milestoneId: string;
  count: number;
}

export interface UpdateRosterParams {
  rosterId: number;
  level: RosterLevelType | undefined;
  stars: number | undefined;
  amount: number | undefined;
}

export interface UpgradeRosterRequest {
  rosterId: number;
  level: RosterLevelType;
  stars: number;
  amount: number;
}

export interface UpdateRosterResponse {
  message: string;
  success: boolean;
}

export interface RecruitRosterRequest {
  rosterId: number;
}

export type FilterablePlayerRoster = PlayerRoster &
  Pick<RosterItemResponse, "class" | "era" | "stable" | "e3">;
