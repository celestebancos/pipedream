const airtable = require("../../airtable.app.js")
const common = require("../common.js")

module.exports = {
	key: 'sync_record',
	name: 'Sync Record',
	description: 'Updates a record in Airtable to sync it with a record from an external source. ' + 
	'If no existing Airtable record matches the source record, a new Airtable record will be created. ' + 
	'In either case, the matching record will be returned.',
	version: '0.0.25',
	type: 'action',
	props: {
    ...common.props,
		source_record : {
			type: 'object',
			label: 'Source Record',
		},
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
	},
	methods: {
		table(){
			return this.airtable.base(this.baseId)(this.tableId)
		},
		async checkForExistingRecord(filterByFormula){
			const config = {
				filterByFormula,
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
		async createNewRecord(fields){
			const airtable_record = await this.table().create(fields)
			return airtable_record
		}
	},
	async run(){
		const existing_record = await this.checkForExistingRecord(this.match_criteria)
		if(existing_record){
			//update existing record?
			return existing_record
		} else {
			//create new record
			const source = this.source_record
			const fields = {
				'Name': source.DisplayName,
				'QB Customer Name': source.DisplayName,
				'QB Customer ID': source.Id,
			}
			const new_record = await this.createNewRecord(fields)
			return new_record
		}
	},
}