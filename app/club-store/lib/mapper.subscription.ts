import { SubscriptionTier } from "@wwe-portal/ui/features";
import { removeNullOrUndefinedElements } from "../helper/common/arrayHelper";
import {
  PlanResponseData,
  SubscriptionPlanBlueprint,
} from "../types/type.subscription";
import { EnhancedSubscriptionPlan } from "../types/type.subscription";

export const groupTierMap: Record<string, SubscriptionTier> = {
  iap_subscription_web_premium: SubscriptionTier.BRONZE,
  iap_subscription_web_prestige: SubscriptionTier.SILVER,
  iap_subscription_web_supervip: SubscriptionTier.GOLD,
};

const tierLabelMap: Record<SubscriptionTier, string> = {
  [SubscriptionTier.SILVER]: "Prestige",
  [SubscriptionTier.BRONZE]: "Premium",
  [SubscriptionTier.GOLD]: "Super VIP",
};

const tierPriorityMap: Record<SubscriptionTier, number> = {
  [SubscriptionTier.BRONZE]: 1,
  [SubscriptionTier.SILVER]: 2,
  [SubscriptionTier.GOLD]: 3,
};

export const parseGroupToTier = (
  external_id: PlanResponseData["external_id"]
) => {
  if (!external_id) return undefined;
  return groupTierMap[external_id];
};

export const parseSubscriptionPlan = (
  data: PlanResponseData,
  blueprint: Partial<SubscriptionPlanBlueprint> | undefined
) => {
  if (data.external_id == null) return undefined;
  const tier = parseGroupToTier(data.external_id);
  if (tier == null || blueprint == null) return undefined;
  const blueprintItem = blueprint[tier];
  if (blueprintItem == null) return undefined;
  const plan: EnhancedSubscriptionPlan = {
    xsollaPlanId: data.id,
    id: data.external_id,
    externalId: data.external_id,
    tier,
    benefits: blueprintItem.benefits,
    displayName: `${tierLabelMap[tier]} Pass`,
    shortName: tierLabelMap[tier],
    price: `${data.charge.amount} ${data.charge.currency}`,
    priority: tierPriorityMap[tier],
    rawPlan: data,
    title: blueprintItem.title,
    moreInfoItems: blueprintItem.moreInfoItems,
  };
  return plan;
};

export const parseSubscriptionPlanList = (
  rawPlans: PlanResponseData[] | undefined,
  blueprint: Partial<SubscriptionPlanBlueprint>
) => {
  return removeNullOrUndefinedElements(
    rawPlans?.map((rawPlan) => {
      return parseSubscriptionPlan(rawPlan, blueprint);
    }) ?? []
  );
};
