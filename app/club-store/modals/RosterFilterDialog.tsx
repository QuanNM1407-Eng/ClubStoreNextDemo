import {
  RosterFilterData,
  RosterFilterDialog as RosterFilterDialogUI,
  RosterFilterProps,
} from "@wwe-portal/ui/features/roster";
import { FilterablePlayerRoster } from "../lib/type";

import { ChangeEvent, useMemo, useState } from "react";

import showboats from "../../../assets/images/showboats.png";
import acrobats from "../../../assets/images/acrobats.png";
import powerhouses from "../../../assets/images/powerhouses.png";
import technicians from "../../../assets/images/technicians.png";
import tricksters from "../../../assets/images/tricksters.png";
import strikers from "../../../assets/images/strikers.png";
import attitude from "../../../assets/images/attitude.png";
import legends from "../../../assets/images/legends.png";
import modern from "../../../assets/images/modern.png";
import newGeneration from "../../../assets/images/new-generation.png";
import PG from "../../../assets/images/PG.png";
import reality from "../../../assets/images/reality.png";
import ruthlessAggression from "../../../assets/images/ruthless-aggression.png";
import hallOfFame from "../../../assets/images/hall-of-fame.png";

import Alliance from "../../../assets/images/stables/Alliance.png";
import Authority from "../../../assets/images/stables/Authority.png";
import Club from "../../../assets/images/stables/Club.png";
import CORP from "../../../assets/images/stables/CORP.png";
import DiamondExchange from "../../../assets/images/stables/DiamondExchange.png";
import DX from "../../../assets/images/stables/DX.png";
import Evolution from "../../../assets/images/stables/Evolution.png";
import FourHorsemen from "../../../assets/images/stables/FourHorsemen.png";
import HartFoundation from "../../../assets/images/stables/HartFoundation.png";
import HeenanFamily from "../../../assets/images/stables/HeenanFamily.png";
import LeagueOfNations from "../../../assets/images/stables/LeagueOfNations.png";
import Legacy from "../../../assets/images/stables/Legacy.png";
import MillionairesClub from "../../../assets/images/stables/MillionairesClub.png";
import Nexus from "../../../assets/images/stables/Nexus.png";
import NOD from "../../../assets/images/stables/NOD.png";
import NWO from "../../../assets/images/stables/NWO.png";
import RatPack from "../../../assets/images/stables/RatPack.png";
import Shield from "../../../assets/images/stables/Shield.png";
import Z from "../../../assets/images/stables/Z.png";
import { debounce } from "@wwe-portal/ui/external";
import {
  createPortableDialog,
  EmptySearchResult,
  usePortableDialog,
} from "@wwe-portal/ui/components";
import { useTranslation } from "react-i18next";
const defaultFilterValue = {
  era: null,
  class: null,
  stable: null,
};

const isMatch = (
  value: string[] | string | null,
  searchText: string | null
) => {
  if (!searchText) return true;
  if (value == null) return false;
  if (typeof value === "string") {
    return value.toLowerCase().includes(searchText?.toLowerCase());
  }
  if (Array.isArray(value)) {
    return value.some((item) => isMatch(item, searchText));
  }
  return true;
};

