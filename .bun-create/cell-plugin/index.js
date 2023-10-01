const privileges_$PLUGIN_ID = ["cellvalue", "configuration", "metadata"];

const OuterbaseEvent_$PLUGIN_ID = {
  onSave: "onSave",
};

const OuterbaseColumnEvent_$PLUGIN_ID = {
  onEdit: "onEdit",
  onStopEdit: "onStopEdit",
  onCancelEdit: "onCancelEdit",
  updateCell: "updateCell",
};

class OuterbasePluginConfig_$PLUGIN_ID_COLUMN {
  cellValue = undefined;

  constructor(object) {}
}

const triggerEvent_$PLUGIN_ID = (fromClass, data) => {
  const event = new CustomEvent("custom-change", {
    detail: data,
    bubbles: true,
    composed: true,
  });

  fromClass.dispatchEvent(event);
};

const decodeAttributeByName_$PLUGIN_ID = (fromClass, name) => {
  const encodedJSON = fromClass.getAttribute(name);
  const decodedJSON = encodedJSON
    ?.replace(/&quot;/g, '"')
    ?.replace(/&#39;/g, "'");
  return decodedJSON ? JSON.parse(decodedJSON) : {};
};

const templateCell_$PLUGIN_ID_COLUMN = document.createElement("template");
templateCell_$PLUGIN_ID_COLUMN.innerHTML = `
<style>
  #container { 
    display: flex;
    align-items: center;
    gap: 8px;
    justify-content: space-between;
    height: 100%;
    width: calc(100% - 16px);
    padding: 0 8px;
  }

  input {
    height: 100%;
    flex: 1;
    background-color: transparent;
    border: 0;
    min-width: 0;
    white-space: nowrap;
    text-overflow: ellipsis;
    overflow: hidden;
  }

  input:focus {
    outline: none;
  }

  .svg-btn {
    background-color: transparent;
    height: 100%;
    padding: 4px;
    border: none;
    border-radius: 4px;
    cursor: pointer;
  }
</style>

<div id="container">
  <input type="text" id="input-url" placeholder="Media url...">
  <button id="svg-btn" class="svg-btn">
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24">
      <path fill="currentColor" fill-rule="evenodd" d="M2.25 12c0-5.385 4.365-9.75 9.75-9.75s9.75 4.365 9.75 9.75s-4.365 9.75-9.75 9.75S2.25 17.385 2.25 12Zm14.024-.983a1.125 1.125 0 0 1 0 1.966l-5.603 3.113A1.125 1.125 0 0 1 9 15.113V8.887c0-.857.921-1.4 1.671-.983l5.603 3.113Z" clip-rule="evenodd"/>
    </svg>
  </button>
</div>
`;

class OuterbasePluginCell_$PLUGIN_ID_COLUMN extends HTMLElement {
  static get observedAttributes() {
    return privileges_$PLUGIN_ID;
  }

  config = new OuterbasePluginConfig_$PLUGIN_ID_COLUMN({});

  constructor() {
    super();

    this.shadow = this.attachShadow({ mode: "open" });
    this.shadow.appendChild(
      templateCell_$PLUGIN_ID_COLUMN.content.cloneNode(true)
    );
  }

  connectedCallback() {
    this.config = new OuterbasePluginConfig_$PLUGIN_ID_COLUMN(
      decodeAttributeByName_$PLUGIN_ID(this, "configuration")
    );

    this.render();
  }

  attributeChangedCallback(name, oldValue, newValue) {
    this.render();
  }

  render() {}
}

const templateEditor_$PLUGIN_ID_COLUMN = document.createElement("template");
templateEditor_$PLUGIN_ID_COLUMN.innerHTML = `
<style>
  #container {
    max-width: 320px;
  }
</style>

<div id="container"></div>
`;

class OuterbasePluginCellEditor_$PLUGIN_ID_COLUMN extends HTMLElement {
  static get observedAttributes() {
    return privileges_$PLUGIN_ID;
  }

  config = new OuterbasePluginConfig_$PLUGIN_ID_COLUMN({});

  constructor() {
    super();

    this.shadow = this.attachShadow({ mode: "open" });
    this.shadow.appendChild(
      templateEditor_$PLUGIN_ID_COLUMN.content.cloneNode(true)
    );
  }

  connectedCallback() {
    this.config = new OuterbasePluginConfig_$PLUGIN_ID_COLUMN(
      decodeAttributeByName_$PLUGIN_ID(this, "configuration")
    );

    this.config.cellValue = this.getAttribute("cellvalue");
    this.render();
  }

  render() {}
}

window.customElements.define(
  "outerbase-plugin-cell-$PLUGIN_ID",
  OuterbasePluginCell_$PLUGIN_ID_COLUMN
);
window.customElements.define(
  "outerbase-plugin-cell-editor-$PLUGIN_ID",
  OuterbasePluginCellEditor_$PLUGIN_ID_COLUMN
);
