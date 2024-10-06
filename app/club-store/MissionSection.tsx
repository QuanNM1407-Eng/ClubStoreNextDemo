import { MissionSection as MissionSectionUI } from "@wwe-portal/widget/club-store";
import { useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import { MissionOfferDialog } from "./modals/OfferDialog";
// import { useMutateClaimAll } from "./query/subscriptionQueries";
import {
  mapMissionTypeToLabel,
  useClaimAllStatus,
  useMissionItems,
  useMissionStatus,
} from "./query/clubStoreQueries";
import { Button, usePortableDialog } from "@wwe-portal/ui/components";
import { MilestonePeriodData } from "@wwe-portal/ui/features/club-store/milestone/milestone-period";
// import { useEnabledFlags } from "views/components/FeatureFlag";
import { OfferItem, OfferReviewDialog } from "@wwe-portal/ui/features";
import React from "react";

interface SortableMission {
  isClaimedValue: number;
  hasPinValue: number;
  endPoint: number;
  periodType: number;
  currentPoint: number;
  milestoneId: string;
}

const comparedKeys = [
  "hasPinValue",
  "isClaimedValue",
  "periodType",
  "endPoint",
  "currentPoint",
] as const;
const isMissionBetter = (a: SortableMission, b: SortableMission) => {
  for (const field of comparedKeys) {
    const d = a[field] - b[field];
    if (d !== 0) return d;
  }
  return a.milestoneId.localeCompare(b.milestoneId);
};

export const MissionSection = () => {
  const modal = usePortableDialog(MissionOfferDialog);
  const { t } = useTranslation();
  const [isSectionModal, setIsSectionModal] = useState(false);
  const { data: missionItems, missionItemResponse } = useMissionItems();
  const { data: missionStatus } = useMissionStatus();
  const { data: claimAllStatus } = useClaimAllStatus();
  const isClaimAllAble = useMemo(
    () => Boolean(claimAllStatus?.length),
    [claimAllStatus]
  );

  // const { mutate } = useMutateClaimAll();
  const [isViewMore, setIsViewMore] = useState(false);
  // const [isRevamp] = useEnabledFlags(["clubStore.missions.revamp"]);
  const isRevamp = false;
  const [groupMission, setGroupMission] = useState<OfferItem[]>([]);
  const sortableData = useMemo(
    () =>
      (missionItems as MilestonePeriodData[])
        .map((record) => {
          const currentPoint =
            (missionStatus?.[record.milestoneId]?.count ?? 0) > record.endPoint
              ? record.endPoint
              : missionStatus?.[record.milestoneId]?.count ?? 0;
          const hasPin = record.endPoint === currentPoint;
          const isClaimable =
            claimAllStatus?.some(
              ({ milestoneId }) => milestoneId === record.milestoneId
            ) ?? true;
          const isClaimed = hasPin && !isClaimable;
          const updatedAt = new Date(
            missionStatus?.[record.milestoneId]?.updatedAt ?? ""
          );
          return {
            ...record,
            currentPoint,
            hasPinValue: record.endPoint > currentPoint ? -1 : 1,
            isClaimed,
            hasPin,
            isClaimedValue: !isClaimed ? -1 : 1,
            updatedAt: updatedAt.getTime(),
          };
        })
        .sort(isMissionBetter) ?? [],
    [missionItems, missionStatus, claimAllStatus]
  );

  const topMissions = useMemo(() => {
    return Object.keys(mapMissionTypeToLabel)
      .map((type) =>
        sortableData.find(
          (mission) => String(mission.periodType) === String(type)
        )
      )
      .filter(
        (item) =>
          Boolean(item) &&
          (item?.hasPinValue !== 1 || item?.isClaimedValue !== 1)
      ) as MilestonePeriodData[];
  }, [sortableData]);

  const topMissionIds = new Set(
    topMissions.map((mission) => mission?.milestoneId)
  );

  const viewMoreMissions = sortableData.filter(
    (record) => !topMissionIds.has(record.milestoneId)
  );

  const viewReward = (id: string) => {
    const rawOffer = missionItemResponse?.data.find(
      (item) => item.subEventId.toString() === id
    );
    if (rawOffer == null) return;
    modal.show({
      data: {
        title: "MISSION REWARDS",
        description: rawOffer.type
          ? mapMissionTypeToLabel[rawOffer.type]
          : rawOffer.name,
        detailsDescription: rawOffer.description,
        rewardList: rawOffer.mission.reward?.pools?.map(
          ({ displayName, quantity }) => `${quantity} ${displayName}`
        ),
        isBlocked: false,
      },
      type: rawOffer.type,
    });
  };

  return (
    <>
      <MissionSectionUI
        isRevamp={isRevamp}
        claimAllTooltipContent={t("clubStore.claimAll.description")}
        data={{
          defaultMileStonePeriods: topMissions,
          milestonePeriods: isRevamp || isViewMore ? viewMoreMissions : [],
          onMissionDetails: viewReward,
        }}
        description={t("subscription.mission.description")}
        isClaimAllAble={isClaimAllAble}
        title="Missions"
        // onClaim={mutate}
        onClaim={() => {}}
        onMissionSectionClick={(type) => {
          const g = sortableData
            ?.filter((i) => i.periodType === type)
            .map((i) => {
              const { id, imgUrl, quantity, currentPoint, endPoint } = i;
              return {
                itemId: id,
                imageUrl: imgUrl,
                dynamicImageUrl: imgUrl,
                percentage: Math.ceil((currentPoint / endPoint) * 100),
                text: `${quantity}`,
              };
            });

          setGroupMission(g ?? []);
          setIsSectionModal(true);
        }}
        viewMoreBtn={
          topMissions.length < missionItems.length && (
            <div className="wwe-w-full wwe-flex wwe-justify-center wwe-pt-5">
              <Button
                className="wwe-w-full wwe-h-[44px] md:wwe-w-[200px] wwe-font-semibold"
                onClick={() => {
                  setIsViewMore(!isViewMore);
                }}
                variant="secondary"
              >
                View {isViewMore ? "Less" : "More"}
              </Button>
            </div>
          )
        }
      />
      <OfferReviewDialog
        onClose={() => setIsSectionModal(false)}
        open={isSectionModal}
        isAggregate
        onItemClick={(id) => {
          viewReward(id);
        }}
        data={{
          title: "",
          items: groupMission,
          vipPoints: 100,
          endDate: "",
          id: "1",
          actionBtn: null,
          storeItemDescription: "",
        }}
      />
    </>
  );
};
