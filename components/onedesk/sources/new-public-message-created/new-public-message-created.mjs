import common from "../common/common.mjs";

export default {
  ...common,
  key: "onedesk-new-public-message-created",
  name: "New Public Message Created",
  description: "Emit new event when a new public message is created. [See the docs](https://www.onedesk.com/developers/#_get_item_updates)",
  version: "0.0.1",
  type: "source",
  dedupe: "unique",
  methods: {
    ...common.methods,
    async getUpdates(applicationId) {
      const { data } = await this.onedesk.getItemUpdates({
        data: {
          applicationId,
          itemTypes: [
            "ConversationMessageActivity",
          ],
          operations: [
            "CREATE",
          ],
        },
      });
      return data;
    },
    generateMeta(item) {
      return {
        id: item.itemId,
        summary: `New Message Activity ID ${item.itemId}`,
        ts: Date.parse(item.collectedTimestamp),
      };
    },
  },
};
