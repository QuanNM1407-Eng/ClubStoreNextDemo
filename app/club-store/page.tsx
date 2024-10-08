"use client";
import {
  ChangePlanDialog,
  ClubCoinAmount,
  ClubStoreNavigation,
  HelloWorldCard,
} from "@wwe-portal/ui/features";
// import { FeatureFlag, useEnabledFlag } from "views/components/FeatureFlag";

import { useNavigationBar } from "./useNavigationBar";
import { ClubStoreLayout } from "@wwe-portal/widget/club-store";
import { MissionSection } from "./MissionSection";
import { FuseUpSection } from "./FuseupSection";
// import { useSubscriptionHistory } from "./lib/helper";
// import { RecruitmentSection } from "./RecruitmentSection";
// import { ExclusiveItemSection } from "./ExclusiveItemSection";
// import { useGetClubCoins } from "store/global/useCurrency";
// import { useSubscriptionQuery } from "../Subscription/lib/query";
// import { useSubscriptionMutation } from "../Subscription/lib/mutation";
import {
  Dialog,
  PageContent,
  PortableDialogProvider,
} from "@wwe-portal/ui/components";
// import { globalSel } from "store/global";
// import { useSelector } from "react-redux";
import { ExclusiveItemSectionRevamp } from "./ExclusiveItemSectionRevamp";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import useIsAuthenticated from "./hooks/global/useIsAuthenticated";
import React from "react";
import { useSubscriptionHistory } from "./helper/clubstoreHelper";
import { useGetClubCoins } from "./lib/useCurrency";
import { useSubscriptionQuery } from "./query/subscriptionQueries";
import { RecruitmentSection } from "./RecruitmentSection";

export default function Page() {
  const { currentPlan, abilities } = useSubscriptionQuery();
  // const { mutation, upgradeDialogState } = useSubscriptionMutation({
  //   currentPlan,
  // });
  const mutation = {} as never;
  const { amount: currentUserClubCoin } = useGetClubCoins();

  const { goAddClubCoin, goToSubscription } = useSubscriptionHistory();
  const { refs, stickyElmRef, ...navigation } = useNavigationBar();
  // const { t } = useTranslation();
  const missionEnabled = true;
  // const missionEnabled = useEnabledFlag("clubStore.missions");
  // const fuseUpEnabled = useEnabledFlag("clubStore.fuseUp");
  // const recruitmentEnabled = useEnabledFlag("clubStore.recruitment");
  // const itemEnabled = useEnabledFlag("clubStore.offers");
  const fuseUpEnabled = true;
  const recruitmentEnabled = true;
  const itemEnabled = true;
  const { isAuthenticated } = useIsAuthenticated();

  const getDescription = () => {
    if (!isAuthenticated || currentPlan == null) {
      return "subscription.introduction";
    }
    if (!abilities?.clubStoreAccess) {
      return "subscription.lower.introduction";
    }

    return "subscription.highest.introduction";
  };
  const getButtonContent = () => {
    if (!isAuthenticated || currentPlan == null) {
      return "SUBSCRIBE NOW";
    }
    if (!abilities?.clubStoreAccess) {
      return "UPGRADE NOW";
    }

    return undefined;
  };

  return (
    <PortableDialogProvider>
      <PageContent>
        <ClubStoreLayout
          pageTitle="Club Store"
          content={
            <>
              <HelloWorldCard
                onClick={goToSubscription}
                description={getDescription()}
                buttonContent={getButtonContent()}
              />
              {missionEnabled && (
                <div ref={refs.mission}>
                  <MissionSection />
                </div>
              )}
              {fuseUpEnabled && (
                <div ref={refs.fuseUp}>
                  <FuseUpSection subscribeMutation={mutation} />
                </div>
              )}
              {recruitmentEnabled && (
                <div ref={refs.recruitment}>
                  <RecruitmentSection subscribeMutation={mutation} />
                </div>
              )}
              {itemEnabled && (
                <div ref={refs.items}>
                  <ExclusiveItemSectionRevamp />
                </div>
              )}
            </>
          }
          clubCoin={
            currentUserClubCoin != null && (
              <div>
                <ClubCoinAmount
                  clubCoin={currentUserClubCoin}
                  // onClickAdd={goAddClubCoin}
                  onClickAdd={() => {}}
                />
              </div>
            )
          }
          navigation={
            <div>navigation</div>
            // <ClubStoreNavigation ref={stickyElmRef} {...navigation} />
          }
        />

        {/* {upgradeDialogState ? (
        <Dialog
          onOpenChange={(value) => {
            if (!value) {
              upgradeDialogState.onClose();
            }
          }}
          open
        >
          <ChangePlanDialog
            buttonContent={upgradeDialogState.buttonContent}
            description={upgradeDialogState.description}
            isUpgrading={mutation.isLoading}
            onChange={upgradeDialogState.onChange}
            onClose={upgradeDialogState.onClose}
          />
        </Dialog>
      ) : null} */}
      </PageContent>
    </PortableDialogProvider>
  );
}
