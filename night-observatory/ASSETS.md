# 夜班观测站素材

文字和 Spec V2 角色卡是此示例的原创内容；图片由内置 imagegen 生成，原始 PNG 保持不变。模板将头像与基础立绘指向同一图片。下面是生成时使用的人物、构图和修改要求，方便 fork 后继续创作。

## 图片提示集

共同要求：original hand-painted storybook / modern visual-novel illustration; clean readable silhouette; soft lighting; slightly stylized adult proportions; full body, centered portrait framing with padding around head and shoes; front slight three-quarter view. Transparent background with genuine alpha. No scenery, lettering, logo, watermark or extra figures. Do not imitate an existing character or named artist.

- **Mira 基础立绘**：An original adult female observatory planner in her late twenties. Short dark wavy hair, copper round glasses, teal practical work coat over cream clothes. Holds a small notebook at waist height. Warm, curious neutral expression.
- **Sol 基础立绘**：An original adult male observatory engineer in his early thirties. Tousled dark brown hair, warm medium skin, rolled-up slate-blue shirt, ochre utility vest, charcoal trousers and worn boots. Holds a folded telescope schematic with no legible writing. Relaxed, mildly amused expression, quiet dry humor. Match Mira's illustration style and framing.
- **Mira 开心表情编辑**：Edit the Mira base image. Change only her facial expression to a delighted warm open smile and bright eyes. Preserve identity, clothes, notebook, pose, lighting, full-body framing, dimensions and transparency; add nothing else.
- **Sol 若有所思表情编辑**：Edit the Sol base image. Change only his facial expression to friendly skepticism, one raised eyebrow and a restrained half-smile. Preserve identity, clothes, schematic, pose, lighting, full-body framing, dimensions and transparency; add nothing else.

## 文件对应

所有路径位于本目录的 `assets/` 中，完整字节数及 SHA-256 见 `team-package.json`。

| 用途          | 文件                                                                    |
| ------------- | ----------------------------------------------------------------------- |
| Mira 原卡     | `fb157a7262bf8c7b6a66c82a5efe2edc0ca5175f113e07fcdfc6ed353452084a.json` |
| Mira 基础立绘 | `b5a4d5390c9a1dac1dbf65637380baad09fb0a2df52cf3366c3c3ef3dc6ed32c.png`  |
| Mira 开心     | `bd074bcab651285420198a0be599e25056e88fca6e3fdacdd6dca8c8ce8bb4c7.png`  |
| Mira 提示音   | `96da292f3aad0253717c5536fe268503b3d026fac6ae46996a76a9eed5686e33.wav`  |
| Sol 原卡      | `718855525ba28477f94cedd7eca27d7732085a7dd0d582399c2fee01da1b3954.json` |
| Sol 基础立绘  | `6f7989861a4d4883fce715bb9de06cc17da4315bd6e6e3d2c153b1e8e2c4b5bd.png`  |
| Sol 若有所思  | `25512d32a6dcc0f93fda08f720e80c8023854bf1db72f0957cfa90fbb838b835.png`  |
| Sol 提示音    | `0a2995cc405cf80703a14cbbc4af2377001584f8805be533744a50e5d66a6e4d.wav`  |

提示音是原创合成音，24 kHz、单声道、16-bit PCM，各约 0.72 秒；它们用于演示手动播放，不含语音。图片为 1024×1536 RGBA PNG。人物名字、性格及部门结构都可以在自己的 fork 中修改。
