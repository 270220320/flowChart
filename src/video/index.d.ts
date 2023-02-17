import * as axios from 'axios';

interface videoInfo {
    [key: string]: string | number | boolean | videoInfo | Array<videoInfo>;
}
interface PlayVideoArgs {
    videoElm: string;
    mediaServerAddr: string;
    cameraUserName: string;
    cameraPwd: string;
    cameraIp: string;
    cameraRtspPort: string;
    cameraChannel: string;
    cameraStream: string;
    addRtspProxyUrl: string;
}
interface EndpointConfig {
    debug: boolean;
    simulcast: boolean;
    useCamera: boolean;
    audioEnable: boolean;
    videoEnable: boolean;
    recvOnly: boolean;
}
interface WebRtc {
    el?: HTMLElement;
    w?: number;
    h?: number;
    autoPlay?: boolean;
    plays: PlayVideoArgs | Array<PlayVideoArgs>;
    endpointConfig?: EndpointConfig;
}
declare const playOneWebRtcMt: (uuid: string, domId: string, token?: string) => Promise<any>;
declare class WebRtcMt {
    constructor(opt: WebRtc);
    p_player: any;
    protected instance: axios.AxiosInstance;
    protected playerMap: Map<any, any>;
    protected streamMap: Map<any, any>;
    protected mediaServerAddrMap: Map<any, any>;
    protected config: {
        w: number;
        h: number;
        endpointConfig: {};
    };
    protected createRtspUrl(plays: any): {
        stream: string;
        addRtspProxyUrl: any;
        sdpUrl: string;
    };
    protected init(opt: WebRtc): void;
    protected createVideo(plays: PlayVideoArgs): Promise<unknown>;
    log(type: "err" | "info" | "warn", text: string): void;
    stopPlay(id?: string): void;
    protected playEvent(player: any, videoElm: string, sdpUrl: string): void;
    protected rePlay(videoElm: string): void;
    protected play(videoElm: string): void;
    startPlay(plays: PlayVideoArgs): void;
}

interface ICamera {
    cameraId: string;
    cameraCode: string;
}
type GetCameraConfig = {
    token?: string;
    delay?: number;
    onChange?: (cameraList: ICamera[], alarmList: any[]) => void;
    onPolling?: (cameraList: ICamera[], alarmList: any[]) => void;
};
/**
 * 轮询正在报警的摄像头列表
 * @returns 停止轮询
 * @example
 * const stopRequest = getAlarmingCamera({
 *   token: 'xxx',
 *   delay: 3000,
 *   onChange(cameraList, alarmList) {
 *     console.log(cameraList, alarmList);
 *   }
 * })
 */
declare function getAlarmingCamera(config: GetCameraConfig): () => void;

export { EndpointConfig, PlayVideoArgs, WebRtc, WebRtcMt, getAlarmingCamera, playOneWebRtcMt, videoInfo };
