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
  <input type="text" id="video-url" placeholder="Video url...">
  <button id="play-video" class="svg-btn">
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

  render() {
    const srcUrl = this.getAttribute("cellvalue");
    const videoUrlInput = this.shadow.getElementById("video-url");
    const playVideoBtn = this.shadow.getElementById("play-video");

    videoUrlInput.value = srcUrl;

    videoUrlInput.addEventListener("blur", () => {
      triggerEvent_$PLUGIN_ID(this, {
        action: OuterbaseColumnEvent_$PLUGIN_ID.updateCell,
        value: videoUrlInput.value,
      });
    });

    playVideoBtn.addEventListener("click", () => {
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
    max-width: 360px;
  }

  p {
    background-color: #777777;
    margin: 0;
    padding: 8px 16px;
    border-radius: 4px;
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

  async getVimeoEmbedUrl(url) {
    const res = await fetch(`https://vimeo.com/api/oembed.json?url=${url}`);

    const data = await res.json();
    return `https://player.vimeo.com/video/${data.video_id}?title=0&byline=0&dnt=1`;
  }

  getYouTubeEmbedUrl(url) {
    const youtubeRegex =
      /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|\&v=)([^#\&\?]*).*/;
    const match = url.match(youtubeRegex);
    if (match && match[2].length == 11) {
      return `https://youtube.com/embed/${match[2]}`;
    }
  }

  async render() {
    let srcUrl = this.getAttribute("cellvalue");
    if (srcUrl) {
      if (srcUrl.includes("vimeo")) {
        this.shadow.getElementById(
          "container"
        ).innerHTML = `<iframe id="video-player" type="text/html" width="360" height="240" frameborder="0" />`;

        const embedUrl = await this.getVimeoEmbedUrl(srcUrl);
        const player = this.shadow.getElementById("video-player");
        player.src = embedUrl;
      } else {
        this.shadow.getElementById(
          "container"
        ).innerHTML = `<p>Not a valid YouTube / Vimeo video URL</p>`;
      }
    }
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
