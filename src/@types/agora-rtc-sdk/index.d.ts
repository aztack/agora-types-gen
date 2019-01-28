declare module "agora-rtc-sdk" {

    // variables
    let BUILD: string;
    let VERSION: string;

    // functions
    function checkSystemRequirements(): boolean;
    function createClient(config: ClientConfig): Client;
    function createStream(spec: StreamSpec): Stream;
    function getDevices(callback: Function): void;

    // modules    
    module Logger {
        // type aliases
        type DEBUG = 0;
        type ERROR = 3;
        type INFO = 1;
        type NONE = 4;
        type WARNING = 2;

        // functions
        function disableLogUpload(): void;
        function enableLogUpload(): void;
        function setLogLevel(level: DEBUG | INFO | WARNING | ERROR | NONE): void;

    }

    // interfaces    

    export interface Client {

        // methods
        configPublisher(width: number, height: number, framerate: number, bitrate: number, publisherUrl: string): void;
        disableDualStream(onSuccess: Function, onFailure: Function): void;
        enableAudioVolumeIndicator(): void;
        enableDualStream(onSuccess: Function, onFailure: Function): void;
        getCameras(callback: Function): void;
        getLocalAudioStats(callback: Function): void;
        getLocalVideoStats(callback: Function): void;
        getNetworkStats(callback: Function): void;
        getPlayoutDevices(callback: Function): void;
        getRecordingDevices(callback: Function): void;
        getRemoteAudioStats(callback: Function): void;
        getRemoteVideoStats(callback: Function): void;
        getSystemStats(callback: Function): void;
        getTransportStats(callback: Function): void;
        init(appId: string, onSuccess: Function, onFailure: Function): void;
        join(tokenOrKey: string, channel: string, uid: number | string, onSuccess: Function, onFailure: Function): void;
        leave(onSuccess: Function, onFailure: Function): void;
        on(event: "stream-published", callback: Function): void;
        on(event: "stream-added", callback: Function): void;
        on(event: "stream-removed", callback: Function): void;
        on(event: "stream-subscribed", callback: Function): void;
        on(event: "peer-leave", callback: Function): void;
        on(event: "mute-audio", callback: Function): void;
        on(event: "unmute-audio", callback: Function): void;
        on(event: "mute-video", callback: Function): void;
        on(event: "unmute-video", callback: Function): void;
        on(event: "client-banned", callback: Function): void;
        on(event: "active-speaker", callback: Function): void;
        on(event: "volume-indicator", callback: Function): void;
        on(event: "liveStreamingStarted", callback: Function): void;
        on(event: "liveStreamingFailed", callback: Function): void;
        on(event: "liveStreamingStopped", callback: Function): void;
        on(event: "liveTranscodingUpdated", callback: Function): void;
        on(event: "onTokenPrivilegeWillExpire", callback: Function): void;
        on(event: "onTokenPrivilegeDidExpire", callback: Function): void;
        on(event: "error", callback: Function): void;
        on(event: "networkTypeChanged", callback: Function): void;
        on(event: "recordingDeviceChanged", callback: Function): void;
        on(event: "playoutDeviceChanged", callback: Function): void;
        on(event: "cameraChanged", callback: Function): void;
        on(event: "streamTypeChange", callback: Function): void;
        publish(stream: Stream, onFailure: Function): void;
        renewChannelKey(key: string, onSuccess: Function, onFailure: Function): void;
        renewToken(token: string): void;
        setEncryptionMode(encryptionMode: "aes-128-xts" | "aes-256-xts" | "aes-128-ecb"): void;
        setEncryptionSecret(password: string): void;
        setLiveTranscoding(coding: LiveTranscoding): void;
        setLowStreamParameter(param: object): void;
        setProxyServer(proxyServer: string): void;
        setRemoteVideoStreamType(stream: Stream, streamType: 0 | 1): void;
        setStreamFallbackOption(stream: Stream, fallbackType: 0 | 1 | 2): void;
        setTurnServer(turnServer: object): void;
        startLiveStreaming(url: string, enableTranscoding?: boolean): void;
        stopLiveStreaming(url: string): void;
        subscribe(stream: Stream, onFailure: Function): void;
        unpublish(stream: Stream, onFailure: Function): void;
        unsubscribe(stream: Stream, onFailure: Function): void;

    }

    export interface ClientConfig {

        // properties
        codec: "vp8" | "h264";
        mode: "live" | "rtc";
        proxyServer?: string;
        turnServer?: object;

    }

    export interface LiveTranscoding {

        // properties
        audioBitrate: number;
        audioChannels: number;
        audioSampleRate: 32000 | 441000 | 48000;
        backgroundColor: number;
        height: number;
        lowLatency: boolean;
        transcodingUsers: object;
        userCount: number;
        videoBitrate: number;
        videoCodecProfile: 66 | 77 | 100;
        videoFramerate: number;
        videoGop: number;
        width: number;

    }

    export interface LocalAudioStats {

        // properties
        CodecType?: string;
        MuteState?: string;
        RecordingLevel?: string;
        SamplingRate?: string;
        SendBitrate?: string;
        SendLevel?: string;

    }

    export interface LocalAudioStatsMap {

        // indexables
        [uid: string]: LocalAudioStats;
    }

    export interface LocalStreamStats {

        // properties
        accessDelay: string;
        audioSendBytes: string;
        audioSendPackets: string;
        audioSendPacketsLost: string;
        videoSendBytes: string;
        videoSendFrameRate: string;
        videoSendPackets: string;
        videoSendPacketsLost: string;
        videoSendResolutionHeight?: string;
        videoSendResolutionWidth?: string;

    }

    export interface LocalVideoStats {

        // properties
        EncodeDelay?: string;
        MuteState?: string;
        SendBitrate?: string;
        SendFrameRate?: string;
        SendResolutionHeight?: string;
        SendResolutionWidth?: string;
        TargetSendBitrate?: string;

    }

    export interface LocalVideoStatsMap {

        // indexables
        [uid: string]: LocalVideoStats;
    }

    export interface MediaDeviceInfo {

        // properties
        deviceId: string;
        kind: string;
        label: string;

    }

    export interface MediaStreamTrack {

    }

    export interface NetworkStats {

        // properties
        NetworkType: "bluetooth" | "cellular" | "ethernet" | "none" | "wifi" | "wimax" | "other" | "unknown" | "UNSUPPORTED";

    }

    export interface RemoteAudioStats {

        // properties
        CodecType?: string;
        End2EndDelay?: string;
        MuteState?: string;
        PacketLossRate?: string;
        RecvBitrate?: string;
        RecvLevel?: string;
        TransportDelay?: string;

    }

    export interface RemoteAudioStatsMap {

        // indexables
        [uid: string]: RemoteAudioStats;
    }

    export interface RemoteStreamStats {

        // properties
        accessDelay: string;
        audioReceiveBytes: string;
        audioReceiveDelay: string;
        audioReceivePackets: string;
        audioReceivePacketsLost: string;
        endToEndDelay: string;
        videoReceiveBytes: string;
        videoReceiveDecodeFrameRate: string;
        videoReceiveDelay: string;
        videoReceiveFrameRate: string;
        videoReceivePackets: string;
        videoReceivePacketsLost: string;
        videoReceivedResolutionHeight?: string;
        videoReceivedResolutionWidth?: string;

    }

    export interface RemoteVideoStats {

        // properties
        End2EndDelay?: string;
        MuteState?: string;
        PacketLossRate?: string;
        RecvBitrate?: string;
        RecvResolutionHeight?: string;
        RecvResolutionWidth?: string;
        RenderFrameRate?: string;
        TransportDelay?: string;

    }

    export interface RemoteVideoStatsMap {

        // indexables
        [uid: string]: RemoteVideoStats;
    }

    export interface Stream {

        // methods
        addTrack(track: MediaStreamTrack): void;
        adjustAudioMixingVolume(level: number): void;
        close(): void;
        disableAudio(): void;
        disableVideo(): void;
        enableAudio(): void;
        enableVideo(): void;
        getAudioLevel(): number;
        getAudioMixingCurrentPosition(): number | void;
        getAudioMixingDuration(): number | void;
        getAudioTrack(): MediaStreamTrack | void;
        getId(): number;
        getStats(callback: Function): void;
        getVideoTrack(): MediaStreamTrack | void;
        hasAudio(): boolean;
        hasVideo(): boolean;
        init(onSuccess: Function, onFailure: Function): void;
        on(event: "accessAllowed", callback: Function): void;
        on(event: "accessDenied", callback: Function): void;
        on(event: "stopScreenSharing", callback: Function): void;
        pauseAudioMixing(): void;
        play(HTMLElementID: string, option: object): void;
        removeTrack(track: MediaStreamTrack): void;
        replaceTrack(MediaStreamTrack: MediaStreamTrack, onSuccess: Function, onFailure: Function): void;
        resumeAudioMixing(): void;
        setAudioMixingPosition(position: number): void;
        setAudioOutput(deviceId: string, onSuccess: Function, onFailure: Function): void;
        setAudioProfile(profile: "speech_low_quality" | "speech_standard" | "music_standard" | "standard_stereo" | "high_quality" | "high_quality_stereo"): void;
        setAudioVolume(volume: number): void;
        setScreenProfile(profile: string): void;
        setVideoProfile(profile: string): void;
        startAudioMixing(options: object, callback: Function): void;
        stop(): void;
        stopAudioMixing(): void;
        switchDevice(type: string, deviceId: string, onSuccess: Function, onFailure: Function): void;

    }

    export interface StreamSpec {

        // properties
        audio: boolean;
        audioProcessing?: object;
        audioSource: object;
        cameraId?: string;
        extensionId?: string;
        mediaSource?: "screen" | "application" | "window";
        microphoneId?: string;
        mirror?: boolean;
        screen: boolean;
        streamID: number;
        video: boolean;
        videoSource: object;

    }

    export interface SystemStats {

        // properties
        BatteryLevel: "string";

    }

    export interface TransportStats {

        // properties
        RTT?: string;

    }

}