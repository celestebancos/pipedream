const fs = require('fs')
const axios = require('axios')

module.exports = {
  name: 'Zoho CRM Download Attachment',
  description: 'Downloads an attachment from Zoho CRM based on the attachment id and saves it in the /tmp/ directory. Returns the file path of the saved file for later use.',
  key: 'zoho_crm_download_attachment',
  version: '1.0.0',
  type: 'action',
  props: {
    zoho_crm: {
      type: 'app',
      app: 'zoho_crm',
    },
    module:{
      type: 'string',
      label: 'Module',
      options: [
        {label: 'Leads', value: 'leads'},
        {label: 'Accounts', value: 'accounts'},
        {label: 'Contacts', value: 'contacts'},
        {label: 'Deals', value: 'deals'},
        {label: 'Products', value: 'products'},
        {label: 'Quotes', value: 'quotes'},
        {label: 'Sales Orders', value: 'salesorders'},
        {label: 'Purchase Orders', value: 'purchaseorders'},
        {label: 'Invoices', value: 'invoices'},
        {label: 'Campaigns', value: 'campaigns'},
        {label: 'Tasks', value: 'tasks'},
        {label: 'Cases', value: 'cases'},
        {label: 'Events', value: 'events'},
        {label: 'Solutions', value: 'solutions'},
        {label: 'Vendors', value: 'vendors'},
        {label: 'Price Books', value: 'pricebooks'},
        {label: 'Custom', value: 'custom'},
        {label: 'Notes', value: 'notes'},
      ]
    },
    record_id:{
      type: 'string',
      label: 'Record ID',
    },
    attachment_id:{
      type: 'string',
      label: 'Attachment ID',
    },
    file_name: {
      type: 'string',
      label: 'File Name (Optional)',
      optional: true,
    }
  },

  async run(){
    const {data: file} = await axios({
      url: `${this.zoho_crm.$auth.api_domain}/crm/v2/${this.module}/${this.record_id}/Attachments/${this.attachment_id}`,
      headers: {
        "Authorization": `Zoho-oauthtoken ${this.zoho_crm.$auth.oauth_access_token}`,
      },
      responseType: 'arraybuffer'
    })

    const file_path = `/tmp/${this.file_name ? this.file_name : this.attachment_id}`

    fs.writeFileSync(file_path, file)

    return file_path
  },
}