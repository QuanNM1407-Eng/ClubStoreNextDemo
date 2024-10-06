import { OfferData } from "@wwe-portal/data/offers";
import { CurrencyType } from "@wwe-portal/ui/features/club-store/type";
import {
  PlayerRoster,
  RosterLevelType,
  TierLevelEnum,
} from "@wwe-portal/ui/features/roster";

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
