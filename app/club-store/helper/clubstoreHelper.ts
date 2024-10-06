import { RosterLevelType } from "@wwe-portal/ui/features/roster";
import { useResponsive } from "../hooks/common";
import { useMemo } from "react";
import { useRouter } from "next/navigation";

import { FAQ_KEYS } from "../query/subscriptionQueries";
import { rosterPriceSheet } from "../constants/club-store.constants";

const getCurrentPrice = ({
  level,
  star,
  hollowStar,
}: Partial<{
  level: RosterLevelType;
  star: number;
  hollowStar: number;
}>) => {
  if (level == null || star == null || hollowStar == null) return undefined;
  const key = `${star + hollowStar}S${level}`;
  return rosterPriceSheet[key];
};

export const calculateFusingCost = ({
  currentLevel,
  nextLevel,
  currentStar,
  nextStar,
  hollowStar,
}: Partial<{
  currentLevel: RosterLevelType;
  nextLevel: RosterLevelType;
  currentStar: number;
  nextStar: number;
  hollowStar: number;
}>) => {
  if (
    currentLevel == null ||
    nextLevel == null ||
    currentStar == null ||
    nextStar == null
  )
    return 0;
  if (currentLevel === nextLevel && currentStar === nextStar) return 0;
  const currentValue = getCurrentPrice({
    level: currentLevel,
    star: currentStar,
    hollowStar,
  });
  const nextValue = getCurrentPrice({
    level: nextLevel,
    star: nextStar,
    hollowStar: 0,
  });

  if (currentValue == null || nextValue == null) return 0;
  return nextValue - currentValue;
};

export const useRosterListSize = () => {
  const { isTablet, isDesktop, isUltra } = useResponsive();
  const pageSize = useMemo(() => {
    if (isUltra) return 10;
    if (isDesktop || isTablet) return 6;
    return 4;
  }, [isTablet, isDesktop, isUltra]);
  return pageSize;
};

export const useSubscriptionHistory = () => {
  const route = useRouter();
  const goAddClubCoin = () => {
    route.push(`/subscription?faq-item=${FAQ_KEYS.HOW_TO_EARN_CLUB_COINS}`);
  };
  const goToSubscription = () => route.push("/subscription");
  return {
    goAddClubCoin,
    goToSubscription,
  };
};
