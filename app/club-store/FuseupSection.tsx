import { ExclusiveFuseupSection as FuseupSectionUI } from "@wwe-portal/widget/club-store";

import { FuseupDialog, useFuseupDialog } from "./modals/FuseupDialog";

import { useRosterListSize } from "./helper/clubstoreHelper";
import { parseRosterItemToProps } from "./lib/mapper.offer";
import { useRosterItems } from "./query/clubStoreQueries";
import { useSelectRoster, useRosterFilter } from "./lib/use-roster-filter";
import { FC } from "react";
import { UserSubscriptionMutationState } from "@wwe-portal/widget/subscription";
import { useTranslation } from "react-i18next";
import { usePortableDialog } from "@wwe-portal/ui/components";

export const FuseUpSection: FC<{
  subscribeMutation: UserSubscriptionMutationState;
}> = ({ subscribeMutation }) => {
  const pageSize = useRosterListSize();
  const { data: rosterItemResponse, isInitialLoading: isLoadingRosters } =
    useRosterItems();
  const allData = rosterItemResponse?.data
    .map(parseRosterItemToProps)
    .filter((item) => item.id);
  const rosters = allData?.slice(0, pageSize);
  const total = rosterItemResponse?.data.length;

  const fuseupModal = usePortableDialog(FuseupDialog);
  const { t } = useTranslation();

  const { roster, selectRosterById, clearSelection } = useSelectRoster({
    rosters: allData ?? [],
    onSelected: () => {
      fuseupDialog.show();
    },
  });

  const {
    show: showRosterFilter,
    remove: hideRosterFilter,
    dialog,
  } = useRosterFilter({
    title: "CURRENT ROSTER",
    onClickRoster: selectRosterById,
    hidden: fuseupModal.visible,
    playerRosters: allData ?? [],
    id: "fuse-up-filter",
  });

  const fuseupDialog = useFuseupDialog({
    currentRoster: roster,
    hideRosterFilter,
    onClose: clearSelection,
    subsribeMutation: subscribeMutation,
  });

  return (
    <>
      <FuseupSectionUI
        title={t("clubStore.fuseUp.title")}
        description={t("clubStore.fuseUp.description")}
        isLoading={isLoadingRosters}
        rosters={rosters}
        total={total}
        onItemClick={selectRosterById}
        onViewMoreRosters={showRosterFilter}
      />
      {dialog}
      {fuseupDialog.dialog}
    </>
  );
};
