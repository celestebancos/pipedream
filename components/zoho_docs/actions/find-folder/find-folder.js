const zohoDocs = require("../../zoho_docs.app.js");
const common = require("../common.js");

module.exports = {
	name: "Find Folder",
	description: "Search for a folder by name.",
	key: "find-folder",
	version: "0.0.3",
	type: "action",
	props: {
    ...common.props,
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
	},
	methods: {
	},
	async run() {
		// if(params.existing_folder_id){
		// 	return params.existing_folder_id
		// } else {
		// 	// find the deal folder if it's not already linked in Airtable
		// 	// compile a list of candidate folders (all the folders in Load Processing and Loads in Storage)
		// 	const load_processing_folder_id = process.env.ZOHO_DOCS_LOAD_PROCESSING_FOLDER_ID
		// 	const load_processing = await getFolders(load_processing_folder_id)
		// 	const loads_in_storage = await getFolders(load_processing.find(folder => folder.name.includes('Loads in Storage')).id)
		// 	const all_folders = load_processing.concat(loads_in_storage)

		// 	const po_number = params.po_number.replace('/', ' ')
		// 	const [matching_folder] = all_folders.filter(folder => folder.name.includes(po_number))
		// 	if(matching_folder){
		// 		console.log(matching_folder.name)
		// 		return matching_folder.id
		// 	} else {
		// 		throw new Error(`No folder found in Zoho Docs for PO ${po_number}`)
		// 	}
		// }

		// async function getFolders(folder_id){
		// 	// console.log(`Getting list of folders in folder with id ${folder_id}`)
		// 	const response = await require("@pipedreamhq/platform").axios(this, {
		// 		method: "get",
		// 		url: `https://apidocs.zoho.com/files/v1/folders`,
		// 		headers: {
		// 			"Authorization": `Zoho-oauthtoken ${auths.zoho_docs.oauth_access_token}`,
		// 		},
		// 		params: {
		// 			folderid: folder_id,
		// 		},
		// 	})
		// 	const folders = response.FOLDER.map(folder => {
		// 		return {
		// 			name: folder.FOLDERNAME,
		// 			id: folder.FOLDERID,
		// 		}
		// 	})
		// 	return folders
		// }
	},
};
