import { ExclusiveRecruitmentSection as ExclusiveRecruitmentSectionUI } from "@wwe-portal/widget/club-store";
import {
  RecruitmentDialog,
  useRecruitmentDialog,
} from "./modals/RecruitmentDialog";
import { useRosterListSize } from "./helper/clubstoreHelper";
import { parseRosterItemToProps } from "./lib/mapper.offer";
import { useLockedRosters } from "./query/clubStoreQueries";
import { useRosterFilter, useSelectRoster } from "./lib/use-roster-filter";
import { FC } from "react";
import { UserSubscriptionMutationState } from "@wwe-portal/widget/subscription";
import { FilterablePlayerRoster } from "./lib/type";
import { useTranslation } from "react-i18next";
import { usePortableDialog } from "@wwe-portal/ui/components";

const getRosterRecruitPrice = (roster: FilterablePlayerRoster | undefined) => {
  if (roster == null) return undefined;
  const recruitPrice = Number(roster.e3);
  if (Number.isNaN(recruitPrice)) return undefined;
  return recruitPrice;
};

export const RecruitmentSection: FC<{
  subscribeMutation: UserSubscriptionMutationState;
}> = ({ subscribeMutation }) => {
  const recruitmentModal = usePortableDialog(RecruitmentDialog);

  const pageSize = useRosterListSize();
  const { data: rosterItemResponse, isInitialLoading: isLoadingRosters } =
    useLockedRosters();
  const allData = rosterItemResponse?.data
    .map(parseRosterItemToProps)
    .map((roster) => ({
      ...roster,
      level: "G" as const,
      star: 5,
      disabled: roster.e3 == null,
    }))
    .filter((item) => item.id);
  const { roster, selectRosterById, clearSelection } = useSelectRoster({
    rosters: allData ?? [],
    onSelected: () => {
      recruitmentDialog.show();
    },
  });
  const { t } = useTranslation();

  const rosters = allData?.slice(0, pageSize);

  const total = rosterItemResponse?.data.length;

  const {
    show: showRosterFilter,
    remove: hideRosterFilter,
    dialog,
  } = useRosterFilter({
    title: "NEW RECRUITMENT",
    onClickRoster: selectRosterById,
    hidden: recruitmentModal.visible,
    playerRosters: allData ?? [],
    id: "recruit-up-filter",
  });

  const recruitmentDialog = useRecruitmentDialog({
    hideRosterFilter,
    subsribeMutation: subscribeMutation,
    roster,
    recruitPrice: getRosterRecruitPrice(roster),
    onClose: clearSelection,
  });

  return (
    <>
      <ExclusiveRecruitmentSectionUI
        title={t("clubStore.recruitment.title")}
        description={t("clubStore.recruitment.description")}
        isLoading={isLoadingRosters}
        rosters={rosters}
        total={total}
        onItemClick={selectRosterById}
        onViewMoreRosters={showRosterFilter}
      />
      {dialog}
      {recruitmentDialog.dialog}
    </>
  );
};
