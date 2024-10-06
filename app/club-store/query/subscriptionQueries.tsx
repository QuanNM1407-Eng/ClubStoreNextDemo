import { useQuery, useQueryClient } from "@tanstack/react-query";
import { SubscriptionData } from "@wwe-portal/widget/subscription";
import { useMemo } from "react";
import {
  groupTierMap,
  parseSubscriptionPlanList,
} from "../lib/mapper.subscription";
import {
  CurrentSubscriptionPlan,
  SubscriptionPlanResponse,
  UserSubscriptionPlanResponse,
} from "../types/type.subscription";
import subscriptionData from "../lib/subscriptionData";
import {
  SubscriptionBenefitType,
  SubscriptionBenefits,
  UserSubscriptionPlan,
} from "../types/type.subscription";
import { MAX_REFETCH_INTERVAL } from "../constants/api.constant";
import {
  QUERY_KEY_SUBSCRIPTION,
  QUERY_KEY_SUBSCRIPTION_USER,
} from "../constants/key.constant";
import useIsAuthenticated from "../hooks/global/useIsAuthenticated";
import useGetCurrentUser from "../hooks/global/useGetCurrentUser";
import React from "react";
import { getSubscriptionPlans, getUserSubscriptionPlan } from "./api";

export const useGetSubscriptionDetails = (ids?: string[]) => {
  if (ids == null || ids.length === 0) return null;
  return subscriptionData;
};

export const useSubscriptionPlansQuery = () => {
  return useQuery([QUERY_KEY_SUBSCRIPTION], () => getSubscriptionPlans());
};

export const useUserSubscriptionQuery = () => {
  const isAuthenticated = useIsAuthenticated();

  const { currentUser } = useGetCurrentUser();
  const result = useQuery(
    [
      QUERY_KEY_SUBSCRIPTION_USER,
      { userId: currentUser?.userId, isAuthenticated },
    ],
    async () => {
      if (!isAuthenticated) return null;
      return getUserSubscriptionPlan();
    },
    {
      refetchInterval: (data) => {
        const now = Date.now();

        // Get min next_charge_date, query should refetch at next_charge_date
        const nextChargeDates = data?.data
          ?.filter(
            (item) =>
              item.date_next_charge &&
              new Date(item.date_next_charge).getTime() > now
          )
          .map((item) => new Date(item.date_next_charge!).getTime());

        if (nextChargeDates && nextChargeDates.length > 0) {
          const minDate = Math.min(...nextChargeDates);
          const interval = Math.min(minDate - now, MAX_REFETCH_INTERVAL);
          if (interval < 0) return false;
          return interval;
        }
        return false;
      },
    }
  );

  return {
    currentXsollaPlans: result.data?.data,
    isLoading: result.isInitialLoading,
  };
};

const getExpiredDate = (plan?: UserSubscriptionPlan) => {
  try {
    if (plan?.status !== "non_renewing") return undefined;
    if (plan.date_next_charge == null) return undefined;
    const formatter = new Intl.DateTimeFormat("en", {
      day: "numeric",
      month: "short",
    });
    return formatter.format(new Date(plan.date_next_charge));
  } catch (e) {
    // addDDError(e);
  }
};

export const useSubscriptionQuery = () => {
  const { data: planResponse, isLoading } = useSubscriptionPlansQuery();

  const rawPlans = planResponse?.data.filter(
    (plan) =>
      plan.external_id && Object.keys(groupTierMap).includes(plan.external_id)
  );

  const planDetails = useGetSubscriptionDetails(
    rawPlans?.map((plan) => plan.external_id) as string[]
  );

  const plans = useMemo(() => {
    if (rawPlans == null || planDetails == null) return undefined;

    return parseSubscriptionPlanList(rawPlans, planDetails);
  }, [rawPlans, planDetails]);

  const { currentXsollaPlans, isLoading: isLoadingCurrentPlan } =
    useUserSubscriptionQuery();
  const foundPlan = useMemo(
    () =>
      plans?.find((plan) =>
        currentXsollaPlans?.some(
          (userPlan) =>
            userPlan.external_id === plan.externalId &&
            userPlan.date_next_charge &&
            new Date(userPlan.date_next_charge).getTime() > Date.now()
        )
      ),
    [currentXsollaPlans, plans]
  );

  const subscriptionId = useMemo(
    () =>
      currentXsollaPlans?.find(
        (currentUserPlan) => currentUserPlan.external_id === foundPlan?.id
      )?.id,
    [currentXsollaPlans, foundPlan]
  );
  const currentPlan: CurrentSubscriptionPlan | undefined = useMemo(
    () =>
      foundPlan && subscriptionId != null
        ? {
            ...foundPlan,
            subscriptionId,
            expiredIn: getExpiredDate(
              currentXsollaPlans?.find(
                (item) => item.external_id === subscriptionId
              )
            ),
          }
        : undefined,
    [currentXsollaPlans, foundPlan, subscriptionId]
  );

  const clubStoreAccessRequiredTier = plans?.find((plan) =>
    plan.rawPlan.benefits?.some(
      (benefit) => benefit.name === SubscriptionBenefits.clubStoreAccess
    )
  )?.tier;
  const fuseupRequiredTier = clubStoreAccessRequiredTier;
  const recruitRequiredTier = clubStoreAccessRequiredTier;

  const abilities = useMemo(
    () =>
      Object.values(SubscriptionBenefits).reduce(
        (result: Record<SubscriptionBenefitType, boolean>, benefitName) => ({
          ...result,
          [benefitName]: Boolean(
            currentPlan?.rawPlan.benefits?.some(
              (benefit) => benefit.name === SubscriptionBenefits[benefitName]
            )
          ),
        }),
        {
          freePull: false,
          pullPity: false,
          mission: false,
          clubStoreAccess: false,
        }
      ) as Record<SubscriptionBenefitType, boolean>,
    [currentPlan]
  );

  return {
    isLoading: isLoading || isLoadingCurrentPlan,
    plans,
    currentPlan,
    mockFaq,
    abilities,
    fuseupRequiredTier,
    recruitRequiredTier,
  };
};

