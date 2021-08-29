const axios = require("axios");

module.exports = {
  type: "app",
  app: "zoho_docs",
  propDefinitions: {
    folderId: {
      type: "string",
      label: "Folder",
      description: "Choose a folder from the dropdown or turn structured mode off to enter a folder ID directly. " +
      "Any folders in *Shared with Me* must be entered by ID as they will not be available on the dropdown.",
      async options({prevContext}){
        const getFolders = this.getFolders
        const options = []

        // Put the root folder in as the first option on the dropdown
        // and set it as the first parent folder to use when getting subfolders
        if(prevContext.parent_folders === undefined){
          const root_folder = {label: 'Zoho Docs', value: null}
          prevContext.parent_folders = [root_folder]
          options.push(root_folder)
        }

        // Get subfolders for each item in the list of parent folders and convert them all to options
        const pending_option_lists = prevContext.parent_folders.map(folder => getOptions(folder))
        const new_options = (await Promise.all(pending_option_lists)).flat().sort(sortByLabel)
        options.push(...new_options)

        // Return the new options and use them as the list of parent folders next time
        return {
          options,
          context: {parent_folders: new_options}
        }

        // Call the Zoho Docs API to get a list of folders inside each parent folder
        // and convert them all to options
        async function getOptions(parent_folder){
          const folders = await getFolders(parent_folder.value)
          const options = folders.map(folder => convertToOption(folder, parent_folder.label))
          return options
        }

        // Convert a folder object returned by the Zoho Docs API into a label/value option object
        function convertToOption(folder, parent_name){
          return {
            label: parent_name  + ' > ' + folder.FOLDER_NAME,
            value: folder.FOLDER_ID,
          }
        }

        function sortByLabel(option_A, option_B){
          const label_A = option_A.label.toLowerCase()
          const label_B = option_B.label.toLowerCase()
          if(label_A < label_B){
            return -1
          } else if(label_B > label_A){
            return 1
          } else {
            return 0
          }
        }
      },
    },},
  methods: {
    async getFolders(parent_folder_id){
      const {data} = await axios({
        method: "get",
        url: "https://apidocs.zoho.com/files/v1/folders",
        headers: {
          "Authorization": `Zoho-oauthtoken ${this.$auth.oauth_access_token}`,
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
  },
};
