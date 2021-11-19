const common = require("../common/timer-based/base");

module.exports = {
  ...common,
  name: "Custom COQL Query",
  version: "0.0.1",
  key: "custom-coql-query",
  description: "Emit a new event for each record returned by the specified COQL query. See [COQL Query API Docs](https://www.zoho.com/crm/developer/docs/api/v2/COQL-Overview.html) to learn how to construct a query.",
  props: {
    ...common.props,
    select: {
      label: 'SELECT',
      description: "Enter a [comma-separated list of field API names]" +
        "(https://www.zoho.com/crm/developer/docs/api/v2/COQL-Overview.html) " +
        "to return as columns. Up to 50 columns are allowed. Unfortunately there is no shortcut to return all columns." +
        "\nE.g. `Full_Name, Email, Phone`",
      type: "string",
    },
    from: {
      label: "FROM",
      description: "Enter the name of a [CRM module]" +
        "(https://www.zoho.com/crm/developer/docs/api/v2/Get-Records-through-COQL-Query.html)." +
        "\nE.g. `Contacts`",
      type: "string",
    },
    where: {
      label: "WHERE",
      description: "Enter one or more [conditions]" +
        "(https://www.zoho.com/crm/developer/docs/api/v2/Get-Records-through-COQL-Query.html)." +
        "\nE.g. `(((Last_Name = 'Boyle') and (First_Name is not null)) and (Account_Name.Account_Name like 'Zylker'))`",
      type: "string",
    },
    order_by: {
      label: "ORDER BY",
      description: "Enter a [field API name]" +
        "(https://www.zoho.com/crm/developer/docs/api/v2/COQL-Overview.html) " +
        "followed by ASC or DESC." +
        "\nE.g. `Full_Name ASC`",
      type: "string",
    },
    // max_records: {
    //   label: "Max Records to Emit",
    //   description: "Enter the maximum number of records to emit or leave blank to emit all records matching the FROM condition."
    //     "\nE.g. `10`",
    //   type: "integer",
    // },
  },
  type: "source",
  methods: {
    generateMeta(record = {}){
      return {
        id: record.id,
        summary: record.id
      }
    },
    async processEvent(event){
      const select = 'SELECT ' + this.select
      const from = 'FROM ' + this.from
      const where = 'WHERE ' + this.where
      const order_by = 'ORDER BY ' + this.order_by
      const query = [select, from, where, order_by].join('\n')
      // const max_records = this.max_records

      const coql_records = await this.zoho_crm.postCOQLQuery(query)
      if(coql_records.length > 0){
        console.log(`${coql_records.length} records found for query \n${query}`)
      }
      const first_result = coql_records[0]
      this.$emit(first_result, this.generateMeta(first_result));
    },
  },
};
