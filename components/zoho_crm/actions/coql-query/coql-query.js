const zoho_crm = require("../../zoho_crm.app.js");

module.exports = {
  name: "COQL Query",
  version: "0.0.25",
  key: "zoho_crm-coql-query",
  description: "Get records via a COQL query. See [COQL Query API Docs](https://www.zoho.com/crm/developer/docs/api/v2/COQL-Overview.html) for more details on query construction.",
  props: {
    zoho_crm,
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
  },
  type: "action",
  methods: {
  },
  async run({ $ }) {
    const select = 'SELECT ' + this.select
    const from = 'FROM ' + this.from
    const where = 'WHERE ' + this.where
    const order_by = 'ORDER BY ' + this.order_by
    const query = [select, from, where, order_by].join('\n')
    // const max_records = this.max_records

    const records = await this.zoho_crm.postCOQLQuery(query)
    $.export("query", query);
    $.export("count", records.length);
    return records
  },
};
