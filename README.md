# Music Mizu

一个由 [Faircamp](https://faircamp.org/) 生成的独立音乐站，可直接部署到腾讯 EdgeOne Pages，并通过 GitHub Pages 在上线前预览。

站点自带一张原创示例专辑、可播放音频、波形、封面和 FLAC 下载。示例音频为程序化合成，不含第三方版权素材。

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

1. 删除 `catalog/memory-of-water/` 中的示例音频和封面。
2. 每张专辑在 `catalog/` 下建立一个目录，放入 FLAC、MP3、WAV、OGG、OPUS、AIFF 或 ALAC 音频。
3. 将封面命名为 `cover.jpg` 或 `cover.png`。
4. 复制并修改示例 `release.eno`；站点总标题、简介和主题在 `catalog/catalog.eno` 中修改。
5. 重新运行构建脚本，并提交更新后的 `catalog/` 与 `dist/`。

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
  custom.css              少量视觉增强
  memory-of-water/        可删除的示例专辑
dist/                     已构建、可直接部署的静态站点
scripts/                  本地构建脚本
.github/workflows/        GitHub Pages 预览工作流
```

## 上线前检查

- 将示例音乐、简介和 GitHub 联系链接换成正式内容。
- 如需 RSS、嵌入播放器或 M3U，在 `catalog/catalog.eno` 中设置正式域名 `base_url` 后再启用对应选项。
- 确认音频和封面拥有发布权。
- 将自定义域名绑定到 EdgeOne，并按所选中国大陆加速区域完成可能需要的备案。
