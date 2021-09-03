const zohoDocs = require("../../zoho_docs.app.js");
const common = require("../common.js");

const axios = require("axios");

module.exports = {
  name: "Move Folder",
  description: "Move a folder from one location to another.",
  key: "move_folder",
  version: "0.1.21",
  type: "action",
  props: {
    ...common.props,
    folderToMove: {
      propDefinition: [
        zohoDocs,
        "nonRootFolder",
      ],
      label: 'Folder to Move',
    },
    destinationFolder: {
      propDefinition: [
        zohoDocs,
        "folder",
      ],
      label: 'Destination Folder',
    },
  },
  methods: {
  },
  async run() {
    const params = {
      folderid: this.folderToMove.FOLDER_ID,
      prevparentfolderid: this.folderToMove.PARENT_FOLDER_ID,
      destfolderid: this.destinationFolder.FOLDER_ID,
    }

    try{
      const response = await axios({
        method: "post",
        url: "https://apidocs.zoho.com/files/v1/folders/move",
        headers: {
          "Authorization": `Zoho-oauthtoken ${this.zohoDocs.$auth.oauth_access_token}`,
        },
        params,
      })
      console.log(`Folder "${this.folderToMove.FOLDER_NAME}" moved to "${this.destinationFolder.FOLDER_NAME}"`)
    } catch(ex){
      console.log(ex.message)
    }

    return {folderToMove: this.folderToMove, destinationFolder: this.destinationFolder}
  },
};
