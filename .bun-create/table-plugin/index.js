const observableAttributes = [
  "cellvalue",
  "rowvalue",
  "tablevalue",
  "tableschemavalue",
  "databaseschemavalue",
  "configuration",
  "metadata",
];

const OuterbaseEvent = {
  onSave: "onSave",
};

const OuterbaseColumnEvent = {
  onEdit: "onEdit",
  onStopEdit: "onStopEdit",
  onCancelEdit: "onCancelEdit",
  updateCell: "updateCell",
};

const OuterbaseTableEvent = {
  updateRow: "updateRow",
  deleteRow: "deleteRow",
  createRow: "createRow",
  getNextPage: "getNextPage",
  getPreviousPage: "getPreviousPage",
};

const configKeys = {
  imageKey: { title: "Image Key", type: "select" },
  optionalImagePrefix: { title: "Image Url Prefix (Optional)", type: "text" },
  titleKey: { title: "Title Key", type: "select" },
  descriptionKey: { title: "Description Key", type: "select" },
  subtitleKey: { title: "Subtitle Key", type: "select" },
};

class OuterbasePluginConfig_$PLUGIN_ID {
  tableValue = undefined;
  count = 0;
  page = 1;
  offset = 50;
  theme = "light";

  // Inputs from the configuration screen
  imageKey = undefined;
  optionalImagePrefix = undefined;
  titleKey = undefined;
  descriptionKey = undefined;
  subtitleKey = undefined;

  // Variables for us to hold state of user actions
  deletedRows = [];

  constructor(object) {
    for (const key in configKeys) {
      this[key] = object?.[key];
    }
  }

  toJSON() {
    const json = {};
    for (const key in configKeys) {
      json[key] = this[key];
    }

    return json;
  }
}

const triggerEvent = (fromClass, data) => {
  const event = new CustomEvent("custom-change", {
    detail: data,
    bubbles: true,
    composed: true,
  });

  fromClass.dispatchEvent(event);
};

