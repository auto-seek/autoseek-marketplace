# Video Shotcraft

![Video Shotcraft 头像](assets/avatar.png)

用真实产品页面和 Remotion 制作可编辑的宣传片。包括 124 张镜头配方卡、150 个镜头、Ink Press 模板、Motion Workbench、音效选材与对齐工具，以及剪映草稿导出。

## 安装与使用

在 AutoSeek 的插件市场中检查更新，搜索 **Video Shotcraft**，安装后在目标项目的对话中提出任务，例如：

- “用 Video Shotcraft 为我的产品制作一支宣传片。”
- “用 Ink Press 模板为这个网页制作宣传片。”
- “用 Video Shotcraft 给这个镜头添加并对齐音效。”

准备好产品项目或网页地址。完整视频可使用模板、自主创作或共同创作；技能会按任务范围引导。仅处理音效时可直接搜索候选或对齐声音。

需要 Node.js/npm 和 ffmpeg/ffprobe；节拍分析另外需要 uv。页面采集和 Remotion 首次渲染可能下载浏览器或依赖。安装插件本身不安装这些系统工具，也不自动运行制作脚本。

[上游中文说明](skills/video-shotcraft/README_CN.md) · [动态镜头画廊](https://vincentwei1021.github.io/video-shotcraft/) · [技能入口](skills/video-shotcraft/SKILL.md)

## 来源与维护

- 原作者：Wei Yihao（[Vincentwei1021](https://github.com/Vincentwei1021)）。
- 上游：[Vincentwei1021/video-shotcraft](https://github.com/Vincentwei1021/video-shotcraft)。
- AutoSeek fork：[auto-seek/video-shotcraft](https://github.com/auto-seek/video-shotcraft)。
- 收录提交：`3ac67b75dd0b3bc2fd807c17f6b7ce35373eef3d`，收录日期：2026-11-10。
- 市场包版本：`1.0.0`。

`skills/video-shotcraft/` 是该上游提交的完整快照，保留原有目录、模板、音频、脚本、说明和许可证。AutoSeek 在包根增加市场清单、头像和本说明。因插件包不接受符号链接，`workbench/demosrc → ../demos` 展开为同内容的普通目录；原有引用路径、技能正文与制作流程未修改。同步上游时替换该快照，核对清单及资源路径，并提高市场包版本。

头像由内置 imagegen 工具生成，提示词保存在 [assets/avatar-prompt.txt](assets/avatar-prompt.txt)。它是 AutoSeek 市场头像，上游原始品牌标志仍保留在技能目录中。

## 许可

- 上游代码与文档：[Apache-2.0](LICENSE)，保留原作者版权及声明。
- BGM：[素材归属](skills/video-shotcraft/assets/audio/ATTRIBUTION.md)。
- 模板历史音频：[模板音频归属](skills/video-shotcraft/template/public/audio/ATTRIBUTION.md)。
- 新视频使用的 Freesound 音效须按每个文件的许可证保留来源及必要署名。
- Remotion 使用其自身许可证，部分公司使用场景需要商业许可；使用前查看[上游许可说明](skills/video-shotcraft/README.md#license)。
- 模板中的产品截图是演示素材，发布成片前替换为自己的产品内容。
