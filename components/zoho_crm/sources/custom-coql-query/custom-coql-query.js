const common = require("../common/timer-based/base");

module.exports = {
  ...common,
  name: "Custom COQL Query",
  version: "0.0.1",
  key: "custom-coql-query",
  description: "Emit a new event for each record returned by the specified COQL query.",
  props: {
    ...common.props,
    query: {
      label: 'COQL Query',
      description: 'Enter the COQL query to generate an event for each record returned by the query. See [COQL Query API Docs](https://www.zoho.com/crm/developer/docs/api/v2/COQL-Overview.html) to learn how to construct a query.',
      type: 'string',
    }
  },
  type: "source",
  methods: {
    generateMeta(){
      return {
        id: 'placeholder',
        summary: 'This is the summary.'
      }
    },
    async processEvent(event){
      const query = `SELECT Account_Name, Shipping_Contact, Shipping_Contact_Old, Shipping_Phone, Shipping_Email 
        FROM Accounts 
        WHERE Shipping_Contact is null and (Shipping_Contact_Old is not null or (Shipping_Phone is not null or Shipping_Email is not null))`

      const coql_records = await this.zoho_crm.postCOQLQuery(query)
      const first_result = coql_records[0]
      // const first_result = {query}
      const result = {
        event: first_result
      }
      const meta = this.generateMeta()
      this.$emit(result, meta);
    },
  },
  // async run(event) {
  //   this.$emit(
  //     { event },
  //     {
  //       summary: "Hello, world!",
  //       ts: Date.now(),
  //     }
  //   );
  // },
};
