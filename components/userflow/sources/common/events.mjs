const NAME_PLACEHOLDER = "{name}";

export default {
  NAME_PLACEHOLDER,
  TOPIC: {
    ALL: "*",
    EVENT: "event",
    EVENT_TRACKED: "event.tracked",
    EVENT_TRACKED_NAME: `event.tracked.${NAME_PLACEHOLDER}`,
    GROUP: "group",
    GROUP_CREATED: "group.created",
    GROUP_UPDATED: "group.updated",
    USER: "user",
    USER_CREATED: "user.created",
    USER_UPDATED: "user.updated",
  },
  EVENT: {
    ANNOUNCEMENT_SEEN: "announcement_seen",
    ASSISTANT_FEEDBACK_SUBMITTED: "assistant_feedback_submitted",
    CHECKLIST_COMPLETED: "checklist_completed",
    CHECKLIST_ENDED: "checklist_ended",
    CHECKLIST_HIDDEN: "checklist_hidden",
    CHECKLIST_SHOWN: "checklist_shown",
    CHECKLIST_STARTED: "checklist_started",
    CHECKLIST_TASK_CLICKED: "checklist_task_clicked",
    CHECKLIST_TASK_COMPLETED: "checklist_task_completed",
    FLOW_COMPLETED: "flow_completed",
    FLOW_ENDED: "flow_ended",
    FLOW_STARTED: "flow_started",
    FLOW_STEP_SEEN: "flow_step_seen",
    LAUNCHER_ACTIVATED: "launcher_activated",
    LAUNCHER_DISMISSED: "launcher_dismissed",
    LAUNCHER_SEEN: "launcher_seen",
    PAGE_VIEWED: "page_viewed",
    QUESTION_ANSWERED: "question_answered",
    RESOURCE_CENTER_CLICKED: "resource_center_clicked",
    RESOURCE_CENTER_CLOSED: "resource_center_closed",
    RESOURCE_CENTER_OPENED: "resource_center_opened",
    TOOLTIP_TARGET_MISSING: "tooltip_target_missing",
    ASSISTANT_MESSAGE_SENT: "assistant_message_sent",
    ASSISTANT_RATING_SUBMITTED: "assistant_rating_submitted",
    BANNER_DISMISSED: "banner_dismissed",
    BANNER_SEEN: "banner_seen",
    RANDOM_AB_ASSIGNED: "random_ab_assigned",
    RANDOM_NUMBER_ASSIGNED: "random_number_assigned",
  },
};
