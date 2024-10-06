import { useWindowSize } from "./hooks";
import {
  useRef,
  useCallback,
  useMemo,
  useEffect,
  MutableRefObject,
} from "react";
import { IntersectionOptions, useInView } from "react-intersection-observer";

const DEFAULT_TOP_OFFSET = 320;
const BOUND_HEIGHT = 50;

const ItemIDS = {
  mission: "mission",
  fuseUp: "fuseUp",
  recruitment: "recruitment",
  items: "items",
} as const;

const defaultItemIds = [
  {
    id: ItemIDS.mission,
    label: "Missions",
  },
  {
    id: ItemIDS.fuseUp,
    label: "Fuse Up",
  },
  {
    id: ItemIDS.recruitment,
    label: "Superstar",
  },
  {
    id: ItemIDS.items,
    label: "Drops",
  },
] as const;

export const useNavigationBar = () => {
  const [, height = 0] = useWindowSize();

  const mission = useRef<Element | null | undefined>(null);
  const fuseUp = useRef<Element | null | undefined>(null);
  const items = useRef<Element | null | undefined>(null);
  const recruitment = useRef<Element | null | undefined>(null);

  const TOP_OFFSET =
    (mission?.current as HTMLElement)?.offsetTop || DEFAULT_TOP_OFFSET;

  const bottomRootMargin = height - TOP_OFFSET - BOUND_HEIGHT;
  const options: IntersectionOptions = {
    threshold: 0,
    delay: 0,
    root: null,
    rootMargin: `-${TOP_OFFSET}px 0px -${
      bottomRootMargin < 0 ? 0 : bottomRootMargin
    }px 0px`,
  };

  const stickyElementRef = useRef<HTMLDivElement>(null);

  const [missionRef, missionInView, missionEntry] = useInView(options);

  const [fuseUpRef, fuseUpInView, fuseUpEntry] = useInView(options);

  const [itemsRef, itemsInView, itemsEntry] = useInView(options);

  const [recruitmentRef, recruitmentInView, recruitmentEntry] =
    useInView(options);

  const activeId = useMemo(() => {
    // Get latest in-view element id
    return (
      [
        {
          id: ItemIDS.mission,
          inView: missionInView,
          time: missionEntry?.time ?? 0,
        },
        {
          id: ItemIDS.fuseUp,
          inView: fuseUpInView,
          time: fuseUpEntry?.time ?? 0,
        },
        {
          id: ItemIDS.recruitment,
          inView: recruitmentInView,
          time: recruitmentEntry?.time ?? 0,
        },
        {
          id: ItemIDS.items,
          inView: itemsInView,
          time: itemsEntry?.time ?? 0,
        },
      ]
        .filter(({ inView }) => inView)
        .sort((a, b) => b.time - a.time)[0]?.id ?? ItemIDS.mission
    );
  }, [
    missionInView,
    missionEntry,
    fuseUpInView,
    fuseUpEntry,
    recruitmentInView,
    recruitmentEntry,
    itemsInView,
    itemsEntry,
  ]);

  const setMissionRefs = useCallback(
    (node) => {
      mission.current = node;
      missionRef(node);
    },
    [missionRef]
  );

  const setFuseUpRefs = useCallback(
    (node) => {
      fuseUp.current = node;
      fuseUpRef(node);
    },
    [fuseUpRef]
  );

  const setItemsRefs = useCallback(
    (node: Element | null | undefined) => {
      items.current = node;
      itemsRef(node);
    },
    [itemsRef]
  );

  const setRecruitmentRefs = useCallback(
    (node: Element | null | undefined) => {
      recruitment.current = node;
      recruitmentRef(node);
    },
    [recruitmentRef]
  );

  const refs = useMemo(
    () => ({
      mission: setMissionRefs as never,
      fuseUp: setFuseUpRefs as never,
      items: setItemsRefs as never,
      recruitment: setRecruitmentRefs as never,
    }),
    [setMissionRefs, setFuseUpRefs, setItemsRefs, setRecruitmentRefs]
  );

  const refObjects: Record<
    keyof typeof ItemIDS,
    MutableRefObject<Element | null | undefined>
  > = useMemo(
    () => ({
      mission,
      recruitment,
      items,
      fuseUp,
    }),
    []
  );

  useEffect(() => {
    if (!activeId) return;
    const currentElement = stickyElementRef.current?.querySelector(
      `div[data-id="${activeId}"]`
    );
    if (!currentElement) return;
    const offsetLeft = currentElement.getBoundingClientRect().left;
    currentElement.parentElement?.scrollTo({
      behavior: "smooth",
      left: offsetLeft,
    });
  }, [activeId, stickyElementRef]);

  const itemIds = defaultItemIds.filter((item) => {
    const refObject = refObjects[item.id];

    return refObject?.current != null;
  });

  return {
    onClick: ({ id }: { id: string }) => {
      if (id) {
        window?.scrollTo?.({
          top: refObjects[id].current.offsetTop - TOP_OFFSET,
          behavior: "smooth",
        });
      }
    },
    refs,
    activeId,
    itemIds,
    stickyElmRef: stickyElementRef,
  };
};
