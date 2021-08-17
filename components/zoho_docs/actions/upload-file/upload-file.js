const zohoDocs = require("../../zoho_docs.app.js");
const axios = require("axios");
const FormData = require("form-data");
const fs = require("fs");

module.exports = {
  name: "Upload File",
  description: "Upload a file to the specified folder.",
  key: "upload_file",
  version: "0.1.12",
  type: "action",
  props: {
    zohoDocs,
    folderID: {
      type: "string",
      label: "Folder ID",
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
