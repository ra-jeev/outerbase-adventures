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
  apiKey = undefined;

  constructor(object) {
    this.apiKey = object?.apiKey;
  }

  toJSON() {
    return {
      apiKey: this.apiKey,
    };
  }
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
templateCell_$PLUGIN_ID_COLUMN.innerHTML = `<style>
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
  <input type="text" id="md-input" placeholder="Add your markdown">
  <button id="edit-btn" class="svg-btn">
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24">
      <g fill="currentColor">
        <path d="M21.731 2.269a2.625 2.625 0 0 0-3.712 0l-1.157 1.157l3.712 3.712l1.157-1.157a2.625 2.625 0 0 0 0-3.712Zm-2.218 5.93l-3.712-3.712l-8.4 8.4a5.25 5.25 0 0 0-1.32 2.214l-.8 2.685a.75.75 0 0 0 .933.933l2.685-.8a5.25 5.25 0 0 0 2.214-1.32l8.4-8.4Z"/><path d="M5.25 5.25a3 3 0 0 0-3 3v10.5a3 3 0 0 0 3 3h10.5a3 3 0 0 0 3-3V13.5a.75.75 0 0 0-1.5 0v5.25a1.5 1.5 0 0 1-1.5 1.5H5.25a1.5 1.5 0 0 1-1.5-1.5V8.25a1.5 1.5 0 0 1 1.5-1.5h5.25a.75.75 0 0 0 0-1.5H5.25Z"/>
      </g>
    </svg>
  </button>
</div>`;

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

  render() {
    const text = this.getAttribute("cellvalue");
    const mdInput = this.shadow.getElementById("md-input");
    const editBtn = this.shadow.getElementById("edit-btn");

    mdInput.value = text;

    mdInput.addEventListener("blur", () => {
      triggerEvent_$PLUGIN_ID(this, {
        action: OuterbaseColumnEvent_$PLUGIN_ID.updateCell,
        value: mdInput.value,
      });
    });

    editBtn.addEventListener("click", () => {
      triggerEvent_$PLUGIN_ID(this, {
        action: OuterbaseColumnEvent_$PLUGIN_ID.onEdit,
        value: true,
      });
    });
  }
}

const templateEditor_$PLUGIN_ID_COLUMN = document.createElement("template");
templateEditor_$PLUGIN_ID_COLUMN.innerHTML = `
<style>
  #container {
    min-width: 100%;
    border: 1px solid dodgerblue;
    border-radius: 8px;
  }

  #feature-container {
    display: flex;
    padding: 8px 16px;
  }

  .feature {
    height: 32px;
    display: flex;
    gap: 8px;
    align-items: center;
  }

  #buttons-container {
    display: flex;
    gap: 16px;
    padding: 8px 16px;
  }

  .btn {
    padding: 8px 16px;
    border: none;
    border-radius: 8px;
    font-size: 1rem;
    line-height: 1;
    cursor: pointer;
    transition: 0.3s all ease;
    background-color: rgba(0, 0, 0, 0.12);
    color: currentColor;
  }

  .btn:hover {
    background-color: rgba(0, 0, 0, 0.18);
  }

  .btn-primary {
    background-color: rgb(28, 100, 242);
    color: white;
  }

  .btn-primary:hover {
    background-color: rgb(26, 86, 219);
  }

  select {
    width: 172px;
    font-size: 14px;
    line-height: 1;
    background: transparent;
    border: 1px solid #343438;
    padding: 8px 12px;
    border-radius: 8px;
    cursor: pointer;
    background-image: url('data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" height="28" viewBox="0 -960 960 960" width="32"><path fill="black" d="M480-380 276-584l16-16 188 188 188-188 16 16-204 204Z"/></svg>');
    background-position: 100%;
    background-repeat: no-repeat;
    appearance: none;
    -webkit-appearance: none !important;
    -moz-appearance: none !important;
  }

  .divider {
    background-color: #e1e3e9;
    display: inline-block;
    height: 20px;
    margin: 6px 12px;
    width: 1px;
  }

  TOAST_UI_CSS
  TOAST_UI_DARK_CSS
</style>

<div id="container">
  <div id="feature-container">
    <div class="feature">
      <span>Change tone</span>
      <select id="tone-select"></select>
      <button id="tone-btn" class="btn btn-primary">Rewrite</button>
    </div>
    <div class="divider"></div>
    <div class="feature">
      <span>Other commands</span>
      <select id="cmd-select"></select>
      <button id="cmd-btn" class="btn btn-primary">Execute</button>
    </div>
  </div>
  <div id="editor"></div>
  <div id="buttons-container">
    <button id="cancel-btn" class="btn">Cancel</button>
    <button id="save-btn" class="btn btn-primary">Save</button>
  </div>
</div>`;

class OuterbasePluginCellEditor_$PLUGIN_ID_COLUMN extends HTMLElement {
  static get observedAttributes() {
    return privileges_$PLUGIN_ID;
  }

