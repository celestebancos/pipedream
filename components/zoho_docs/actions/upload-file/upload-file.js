const zohoDocs = require("../../zoho_docs.app.js");
const axios = require("axios");
const FormData = require("form-data");
const fs = require("fs");

module.exports = {
  name: "Upload File",
  description: "Upload a file to the specified folder.",
  key: "upload_file",
  version: "0.4.7",
  type: "action",
  props: {
    zohoDocs,
    folderID: {
      type: "string",
      label: "Folder",
      description: "Choose a folder from the dropdown or turn structured mode off to enter a folder ID directly.",
      async options({prevContext}){
        const unchecked_folder_ids = prevContext.unchecked_folder_ids || []
        let folder_id_to_check = unchecked_folder_ids.shift()
        let folders = await this.getSubfolders(folder_id_to_check)

        while(folders.length === 0 && unchecked_folder_ids.length > 0){
          folder_id_to_check = unchecked_folder_ids.shift()
          folders = await this.getSubfolders(folder_id_to_check)
        }

        const options = folders.map(folder => {
          return {
            label: ' > ' + getName(folder),
            value: getId(folder),
          }
        })

        //add the root folder as the first option
        if(!prevContext.parent_folder_id){
          const root_folder = {label: 'Zoho Docs', value: null}
          options.unshift(root_folder)
        }

        const subfolder_ids = folders.map(folder => getId(folder))
        const more_unchecked_folder_ids = unchecked_folder_ids.concat(subfolder_ids)

        return {
          options,
          context: {unchecked_folder_ids: more_unchecked_folder_ids},
        }

        //Zoho Docs uses different property names depending on whether the folder is top-level or not
        function getName(folder){
          return folder.FOLDERNAME || folder.FOLDER_NAME
        }
        function getId(folder){
          return folder.FOLDERID || folder.FOLDER_ID
        }
      },
    },
    filePath: {
      type: "string",
      label: "File Path",
    },
    fileName: {
      type: "string",
      label: "File Name (Optional)",
      optional: true,
    },
  },
  methods: {
    async getSubfolders(parent_folder_id){
      const {data} = await axios({
        method: "get",
        url: "https://apidocs.zoho.com/files/v1/folders",
        headers: {
          "Authorization": `Zoho-oauthtoken ${this.zohoDocs.$auth.oauth_access_token}`,
        },
        params: {
          folderid: parent_folder_id,
        },
      })
      // Ihe Zoho Docs API returns two different schemas depending on whether the folderid request param was defined.
      if(data.FOLDER){
        // If a folderid was given, the response contains the subfolders of that folder.
        // The response has a FOLDER property and the folders have FOLDERNAME and FOLDERID properties (no underscores).
        const standardized_folders = data.FOLDER.map(folder => {
          folder.FOLDER_NAME = folder.FOLDERNAME
          folder.FOLDER_ID = folder.FOLDERID
          return folder
        })
        return standardized_folders
      } else if (data.length){
        // If the folderid param was not defined, the response contains subfolders of the user's root folder.
        // The response is an array with the first item being meta-data and the rest of the items being folder objects
        // (wrapped in arrays) with FOLDER_NAME and FOLDER_ID properties.
        const [folderInfo, ...folders] = data
        return folders.map(folder => folder[0])
      } else {
        throw new Error(`Folder ID: ${parent_folder_id} Data: ${JSON.stringify(data)}`)
      }
    },
    async uploadFile(folderID, filePath, fileName) {
      try {
        const data = new FormData();
        data.append("content", await fs.createReadStream(filePath));
        const response = await axios({
          method: "post",
          url: "https://apidocs.zoho.com/files/v1/upload",
          headers: {
            "Authorization": `Zoho-oauthtoken ${this.zohoDocs.$auth.oauth_access_token}`,
            "Content-Type": "multipart/form-data",
            ...data.getHeaders(),
          },
          params: {
            filename: fileName,
            fid: folderID,
          },
          data: data,
        });
        const [
          { documentname },
          { uploaddocid },
        ] = response.data.response[2].result;
        return {
          name: documentname,
          id: uploaddocid,
        };
      } catch (ex) {
        if (ex.code === "ENOENT") {
          throw new Error(`No such file or directory: ${filePath}`);
        } else if (ex.response && ex.response.status === 400) {
          throw new Error(`400 Bad Request. Check for potentially invalid characters in the File Name: ${fileName}`);
        } else if (ex.response && ex.response.status === 500) {
          throw new Error(`500 Server Error. Double-check that the Folder ID is correct and the folder still exists: ${folderID}`);
        } else {
          console.log(ex);
          throw new Error(ex);
        }
      }
    },
  },
  async run() {
    if (!this.filePath.startsWith("/tmp/")) {
      throw new Error("File must be saved in the /tmp directory and File Path must begin with '/tmp/'");
    }
    const fileName = this.fileName || this.filePath.replace ("/tmp/", "");
    return await this.uploadFile(this.folderID, this.filePath, fileName);
  },
};
