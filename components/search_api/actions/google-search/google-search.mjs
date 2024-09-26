import app from "../../search_api.app.mjs";

export default {
  key: "search_api-google-search",
  name: "Google Search API",
  description: "Google Search API uses /api/v1/search?engine=google API endpoint to scrape real-time results. [See the documentation](https://www.searchapi.io/docs/google)",
  version: "0.0.1",
  type: "action",
  props: {
    app,
    q: {
      propDefinition: [
        app,
        "q",
      ],
    },
    device: {
      propDefinition: [
        app,
        "device",
      ],
    },
    domain: {
      propDefinition: [
        app,
        "domain",
      ],
    },
    hl: {
      propDefinition: [
        app,
        "hl",
      ],
    },
    gl: {
      propDefinition: [
        app,
        "gl",
      ],
    },
    timePeriod: {
      propDefinition: [
        app,
        "timePeriod",
      ],
    },
    num: {
      propDefinition: [
        app,
        "num",
      ],
    },
    page: {
      propDefinition: [
        app,
        "page",
      ],
    },
  },
  async run({ $ }) {
    const engine = "google";
    const params = {
      q: this.q,
      device: this.device,
      domain: this.domain,
      hl: this.hl,
      gl: this.gl,
      time_period: this.timePeriod,
      num: this.num,
      page: this.page,
    };

    const result = await this.app.search({
      $,
      params,
      engine,
    });

    $.export("$summary", `Successfully searched "${this.q} on engine ${engine}"`);

    return result;
  },
};
