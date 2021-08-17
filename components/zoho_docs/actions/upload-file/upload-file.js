const zoho_docs = require('../../zoho_docs.app.js')
const axios = require('axios')
const FormData = require('form-data')
const fs = require('fs')

module.exports = {
	name: 'Upload File',
	description: 'Upload a file to the specified folder.',
	key: 'upload_file',
	version: '0.1.2',
	type: 'action',
	props: {
		zoho_docs,
		folder_id: {
			type: 'string',
			label: 'Folder ID',
		},
		file_path: {
			type: 'string',
			label: 'File Path',
		},
		file_name: {
			type: 'string',
			label: 'File Name (Optional)',
			optional: true,
		},
	},
	methods: {
		async uploadFile(folder_id, file_path, file_name){
    const data = new FormData()
    data.append('content', await fs.createReadStream(file_path))
    const response = await axios({
        method: "post",
        url: `https://apidocs.zoho.com/files/v1/upload`,
        headers: {
            "Authorization": `Zoho-oauthtoken ${this.zoho_docs.$auth.oauth_access_token}`,
            'Content-Type': 'multipart/form-data',
            ...data.getHeaders(),
        },
        params: {
            filename: file_name,
            fid: folder_id,
        },
        data: data,
    })
    const [{documentname}, {uploaddocid}] = response.data.response[2].result
    return {
        name: documentname,
        id: uploaddocid,
    }
}
	},
	async run(){
		const file_name = this.file_name || this.file_path.replace ('/tmp/', '')
		return await this.uploadFile(this.folder_id, this.file_path, file_name)
	},
}
