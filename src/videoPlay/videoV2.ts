import axios from "axios";
import {
  Endpoint,
  Events,
  GetAllScanResolution,
  GetSupportCameraResolutions,
  Media,
  isSupportResolution,
} from "./ZLMRTCClient.js";

const appName = "live";
export interface videoInfo {
  [key: string]: string | number | boolean | videoInfo | Array<videoInfo>;
}
export interface PlayVideoArgs {
  videoElm: string;
  videoDom?: Document;
  mediaServerAddr: string;
  cameraUserName: string;
  cameraPwd: string;
  cameraIp: string;
  cameraRtspPort: string;
  cameraChannel: string;
  cameraStream: string;
  addRtspProxyUrl: string;
}

export interface EndpointConfig {
  debug: boolean; // 是否打印日志
  simulcast: boolean; // 是否本地流和远程流同时播放
  useCamera: boolean; // 是否启用本地相机
  audioEnable: boolean; // 是否允许音频
  videoEnable: boolean; // 是否允许视频
  recvOnly: boolean; // 只接收数据
}

export interface WebRtc {
  el?: HTMLElement;
  w?: number;
  h?: number;
  autoPlay?: boolean;
  plays: PlayVideoArgs | Array<PlayVideoArgs>;
  endpointConfig?: EndpointConfig;
}

export const playOneWebRtcMt = async (
  uuid: string,
  domId: string,
  dom?: Document,
  token?: string
) => {
  let play;
  const res = await axios.get(`/api/vms/v1/camera/getByUuid?uuid=${uuid}`, {
    headers: {
      token: token || sessionStorage.getItem("token") || "",
    },
  });
  if (res.status === 200) {
    const camera = res.data.data;
    const { channel, streamType } = camera;
    let url = camera.webrtcTemplateMerged;
    url = (url as string).replaceAll("${channel}", channel as string);
    url = (url as string).replaceAll("${streamType}", streamType as string);
    play = new WebRtcMt({
      plays: {
        videoElm: domId,
        videoDom: dom,
        mediaServerAddr: (camera.mediaServerPo as videoInfo).url as string,
        cameraUserName: camera.user as string,
        cameraPwd: camera.pass as string,
        cameraIp: camera.ip as string,
        cameraRtspPort: camera.rtspPort as string,
        cameraChannel: camera.channel as string,
        cameraStream: camera.streamType as string,
        addRtspProxyUrl: url,
      },
    });
  }
  return play;
};

export class WebRtcMt {
  constructor(opt: WebRtc) {
    this.init(opt);
  }

  private dom;

  public p_player: any; // 返回播放视频数据

  protected instance = axios.create({
    timeout: 60000,
  });

  protected playerMap = new Map();

  protected streamMap = new Map();

  protected mediaServerAddrMap = new Map();

  protected config = {
    w: 100,
    h: 100,
    endpointConfig: {},
  };

  // 根据参数配置组装相关url
  protected createRtspUrl(plays: any) {
    const {
      cameraIp,
      cameraRtspPort,
      cameraChannel,
      cameraStream,
      mediaServerAddr,
      addRtspProxyUrl,
    } = plays;
    const stream = `v${cameraIp}-${cameraRtspPort}-${cameraChannel}-${cameraStream}`;
    const sdpUrl = `${mediaServerAddr}/index/api/webrtc?app=${appName}&stream=${stream}&type=play`;
    return { stream, addRtspProxyUrl, sdpUrl };
  }

  // 初始化
  protected init(opt: WebRtc) {
    // 初始化视频播放器配置
    if (opt.endpointConfig) {
      this.config.endpointConfig = opt.endpointConfig;
    }

    // 初始化视频播放器宽高分辨率
    if (opt.h) this.config.h = opt.h;
    if (opt.w) this.config.w = opt.w;
    // 判断是否是多个视频同时播放
    if (Object.prototype.toString.call(opt.plays) === "[object Object]") {
      // 单个视频播放
      this.p_player = this.createVideo(opt.plays as PlayVideoArgs);
    } else {
      // 多个视频播放
      for (const i of opt.plays as Array<PlayVideoArgs>) {
        this.createVideo(i);
      }
    }
  }

