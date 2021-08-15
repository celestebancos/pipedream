const airtable = require("../../airtable.app.js")
const common = require("../common.js")

module.exports = {
	key: 'sync_record',
	name: 'Sync Record',
	description: 'Updates a record in Airtable to sync it with a record from an external source. ' + 
	'If no existing Airtable record matches the source record, a new Airtable record will be created. ' + 
	'In either case, the matching record will be returned.',
	version: '0.0.41',
	type: 'action',
	props: {
		...common.props,
		match_criteria: {
			propDefinition: [
				airtable,
				"filterByFormula",
			],
			label: "Target Record Match Criteria",
			description: "Enter an [Airtable formula](https://support.airtable.com/hc/en-us/articles/203255215-Formula-Field-Reference) " + 
			"to determine whether a given Airtable record in the selected *Base* and *Table* is a match for the *Source Record* indicated above. \n" + 
			"Example: `{Third Party ID} = '{{steps.source_record.id}}'`"
		},
		record: {
			propDefinition: [
				airtable,
				'record'
			],
			label: 'Fields to Sync',
		},
	},
	methods: {
		table(){
			return this.airtable.base(this.baseId)(this.tableId)
		},
		async checkForExistingRecords(filterByFormula){
			const config = {
				filterByFormula,
			}
			const matching_records = []
			await this.table().select(config).eachPage((records, fetchNextPage) => {
				records.forEach(record => {
					matching_records.push(record._rawJson)
				})
				fetchNextPage()
			})
			return matching_records
		},
		async updateExistingRecord(id, fields){
			const response = await this.table().update([{id,fields}])
			return response[0]._rawJson
		}
	},
	async run(){
		const existing_records = await this.checkForExistingRecords(this.match_criteria)
		if(existing_records){
			if(existing_records.length > 1){
				throw new Error (`Multiple matches for ${this.match_criteria} (${existing_records.length} matches found)`)
			} else {
				const updated_record = await this.updateExistingRecord(existing_records[0].id, this.record)
				return updated_record
			}
		} else {
			const new_record = await this.table().create(this.record)
			return new_record
		}
	},
}