console.log("[worker] initializing");

function arrayToHeap(typedArray) {
  var numBytes  = typedArray.length * typedArray.BYTES_PER_ELEMENT;
  var ptr       = Module._malloc(numBytes);
  var heapBytes = Module.HEAPU8.subarray(ptr, ptr + numBytes);
  heapBytes.set(typedArray);
  return heapBytes;
}

function makeCommandBuffer() {
  var rawBuffer = new ArrayBuffer(1000);
  var heapView  = new Uint8Array(rawBuffer);
  return arrayToHeap(heapView).byteOffset;
}

function fillCommandBuffer(cmdBuf, cmdStr) {
  for (var i = 0; i < cmdStr.length; i++) {
    Module.setValue(cmdBuf + i, cmdStr.charCodeAt(i), "i8");
  }
  Module.setValue(cmdBuf + cmdStr.length, 0, "i8");
}

commandBufferInititalized = false;
commandBuffer = 0;

function doNextTurn() { Module._doNextTurn(); }

function gnubgCommandSingle(command) {
  if (!commandBufferInititalized) {
    commandBuffer = makeCommandBuffer();
    commandBufferInititalized = true;
  }

  if (command.startsWith("b/")
      || command.startsWith("bar/")
      || ["1", "2", "3", "4", "5", "6", "7", "8", "9"].includes(command.substring(0, 1)))
  { // assume it's a move
    command = "move " + command;
  }

  fillCommandBuffer(commandBuffer, command);
  writeLog("=> " + command);
  Module._run_command(commandBuffer);

  // setTimeout(doNextTurn, 0); // TODO: turn off
}

function gnubgCommands(commands) {
  commands.split(/;\s*/).forEach(gnubgCommandSingle);
}

function writeLog(logStr) { self.postMessage(logStr); }
function stdin() { console.log("STDIN prompted"); }

var Module = {
  preRun: [ function() { FS.init(stdin); } ],
  print: writeLog,
  printErr: writeLog,
  onRuntimeInitialized: function() { Module._start(); }
}


self.addEventListener("message",
  function(ev) {
    let cmds = ev.data;
    console.log("[->worker] " + cmds);

    if (cmds === "doNextTurn")
      Module._doNextTurn();
    else
      gnubgCommands(cmds);
  }
);

importScripts("gnubg.js");
