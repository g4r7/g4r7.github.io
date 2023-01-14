importScripts("katago.js");

let kataGoInstance;

self.onmessage = ev => {
  let cmd = ev.data;
  switch (cmd.type) {
    case "init":
      KataGo({
        subcommand: cmd.subcommand,
        configFile: cmd.configFile,
        config: cmd.config,
        model: cmd.model,

        mainScriptUrlOrBlob: "katago.js",
        onstatus: status => self.postMessage({type: "status", statusCode: status}),
        onmessage: cmd => self.postMessage({type: "message", text: cmd})
      }).then(kg => {
        kataGoInstance = kg;
        console.log("KataGo ready", kg)
      });
      break;

    case "preload":
      fetch(cmd.url || cmd.file).then(res => res.text())
      .then(text => kataGoInstance.FS.writeFile(cmd.file, text));
      break;

    // case "message":
    //   kataGoInstance.postCommand(cmd.text);
    //   break;

    case "loadsgf_string":
      kataGoInstance.FS.writeFile("sgf_temp", cmd.arg);
      kataGoInstance.postCommand("loadsgf sgf_temp");

    default:
      console.log("W/postCommand", cmd);
      kataGoInstance.postCommand(cmd.type + " " + cmd.arg);
  }
};
