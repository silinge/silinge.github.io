# 部署指南：将轨迹追踪器应用部署到GitHub Pages

本指南将帮助您将轨迹追踪器应用部署到GitHub Pages上，使其可以通过网络访问。

## 准备工作

1. 确保您已经安装了Git，并且有一个GitHub账号。
2. 确保您的项目已经准备好，代码可以正常运行。

## 部署步骤

### 1. 创建GitHub仓库

1. 登录您的GitHub账号。
2. 点击右上角的"+"按钮，选择"New repository"。
3. 填写仓库名称为"trackers"。
4. 选择公开(Public)或私有(Private)，建议选择公开以便于访问GitHub Pages。
5. 点击"Create repository"创建仓库。

### 2. 初始化本地Git仓库并推送到GitHub

```bash
# 在项目根目录下初始化Git仓库
git init

# 添加所有文件到暂存区
git add .

# 提交更改
git commit -m "初始化项目"

# 添加远程仓库
git remote add origin https://github.com/[你的GitHub用户名]/trackers.git

# 推送到GitHub
git push -u origin main
```

注意：如果您的默认分支是master而不是main，请相应调整上述命令。

### 3. 修改package.json中的homepage字段

打开package.json文件，确保homepage字段已正确设置：

```json
"homepage": "https://[你的GitHub用户名].github.io/huba/trackers"
```

请将[你的GitHub用户名]替换为您的实际GitHub用户名。

### 4. 使用npm部署到GitHub Pages

```bash
# 安装gh-pages包（如果尚未安装）
npm install --save-dev gh-pages

# 部署到GitHub Pages
npm run deploy
```

这将执行以下操作：
1. 运行predeploy脚本，构建您的应用
2. 运行deploy脚本，将构建后的文件发布到GitHub Pages

### 5. 配置GitHub Pages

1. 在GitHub上访问您的仓库。
2. 点击"Settings"。
3. 在左侧菜单中找到并点击"Pages"。
4. 在"Source"部分，选择"gh-pages"分支和"/root"文件夹。
5. 点击"Save"。

### 6. 访问您的应用

部署完成后，您可以通过以下URL访问您的应用：

```
https://[你的GitHub用户名].github.io/huba/trackers
```

部署可能需要几分钟时间才能生效。

## 更新应用

当您对代码进行更改后，只需重新运行部署命令即可更新GitHub Pages上的应用：

```bash
npm run deploy
```

## 常见问题

### 资源加载失败

如果您的应用在GitHub Pages上无法正确加载资源（如图片、CSS或JavaScript文件），请检查：

1. vite.config.ts中的base配置是否正确设置为'/huba/trackers/'。
2. 确保所有资源路径都是相对路径，或者使用import导入资源。

### 路由问题

如果您的应用使用了前端路由（如React Router），可能需要额外配置以支持GitHub Pages的单页应用部署。请参考相关路由库的文档进行配置。

### 部署失败

如果部署失败，请检查：

1. 您是否有GitHub仓库的写入权限。
2. 构建过程是否成功完成（没有错误）。
3. gh-pages包是否正确安装。

## 自动化部署（可选）

您也可以设置GitHub Actions来自动部署您的应用。这样，每当您推送代码到主分支时，应用就会自动部署到GitHub Pages。

要设置GitHub Actions，请在项目根目录创建`.github/workflows/deploy.yml`文件，并添加适当的工作流配置。

祝您部署顺利！