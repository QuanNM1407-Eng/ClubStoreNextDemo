import {
  ClaimAllStatusResponse,
  ExclusiveItemResponse,
  MissionItemResponse,
  MissionStatusResponse,
  RosterItemResponse,
  SubscriptionPlanResponse,
  UpdateRosterResponse,
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

export const getClaimAllStatus = async (): Promise<ClaimAllStatusResponse> => {
  const response = await fetch(
    "https://dev-api.wwechampions.com/club/missions/all/claim/status",
    { credentials: "include" }
  );
  return await response.json();
};

export const getExclusiveItems = async (): Promise<ExclusiveItemResponse[]> => {
  const response = await fetch(
    "https://dev-api.wwechampions.com/club/offers/all",
    { credentials: "include" }
  );
  return await response.json();
};

export const getLockedRosters = async (): Promise<RosterItemResponse[]> => {
  const response = await fetch(
    "https://dev-api.wwechampions.com/club/roster/all/locked",
    { credentials: "include" }
  );
  return await response.json();
};

export const getMissionItems = async (): Promise<MissionItemResponse[]> => {
  const response = await fetch(
    "https://dev-api.wwechampions.com/club/missions/all",
    { credentials: "include" }
  );
  return await response.json();
};

export const getMissionStatuses = async (): Promise<
  MissionStatusResponse[]
> => {
  const response = await fetch(
    "https://dev-api.wwechampions.com/club/missions/all/status",
    { credentials: "include" }
  );
  return await response.json();
};

export const getRosterItems = async (): Promise<RosterItemResponse[]> => {
  const response = await fetch(
    "https://dev-api.wwechampions.com/club/roster/all",
    { credentials: "include" }
  );
  return await response.json();
};

// export const updateRoster = async (data: UpgradeRosterRequest) => {
//   return await nestApiClient.post<{ data: UpdateRosterResponse }>(
//     `/club/roster/upgrade`,
//     data
//   );
// };

export const updateRoster = async (): Promise<UpdateRosterResponse[]> => {
  const response = await fetch(
    "https://dev-api.wwechampions.com/club/roster/upgrade",
    { credentials: "include" }
  );
  return await response.json();
};

// export const recruitRoster = async (data: RecruitRosterRequest) => {
//   return await nestApiClient.post<{ data: UpdateRosterResponse }>(
//     `/club/roster/recruit`,
//     data
//   );
// };

export const recruitRoster = async (): Promise<UpdateRosterResponse[]> => {
  const response = await fetch(
    "https://dev-api.wwechampions.com/club/roster/recruit",
    { credentials: "include" }
  );
  return await response.json();
};

export const claimAllMissions = async (): Promise<RosterItemResponse[]> => {
  const response = await fetch(
    "https://dev-api.wwechampions.com/club/missions/all/claim",
    { credentials: "include" }
  );
  return await response.json();
};