const decodeAttributeByName = (fromClass, name) => {
  const encodedJSON = fromClass.getAttribute(name);
  const decodedJSON = encodedJSON
    ?.replace(/&quot;/g, '"')
    ?.replace(/&#39;/g, "'");
  return decodedJSON ? JSON.parse(decodedJSON) : {};
};

const templateTable = document.createElement("template");
templateTable.innerHTML = `
  <style>
      #theme-container {
          height: 100%;
      }
  
      #container {
          display: flex;
          flex-direction: column;
          height: 100%;
          overflow-y: scroll;
      }
  
      .grid-container {
          flex: 1;
          display: grid;
          grid-template-columns: repeat(4, minmax(0, 1fr));
          gap: 12px;
          padding: 12px;
      }
  
      .grid-item {
          position: relative;
          display: flex;
          flex-direction: column;
          background-color: transparent;
          border: 1px solid rgb(238, 238, 238);
          border-radius: 4px;
          box-shadow: 0 4px 4px 0 rgba(0, 0, 0, 0.05);
          overflow: clip;
      }
  
      .img-wrapper {
          height: 0;
          overflow: hidden;
          padding-top: 100%;
          box-sizing: border-box;
          position: relative;
      }
  
      img {
          width: 100%;
          vertical-align: top;
          position: absolute;
          top: 0;
          left: 0;
          height: 100%;
          object-fit: cover;
      }
  
      .contents {
          padding: 12px;
      }
  
      .title {
          font-weight: bold;
          font-size: 16px;
          line-height: 24px;
          font-family: "Inter", sans-serif;
          line-clamp: 2;
          margin-bottom: 8px;
      }
  
      .description {
          flex: 1;
          overflow: hidden;
          text-overflow: ellipsis;
          font-size: 14px;
          line-height: 20px;
          font-family: "Inter", sans-serif;
  
          display: -webkit-box;
          -webkit-line-clamp: 3;
          -webkit-box-orient: vertical;  
          overflow: hidden;
      }
  
      .subtitle {
          font-size: 12px;
          line-height: 16px;
          font-family: "Inter", sans-serif;
          color: gray;
          font-weight: 300;
          margin-top: 8px;
      }
  
      p {
          margin: 0;
      }
  
      .dark {
          #container {
              background-color: black;
              color: white;
          }
      }
  
      @media only screen and (min-width: 768px) {
          .grid-container {
              grid-template-columns: repeat(4, minmax(0, 1fr));
          }
      }
  
      @media only screen and (min-width: 1200px) {
          .grid-container {
              grid-template-columns: repeat(5, minmax(0, 1fr));
              gap: 20px;
          }
      }
  
      @media only screen and (min-width: 1400px) {
          .grid-container {
              grid-template-columns: repeat(6, minmax(0, 1fr));
              gap: 32px;
          }
      }
  </style>
  
  <div id="theme-container" class="dark">
      <div id="container">
          
      </div>
  </div>
  `;

class OuterbasePluginTable_$PLUGIN_ID extends HTMLElement {
  static get observedAttributes() {
    return observableAttributes;
  }

  config = new OuterbasePluginConfig_$PLUGIN_ID({});

  constructor() {
    super();

    this.shadow = this.attachShadow({ mode: "open" });
    this.shadow.appendChild(templateTable.content.cloneNode(true));
  }

  connectedCallback() {
    this.render();
  }

  attributeChangedCallback(name, oldValue, newValue) {
    this.config = new OuterbasePluginConfig_$PLUGIN_ID(
      decodeAttributeByName(this, "configuration")
    );
    this.config.tableValue = decodeAttributeByName(this, "tableValue");
    this.config.theme = decodeAttributeByName(this, "metadata").theme;

    if (this.config.theme) {
      const element = this.shadow.getElementById("theme-container");
      element.classList.remove("dark");
      element.classList.add(this.config.theme);
    }

    this.render();
  }

  render() {
    this.shadow.querySelector("#container").innerHTML = ``;

    // Do stuff with elements
  }
}

const templateConfiguration = document.createElement("template");
templateConfiguration.innerHTML = `
  <style>
      #configuration-container {
          display: flex;
          height: 100%;
          overflow-y: scroll;
          padding: 40px 50px 65px 40px;
      }
  
      .field-title {
          font: "Inter", sans-serif;
          font-size: 12px;
          line-height: 18px;
          font-weight: 500;
          margin: 0 0 8px 0;
      }
  
      select {
          width: 320px;
          height: 40px;
          margin-bottom: 16px;
          background: transparent;
          border: 1px solid #343438;
          border-radius: 8px;
          color: black;
          font-size: 14px;
          padding: 0 8px;
          cursor: pointer;
          background-image: url('data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" height="28" viewBox="0 -960 960 960" width="32"><path fill="black" d="M480-380 276-584l16-16 188 188 188-188 16 16-204 204Z"/></svg>');
          background-position: 100%;
          background-repeat: no-repeat;
          appearance: none;
          -webkit-appearance: none !important;
          -moz-appearance: none !important;
      }
  
      input {
          width: 320px;
          height: 40px;
          margin-bottom: 16px;
          background: transparent;
          border: 1px solid #343438;
          border-radius: 8px;
          color: black;
          font-size: 14px;
          padding: 0 8px;
      }
  
      button {
          border: none;
          background-color: #834FF8;
          color: white;
          padding: 6px 18px;
          font: "Inter", sans-serif;
          font-size: 14px;
          line-height: 18px;
          border-radius: 8px;
          cursor: pointer;
      }
  
      .preview-card {
          margin-left: 80px;
          width: 240px;
          background-color: white;
          border-radius: 16px;
          overflow: hidden;
      }
  
      .preview-card > img {
          width: 100%;
          height: 165px;
      }
  
      .preview-card > div {
          padding: 16px;
          display: flex; 
          flex-direction: column;
          color: black;
      }
  
      .preview-card > div > p {
          margin: 0;
      }
  
      .dark {
          #configuration-container {
              background-color: black;
              color: white;
          }
      }
  
      .dark > div > div> input {
          color: white !important;
      }
  
      .dark > div > div> select {
          color: white !important;
          background-image: url('data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" height="28" viewBox="0 -960 960 960" width="32"><path fill="white" d="M480-380 276-584l16-16 188 188 188-188 16 16-204 204Z"/></svg>');
      }
  </style>
  
  <div id="theme-container" class="dark">
      <div id="configuration-container">
          
      </div>
  </div>
  `;

class OuterbasePluginConfiguration_$PLUGIN_ID extends HTMLElement {
  static get observedAttributes() {
    return observableAttributes;
  }

  config = new OuterbasePluginConfig_$PLUGIN_ID({});

  constructor() {
    super();

    this.shadow = this.attachShadow({ mode: "open" });
    this.shadow.appendChild(templateConfiguration.content.cloneNode(true));
  }

  connectedCallback() {
    this.render();
  }

  attributeChangedCallback(name, oldValue, newValue) {
    this.config = new OuterbasePluginConfig_$PLUGIN_ID(
      decodeAttributeByName(this, "configuration")
    );
    this.config.tableValue = decodeAttributeByName(this, "tableValue");
    this.config.theme = decodeAttributeByName(this, "metadata").theme;

    if (this.config.theme) {
      const element = this.shadow.getElementById("theme-container");
      element.classList.remove("dark");
      element.classList.add(this.config.theme);
    }

    this.render();
  }

  render() {
    let firstRow = this.config.tableValue.length
      ? this.config.tableValue[0]
      : {};
    let keys = Object.keys(firstRow);

    if (
      !keys?.length === 0 ||
      !this.shadow.querySelector("#configuration-container")
    ) {
      return;
    }

    const configElements = [];
    for (const configKey in configKeys) {
      const value = configKeys[configKey];
      const elementHtml = [`<p class="field-title">${value.title}</p>`];
      if (value.type === "select") {
        elementHtml.push(`<select id="${configKey}">`);
        const options = keys.map(
          (key) =>
            `<option value="${key}" ${
              key === this.config[configKey] ? "selected" : ""
            }>${key}</option>`
        );
        elementHtml.push(...options, "</select>");
        configElements.push(elementHtml.join("\n"));
      } else if (value.type === "text") {
        elementHtml.push(`<input id="${configKey}" type="text" value="" />`);
        configElements.push(elementHtml.join("\n"));
      } else {
        console.log(
          `Unsupported config element type: ${value.type} for key: ${configKey}`
        );
      }
    }

    this.shadow.querySelector("#configuration-container").innerHTML = `
          <div style="flex: 1;">
              ${configElements.join("\n")}
  
              <div style="margin-top: 8px;">
                  <button id="saveButton">Save View</button>
              </div>
          </div>
  
          <div style="position: relative;">
              <div class="preview-card">
                  <img src="${
                    sample[this.config.imageKey]
                  }" width="100" height="100">
  
                  <div>
                      <p style="margin-bottom: 8px; font-weight: bold; font-size: 16px; line-height: 24px; font-family: 'Inter', sans-serif;">${
                        sample[this.config.titleKey]
                      }</p>
                      <p style="margin-bottom: 8px; font-size: 14px; line-height: 21px; font-weight: 400; font-family: 'Inter', sans-serif;">${
                        sample[this.config.descriptionKey]
                      }</p>
                      <p style="margin-top: 12px; font-size: 12px; line-height: 16px; font-family: 'Inter', sans-serif; color: gray; font-weight: 300;">${
                        sample[this.config.subtitleKey]
                      }</p>
                  </div>
              </div>
          </div>
          `;

    const saveButton = this.shadow.getElementById("saveButton");
    saveButton.addEventListener("click", () => {
      triggerEvent(this, {
        action: OuterbaseEvent.onSave,
        value: this.config.toJSON(),
      });
    });

    for (const configKey in configKeys) {
      const elm = this.shadow.getElementById(configKey);
      elm.addEventListener("change", () => {
        this.config[configKey] = elm.value;
        this.render();
      });
    }
  }
}

window.customElements.define(
  "outerbase-plugin-table-$PLUGIN_ID",
  OuterbasePluginTable_$PLUGIN_ID
);
window.customElements.define(
  "outerbase-plugin-configuration-$PLUGIN_ID",
  OuterbasePluginConfiguration_$PLUGIN_ID
);
