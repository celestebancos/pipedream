export default {
  name: "Custom Coql Query",
  version: "0.0.1",
  key: "custom-coql-query",
  description: "Emit new events on each...",
  props: {},
  type: "source",
  methods: {},
  async run(event) {
    this.$emit(
      { event },
      {
        summary: "Hello, world!",
        ts: Date.now(),
      }
    );
  },
};