  config = new OuterbasePluginConfig_$PLUGIN_ID_COLUMN({});
  editor = undefined;
  tones = [
    "Pick a tone",
    "Professional",
    "Casual",
    "Friendly",
    "Informative",
    "Authoritative",
  ];

  commands = [
    {
      id: "command",
      title: "Pick a command",
      selection: false,
      prompt:
        "Rephrase the following text and make the sentences more clear and readable",
    },
    {
      id: "rephrase",
      title: "Rephrase selction",
      selection: true,
      prompt:
        "Rephrase the following text and make the sentences more clear and readable",
    },
    {
      id: "expand",
      title: "Expand selection",
      selection: true,
      prompt:
        "Continue building on the following text, make it better and verbose",
    },
    {
      id: "shorten",
      title: "Shorten selection",
      selection: true,
      prompt:
        "Based on the following text, try to make it readable and concise at the same time",
    },
    {
      id: "suggest",
      title: "Suggest headlines",
      selection: false,
      prompt: "Suggest some short headlines for the following text",
    },
    {
      id: "summarize",
      title: "Summarize text",
      selection: false,
      prompt: "Write a short summary for the following text",
    },
  ];

  constructor() {
    super();

    this.shadow = this.attachShadow({ mode: "open" });
    this.shadow.appendChild(
      templateEditor_$PLUGIN_ID_COLUMN.content.cloneNode(true)
    );
  }

  loadToastUiEditor() {
    const scriptSrc =
      "https://uicdn.toast.com/editor/latest/toastui-editor-all.min.js";
    if (document.scripts) {
      for (const script of document.scripts) {
        if (script.src === scriptSrc) {
          console.log("script already loaded, bail out");
          return;
        }
      }
    }

    const el = document.createElement("script");
    el.src = scriptSrc;

    el.onload = () => {
      this.render();
    };

    el.onerror = (event) => {
      console.log("failed to load the script", event);
    };

    document.head.appendChild(el);
  }

  connectedCallback() {
    this.config = new OuterbasePluginConfig_$PLUGIN_ID_COLUMN(
      decodeAttributeByName_$PLUGIN_ID(this, "configuration")
    );

    const agPopUp = document.querySelector(".ag-popup");
    const colorScheme = window.getComputedStyle(agPopUp)["color-scheme"];

    this.config.theme = colorScheme === "normal" ? "light" : "dark";

    this.loadToastUiEditor();

    const cancelBtn = this.shadow.getElementById("cancel-btn");
    cancelBtn.addEventListener("click", () => {
      triggerEvent_$PLUGIN_ID(this, {
        action: OuterbaseColumnEvent_$PLUGIN_ID.onCancelEdit,
        value: true,
      });
    });

    const saveBtn = this.shadow.getElementById("save-btn");
    saveBtn.addEventListener("click", () => {
      const finalContent = this.editor.getMarkdown();
      console.log("sending the content from editor", finalContent);
      triggerEvent_$PLUGIN_ID(this, {
        action: OuterbaseColumnEvent_$PLUGIN_ID.onStopEdit,
        value: finalContent,
      });
      triggerEvent_$PLUGIN_ID(this, {
        action: OuterbaseColumnEvent_$PLUGIN_ID.updateCell,
        value: finalContent,
      });
    });

    this.config.cellValue = this.getAttribute("cellvalue");
    this.render();
  }

  disconnectedCallback() {
    if (this.editor) {
      this.editor.destroy();
      this.editor = undefined;
    }
  }

  setEditorPosition() {
    const agPopUpChild = document.querySelector(".ag-popup-child");
    const container = this.shadow.getElementById("container");

    setTimeout(() => {
      agPopUpChild.style.left = `${
        (window.innerWidth - container.offsetWidth) / 2
      }px`;
      // agPopUpChild.style.top = `${
      //   (window.innerHeight - container.offsetHeight - 100) / 2
      // }px`; // -100 offset for outerbase top bars

      agPopUpChild.style.top = "0px"; // Just hardcode at 0px otherwise top border not visible
    }, 10);
  }

  handleKeyDown(_, event) {
    if (event.key === "Enter") {
      event.stopPropagation();
    }
  }

