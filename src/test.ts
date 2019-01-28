import * as AgoraRTC from "agora-rtc-sdk";

AgoraRTC.getDevices(function(devices: AgoraRTC.MediaDeviceInfo[] ) {
  let devCount = devices.length;
  console.log(devCount);
  let d = devices[0];
  console.log(d.deviceId, d.kind, d.label);
});

let shareClient = AgoraRTC.createClient({
  codec: "vp8",
  mode: "live",
});

shareClient.init("appId", console.log, console.error);
let defaultConfig: AgoraRTC.StreamSpec = {
  streamID: 1,
  audio: true,
  audioSource: {},
  video: true,
  videoSource: {},
  screen: false,
};
let stream = AgoraRTC.createStream(defaultConfig);
console.log(stream.getAudioLevel());
