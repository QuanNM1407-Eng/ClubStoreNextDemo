import {
  ClubCurrencySimpleIcon,
  createPortableDialog,
  removeDialog,
  showDialog,
  showDialogById,
  usePortableDialog,
} from "@wwe-portal/ui/components";
import {
  PlayerRoster,
  RosterFuseUpDialog,
  RosterLevelType,
} from "@wwe-portal/ui/features/roster";
import { FC, useMemo, useState } from "react";

import { useSubscriptionQuery } from "../query/subscriptionQueries";
import {
  calculateFusingCost,
  useSubscriptionHistory,
} from "../helper/clubstoreHelper";
import { useMutateFuseUp } from "../query/clubStoreMutations";
import { NotEnoughClubCoinDialog } from "./NotEnoughClubCoinDialog";
import { useGetClubCoins } from "../lib/useCurrency";
import { useTranslation } from "react-i18next";
import { UserSubscriptionMutationState } from "@wwe-portal/widget/subscription";

type FuseupDialogProps = {
  currentRoster: PlayerRoster;
  hideRosterFilter?: () => void;
  subsribeMutation: UserSubscriptionMutationState;
  onClose: () => void;
};

const ButtonContent: FC<{
  isSubscribed: boolean;
  canFuseup: boolean;
  fuseupPrice: number;
}> = ({ isSubscribed, canFuseup, fuseupPrice }) => {
  const { t } = useTranslation();
  if (canFuseup && fuseupPrice > 0)
    return (
      <>
        <ClubCurrencySimpleIcon size="large" className="wwe-text-white" />
        <span>{fuseupPrice}</span>
      </>
    );

  if (canFuseup && fuseupPrice <= 0) {
    return <>{t("subscription.fuseUp.upgrade")}</>;
  }

  if (isSubscribed)
    return <>{t("subscription.select.higher.tier.to.fuseup")}</>;
  return <>{t("subscription.subscribe.to.fuseup")}</>;
};

export const FuseupDialog = createPortableDialog(
  ({
    currentRoster,
    hideRosterFilter,
    subsribeMutation,
    onClose,
  }: FuseupDialogProps) => {
    const { currentPlan, abilities } = useSubscriptionQuery();
    const { amount: clubCoin } = useGetClubCoins();
    const { goAddClubCoin, goToSubscription } = useSubscriptionHistory();
    const modal = usePortableDialog();
    const [selectedStar, setSelectedStar] = useState<number | undefined>(
      currentRoster.star
    );
    const [selectedLevel, setSelectedLevel] = useState<
      RosterLevelType | undefined
    >(currentRoster.level);

    const removeModal = () => {
      modal.remove();
      onClose();
    };

    const resetSelection = () => {
      setSelectedLevel(currentRoster.level);
      setSelectedStar(currentRoster.star);
    };

    const handleSelectStar = (nextStar: number) => {
      if (!abilities.clubStoreAccess) return;
      const nextFusingCost = calculateFusingCost({
        currentLevel: currentRoster.level,
        currentStar: currentRoster.star,
        nextLevel: selectedLevel ?? currentRoster.level,
        nextStar,
        hollowStar: currentRoster.hollowStar,
      });

      if (nextFusingCost <= 0) {
        resetSelection();
        return;
      }
      setSelectedStar(nextStar);
    };

    const handleSelectLevel = (nextTier: RosterLevelType) => {
      if (!abilities.clubStoreAccess) return;
      if (currentRoster == null) return;
      if (
        currentRoster.level == null ||
        currentRoster.star == null ||
        currentPlan == null ||
        nextTier === selectedLevel ||
        selectedStar == null
      ) {
        return;
      }

      setSelectedLevel(nextTier);

      if (selectedStar > currentRoster.star + currentRoster.hollowStar) {
        return;
      }

      setSelectedStar(currentRoster.star + currentRoster.hollowStar);
    };

    const fuseUpPrice = useMemo(() => {
      return calculateFusingCost({
        currentLevel: currentRoster?.level,
        currentStar: currentRoster?.star,
        hollowStar: currentRoster?.hollowStar,
        nextLevel: selectedLevel ?? currentRoster?.level,
        nextStar: selectedStar ?? currentRoster?.star,
      });
    }, [selectedLevel, selectedStar, currentRoster]);

    const clearAll = () => {
      reset();
      setSelectedStar(undefined);
      setSelectedLevel(undefined);
    };

    const {
      mutate,
      isLoading: isFusingUp,
      reset,
    } = useMutateFuseUp({
      onSuccess: () => {
        removeModal();
      },
      onError: () => {
        reset();
      },
      onCloseSuccessDialog: () => {
        clearAll();
      },
    });

    const handleClickUpgrade = () => {
      if (!currentRoster) return;
      if (isFusingUp || subsribeMutation.isLoading) return;

      if (!abilities.clubStoreAccess) {
        removeModal();
        hideRosterFilter?.();
        goToSubscription();
        return;
      }
      if (selectedLevel == null || selectedStar == null) {
        throw new Error("invalid data");
      }
      if (fuseUpPrice > (clubCoin ?? 0)) {
        showDialog(NotEnoughClubCoinDialog);
        return;
      }

      mutate({
        stars: selectedStar,
        level: selectedLevel,
        rosterId: currentRoster.rosterId,
        amount: fuseUpPrice,
      });
    };

    return (
      <RosterFuseUpDialog
        open={modal.visible}
        contentProps={{
          selectedLevel,
          selectedStar,
          roster: currentRoster,
          onSelectLevel: handleSelectLevel,
          onSelectStar: handleSelectStar,
          clubCoinProps: {
            clubCoin,
            onClickAdd: () => {
              removeModal();
              hideRosterFilter?.();
              goAddClubCoin();
            },
          },
          fuseUpPrice,
          buttonProps: {
            onClick: handleClickUpgrade,
            disabled:
              abilities.clubStoreAccess &&
              (isFusingUp || subsribeMutation.isLoading || fuseUpPrice <= 0),
            loading: isFusingUp || subsribeMutation.isLoading,
            children: (
              <div className="wwe-flex wwe-items-center wwe-gap-1 wwe-text-base">
                <ButtonContent
                  isSubscribed={currentPlan != null}
                  canFuseup={abilities.clubStoreAccess}
                  fuseupPrice={fuseUpPrice}
                />
              </div>
            ),
          },
          isUpgradeMode: true,
        }}
        onClose={() => {
          if (isFusingUp || subsribeMutation.isLoading) {
            return;
          }
          removeModal();
        }}
      />
    );
  }
);

const ID = "FuseupDialog";
export const useFuseupDialog = ({
  currentRoster,
  ...props
}: Omit<FuseupDialogProps, "currentRoster"> & {
  currentRoster: PlayerRoster | undefined;
}) => {
  return {
    show: () => showDialogById(ID),
    remove: () => {
      removeDialog(ID);
      props.onClose();
    },
    dialog: currentRoster ? (
      <FuseupDialog id={ID} currentRoster={currentRoster} {...props} />
    ) : null,
  };
};
