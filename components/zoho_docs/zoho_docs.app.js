const axios = require("axios");

module.exports = {
  type: "app",
  app: "zoho_docs",
  propDefinitions: {
    folder: {
      type: "string",
      label: "Folder",
      description: "Folders in the Zoho Docs *Shared with Me* folder are not available from the dropdown " +
      "and must be entered as objects with a *FOLDER_ID* property: " +
      "\n`{{ {FOLDER_ID: \"ell0dptvw5ilwndfeqp3bupdjfzp48a7s0j4f\"} }}` ",
      async options({ prevContext }) {
        if (prevContext.parentFolders === undefined) {
          const {
            options,
            context,
          } = await this.getFolderOptions(prevContext);
          // Set the root folder as the first option on the dropdown
          const rootFolder = {
            label: "Zoho Docs",
            value: this.getRootFolder(),
          };
          const optionsWithRootFolder = [
            rootFolder,
            ...options,
          ];
          return {
            options: optionsWithRootFolder,
            context,
          };
        } else {
          // Don't include the root folder in additional sets of options
          return await this.getFolderOptions(prevContext);
        }
      },
    },
    nonRootFolder: {
      type: "string",
      label: "Folder",
      description: "Folders in the Zoho Docs *Shared with Me* folder are not available from the dropdown " +
      "and must be entered as objects with a *FOLDER_ID* property: " +
      "\n`{{ {FOLDER_ID: \"ell0dptvw5ilwndfeqp3bupdjfzp48a7s0j4f\"} }}` ",
      async options({ prevContext }) {
        // Don't include the root folder as an option on the dropdown
        return await this.getFolderOptions(prevContext);
      },
    },
  },
  methods: {
    getRootFolder() {
      return {
        FOLDER_NAME: "Zoho Docs",
        FOLDER_ID: 1,
      };
    },
    async getFolderOptions(prevContext) {
      const getFolders = this.getFolders;

      // Set the root folder as the first parent folder to use when getting subfolders
      // if there are no parent folders from the previous context
      const parentFolders = (prevContext.parentFolders !== undefined)
        ? prevContext.parentFolders
        : [
          {
            label: "Zoho Docs",
            value: this.getRootFolder(),
          },
        ];

      // Get subfolders for each item in the list of parent folders and convert them all
      // to options
      const pendingOptionLists = parentFolders.map((folder) => getOptions(folder));
      const newOptions = (await Promise.all(pendingOptionLists)).flat().sort(sortByLabel);

      // Return the new options and use them as the list of parent folders next time
      return {
        options: newOptions,
        context: {
          parentFolders: newOptions,
        },
      };

      // Call the Zoho Docs API to get a list of folders inside each parent folder
      // and convert them all to options
      async function getOptions(parentFolder) {
        const folders = await getFolders(parentFolder.value.FOLDER_ID);
        const options = folders.map((folder) => convertToOption(folder, parentFolder.label));
        return options;
      }

      // Convert a folder object returned by the Zoho Docs API into a label/value option object
      function convertToOption(folder, parentName) {
        return {
          label: parentName  + " > " + folder.FOLDER_NAME,
          value: folder,
        };
      }

      function sortByLabel(optionA, optionB) {
        const labelA = optionA.label.toLowerCase();
        const labelB = optionB.label.toLowerCase();
        if (labelA < labelB) {
          return -1;
        } else if (labelB > labelA) {
          return 1;
        } else {
          return 0;
        }
      }
    },
    async getFolders(parentFolderId) {
      // The ID of the Zoho Docs root folder is 1 but the folderid request param must be null
      // to get the list of folders in the root folder
      const folderId = parentFolderId === 1
        ? null
        : parentFolderId;
      const { data } = await axios({
        method: "get",
        url: "https://apidocs.zoho.com/files/v1/folders",
        headers: {
          "Authorization": `Zoho-oauthtoken ${this.$auth.oauth_access_token}`,
        },
        params: {
          folderid: folderId,
        },
      });
      // Ihe Zoho Docs API returns two different schemas depending on whether the folderid
      // request param was defined.
      if (data.FOLDER) {
        // If a folderid was given, the response contains the subfolders of that folder.
        // The response has a FOLDER property and the folders have FOLDERNAME and FOLDERID
        // properties (no underscores).
        const standardizedFolders = data.FOLDER.map((folder) => {
          folder.FOLDER_NAME = folder.FOLDERNAME;
          folder.FOLDER_ID = folder.FOLDERID;
          return folder;
        });
        return standardizedFolders;
      } else if (data.length) {
        // If the folderid param was not defined, the response contains subfolders of
        // the user's root folder.
        // The response is an array with the first item being meta-data and the rest of the items
        // being folder objects (wrapped in arrays) with FOLDER_NAME and FOLDER_ID properties.
        const [
          ,
          ...folders
        ] = data;
        return folders.map((folder) => folder[0]);
      } else {
        throw new Error(`Folder ID: ${parentFolderId} Data: ${JSON.stringify(data)}`);
      }
    },
    validateFolderProp(prop, prop_name){
      if(!prop || !prop.FOLDER_ID){
         console.log(`${prop_name}: `, prop)
       if(typeof prop === 'string'){
          throw new Error(`'${prop_name}' is a string instead of an object. If you entered a step reference or an object literal, ` +
            `make sure to wrap it in double curly braces so it is not evaluated as a string: {{ {FOLDER_ID: folder_id_value} }}`)
        } else {
          throw new Error(`'${prop_name}' must be a single object and must have a FOLDER_ID property.`)
        }
      }
    },
  },
};
