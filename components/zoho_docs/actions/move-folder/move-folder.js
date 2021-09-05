const zohoDocs = require("../../zoho_docs.app.js");
const common = require("../common.js");

const axios = require("axios");

module.exports = {
  name: "Move Folder",
  description: "Move a folder from one location to another.",
  key: "move_folder",
  version: "0.3.5",
  type: "action",
  props: {
    ...common.props,
    folderToMove: {
      propDefinition: [
        zohoDocs,
        "nonRootFolder",
      ],
      label: "Folder to Move",
      description: "Folders in the Zoho Docs *Shared with Me* folder are not available from the dropdown " +
      "and must be entered as objects. To move a folder, its current *PARENT_FOLDER_ID* " +
      "must be provided in addition to its *FOLDER_ID*: " +
      "\n`{{ {FOLDER_ID: \"f02fw9csk8bwvdxg9vbyifynaik3n0ee4wjj1\", PARENT_FOLDER_ID: \"nzhtp9i0sb9dk4e0zl70h7cket3blai86c76x\"} }}` ",
    },
    destinationFolder: {
      propDefinition: [
        zohoDocs,
        "folder",
      ],
      label: "Destination Folder",
    },
  },
  methods: {},
  async run() {
    this.zohoDocs.validateFolderProp(this.folderToMove, 'Folder to Move')
    this.zohoDocs.validateFolderProp(this.destinationFolder, 'Destination Folder')
    if(!this.folderToMove.PARENT_FOLDER_ID){
      console.log('Folder to Move: ', this.folderToMove)
      throw new Error('Folder to Move must have a PARENT_FOLDER_ID property.')
    }

    const params = {
      folderid: this.folderToMove.FOLDER_ID,
      prevparentfolderid: this.folderToMove.PARENT_FOLDER_ID,
      destfolderid: this.destinationFolder.FOLDER_ID,
    };

    try {
      await axios({
        method: "post",
        url: "https://apidocs.zoho.com/files/v1/folders/move",
        headers: {
          "Authorization": `Zoho-oauthtoken ${this.zohoDocs.$auth.oauth_access_token}`,
        },
        params,
      });
      console.log(`Folder "${this.folderToMove.FOLDER_NAME}" moved to "${this.destinationFolder.FOLDER_NAME}"`);
    } catch (ex) {
      if(ex.response.status === 500){
        console.log(params)
        throw new Error('Request failed with status code 500. Double-check that the folder IDs listed below are correct and that the folders still exist.')
      } else {
        throw ex
      }
    }

    return {
      folderToMove: this.folderToMove,
      destinationFolder: this.destinationFolder,
    };
  },
};
