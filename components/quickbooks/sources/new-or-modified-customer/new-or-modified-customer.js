const quickbooks = require("../../quickbooks.app");
const common = require("../common");

const sourceEntity = "Customer";

const supportedOperations = common.methods.getSupportedOperations(sourceEntity);
const supportedOperationsList = common.methods.getOperationsDescription(supportedOperations);

module.exports = {
  ...common,
  key: "quickbooks-new-or-modified-customer",
  name: `New or Modified Customer (${supportedOperationsList})`,
  description: `Emit Customers that are ${supportedOperationsList.toLowerCase()}. Visit the documentation page to learn how to configure webhooks for your QuickBooks company: https://developer.intuit.com/app/developer/qbo/docs/develop/webhooks`,
  version: "0.0.1",
  type: "source",
  props: {
    ...common.props,
    webhook_verifier_token: {
      propDefinition: [
        quickbooks,
        "webhook_verifier_token",
      ],
    },
    operations_to_emit: {
      propDefinition: [
        quickbooks,
        "webhook_operations",
      ],
      // overwrite the default options from the propDefinition to list only the options supported
      // by this source's entity
      options: supportedOperations,
      default: supportedOperations,
    },
  },
  methods: {
    ...common.methods,
    async validateAndEmit(event, entity) {
      // only emit events that match the specified entity name and operation
      // but if the operations prop is left empty, emit all events rather
      // than filtering them all out
      // (it would a hassle for the user to select every single option
      // if they wanted to emit everything)
      if (entity.name !== sourceEntity) {
        console.log(`${entity.name} webhook received and ignored, since it is not a Customer`);
      } else if (this.operations_to_emit.length > 0
        && !this.operations_to_emit.includes(entity.operation)) {
        console.log(`Operation '${entity.operation}' not found in list of selected Operations`);
      } else {
        await this.emitEvent(event, entity);
      }
    },
  },
};
