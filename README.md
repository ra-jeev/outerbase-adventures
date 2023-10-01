# outerbase-adventures

This repository is a collection of some of the Outerbase plugins created by me.

The plugins code is present in the `plugins` sub-folder, while the `.bun-create` sub-folder contains Outerbase plugin templates.

## Outerbase plugins

The `plugins` folder contains the following plugins:

1. `audio-player`: A cell plugin to play audio links by creating an audio player.
2. `video-player`: Another cell plugin to create a video player for playing `Vimeo` video urls. It has implementation for `YouTube` video urls also, but that doesn't work at present due to the iframe sandbox restrictions in Outerbase.
3. `md-editor`: A fully featured `Markdown/WYSIWYG` Editor/Viewer for Outerbase cells. The editor has `ChatGPT` integration to help with your writing.

## Outerbase plugin templates

The sub-folders inside the `.bun-create` folder represent the template names.

To start creating a new plugin, run the following command.

##

```bash
bun create ./template-name destination-path
```

E.g.

```bash
bun create ./cell-plugin-ext plugins/my-new-plugin
```

The above command copies the content of the template folder into the destination folder amd also initializes `git`. For skipping `git` initialization, run the same command with `--no-git` flag.

```bash
bun create --no-git ./cell-plugin-ext plugins/my-new-plugin
```

The `cell-plugin-ext` template has support for injecting third party CSS into the plugin. `bun` doesn't support CSS bundling yet (it just copies the CSS files into the output dir). So the current build process is just replacing identifiers in the plugin code with the content of the CSS files.

E.g. the `md-editor` plugin requires two CSS files and the below command is used for injecting their content into the plugin code. It is better to use the `minified` CDN links.

```bash
bun build.js --replace TOAST_UI_CSS=https://uicdn.toast.com/editor/latest/toastui-editor.min.css TOAST_UI_DARK_CSS=https://uicdn.toast.com/editor/latest/theme/toastui-editor-dark.min.css
```
