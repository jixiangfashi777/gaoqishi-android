# Android APK 打包指南

## 📱 项目说明

这是一个功能完整的Android APP，包含以下特性：
- ✅ 文章浏览和详情查看
- ✅ 分类浏览
- ✅ 资源下载
- ✅ **TTS语音播放**（文章详情页右下角播放按钮）
- ✅ 底部导航栏
- ✅ 佛教风格UI设计

## 🚀 两种打包方式

### 方式一：使用在线打包工具（最简单，推荐）

#### 1. 使用 WebToApp 或类似工具

**推荐工具**:
- **AppsGeyser**: https://appsgeyser.com/
- **Gonative**: https://gonative.io/
- **Appery.io**: https://appery.io/

**步骤**:
1. 访问上述任一网站
2. 选择"从网址创建APP"或"Website to App"
3. 输入URL或上传HTML文件
4. 配置APP信息（名称、图标等）
5. 下载生成的APK文件

#### 2. 使用 Capacitor（本地打包）

这是最专业的方式，需要在有Android开发环境的电脑上操作。

### 方式二：使用 Cordova 本地打包（需要环境）

如果您有Android开发环境，可以按以下步骤操作：

#### 前提条件
- 安装 Node.js
- 安装 Java JDK (8或11)
- 安装 Android Studio
- 安装 Gradle

#### 步骤1: 安装Cordova
```bash
npm install -g cordova
```

#### 步骤2: 创建Cordova项目
```bash
cd gaoqishi-android
cordova create cordova-app com.gaoqishi.app 高七师佛学心理学
cd cordova-app
```

#### 步骤3: 添加Android平台
```bash
cordova platform add android
```

#### 步骤4: 安装TTS插件
```bash
cordova plugin add cordova-plugin-tts
```

#### 步骤5: 复制文件
```bash
# 复制HTML、CSS、JS文件到www目录
cp ../index.html www/
cp ../app.js www/
```

#### 步骤6: 构建APK
```bash
# 调试版本
cordova build android

# 发布版本（需要签名）
cordova build android --release
```

生成的APK文件位置:
- 调试版: `platforms/android/app/build/outputs/apk/debug/app-debug.apk`
- 发布版: `platforms/android/app/build/outputs/apk/release/app-release-unsigned.apk`

## 🎯 快速在线打包步骤（推荐）

### 使用 PWA Builder

PWA Builder可以将您的Web应用转换为Android APK：

1. **访问**: https://www.pwabuilder.com/
2. **输入URL**: https://gaoqishi.pages.dev (或部署此APP的URL)
3. **点击"Package For Stores"**
4. **选择Android**
5. **填写应用信息**:
   - App name: 高七师佛学心理学
   - Package ID: com.gaoqishi.app
   - App version: 1.0.0
   - 上传图标（512x512 PNG）
6. **下载APK**

### 部署到服务器

如果使用在线工具，需要先将APP部署到可访问的URL：

#### 选项1: 使用GitHub Pages
```bash
# 创建GitHub仓库
git init
git add index.html app.js
git commit -m "Initial commit"
git remote add origin https://github.com/你的用户名/gaoqishi-app.git
git push -u origin main

# 在GitHub仓库设置中启用Pages
# 访问: https://你的用户名.github.io/gaoqishi-app
```

#### 选项2: 使用Cloudflare Pages
```bash
# 构建并部署
npm install
npm run build
wrangler pages deploy dist
```

#### 选项3: 使用Netlify
```bash
# 拖拽文件到 https://app.netlify.com/drop
# 或使用Netlify CLI
npm install -g netlify-cli
netlify deploy
```

## 📱 APK签名（可选，用于发布）

如果需要发布到应用商店，需要签名APK：

### 生成密钥
```bash
keytool -genkey -v -keystore my-release-key.keystore -alias my-key-alias -keyalg RSA -keysize 2048 -validity 10000
```

### 签名APK
```bash
jarsigner -verbose -sigalg SHA1withRSA -digestalg SHA1 -keystore my-release-key.keystore app-release-unsigned.apk my-key-alias
```

### 优化APK
```bash
zipalign -v 4 app-release-unsigned.apk app-release.apk
```

## 🛠️ 使用Docker打包（跨平台方案）

如果您没有Android开发环境，可以使用Docker：

```bash
# 使用Cordova Docker镜像
docker run -it --rm -v $(pwd):/app beevelop/cordova:latest bash

# 在容器内执行打包命令
cd /app
cordova create myapp
cd myapp
cordova platform add android
cordova build android
```

## 📦 最简单的方式 - Appetize.io 测试

在打包前，可以先在线测试：

1. 访问 https://appetize.io/
2. 上传index.html
3. 在线模拟Android环境运行
4. 确认功能正常后再打包

## 🎨 APP图标和启动画面

### 图标尺寸
创建以下尺寸的PNG图标：
- 512x512 (用于Google Play)
- 192x192
- 144x144
- 96x96
- 72x72
- 48x48
- 36x36

### 启动画面
创建以下尺寸的启动画面：
- 1280x1920 (port-xxxhdpi)
- 960x1440 (port-xxhdpi)
- 640x960 (port-xhdpi)
- 480x720 (port-hdpi)
- 320x480 (port-mdpi)

## 🔊 TTS功能说明

APP中的TTS功能使用浏览器原生的Speech Synthesis API：
- ✅ 无需联网（使用设备语音）
- ✅ 支持中文
- ✅ 可调节语速、音调
- ✅ 文章详情页自动显示播放按钮
- ✅ 播放/暂停切换
- ✅ 自动朗读文章标题和内容

### TTS使用方式
1. 打开任意文章
2. 点击右下角的播放按钮（🔊）
3. 自动开始朗读
4. 再次点击暂停

## ❓ 常见问题

### Q1: TTS功能在APK中不工作？
A: 
- 确保使用Cordova TTS插件
- 检查设备是否安装了中文语音包
- 设备设置 → 语言和输入法 → 文字转语音输出

### Q2: 如何减小APK体积？
A:
- 使用ProGuard混淆
- 移除未使用的资源
- 使用WebP格式图片
- 启用代码压缩

### Q3: APK安装后无法联网？
A:
- 检查AndroidManifest.xml中的网络权限
- 添加: `<uses-permission android:name="android.permission.INTERNET" />`

### Q4: 如何在没有Android Studio的情况下打包？
A:
- 使用在线打包工具（PWA Builder、AppsGeyser）
- 使用GitHub Actions自动化构建
- 使用Docker镜像

### Q5: 打包后图标不显示？
A:
- 确保图标尺寸正确
- 使用PNG格式
- 检查config.xml配置

## 📞 技术支持

- **微信**: zhuntifacom
- **网站**: https://gaoqishi.pages.dev

## 🎯 推荐流程

**最快速的打包方式**:
1. 将index.html和app.js上传到服务器（Cloudflare Pages/GitHub Pages）
2. 获取URL
3. 使用 PWA Builder (https://www.pwabuilder.com/) 生成APK
4. 下载并安装测试
5. 如需发布到商店，进行签名

**总耗时**: 约15-30分钟

---

**祝您打包顺利！🎉**

如有问题，欢迎联系技术支持。
