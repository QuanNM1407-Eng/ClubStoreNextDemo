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
  RosterRecruitmentDialog,
} from "@wwe-portal/ui/features/roster";

import { useSubscriptionQuery } from "../query/subscriptionQueries";
import { useSubscriptionHistory } from "../helper/clubstoreHelper";
import { useMutateRecruit } from "../query/clubStoreMutations";
import { NotEnoughClubCoinDialog } from "./NotEnoughClubCoinDialog";
import { useGetClubCoins } from "../lib/useCurrency";
import { useTranslation } from "react-i18next";
import { FC } from "react";
import { UserSubscriptionMutationState } from "@wwe-portal/widget/subscription";

interface RecruitmentDialogProps {
  roster?: PlayerRoster;
  recruitPrice?: number;
  hideRosterFilter: () => void;
  subsribeMutation: UserSubscriptionMutationState;
  onClose: () => void;
}

const ButtonContent: FC<{
  isSubscribed: boolean;
  canRecruit: boolean;
  recruitPrice: number;
}> = ({ isSubscribed, canRecruit, recruitPrice }) => {
  const { t } = useTranslation();
  if (canRecruit)
    return (
      <>
        <ClubCurrencySimpleIcon size="large" className="wwe-text-white" />
        <span>{recruitPrice}</span>
      </>
    );

  if (isSubscribed)
    return <>{t("subscription.select.higher.tier.to.recruit")}</>;
  return <>{t("subscription.subscribe.to.recruit")}</>;
};

export const RecruitmentDialog = createPortableDialog(
  ({
    roster,
    recruitPrice,
    hideRosterFilter,
    subsribeMutation,
    onClose,
  }: RecruitmentDialogProps) => {
    const modal = usePortableDialog();

    const { amount: clubCoin } = useGetClubCoins();
    const { currentPlan, abilities } = useSubscriptionQuery();
    const { goAddClubCoin, goToSubscription } = useSubscriptionHistory();

    const closeModal = () => {
      if (isRecruiting || subsribeMutation.isLoading) return;
      onClose();
      modal.remove();
    };

    const { mutate, isLoading: isRecruiting } = useMutateRecruit({
      onSuccess: () => {
        onClose();
        modal.remove();
      },
    });

    const handleClickRecruit = (currentRoster: PlayerRoster) => {
      if (currentRoster == null || clubCoin == null || recruitPrice == null)
        return;

      if (!abilities.clubStoreAccess) {
        onClose();
        modal.remove();
        hideRosterFilter?.();
        goToSubscription();
        return;
      }

      if (recruitPrice > clubCoin) {
        showDialog(NotEnoughClubCoinDialog);
        return;
      }

      mutate({
        rosterId: currentRoster.rosterId,
      });
    };

    if (roster == null || recruitPrice == null) return null;

    return (
      <RosterRecruitmentDialog
        open={modal.visible}
        onClose={closeModal}
        contentProps={{
          roster,
          fuseUpPrice: recruitPrice,
          clubCoinProps: {
            clubCoin,
            onClickAdd: () => {
              goAddClubCoin();
              modal.remove();
              hideRosterFilter?.();
            },
          },
          buttonProps: {
            loading: isRecruiting || subsribeMutation.isLoading,
            disabled:
              abilities.clubStoreAccess &&
              (isRecruiting || subsribeMutation.isLoading),
            onClick: () => handleClickRecruit(roster),
            children: (
              <div className="wwe-flex wwe-items-center wwe-gap-1 wwe-text-base">
                <ButtonContent
                  canRecruit={abilities.clubStoreAccess}
                  isSubscribed={currentPlan != null}
                  recruitPrice={recruitPrice}
                />
              </div>
            ),
          },
        }}
      />
    );
  }
);

const ID = "RecruitmentDialog";

export const useRecruitmentDialog = ({
  roster,
  recruitPrice,
  hideRosterFilter,
  subsribeMutation,
  onClose,
}: RecruitmentDialogProps) => {
  return {
    show: () => showDialogById(ID),
    remove: () => {
      removeDialog(ID);
      onClose();
    },
    dialog: (
      <RecruitmentDialog
        id={ID}
        roster={roster}
        recruitPrice={recruitPrice}
        hideRosterFilter={hideRosterFilter}
        subsribeMutation={subsribeMutation}
        onClose={onClose}
      />
    ),
  };
};
