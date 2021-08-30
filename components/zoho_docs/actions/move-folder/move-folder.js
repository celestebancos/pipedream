const zohoDocs = require("../../zoho_docs.app.js");
const common = require("../common.js");

const axios = require("axios");

module.exports = {
  name: "Move Folder",
  description: "Move a folder from one location to another.",
  key: "move_folder",
  version: "0.0.1",
  type: "action",
  props: {
    ...common.props,
    folder: {
      propDefinition: [
        zohoDocs,
        "folderId",
      ],
      label: 'Folder to Move',
    },
    destFolderId: {
      propDefinition: [
        zohoDocs,
        "folderId",
      ],
    },
    label: 'Destination Folder',
  },
  methods: {
  },
  async run() {
  },
};
