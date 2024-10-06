export interface IndividualEventResponse {
  data: EventData[];
}

export const EventTypeEnum = {
  GLOBAL: 1,
  SOLO: 2,
} as const;

export type EventType = (typeof EventTypeEnum)[keyof typeof EventTypeEnum];

export interface GlobalEventResponse {
  data: {
    events: EventData[];
    showFirst: number;
  };
}

export interface EventData {
  portalEventId: number;
  name: string;
  description: string;
  image: string;
  typeId: EventType;
  statId: number;
  milestones: Milestone[];
  startDate: string;
  endDate: string;
  updatedAt: string;
  createdAt: string;
  milestoneDescriptionTemplate: string;
  pointRules: PointRule[];
  statusId: number;
  parentEventId?: number;
  eventId: string;
  isNew: boolean;
  assetsBanner: AssetsBanner[];
  individualId: string;
  multiple: boolean;
  leaderboardId: string;
  type: string;
  totalPoints: number;
  globalLevel: number;
}

export interface Milestone {
  isNew?: boolean;
  isWritten?: boolean;
  requirement: number;
  image: string;
  name: string;
  description: string;
  rewards: Reward[];
  level: number;
  id: string;
  isCompleted?: boolean;
  claimed: boolean;
}

export interface Reward {
  itemId: string;
  quantity: number;
  displayName: string;
  imageUrl: string;
}

export interface PointRule {
  currencyId: number;
  value: any;
  rate: number;
  name?: string;
  id: string;
  description?: string;
  portalEventsStatId?: number;
  portalEventsSubStatId?: number;
}

export interface AssetsBanner {
  id: string;
  key: string;
  name: string;
  url: string;
}
