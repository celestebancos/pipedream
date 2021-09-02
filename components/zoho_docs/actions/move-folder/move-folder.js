const zohoDocs = require("../../zoho_docs.app.js");
const common = require("../common.js");

const axios = require("axios");

module.exports = {
  name: "Move Folder",
  description: "Move a folder from one location to another.",
  key: "move_folder",
  version: "0.0.9",
  type: "action",
  props: {
    ...common.props,
    folderToMove: {
      propDefinition: [
        zohoDocs,
        "folderId",
      ],
      label: 'Folder to Move',
    },
    destinationFolder: {
      propDefinition: [
        zohoDocs,
        "folderId",
      ],
      label: 'Destination Folder',
    },
  },
  methods: {
  },
  async run() {
    const parent_folder_id = null
    const response = await axios({
      method: "get",
      url: "https://apidocs.zoho.com/files/v1/folders/move",
      headers: {
        "Authorization": `Zoho-oauthtoken ${this.zohoDocs.$auth.oauth_access_token}`,
      },
      params: {
        folderid: this.folderToMove,
        destfolderid: this.destinationFolder,
        prevparentfolderid: parent_folder_id,
      },
    })
  },
};