  // 拉流创建播放器
  protected createVideo(plays: PlayVideoArgs) {
    this.mediaServerAddrMap.set(plays.videoElm, plays);
    const { addRtspProxyUrl } = this.createRtspUrl(plays);

    return new Promise((resolve, reject) => {
      this.instance.get(addRtspProxyUrl).then((res: any) => {
        if (res.data.code === 0) {
          // 拉流成功
          this.startPlay(plays);
          resolve(res.data);
        } else {
          // 拉流失败删除缓存信息
          this.mediaServerAddrMap.delete(plays.videoElm);
          reject();
          this.log("err", "从服务端拉流失败，请重试");
        }
      });
    });
  }

  log(type: "err" | "info" | "warn", text: string) {
    switch (type) {
      case "err":
        throw new Error(text);
      case "warn":
        console.warn(text);
        break;
      default:
        console.info(text);
    }
  }

  // 停止播放0
  stopPlay(id?: string) {
    if (id) {
      // 关闭指定video
      let player = this.playerMap.get(id);
      if (player) {
        player.close();
        this.playerMap.delete(id);
        this.mediaServerAddrMap.delete(id);
        player = null;
      }
    } else {
      // 关闭所有video
      this.playerMap.forEach((item) => {
        item.close();
        item = null;
      });
      this.playerMap.clear();
      this.mediaServerAddrMap.clear();
    }
  }

  // 注册事件监听
  protected playEvent(player: any, videoElm: string, sdpUrl: string) {
    // 下边监听事件如果出现问题得重启一下服务器才行。
    player.on(Events.WEBRTC_ICE_CANDIDATE_ERROR, (e: any) => {
      // ICE 协商出错
      this.log("err", "ICE 协商出错");
      this.rePlay(videoElm);
    });
    player.on(Events.WEBRTC_ON_REMOTE_STREAMS, (e: any) => {
      // 获取到了远端流，可以播放
    });
    player.on(Events.WEBRTC_OFFER_ANWSER_EXCHANGE_FAILED, (e: any) => {
      // offer anwser 交换失败,这里前端得重新调用添加视频拉流代码。
      this.log("warn", `offer anwser 交换失败，获取视频流失败, ${e}`);
      this.rePlay(videoElm);
    });
    player.on(Events.DISCONNECTED, (e: any) => {
      this.log("warn", `事件检测到连接断开${videoElm}`);
      this.rePlay(videoElm);
    });
    player.on(Events.LOST_SERVER, (e: any) => {
      this.log("warn", `事件检测到视频服务器丢失${videoElm}`);
      this.rePlay(videoElm);
    });

    player.on(Events.WEBRTC_ON_CONNECTION_STATE_CHANGE, (state: any) => {
      // RTC 状态变化 ,详情参考 https://developer.mozilla.org/en-US/docs/Web/API/RTCPeerConnection/connectionState
      if (state === "disconnected" || state === "failed") {
        this.rePlay(videoElm);
      }
    });
  }

  // 重播
  protected rePlay(videoElm: string) {
    setTimeout(() => {
      this.play(videoElm);
    }, 3000);
  }

  // 播放
  protected play(videoElm: string) {
    const plays = this.mediaServerAddrMap.get(videoElm);
    const { sdpUrl } = this.createRtspUrl(plays);
    const { w, h } = this.config;
    const EndpointConfig = {
      element: plays.videoDom || document.getElementById(videoElm),
      debug: false,
      zlmsdpUrl: sdpUrl,
      simulcast: false,
      useCamera: false,
      audioEnable: false,
      videoEnable: true,
      recvOnly: true,
      resolution: { w, h },
    };
    const player = new Endpoint({
      ...Object.assign(EndpointConfig, this.config.endpointConfig),
    });
    this.playEvent(player, videoElm, sdpUrl);
    this.playerMap.set(videoElm, player);
  }

  // 开始播放
  startPlay(plays: PlayVideoArgs) {
    setTimeout(() => {
      this.play(plays.videoElm);
    }, 100);
  }
}

export default {
  Endpoint,
  Events,
  GetAllScanResolution,
  GetSupportCameraResolutions,
  Media,
  isSupportResolution,
};
