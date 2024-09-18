import { VRM, VRMExpressionPresetName, VRMLoaderPlugin, VRMUtils } from '@pixiv/three-vrm';
import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';

import { VRMLookAtSmootherLoaderPlugin } from '@/libs/VRMLookAtSmootherLoaderPlugin/VRMLookAtSmootherLoaderPlugin';
import { EmoteController } from '@/libs/emoteController/emoteController';
import { LipSync } from '@/libs/lipSync/lipSync';
import { Screenplay } from '@/types/touch';

import { MotionFileType } from '../emoteController/type';

/**
 * 3Dキャラクターを管理するクラス
 */
export class Model {
  public vrm?: VRM | null;
  public emoteController?: EmoteController;

  private _lookAtTargetParent: THREE.Object3D;
  private _lipSync?: LipSync;

  constructor(lookAtTargetParent: THREE.Object3D) {
    this._lookAtTargetParent = lookAtTargetParent;
    this._lipSync = new LipSync(new AudioContext());
  }

  public async loadVRM(url: string): Promise<void> {
    const loader = new GLTFLoader();
    loader.crossOrigin = 'anonymous';

    loader.register(
      (parser) =>
        new VRMLoaderPlugin(parser, {
          lookAtPlugin: new VRMLookAtSmootherLoaderPlugin(parser),
          autoUpdateHumanBones: true,
        }),
    );
    const gltf = await loader.loadAsync(url);

    // 提升性能
    VRMUtils.removeUnnecessaryVertices(gltf.scene);
    VRMUtils.removeUnnecessaryJoints(gltf.scene);

    const vrm = (this.vrm = gltf.userData.vrm);
    vrm.scene.name = 'VRMRoot';

    VRMUtils.rotateVRM0(vrm);

    this.emoteController = new EmoteController(vrm, this._lookAtTargetParent);
  }

  public unLoadVrm() {
    if (this.vrm) {
      VRMUtils.deepDispose(this.vrm.scene);
      this.vrm = null;
    }
  }

  public async playMotionUrl(fileType: MotionFileType, url: string, loop: boolean = true) {
    this.emoteController?.playMotionUrl(fileType, url, loop);
  }

  public async loadIdleAnimation() {
    this.emoteController?.playEmotion(VRMExpressionPresetName.Neutral);
    this.emoteController?.playMotionUrl(MotionFileType.VRMA, './idle_loop.vrma', true);
  }

  /**
   * 语音播放，配合人物表情动作
   * @param buffer
   * @param screenplay
   */
  public async speak(buffer: ArrayBuffer, screenplay: Screenplay) {
    this.emoteController?.playEmotion(screenplay.expression);
    if (screenplay.motion) this.emoteController?.playMotion(screenplay.motion);
    await new Promise((resolve) => {
      this._lipSync?.playFromArrayBuffer(buffer, () => {
        resolve(true);
      });
    });
  }

  /**
   * 停止语音
   */
  public stopSpeak() {
    this._lipSync?.stopPlay();
    this.emoteController?.playEmotion('neutral');
  }

  public update(delta: number): void {
    if (this._lipSync) {
      const { volume } = this._lipSync.update();
      this.emoteController?.lipSync('aa', volume);
    }
    // vrm 先更新
    this.vrm?.update(delta);
    // 后更新表情动作
    this.emoteController?.update(delta);
  }
}