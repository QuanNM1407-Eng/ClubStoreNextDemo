import { FilterablePlayerRoster } from "./type";

import { RosterFilterDialog } from "../modals/RosterFilterDialog";
import { useCallback, useEffect, useState } from "react";
import { removeDialog, showDialogById } from "@wwe-portal/ui/components";

export const useRosterFilter = ({
  onClickRoster,
  hidden,
  playerRosters,
  id,
  title,
}: {
  onClickRoster: (rosterId: string) => void;
  hidden: boolean;
  playerRosters: FilterablePlayerRoster[];
  id: string;
  title: string;
}) => {
  const remove = useCallback(() => removeDialog(id), [id]);
  useEffect(() => {
    return () => {
      remove();
    };
  }, [remove]);
  return {
    show: () => showDialogById(id),
    remove,
    dialog: (
      <RosterFilterDialog
        defaultVisible={false}
        keepMounted={false}
        id={id}
        title={title}
        playerRosters={playerRosters}
        onClickRoster={onClickRoster}
        hidden={hidden}
      />
    ),
  };
};

export const useSelectRoster = ({
  rosters,
  onSelected,
}: {
  rosters: FilterablePlayerRoster[];
  onSelected: (roster: FilterablePlayerRoster) => void;
}) => {
  const [roster, setRoster] = useState<FilterablePlayerRoster>();

  const selectRosterById = (rosterId: string) => {
    const roster = rosters?.find((item) => item.id === rosterId);
    if (roster) {
      setRoster(roster);
      onSelected(roster);
    }
  };

  return {
    roster,
    selectRosterById,
    clearSelection: () => setRoster(undefined),
  };
};
