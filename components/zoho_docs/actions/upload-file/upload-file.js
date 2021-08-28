const zohoDocs = require("../../zoho_docs.app.js");
const axios = require("axios");
const FormData = require("form-data");
const fs = require("fs");

module.exports = {
  name: "Upload File",
  description: "Upload a file to the specified folder.",
  key: "upload_file",
  version: "0.3.6",
  type: "action",
  props: {
    zohoDocs,
    folderID: {
      type: "string",
      label: "Folder",
      description: "Choose a folder from the dropdown or turn structured mode off to enter a folder ID directly.",
      async options({prevContext}){
        const folders = await this.getSubfolders(prevContext.parent_folder_id)
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

        const next_folder_id = folders[0] ? getId(folders[0]) : prevContext.parent_folder_id
        return {
          options,
          context: {parent_folder_id: next_folder_id},
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
      if(data.FOLDER){
        return data.FOLDER
      } else if (data.length){
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
