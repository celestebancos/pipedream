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
    generateMeta(record){
      return {
        id: record.id,
        summary: record.id
      }
    },
    async processEvent(event){
      const query = this.query
      const coql_records = await this.zoho_crm.postCOQLQuery(query)
      const first_result = coql_records[0]
      this.$emit(first_result, this.generateMeta(first_result));
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
