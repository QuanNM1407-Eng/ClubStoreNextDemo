import {
  SubscriptionPlanResponse,
  UserSubscriptionPlanResponse,
} from "../types/type.subscription";

export const getSubscriptionPlans =
  async (): Promise<SubscriptionPlanResponse> => {
    const response = await fetch(
      "https://dev-payment-api.wwechampions.com/subscription/plans"
    );
    return await response.json();
  };

export const getUserSubscriptionPlan =
  async (): Promise<UserSubscriptionPlanResponse> => {
    const response = await fetch(
      "https://dev-payment-api.wwechampions.com/subscription/user/plans",
      { method: "POST", credentials: "include" }
    );
    return await response.json();
  };

export const getClaimAllStatus =
  async (): Promise<UserSubscriptionPlanResponse> => {
    const response = await fetch(
      "https://dev-api.wwechampions.com/club/missions/all/claim/status",
      { credentials: "include" }
    );
    return await response.json();
  };

export const getExclusiveItems =
  async (): Promise<UserSubscriptionPlanResponse> => {
    const response = await fetch(
      "https://dev-api.wwechampions.com/club/offers/all"
    );
    return await response.json();
  };

export const getLockedRosters =
  async (): Promise<UserSubscriptionPlanResponse> => {
    const response = await fetch(
      "https://dev-api.wwechampions.com/club/roster/all/locked"
    );
    return await response.json();
  };

export const getMissionItems =
  async (): Promise<UserSubscriptionPlanResponse> => {
    const response = await fetch(
      "https://dev-api.wwechampions.com/club/missions/all"
    );
    return await response.json();
  };

export const getMissionStatuses =
  async (): Promise<UserSubscriptionPlanResponse> => {
    const response = await fetch(
      "https://dev-api.wwechampions.com/club/missions/all/status",
      { credentials: "include" }
    );
    return await response.json();
  };

export const getRosterItems =
  async (): Promise<UserSubscriptionPlanResponse> => {
    const response = await fetch(
      "https://dev-api.wwechampions.com/club/roster/all"
    );
    return await response.json();
  };
