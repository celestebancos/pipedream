const LIMIT = 100;

const TYPE_OPTIONS = [
  "PERSONAL_POST",
  "PAGE_POST",
  "STORY",
  "REELS",
  "SHORTS",
  "LINK_CAROUSEL",
  "DOCUMENT",
  "POLL",
];

const STATUS_OPTIONS = [
  "CREATED",
  "READY",
  "PLANNED",
  "PUBLISHED",
  "IN_REVIEW",
  "ACTIVATING",
  "MANUALLY_ACTIVATING",
  "ERROR",
  "DELETED",
  "CHECK_REVIEW_FEEDBACK",
  "IMPORTING",
];

const SCHEDULE_OPTIONS = [
  "PUBLISH_AS_SOON_AS_POSSIBLE",
  "PLANNED_POST_PUBLISH",
];

const PROMOTION_TYPE_OPTIONS = [
  "TRAFFIC",
  "CONVERSIONS",
  "RETARGETING",
  "SHOPPING",
  "CARS",
  "REAL_ESTATE",
  "JOBS",
  "EVENTS",
  "APP",
  "ENGAGEMENT",
  "VIDEO_VIEWS",
  "CALLS",
  "REACH",
  "FOLLOWERS",
  "PROFILE_VIEWS",
  "LEADS",
  "PERFORMANCE_MAX",
];

export default {
  LIMIT,
  TYPE_OPTIONS,
  STATUS_OPTIONS,
  SCHEDULE_OPTIONS,
  PROMOTION_TYPE_OPTIONS,
};
