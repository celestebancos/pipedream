const zohoDocs = require("../../zoho_docs.app.js");
const common = require("../common.js");

module.exports = {
	name: "Find Folders",
	description: "Search for folders by name.",
	key: "find_folders",
	version: "0.1.5",
	type: "action",
	props: {
    ...common.props,
    searchTerm: {
    	type: 'string',
    	label: 'Search Term (Optional)',
    	description: 'Any folder that contains the search term in its name will be returned. Leave blank to get all folders.',
    	optional: true,
    },
    parentFolderId: {
      propDefinition: [
        zohoDocs,
        "folderId",
      ],
      label: "Folder to Search In (Optional)",
      description: "Leave this blank to search in the root folder. " +
      "Choose a folder from the dropdown or turn structured mode off to enter a folder ID directly. " +
      "Any folders in *Shared with Me* must be entered by ID as they will not be available on the dropdown.",
      optional: true,
    },
    caseSensitive:{
    	type: 'boolean',
    	label: 'Case Sensitive',
    	default: true
    }
	},
	methods: {
	},
	async run() {
		const folders = await this.zohoDocs.getFolders(this.parentFolderId)
		const matching_folders = folders.filter(folder => {
			if(this.caseSensitive){
				return folder.FOLDER_NAME.includes(this.searchTerm)
			} else {
				return folder.FOLDER_NAME.toLowerCase().includes(this.searchTerm.toLowerCase())
			}
		})
		return matching_folders
	},
};
