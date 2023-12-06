import airtable from "../../airtable_oauth.app.mjs";
import common from "../common/common.mjs";

export default {
	key: "airtable-get-deal-mjs",
	name: "Get Airtable Deal (New)",
	description: "Enter a record ID to get a deal from the Airtable Deal Tracker base. All sub-records (e.g. HP PO, Shipment) will be returned as well.",
	version: "0.0.13",
	type: "action",
	props: {
		...common.props,
		// baseId and tableId get imported from common.props but I'm overwriting them so I can include default values
		// This requires that I change the type from the fancy $.airtable types to simple string types
		baseId: { 
			type: "string",
			default: 'appquN7zlOyyK8sMF',
		},
		tableId: {
			type: "string",
			default: 'tblnXgM0IrtGxW7V7',
		},
		recordId: {
			propDefinition: [
				airtable,
				"recordId",
			],
		},
	},
	async run({ $ }) {
		const airtable = this.airtable
		const AIRTABLE_RATE_LIMIT_DELAY = 250 //milliseconds — Airtable API allows 5 requests per second
		airtable.validateRecordID(this.recordId);
		// const base = this.airtable.base(this.baseId);
		const baseId = this.baseId?.value ?? this.baseId;
		const {tables} = await this.airtable.listTables({baseId})

		const deal_id = this.recordId
		const deal = await get_record_async('Deals', deal_id)

		const owner_id = get_linked_record_id(deal, 'Deal Owner')
		const owner = await get_record_async('Sales Reps', owner_id)

		const hp_po_id = get_linked_record_id(deal, 'HP PO')
		const hp_po = await get_record_async('Purchase Orders', hp_po_id)

		const supplier_id = hp_po ? get_linked_record_id(hp_po, 'Account') : get_linked_record_id(deal, 'Supplier')
		const supplier = await get_record_async('Accounts', supplier_id)

		const customer_po_id = get_linked_record_id(deal, 'Customer PO')
		const customer_po = await get_record_async('Purchase Orders', customer_po_id)

		const customer_id = customer_po ? get_linked_record_id(customer_po, 'Account') : get_linked_record_id(deal, 'Customer')
		const customer = await get_record_async('Accounts', customer_id)

		const toll_po_id = get_linked_record_id(deal, 'Toll PO')
		const toll_po = await get_record_async('Purchase Orders', toll_po_id)

		const toll_processor_id = get_linked_record_id(toll_po, 'Account')
		const toll_processor = await get_record_async('Accounts', toll_processor_id)

		const shipment_id = get_linked_record_id(deal, 'Primary Shipment')
		const shipment = await get_record_async('Shipments', shipment_id)

		const carrier_id = get_linked_record_id(shipment, 'Carrier')
		const carrier = await get_record_async('Accounts', carrier_id)

		const pickup_location_id = get_linked_record_id(shipment, 'Pickup Location')
		const pickup_location = await get_record_async('Locations', pickup_location_id)

		const delivery_location_id = get_linked_record_id(shipment, 'Delivery Location')
		const delivery_location = await get_record_async('Locations', delivery_location_id)

		$.export("$summary", `Fetched deal "${deal_id}"`);
		return {
			deal,
			owner,
			hp_po,
			supplier,
			customer_po,
			customer,
			toll_po,
			toll_processor,
			shipment,
			carrier,
			pickup_location,
			delivery_location,
		}

		function get_table_id(table_name){
			const [table] = tables.filter(table => table.name === table_name)
			return table.id
		}

		async function get_record_async(table, id){
			// console.log(`Getting ${table} record with id ${id}`)
			if(id){
				try{
					const table_id = get_table_id(table)
					const context = {
						baseId,
						tableId: table_id,
						recordId: id,
					}
					const record = await airtable.getRecord(context)
					record.fields.id = record.id
					await new Promise(resolve => setTimeout(resolve, AIRTABLE_RATE_LIMIT_DELAY))
					return record.fields
				} catch(ex){
					console.log(ex.message)
					return null
				}
			} else {
				return null
			}
		}

		function get_linked_record_id(record, field_name){
			// console.log(`Getting ${field_name} id from record ${record}`)
			if(record){
				return record[field_name] ? record[field_name][0] : null
			} else {
				return null
			}
		}
	},
};
