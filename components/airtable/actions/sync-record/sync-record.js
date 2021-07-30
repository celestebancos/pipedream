const airtable = require("../../airtable.app.js")
const common = require("../common.js")

module.exports = {
	key: 'sync_record',
	name: 'Sync Record',
	description: 'Update or create a record as needed to sync with an external source.',
	version: '0.0.3',
	type: 'action',
	props: {
    ...common.props,
		source_record : {
			type: 'object',
			label: 'Source Record',
		}
	},
	methods: {
		table(){
			return this.airtable.base(this.baseId)(this.tableId)
		},
		async checkForExistingRecord(entity_type, entity_id){
			const config = {
				filterByFormula: `{QB ${entity_type} ID} = ${entity_id}`,
			}
			const data = []
			await this.table().select(config).eachPage((records, fetchNextPage) => {
				records.forEach(record => {
					data.push(record._rawJson)
				})
				fetchNextPage()
			})
			const first_matching_record = data[0]
			return first_matching_record
		},
		async createNewRecord(entity_type, record_data){
			const qb_name_field_name = `QB ${entity_type} Name`  // QB Customer Name or QB Vendor Name
			const qb_id_field_name = `QB ${entity_type} ID`			 // QB Customer ID or QB Vendor ID
			const fields = {
				'Name': record_data.DisplayName,
				[qb_name_field_name]: record_data.DisplayName,
				[qb_id_field_name]: record_data.Id,
			}
			const airtable_record = await this.table().create(fields)
			return airtable_record
		}
	},
	async run(){
		const {entity_type, record_data} = this.source_record
		const entity_id = record_data.Id

		const existing_record = await this.checkForExistingRecord(entity_type, entity_id)
		if(existing_record){
			//update existing record?
			return existing_record
		} else {
			//create new record
			const new_record = await this.createNewRecord(entity_type, record_data)
			return new_record
		}
	},
}