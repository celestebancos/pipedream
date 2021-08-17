const zoho_docs = require('../../zoho_docs.app.js')

module.exports = {
	name: 'Upload File',
	description: 'Upload a file to the specified folder.',
	key: 'upload_file',
	version: '0.0.0',
	type: 'action',
	props: {
		zoho_docs,
	},
	methods: {},
	async run(){},
}
