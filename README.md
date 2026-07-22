# Music Mizu

一个由 [Faircamp](https://faircamp.org/) 生成的独立音乐站，可直接部署到腾讯 EdgeOne Pages，并通过 GitHub Pages 在上线前预览。

站点包含《Noteblock》《草薙宁宁（Wonderlands✕Showtime）》《ProjectMili》《史替え歌》和《中考行进》五张专辑。界面采用以实用为先的高信息密度音乐资料库布局，提供固定侧栏、专辑曲目表格、页面搜索、媒体键支持和全局播放器。

站内导航使用局部页面切换：播放中的音频节点不会随专辑或首页内容一起重载，因此切换页面时音乐和进度会连续保留。

站娘“澪音 Mio”的头像用于 favicon 与站点品牌，透明立绘固定在桌面端右下角，三张主题插画和完整设定图位于首页介绍区。角色素材统一存放在 `catalog/assets/`，并由 Faircamp 复制到发布目录根部。

## 本地预览

1. 从 [Faircamp 官网](https://faircamp.org/) 安装 Faircamp 1.7 或更高版本。
2. 在 PowerShell 中运行：

   ```powershell
   faircamp --catalog-dir catalog --preview
   ```

   Faircamp 会构建站点并自动打开本地预览。

## 构建发布版本

Windows：

```powershell
.\scripts\build.cmd
```

macOS / Linux：

```bash
bash scripts/build.sh
```

生成结果位于 `dist/`。该目录会提交到 Git，GitHub Pages 和 EdgeOne 使用的是同一份静态文件。

## 替换成你的音乐

1. 每张专辑在 `catalog/` 下建立一个目录，放入 FLAC、MP3、WAV、OGG、OPUS、AIFF 或 ALAC 音频。
2. 将封面命名为 `cover.jpg` 或 `cover.png`。
3. 复制并修改已有专辑的 `release.eno`；站点总标题、简介和主题在 `catalog/catalog.eno` 中修改。
4. 重新运行构建脚本，并提交更新后的 `catalog/` 与 `dist/`。

Faircamp 会从音频标签读取曲名和序号。建议在导入前写好 `title`、`artist`、`album`、`track` 和 `date` 标签。

## GitHub Pages 预览

仓库已包含 `.github/workflows/pages.yml`。推送到 `main` 或 `master` 后：

1. 打开 GitHub 仓库的 **Settings → Pages**。
2. 在 **Build and deployment** 中选择 **GitHub Actions**。
3. 等待 `GitHub Pages Preview` 工作流完成。
4. 访问 `https://shizwd.github.io/musicmizu/`。

这可以作为 EdgeOne 正式发布前的公开预览。它部署的是已生成的 `dist/`，因此不会在 GitHub 上处理或转码你的原始音频。

## 腾讯 EdgeOne Pages

在 EdgeOne Pages 中选择 **导入 Git 仓库**，连接 `shizwd/musicmizu`，使用以下设置：

- 框架：Other / 其他
- 根目录：`/`
- 构建命令：`echo "Using prebuilt Faircamp site"`
- 输出目录：`dist`
- 安装命令：留空

EdgeOne 会直接发布 Faircamp 的静态输出。以后每次推送到生产分支，EdgeOne 都会自动部署最新版；也可以先选择 EdgeOne 的 **Preview Environment** 验证，再提升到生产环境。

## 目录结构

```text
catalog/                  Faircamp 音乐与站点配置
  catalog.eno             全站标题、简介、主题与元数据
  custom.css              桌面音乐应用布局与响应式主题
  custom.js               全局播放器、播放队列、搜索与局部导航
  assets/                 澪音头像、透明立绘、设定图与插画
  noteblock/              音符盒专辑
  projectmili/            Mili 作品合集
  shitige/                史替え歌合集
  zhongkao-xingjin/       中考行进
dist/                     已构建、可直接部署的静态站点
scripts/                  本地构建脚本
.github/workflows/        GitHub Pages 预览工作流
```

## 上线前检查

- 检查首页介绍、站娘设定和专辑信息是否仍与当前内容一致。
- 如需 RSS、嵌入播放器或 M3U，在 `catalog/catalog.eno` 中设置正式域名 `base_url` 后再启用对应选项。
- 确认音频和封面拥有发布权。
- 将自定义域名绑定到 EdgeOne，并按所选中国大陆加速区域完成可能需要的备案。
