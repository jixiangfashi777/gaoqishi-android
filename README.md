# 高七师佛学心理学 - Android APP

一个功能完整的Android应用，包含文章浏览、分类查看、资源下载和**TTS语音播放**功能。

## ✨ 主要功能

### 核心功能
- ✅ **文章浏览**: 首页展示最新文章列表
- ✅ **文章详情**: 完整的文章阅读体验
- ✅ **TTS语音播放**: 文章详情页右下角的播放按钮，点击即可收听文章
- ✅ **分类浏览**: 按8个分类浏览文章
- ✅ **资源下载**: 书籍、音频、视频资源下载
- ✅ **底部导航**: 首页、分类、资源、我的

### TTS功能特色
- 🔊 **本地TTS**: 使用设备语音，无需联网
- 🎙️ **中文朗读**: 自动识别中文内容
- ⏯️ **播放控制**: 播放/暂停切换
- 📖 **全文朗读**: 自动朗读标题、副标题和正文
- 🎨 **动画效果**: 播放时按钮有脉冲动画

### UI设计
- 🎨 **佛教风格**: 黄色和红色主色调
- 📱 **响应式**: 适配各种Android设备
- 🌊 **流畅动画**: 平滑的页面切换和交互
- 💎 **卡片设计**: 现代化的Material Design风格

## 📁 项目结构

```
gaoqishi-android/
├── index.html          # 主HTML文件
├── app.js              # 核心JavaScript逻辑（包含TTS）
├── package.json        # NPM配置
├── README.md           # 本文件
├── 打包APK指南.md      # 详细的APK打包指南
└── vite.config.js      # Vite构建配置（如需）
```

## 🚀 快速开始

### 本地预览

1. **直接打开HTML**:
   ```bash
   # 直接用浏览器打开
   open index.html  # Mac
   start index.html # Windows
   ```

2. **使用本地服务器** (推荐):
   ```bash
   # 安装http-server
   npm install -g http-server
   
   # 启动服务器
   cd gaoqishi-android
   http-server -p 8080
   
   # 访问 http://localhost:8080
   ```

3. **使用Python服务器**:
   ```bash
   # Python 3
   python -m http.server 8080
   
   # 访问 http://localhost:8080
   ```

### 在手机浏览器测试

1. 启动本地服务器
2. 查看电脑IP地址: `ipconfig` (Windows) 或 `ifconfig` (Mac/Linux)
3. 在手机浏览器访问: `http://你的IP:8080`
4. 测试所有功能，特别是TTS播放

## 📦 打包APK

详细的打包指南请查看 `打包APK指南.md`

### 最快速方式（推荐）

**使用PWA Builder在线打包**:

1. 部署到GitHub Pages或Cloudflare Pages
2. 访问 https://www.pwabuilder.com/
3. 输入您的APP URL
4. 选择Android平台
5. 下载生成的APK

**总耗时**: 15-30分钟

### 使用Cordova本地打包

```bash
# 1. 安装Cordova
npm install -g cordova

# 2. 创建项目
cordova create myapp com.gaoqishi.app 高七师
cd myapp

# 3. 添加Android平台
cordova platform add android

# 4. 复制文件
cp ../index.html www/
cp ../app.js www/

# 5. 构建APK
cordova build android

# APK位置: platforms/android/app/build/outputs/apk/debug/app-debug.apk
```

## 🔊 TTS功能使用

### 用户使用步骤
1. 打开任意文章
2. 查看右下角的红色播放按钮
3. 点击开始朗读
4. 再次点击暂停

### 技术实现
使用浏览器原生 `SpeechSynthesis` API:
```javascript
const utterance = new SpeechSynthesisUtterance(text);
utterance.lang = 'zh-CN';
speechSynthesis.speak(utterance);
```

### TTS配置
- **语言**: 中文（zh-CN）
- **语速**: 1.0（正常）
- **音调**: 1.0（正常）
- **音量**: 1.0（最大）

## 🎨 自定义配置

### 修改API地址

编辑 `app.js` 第3行:
```javascript
const API_BASE = 'https://gaoqishi.pages.dev/api';
```

### 修改主题颜色

编辑 `index.html` 的 `<style>` 部分:
```css
/* 主色调 */
background: linear-gradient(135deg, #C41E3A, #E63950);

/* 次要色 */
background: linear-gradient(135deg, #FFF8DC 0%, #FAEBD7 100%);
```

### 修改TTS参数

编辑 `app.js` 的 `startTTS()` 函数:
```javascript
state.utterance.rate = 1.0;  // 语速 (0.1-10)
state.utterance.pitch = 1.0; // 音调 (0-2)
state.utterance.volume = 1.0; // 音量 (0-1)
```

## 📱 功能截图说明

### 首页
- 顶部标题和副标题
- 文章卡片列表
- 分类标签
- 底部导航栏

### 文章详情页
- 返回按钮
- 文章标题和副标题
- 文章内容
- 右下角TTS播放按钮（红色圆形）

### 分类页
- 8个分类卡片
- 图标和文章数量
- 点击进入分类文章列表

### 资源页
- 4种资源类型（书籍、音频、视频、下载）
- 文件列表
- 下载按钮

## 🔧 技术栈

- **前端框架**: 原生HTML/CSS/JavaScript
- **样式**: TailwindCSS (CDN)
- **图标**: Font Awesome
- **HTTP请求**: Axios
- **TTS**: Web Speech API
- **打包工具**: Cordova / PWA Builder

## 📊 API接口

所有数据来自后端API:
- `GET /api/articles` - 获取文章列表
- `GET /api/articles/:id` - 获取文章详情
- `GET /api/categories` - 获取分类列表
- `GET /api/files/public/:type` - 获取文件列表

## ⚙️ 系统要求

### 开发环境
- Node.js 14+
- 现代浏览器（Chrome, Firefox, Safari）

### 打包APK需要
- Java JDK 8 或 11
- Android Studio (可选)
- Gradle (自动安装)

### APP运行要求
- Android 5.0 (API 21) 或更高
- 支持 WebView
- 网络连接（加载数据）
- TTS语音包（设备自带）

## 🐛 故障排除

### TTS不工作
1. 检查设备是否安装中文语音包
2. 设备设置 → 语言和输入法 → 文字转语音输出
3. 选择中文语音引擎

### 无法加载数据
1. 检查网络连接
2. 确认API地址正确
3. 查看浏览器控制台错误信息

### APK安装失败
1. 启用"未知来源"安装
2. 检查Android版本是否≥5.0
3. 确保有足够存储空间

## 📞 技术支持

- **微信**: zhuntifacom
- **网站**: https://gaoqishi.pages.dev
- **GitHub**: https://github.com/jixiangfashi777/my_wangzhbeifen

## 📄 许可证

本项目为私有项目，版权所有 © 2025 高七师

---

## 🎯 下一步

1. ✅ 在浏览器中测试所有功能
2. ✅ 在手机浏览器中测试
3. ✅ 使用PWA Builder生成APK
4. ✅ 安装到Android设备测试
5. ✅ 测试TTS功能
6. 🔄 根据需要调整和优化
7. 🚀 分享给用户使用

**祝使用愉快！🙏**