export const RosterFilterDialog = createPortableDialog(
  ({
    title,
    hidden,
    playerRosters,
    onClickRoster,
  }: {
    title: string;
    hidden: boolean;
    playerRosters: FilterablePlayerRoster[];
    onClickRoster: (rosterId: string) => void;
  }) => {
    const modal = usePortableDialog();
    const { t } = useTranslation();
    const [searchText, setSearchText] = useState<string>("");
    const [inputText, setInputText] = useState<string>("");
    const [filterValue, setFilterValue] =
      useState<RosterFilterData>(defaultFilterValue);

    const onClose = () => {
      setFilterValue(defaultFilterValue);
      setInputText("");
      modal.remove();
    };

    const debounceChangeSearchText = useMemo(
      () => debounce((value: string) => setSearchText(value), 300),
      []
    );

    const onChangeSearch = (e: ChangeEvent<HTMLInputElement>) => {
      debounceChangeSearchText(e.target.value);
      setInputText(e.target.value);
    };

    const getFilterDataAction = (type: "class" | "era" | "stable") => {
      return {
        onClearFilter: () =>
          setFilterValue((value) => ({ ...value, [type]: null })),
        onSelectItem: (id: string) =>
          setFilterValue((value) => ({
            ...value,
            [type]: value[type] === id ? null : id,
          })),
      };
    };

    const filterData: RosterFilterProps["filterData"] = {
      class: {
        title: "Class",
        items: [
          { id: "Yellow", title: "showboats", iconUrl: showboats },
          { id: "Blue", title: "acrobats", iconUrl: acrobats },
          { id: "Red", title: "powerhouses", iconUrl: powerhouses },
          { id: "Green", title: "technicians", iconUrl: technicians },
          { id: "Purple", title: "tricksters", iconUrl: tricksters },
          { id: "Black", title: "strikers", iconUrl: strikers },
        ],
        clearFilterText: "All Classes",
        ...getFilterDataAction("class"),
      },
      era: {
        title: "Era",
        items: [
          { id: "Attitude", title: "attitude", iconUrl: attitude },
          { id: "Classic", title: "legends", iconUrl: legends },
          { id: "Modern", title: "modern", iconUrl: modern },
          {
            id: "NewGen",
            title: "new.generation",
            iconUrl: newGeneration,
          },
          { id: "Reality", title: "reality", iconUrl: reality },
          { id: "PG", title: "pg", iconUrl: PG },
          {
            id: "RuthlessAggression",
            title: "ruthless.aggression",
            iconUrl: ruthlessAggression,
          },
          {
            id: "HallofFame",
            title: "hall.Of.fame",
            iconUrl: hallOfFame,
          },
        ],
        clearFilterText: "All Eras",
        ...getFilterDataAction("era"),
      },
      stable: {
        title: "Stable",
        items: [
          { id: "Stable_Alliance", title: "alliance", iconUrl: Alliance },
          {
            id: "Stable_Authority",
            title: "authority",
            iconUrl: Authority,
          },
          { id: "Stable_Club", title: "club", iconUrl: Club },
          { id: "Stable_CORP", title: "corp", iconUrl: CORP },
          {
            id: "Stable_DiamondExchange",
            title: "diamond.exchange",
            iconUrl: DiamondExchange,
          },
          { id: "Stable_DX", title: "dx", iconUrl: DX },
          {
            id: "Stable_Evolution",
            title: "evolution",
            iconUrl: Evolution,
          },
          {
            id: "Stable_FourHorsemen",
            title: "four.horsemen",
            iconUrl: FourHorsemen,
          },
          {
            id: "Stable_HartFoundation",
            title: "hart.foundation",
            iconUrl: HartFoundation,
          },
          {
            id: "Stable_HeenanFamily",
            title: "heenan.family",
            iconUrl: HeenanFamily,
          },
          {
            id: "Stable_LeagueOfNations",
            title: "league.of.nations",
            iconUrl: LeagueOfNations,
          },
          { id: "Stable_Legacy", title: "legacy", iconUrl: Legacy },
          {
            id: "Stable_MillionairesClub",
            title: "millionaires.club",
            iconUrl: MillionairesClub,
          },
          { id: "Stable_Nexus", title: "nexus", iconUrl: Nexus },
          { id: "Stable_NOD", title: "nod", iconUrl: NOD },
          { id: "Stable_NWO", title: "nwo", iconUrl: NWO },
          { id: "Stable_RatPack", title: "rat.pack", iconUrl: RatPack },
          { id: "Stable_Shield", title: "shield", iconUrl: Shield },
          { id: "Stable_Z", title: "z", iconUrl: Z },
        ],
        clearFilterText: "All Stables",
        ...getFilterDataAction("stable"),
      },
    };
    const rosters = useMemo(() => {
      return (
        playerRosters
          ?.filter((item) => {
            return Object.keys(filterValue).every((key) => {
              return isMatch(item[key], filterValue?.[key]);
            });
          })
          .filter((item) => !searchText || isMatch(item.name, searchText)) ?? []
      );
    }, [filterValue, searchText, playerRosters]);

    return (
      <RosterFilterDialogUI
        open={modal.visible}
        onClose={onClose}
        hidden={hidden}
        filterProps={{
          title,
          rosters,
          filterData,
          filterValue,
          searchText: inputText,
          onClickRoster,
          onChangeSearch,
          noItemText: (
            <EmptySearchResult>
              {t("header.search.no.result.without.text")}
            </EmptySearchResult>
          ),
        }}
      />
    );
  }
);
