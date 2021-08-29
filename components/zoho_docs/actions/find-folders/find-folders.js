const zohoDocs = require("../../zoho_docs.app.js");
const common = require("../common.js");

module.exports = {
	name: "Find Folders",
	description: "Search for folders by name.",
	key: "find_folders",
	version: "0.2.15",
	type: "action",
	props: {
		...common.props,
		searchTerm: {
			type: 'string',
			label: 'Search Term (Optional)',
			description: 'Any folder that contains the search term in its name will be returned. Leave blank to get all folders.',
			optional: true,
		},
		caseSensitive: {
			type: 'boolean',
			label: 'Case Sensitive',
			default: true,
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
		searchSubfolders: {
			type: 'boolean',
			label: 'Search All Subfolders',
			default: false,
		}
	},
	methods: {
		async getAllFolders(parent_folders){
			const folder_lists = await Promise.all(parent_folders.map(folder => this.zohoDocs.getFolders(folder.FOLDER_ID)))
			const folders = folder_lists.flat()
			if(folders.length === 0){
				return []
			} else if(!this.searchSubfolders){
				return folders
			} else {
				const sub_folders = await this.getAllFolders(folders)
				return folders.concat(sub_folders)
			}
		}
	},
	async run() {
		const root_folder = {
			FOLDER_ID: this.parentFolderId
		}
		const folders = await this.getAllFolders([root_folder])

		const matching_folders = folders.filter(folder => {
			if(this.caseSensitive){
				return folder.FOLDER_NAME.includes(this.searchTerm)
			} else {
				return folder.FOLDER_NAME.toLowerCase().includes(this.searchTerm.toLowerCase())
			}
		})
		if(matching_folders.length){
			console.log('Folders found:\n', matching_folders.map(folder => folder.FOLDER_NAME).join('\n'))
		} else {
			const location_text = this.parentFolderId ? `https://docs.zoho.com/folder/${this.parentFolderId}` : 'Zoho Docs folder'
			const subfolders_text = this.searchSubfolders ? ' and all subfolders' : ''
			console.log(`Unable to find any folders containing '${this.searchTerm}' when searching in ${location_text}${subfolders_text}.`)
		}
		return matching_folders
	},
};