export const useInvalidateUserSubscription = () => {
  const queryClient = useQueryClient();
  return () => queryClient.invalidateQueries([QUERY_KEY_SUBSCRIPTION_USER]);
};

export const mockSubscription: SubscriptionData = {
  plans: undefined,
  subscriptionTitle: "Join the Universal Champions Club",
  subscriptionDescription: (
    <>
      Experience unmatched rewards and benefits
      <br />
      as a member of the Universal Champions Club
    </>
  ),
};

export const useIsSubscriber = () => {
  const { currentXsollaPlans } = useUserSubscriptionQuery();
  return currentXsollaPlans && currentXsollaPlans.length > 0;
};

export const FAQ_KEYS = {
  HOW_TO_EARN_CLUB_COINS: "how-to-earn-club-coins",
};

export const mockFaq = {
  limit: 5,
  faqList: [
    {
      id: "1",
      question: <>How do I become a Universal Champions Club Member?</>,
      answer: (
        <>
          {`If you are new, create an account to sign in first. Existing users can access the membership page by selecting the 'membership' tab in the nav bar. If you have trouble, look for the "Join Club" button at the top of the page. After a successful transaction, relaunch your app to start enjoying all the benefits of being a member of the Universal Champions Club!`}
        </>
      ),
    },
    {
      id: FAQ_KEYS.HOW_TO_EARN_CLUB_COINS,
      question: <>What are Club Coins and how are they earned?</>,
      answer: (
        <>
          {`Club Coins can be used to redeem any items from the Club Store. As a Prestige Pass member, you can earn additional Club Coins by completing missions and claiming rewards via the Club Store, as well as through the member loyalty credit system.`}
        </>
      ),
    },
    {
      id: "3",
      question: (
        <>What is the loyalty program and how does the credit system work?</>
      ),
      answer: (
        <>
          {`You'll be rewarded with Club Coins and Mission XPs for every coin used to open Premium Loot contents. These activities allow Prestige Pass members to accumulate Club Coins, which can be used to redeem items of your choice within the Club Store.`}
        </>
      ),
    },
    {
      id: "4",
      question: <>What are IN-GAME Premium Loot contents?</>,
      answer: (
        <>
          {`Premium Loot contents are select loot pulls identified as "Paid Loots." These specific loots require premium loot coins, which can be purchased from either the special offers page or the in-app store. As a Prestige Pass member, any loot coins used to open these Premium Loot contents will credit you with Club Coins and Milestone XPs. Look for the "Universal Champions Club Logo" label in the IN-GAME Loot screen to identify these applicable loot contents!`}
        </>
      ),
    },
    {
      id: "5",
      question: <>{`What is Club Store and what's so special about it?`}</>,
      answer: (
        <>
          {`The Club Store offers an exclusive experience for Prestige Pass members. You can use the Real-Time Fuse Up feature to upgrade your superstars in real-time based on your live in-game roster data, and the Superstar Acquisition feature to select and redeem new superstar posters of your choice. These unique benefits make the Club Store an invaluable resource for enhancing your overall in-game experience!`}
        </>
      ),
    },
    {
      id: "6",
      question: <>How do I get the items redeemed from the Club store?</>,
      answer: (
        <>{`After redeeming an item, it will be in your IN-GAME Inbox. Click the rewards tab to claim Superstar posters and other items.`}</>
      ),
    },
    {
      id: "7",
      question: <>How do I manage my subscription?</>,
      answer: (
        <>{`Once subscribed, the active pass will display a 'manage' button instead of 'sign-up'. If you have trouble, click the "Prestige" or "Premium" button on the header, or click your avatar to open the profile nav bar and select the 'membership' button.`}</>
      ),
    },
    {
      id: "8",
      question: <>What if I cancel my subscription?</>,
      answer: (
        <>
          {`Your subscription will stay active until the end of the current billing period without any extra charges. Please note that if you unsubscribe, access to the Club Store will be locked, and your Club Coins will be frozen. You can re-subscribe anytime and pick up right where you left off!`}
        </>
      ),
    },
    {
      id: "9",
      question: <>How does upgrading a subscription work?</>,
      answer: (
        <>
          {`If you are currently subscribed to the Premium Pass, click the sign-up button to upgrade to a Prestige Pass. Its benefits will become effective instantly. You’ll be charged the prorated difference, and a new billing cycle will start.`}
        </>
      ),
    },
    {
      id: "10",
      question: <>How do I contact support for subscription issues?</>,
      answer: (
        <span>
          Contact our support team by submitting a ticket in-app or on our{" "}
          <a
            href="https://scopely.helpshift.com/hc/en/17-wwe-champions/"
            target="_blank"
            rel="noreferrer"
          >
            website
          </a>
          {""}.
        </span>
      ),
    },
  ],
};
