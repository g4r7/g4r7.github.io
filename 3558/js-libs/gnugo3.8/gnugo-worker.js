importScripts("gnugo.js");

let gnugoInstance;

function postGtp(cmdStr) {
  gnugoInstance.ccall("post_gtp", "int", ["string"], [cmdStr]);
}

self.onmessage = ev => {
  const cmd = ev.data;
  console.log("CMD", cmd)
  if (typeof cmd == "string")
    postGtp(cmd);
  else {
    switch (cmd.type) {
      case "init":
        GnuGo({
          preRun: ({FS}) => {
            let outBuf = "";
            function stdout(char) {
              switch (char) {
                case 0:
                case 0x0a: self.postMessage({type: "message", text: outBuf}); outBuf = ""; return;
                case 0x0d: return;
                default:   outBuf += String.fromCharCode(char);
              }
            }
            FS.init(null, stdout, stdout);
          },
          arguments: [ "--mode", "gtp" ]
        }).then(gg => {
          gnugoInstance = gg;
          self.postMessage({type: "status", status: "ready"});
        });
        break;

      case "loadsgf_string":
        gnugoInstance.FS.writeFile("sgf_temp", cmd.arg);
        postGtp("loadsgf sgf_temp");
        break;

      default:
        postGtp(cmd.type + " " + cmd.arg);
    }
  }
}