  async talkToChatGPT(instruction, text) {
    console.log("this.config", this.config);

    const res = await fetch("https://api.openai.com/v1/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${this.config.apiKey}`,
      },
      body: JSON.stringify({
        model: "gpt-3.5-turbo-instruct",
        prompt: `${instruction}: ${text}`,
        max_tokens: 2048,
        temperature: 0.3,
        n: 1,
      }),
    });

    const data = await res.json();
    return data.choices[0].text.trim();
  }

  async handleSelectionAction(prompt) {
    const [start, end] = this.editor.getSelection();
    const selectedText = this.editor.getSelectedText(start, end);
    if (selectedText) {
      this.editor.insertText(`${selectedText}\n\nThinking...`);
      const currLinePos = end[0] + 2;
      this.editor.setSelection(
        [currLinePos, 1],
        [currLinePos, "Thinking...".length + 1]
      );

      const generatedText = await this.talkToChatGPT(prompt, selectedText);
      if (generatedText) {
        this.editor.insertText(generatedText);
      }
    }
  }

  addSelectOption(select, value, content) {
    const option = document.createElement("option");
    option.value = value;
    option.textContent = content || value;
    select.appendChild(option);
  }

  prepareTonesSelctions() {
    const toneSelect = this.shadow.getElementById("tone-select");
    this.tones.forEach((value) => {
      this.addSelectOption(toneSelect, value);
    });

    const toneBtn = this.shadow.getElementById("tone-btn");
    toneBtn.addEventListener("click", () => {
      const selectedIndex = toneSelect.selectedIndex;
      if (selectedIndex) {
        const selectedTone = toneSelect.options[selectedIndex].value;
        const prompt = `Make the following text better and rewrite it in a ${selectedTone.toLowerCase()} tone`;
        this.handleSelectionAction(prompt);
      }
    });
  }

  prepareOtherCommands() {
    const cmdSelect = this.shadow.getElementById("cmd-select");
    this.commands.forEach((command) => {
      this.addSelectOption(cmdSelect, command.id, command.title);
    });

    const cmdBtn = this.shadow.getElementById("cmd-btn");
    cmdBtn.addEventListener("click", async () => {
      const selectedIndex = cmdSelect.selectedIndex;
      if (selectedIndex) {
        const cmd = this.commands[selectedIndex];
        if (cmd.selection) {
          this.handleSelectionAction(cmd.prompt);
        } else {
          const editorText = this.editor.getMarkdown();
          this.editor.moveCursorToEnd();
          this.editor.insertText(`\n\nThinking...`);
          const [start, end] = this.editor.getSelection();
          this.editor.setSelection([start[0], 1], end);
          const generatedText = await this.talkToChatGPT(
            cmd.prompt,
            editorText
          );
          this.editor.insertText(generatedText);
        }
      }
    });
  }

  render() {
    try {
      console.log("inside render toastui", toastui);
      const Editor = toastui.Editor;
      this.editor = new Editor({
        el: this.shadow.querySelector("#editor"),
        height: "420px",
        initialEditType: "markdown",
        initialValue: this.getAttribute("cellvalue"),
        previewStyle: "vertical",
        usageStatistics: false,
        theme: this.config.theme,
        events: { keydown: this.handleKeyDown },
      });

      this.setEditorPosition();
      this.prepareTonesSelctions();
      this.prepareOtherCommands();
    } catch (error) {
      console.log("render error", error);
    }
  }
}

var templateConfiguration = document.createElement("template");
templateConfiguration.innerHTML = `
<style>
  #container {
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
</style>

<div id="container">
    
</div>
`;

class OuterbasePluginConfiguration_$PLUGIN_ID_COLUMN extends HTMLElement {
  static get observedAttributes() {
    return privileges_$PLUGIN_ID;
  }

  config = new OuterbasePluginConfig_$PLUGIN_ID_COLUMN({});

  constructor() {
    super();

    this.shadow = this.attachShadow({ mode: "open" });
    this.shadow.appendChild(templateConfiguration.content.cloneNode(true));
  }

  connectedCallback() {
    this.config = new OuterbasePluginConfig_$PLUGIN_ID_COLUMN(
      decodeAttributeByName(this, "configuration")
    );

    this.render();
  }

  render() {
    this.shadow.querySelector("#container").innerHTML = `
      <div>
        <p class="field-title">Your OpenAI API Key</p>
        <input id="apiKey" type="text" value="" />
        <div style="margin-top: 8px;">
          <button id="saveButton">Save View</button>
        </div>
    `;

    const elm = this.shadow.getElementById("apiKey");
    elm.addEventListener("change", () => {
      this.config.apiKey = elm.value;
    });

    var saveButton = this.shadow.getElementById("saveButton");
    saveButton.addEventListener("click", () => {
      triggerEvent(this, {
        action: OuterbaseEvent_$PLUGIN_ID.onSave,
        value: this.config.toJSON(),
      });
    });
  }
}

window.customElements.define(
  "outerbase-plugin-cell-$PLUGIN_ID",
  OuterbasePluginCell_$PLUGIN_ID_COLUMN
);
window.customElements.define(
  "outerbase-plugin-cell-editor-$PLUGIN_ID",
  OuterbasePluginCellEditor_$PLUGIN_ID_COLUMN
);
window.customElements.define(
  "outerbase-plugin-configuration-$PLUGIN_ID",
  OuterbasePluginConfiguration_$PLUGIN_ID_COLUMN
);
