import { useQuery, useQueryClient } from "@tanstack/react-query";
import {
  getClaimAllStatus,
  getExclusiveItems,
  getLockedRosters,
  getMissionItems,
  getMissionStatuses,
  getRosterItems,
} from "./api";

import {
  MissionItemResponse,
  MissionStatusResponse,
} from "../types/type.subscription";

import { MilestonePeriodData } from "@wwe-portal/ui/features/club-store/milestone/milestone-period";

import {
  QUERY_KEY_ROSTER,
  QUERY_KEY_EXCLUSIVE_ITEMS,
  QUERY_KEY_MISSION_ITEMS,
  QUERY_KEY_MISSION_CLAIM_STATUS,
  QUERY_KEY_MISSION_PROGRESS_STATUS,
} from "../constants/key.constant";
import useIsAuthenticated from "../hooks/global/useIsAuthenticated";
import useGetCurrentUser from "../hooks/global/useGetCurrentUser";

export const mapMissionTypeToLabel = {
  1: "Daily",
  2: "Weekly",
  3: "Monthly",
  4: "Yearly",
};

export const reset_interval = 10000;
const parseMissionItemToProps = (rawItem: MissionItemResponse) => {
  const props: Omit<MilestonePeriodData, "isClaimed" | "updatedAt"> = {
    id: rawItem.subEventId.toString(),
    milestoneId: rawItem.mission.milestoneId,
    periodType: rawItem.type,
    endTime: rawItem.endDate,
    currentPoint: 0,
    endPoint: rawItem.mission?.requirement,
    title: rawItem?.type ? mapMissionTypeToLabel[rawItem.type] : rawItem.name,
    imgUrl: rawItem.mission?.reward?.imageUrl,
    currencyType: rawItem.mission?.reward?.itemId,
    description: rawItem.description,
    quantity: rawItem.mission?.reward?.quantity,
  };
  return props;
};

export const useExclusiveItems = () => {
  const { data, ...rest } = useQuery(
    [QUERY_KEY_EXCLUSIVE_ITEMS],
    getExclusiveItems
  );

  return {
    data,
    ...rest,
  };
};

export const useInvalidateExclusiveItems = () => {
  const queryClient = useQueryClient();
  return () => queryClient.invalidateQueries([QUERY_KEY_EXCLUSIVE_ITEMS]);
};

export const useMissionItems = () => {
  const { data: missionItemResponse } = useQuery(
    [QUERY_KEY_MISSION_ITEMS],
    getMissionItems
  );
  if (!missionItemResponse?.data) return { data: [] };

  const data = missionItemResponse?.data
    .sort((a, b) => a.type - b.type)
    .map(parseMissionItemToProps);
  return { data, missionItemResponse };
};

export const useClaimAllStatus = () => {
  const { isAuthenticated } = useIsAuthenticated();
  const { currentUser } = useGetCurrentUser();
  const { data: missionItemResponse } = useQuery(
    [QUERY_KEY_MISSION_CLAIM_STATUS, { currentUser, isAuthenticated }],
    getClaimAllStatus,
    {
      enabled: isAuthenticated,
    }
  );
  const data = missionItemResponse?.data;

  return { data };
};

export const useInvalidateClaimAllStatus = () => {
  const queryClient = useQueryClient();
  return () => queryClient.invalidateQueries([QUERY_KEY_MISSION_CLAIM_STATUS]);
};

export const useMissionStatus = () => {
  const isAuthenticated = useIsAuthenticated();
  const currentUser = useGetCurrentUser();
  const { data: missionStatusesResponse } = useQuery(
    [QUERY_KEY_MISSION_PROGRESS_STATUS, { currentUser, isAuthenticated }],
    async () => {
      if (!isAuthenticated) return null;
      return await getMissionStatuses();
    },
    {
      refetchInterval: reset_interval,
    }
  );

  const data: Record<string, MissionStatusResponse> | undefined =
    missionStatusesResponse?.data?.reduce(
      (list, status: MissionStatusResponse) => ({
        ...list,
        [status.milestoneId]: status,
      }),
      {}
    );

  return { data };
};

export const useRosterItems = () => {
  const { isAuthenticated } = useIsAuthenticated();
  const { currentUser } = useGetCurrentUser();
  const { data, isInitialLoading, isFetching } = useQuery(
    [QUERY_KEY_ROSTER, "unlocked", { isAuthenticated, currentUser }],
    async () => {
      if (!isAuthenticated) return null;
      return getRosterItems();
    },
    {
      refetchOnWindowFocus: false,
    }
  );
  const total = data?.data.data.length;
  return { data, total, isInitialLoading, isFetching };
};

export const useLockedRosters = () => {
  const { isAuthenticated } = useIsAuthenticated();
  const { currentUser } = useGetCurrentUser();
  const { data, isInitialLoading, isFetching } = useQuery(
    [QUERY_KEY_ROSTER, "locked", { isAuthenticated, currentUser }],
    async () => {
      if (!isAuthenticated) return null;
      return getLockedRosters();
    },
    {
      refetchOnWindowFocus: false,
    }
  );
  const total = data?.data.data.length;
  return { data, total, isInitialLoading, isFetching };
};

export const useInvalidateRosterItems = () => {
  const queryClient = useQueryClient();
  return () => queryClient.invalidateQueries([QUERY_KEY_ROSTER]);
};
