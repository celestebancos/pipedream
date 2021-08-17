const zoho_docs = require('../../zoho_docs.app.js')
const axios = require('axios')
const FormData = require('form-data')
const fs = require('fs')

module.exports = {
	name: 'Upload File',
	description: 'Upload a file to the specified folder.',
	key: 'upload_file',
	version: '0.1.12',
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
		try{
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
		} catch(ex){
			if(ex.code === 'ENOENT'){
				throw new Error(`No such file or directory: ${file_path}`)
			} else if(ex.response && ex.response.status === 400){
				throw new Error(`400 Bad Request. Check for potentially invalid characters in the File Name: ${file_name}`)
			} else if (ex.response && ex.response.status === 500){
				throw new Error(`500 Server Error. Double-check that the Folder ID is correct and the folder still exists: ${folder_id}`)
			} else {
				console.log(ex)
				throw new Error(ex)
			}
		}
}
	},
	async run(){
		if(!this.file_path.startsWith('/tmp/')){
			throw new Error("File must be saved in the /tmp directory and File Path must begin with '/tmp/'")
		}
		const file_name = this.file_name || this.file_path.replace ('/tmp/', '')
		return await this.uploadFile(this.folder_id, this.file_path, file_name)
	},
}
