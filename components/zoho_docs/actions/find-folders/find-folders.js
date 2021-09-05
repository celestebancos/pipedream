const zohoDocs = require("../../zoho_docs.app.js");
const common = require("../common.js");

module.exports = {
  name: "Find Folders",
  description: "Search for folders by name.",
  key: "find_folders",
  version: "0.4.6",
  type: "action",
  props: {
    ...common.props,
    searchTerm: {
      type: "string",
      label: "Search Term (Optional)",
      description: "Any folder that contains the search term in its name will be returned. Leave blank to get all folders.",
      optional: true,
    },
    caseSensitive: {
      type: "boolean",
      label: "Case Sensitive",
      default: true,
    },
    parentFolder: {
      propDefinition: [
        zohoDocs,
        "folder",
      ],
      label: "Folder to Search In (Optional)",
      description: "Leave this blank to search in the root folder. " +
      "Folders in the Zoho Docs *Shared with Me* folder are not available from the dropdown " +
      "and must be entered as objects with a *FOLDER_ID* property: " +
      "\n`{{ {FOLDER_ID: \"ell0dptvw5ilwndfeqp3bupdjfzp48a7s0j4f\"} }}` ",
      optional: true,
    },
    searchSubfolders: {
      type: "boolean",
      label: "Search All Subfolders",
      default: false,
    },
  },
  methods: {
    async getAllFolders(parentFolders) {
      const folderLists = await Promise.all(parentFolders.map(async (folder) => {
        return await this.zohoDocs.getFolders(folder.FOLDER_ID);
      }));
      const folders = folderLists.flat();
      if (folders.length === 0) {
        return [];
      } else if (!this.searchSubfolders) {
        return folders;
      } else {
        const subFolders = await this.getAllFolders(folders);
        return folders.concat(subFolders);
      }
    },
  },
  async run() {
    if(this.parentFolder){
      this.zohoDocs.validateFolderProp(this.parentFolder, 'Folder to Search In')
    }
    const initialParentFolder = this.parentFolder || this.zohoDocs.getRootFolder();

    // const rootFolder = {
    //   FOLDER_ID: this.parentFolder
    //     ? this.parentFolder.FOLDER_ID
    //     : 1,
    // };
    const folders = await this.getAllFolders([
      initialParentFolder,
    ]);

    const matchingFolders = folders.filter((folder) => {
      if (this.caseSensitive) {
        return folder.FOLDER_NAME.includes(this.searchTerm);
      } else {
        return folder.FOLDER_NAME.toLowerCase().includes(this.searchTerm.toLowerCase());
      }
    });

    const subfoldersText = this.searchSubfolders
      ? " and all subfolders"
      : "";
    const locationText = initialParentFolder.FOLDER_NAME + subfoldersText;
    if (matchingFolders.length) {
      const lines = [
        `Folders containing '${this.searchTerm}' found in ${locationText}:`,
        ...matchingFolders.map((folder) => folder.FOLDER_NAME),
      ];
      console.log(lines.join("\n"));
    } else {
      console.log(`Unable to find any folders containing '${this.searchTerm}' when searching in ${locationText}.`);
    }
    return matchingFolders;
  },
};
