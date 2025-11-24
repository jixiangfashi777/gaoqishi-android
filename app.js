// 高七师佛学心理学 Android APP
// API配置
const API_BASE = 'https://gaoqishi.pages.dev/api';

// 全局状态
const state = {
    articles: [],
    categories: [],
    files: [],
    currentArticle: null,
    currentPage: 'home',
    ttsEnabled: false,
    ttsPlaying: false,
    speechSynthesis: window.speechSynthesis,
    utterance: null
};

// 页面导航
function showPage(pageName) {
    // 隐藏所有页面
    document.querySelectorAll('.page').forEach(page => {
        page.classList.remove('active');
    });
    
    // 显示目标页面
    document.getElementById(`${pageName}-page`).classList.add('active');
    
    // 更新导航状态
    document.querySelectorAll('.nav-item').forEach(item => {
        item.classList.remove('active');
    });
    event.currentTarget.classList.add('active');
    
    // 加载页面数据
    state.currentPage = pageName;
    loadPageData(pageName);
    
    // 隐藏TTS按钮（仅在文章页显示）
    if (pageName !== 'article') {
        document.getElementById('tts-button').style.display = 'none';
        stopTTS();
    }
}

// 加载页面数据
async function loadPageData(pageName) {
    switch(pageName) {
        case 'home':
            await loadHomeData();
            break;
        case 'category':
            await loadCategories();
            break;
        case 'files':
            await loadFiles();
            break;
    }
}

// 加载首页数据
async function loadHomeData() {
    const container = document.getElementById('home-content');
    container.innerHTML = '<div class="loading"><div class="spinner"></div><p class="mt-4">加载中...</p></div>';
    
    try {
        // 加载最新文章
        const response = await axios.get(`${API_BASE}/articles?page=1&limit=20`);
        state.articles = response.data.articles || [];
        
        let html = '<div class="space-y-4">';
        
        if (state.articles.length === 0) {
            html += '<div class="text-center text-gray-500 py-8">暂无文章</div>';
        } else {
            state.articles.forEach(article => {
                html += `
                    <div class="card p-4" onclick="showArticle(${article.id})">
                        <h3 class="text-lg font-bold text-gray-800 mb-2">${article.title}</h3>
                        ${article.subtitle ? `<p class="text-gray-600 text-sm mb-2">${article.subtitle}</p>` : ''}
                        <div class="flex justify-between items-center text-sm text-gray-500">
                            <span class="bg-gradient-to-r from-yellow-500 to-red-500 text-white px-3 py-1 rounded-full text-xs">
                                ${article.category_name || '未分类'}
                            </span>
                            <span>
                                <i class="fas fa-eye mr-1"></i>${article.views || 0}
                                <span class="ml-3"><i class="fas fa-calendar mr-1"></i>${formatDate(article.created_at)}</span>
                            </span>
                        </div>
                    </div>
                `;
            });
        }
        
        html += '</div>';
        container.innerHTML = html;
    } catch (error) {
        console.error('加载首页数据失败', error);
        container.innerHTML = '<div class="text-center text-red-500 py-8">加载失败，请检查网络连接</div>';
    }
}

// 加载分类
async function loadCategories() {
    const container = document.getElementById('category-content');
    container.innerHTML = '<div class="loading"><div class="spinner"></div><p class="mt-4">加载中...</p></div>';
    
    try {
        const response = await axios.get(`${API_BASE}/categories`);
        state.categories = response.data || [];
        
        let html = '<div class="grid grid-cols-2 gap-4">';
        
        const iconMap = {
            'fuxue': '🙏',
            'ta': '🗣️',
            'sf': '🎯',
            'shuji': '📚',
            'qita': '📄',
            'xiazai': '📥',
            'yinpin': '🎵',
            'shipin': '🎬'
        };
        
        state.categories.forEach(category => {
            const icon = iconMap[category.slug] || '📁';
            html += `
                <div class="card p-6 text-center" onclick="showCategoryArticles('${category.slug}')">
                    <div class="text-5xl mb-3">${icon}</div>
                    <h3 class="text-lg font-bold text-gray-800">${category.name}</h3>
                    <p class="text-sm text-gray-500 mt-2">${category.article_count || 0} 篇</p>
                </div>
            `;
        });
        
        html += '</div>';
        container.innerHTML = html;
    } catch (error) {
        console.error('加载分类失败', error);
        container.innerHTML = '<div class="text-center text-red-500 py-8">加载失败</div>';
    }
}

// 显示分类文章
async function showCategoryArticles(slug) {
    const container = document.getElementById('category-content');
    container.innerHTML = '<div class="loading"><div class="spinner"></div><p class="mt-4">加载中...</p></div>';
    
    try {
        const response = await axios.get(`${API_BASE}/articles?category=${slug}&limit=50`);
        const articles = response.data.articles || [];
        
        let html = `
            <div class="mb-4">
                <button onclick="loadCategories()" class="text-blue-600">
                    <i class="fas fa-arrow-left mr-2"></i>返回分类
                </button>
            </div>
            <div class="space-y-4">
        `;
        
        if (articles.length === 0) {
            html += '<div class="text-center text-gray-500 py-8">该分类暂无文章</div>';
        } else {
            articles.forEach(article => {
                html += `
                    <div class="card p-4" onclick="showArticle(${article.id})">
                        <h3 class="text-lg font-bold text-gray-800 mb-2">${article.title}</h3>
                        ${article.subtitle ? `<p class="text-gray-600 text-sm mb-2">${article.subtitle}</p>` : ''}
                        <div class="text-sm text-gray-500">
                            <i class="fas fa-eye mr-1"></i>${article.views || 0}
                            <span class="ml-3"><i class="fas fa-calendar mr-1"></i>${formatDate(article.created_at)}</span>
                        </div>
                    </div>
                `;
            });
        }
        
        html += '</div>';
        container.innerHTML = html;
    } catch (error) {
        console.error('加载分类文章失败', error);
        container.innerHTML = '<div class="text-center text-red-500 py-8">加载失败</div>';
    }
}

// 显示文章详情
async function showArticle(articleId) {
    // 切换到文章页
    document.querySelectorAll('.page').forEach(page => page.classList.remove('active'));
    document.getElementById('article-page').classList.add('active');
    
    const container = document.getElementById('article-content');
    container.innerHTML = '<div class="loading"><div class="spinner"></div><p class="mt-4">加载中...</p></div>';
    
    // 显示TTS按钮
    document.getElementById('tts-button').style.display = 'flex';
    stopTTS(); // 停止之前的播放
    
    try {
        const response = await axios.get(`${API_BASE}/articles/${articleId}`);
        const article = response.data.article;
        state.currentArticle = article;
        
        let html = `
            <div class="mb-4">
                <button onclick="backToHome()" class="text-blue-600">
                    <i class="fas fa-arrow-left mr-2"></i>返回
                </button>
            </div>
            
            <div class="card p-6">
                <h1 class="text-2xl font-bold text-gray-800 mb-4">${article.title}</h1>
                
                ${article.subtitle ? `<p class="text-lg text-gray-600 mb-4">${article.subtitle}</p>` : ''}
                
                <div class="flex items-center text-sm text-gray-500 mb-6 pb-4 border-b">
                    <span class="bg-gradient-to-r from-yellow-500 to-red-500 text-white px-3 py-1 rounded-full mr-4">
                        ${article.category_name || '未分类'}
                    </span>
                    <span><i class="fas fa-eye mr-1"></i>${article.views || 0}</span>
                    <span class="ml-4"><i class="fas fa-calendar mr-1"></i>${formatDate(article.created_at)}</span>
                </div>
                
                <div class="article-content">
                    ${article.content ? article.content.replace(/\n/g, '<br>') : ''}
                </div>
            </div>
            
            <div class="mt-4 text-center text-sm text-gray-500">
                <p>点击右下角播放按钮可以收听文章</p>
            </div>
        `;
        
        container.innerHTML = html;
    } catch (error) {
        console.error('加载文章失败', error);
        container.innerHTML = '<div class="text-center text-red-500 py-8">加载失败</div>';
    }
}

// 返回首页
function backToHome() {
    document.querySelectorAll('.page').forEach(page => page.classList.remove('active'));
    document.getElementById('home-page').classList.add('active');
    document.querySelectorAll('.nav-item').forEach(item => item.classList.remove('active'));
    document.querySelectorAll('.nav-item')[0].classList.add('active');
    document.getElementById('tts-button').style.display = 'none';
    stopTTS();
    state.currentPage = 'home';
}

// 加载文件列表
async function loadFiles() {
    const container = document.getElementById('files-content');
    container.innerHTML = `
        <div class="grid grid-cols-2 gap-4 mb-6">
            <div class="card p-6 text-center" onclick="loadFilesByType('document')">
                <div class="text-5xl mb-3">📚</div>
                <h3 class="text-lg font-bold">书籍</h3>
            </div>
            <div class="card p-6 text-center" onclick="loadFilesByType('audio')">
                <div class="text-5xl mb-3">🎵</div>
                <h3 class="text-lg font-bold">音频</h3>
            </div>
            <div class="card p-6 text-center" onclick="loadFilesByType('video')">
                <div class="text-5xl mb-3">🎬</div>
                <h3 class="text-lg font-bold">视频</h3>
            </div>
            <div class="card p-6 text-center" onclick="loadFilesByType('download')">
                <div class="text-5xl mb-3">📥</div>
                <h3 class="text-lg font-bold">下载</h3>
            </div>
        </div>
        <div id="files-list"></div>
    `;
}

// 按类型加载文件
async function loadFilesByType(type) {
    const listContainer = document.getElementById('files-list');
    listContainer.innerHTML = '<div class="loading"><div class="spinner"></div><p class="mt-4">加载中...</p></div>';
    
    try {
        const response = await axios.get(`${API_BASE}/files/public/${type}?limit=50`);
        const files = response.data.files || [];
        
        let html = `
            <div class="mb-4">
                <button onclick="loadFiles()" class="text-blue-600">
                    <i class="fas fa-arrow-left mr-2"></i>返回
                </button>
            </div>
            <div class="space-y-4">
        `;
        
        if (files.length === 0) {
            html += '<div class="text-center text-gray-500 py-8">暂无文件</div>';
        } else {
            files.forEach(file => {
                html += `
                    <div class="card p-4">
                        <div class="flex items-center justify-between">
                            <div class="flex-1">
                                <h3 class="font-bold text-gray-800">${file.original_name}</h3>
                                <p class="text-sm text-gray-500 mt-1">
                                    ${formatFileSize(file.file_size)} · ${formatDate(file.created_at)}
                                </p>
                            </div>
                            <a href="${API_BASE.replace('/api', '')}/api/files/download/${file.filename}" 
                               target="_blank"
                               class="ml-4 bg-gradient-to-r from-red-500 to-red-600 text-white px-4 py-2 rounded-lg">
                                <i class="fas fa-download"></i>
                            </a>
                        </div>
                    </div>
                `;
            });
        }
        
        html += '</div>';
        listContainer.innerHTML = html;
    } catch (error) {
        console.error('加载文件失败', error);
        listContainer.innerHTML = '<div class="text-center text-red-500 py-8">加载失败</div>';
    }
}

// TTS功能 - 切换播放/暂停
function toggleTTS() {
    if (!state.currentArticle) return;
    
    if (state.ttsPlaying) {
        stopTTS();
    } else {
        startTTS();
    }
}

// 开始TTS播放
function startTTS() {
    if (!state.currentArticle) return;
    
    // 停止之前的播放
    if (state.speechSynthesis) {
        state.speechSynthesis.cancel();
    }
    
    // 准备文本内容
    const article = state.currentArticle;
    let textContent = article.title + '。';
    if (article.subtitle) {
        textContent += article.subtitle + '。';
    }
    if (article.content) {
        // 移除HTML标签
        const tempDiv = document.createElement('div');
        tempDiv.innerHTML = article.content;
        textContent += tempDiv.textContent || tempDiv.innerText || '';
    }
    
    // 创建语音合成实例
    state.utterance = new SpeechSynthesisUtterance(textContent);
    
    // 设置中文语音
    const voices = state.speechSynthesis.getVoices();
    const chineseVoice = voices.find(voice => voice.lang.includes('zh'));
    if (chineseVoice) {
        state.utterance.voice = chineseVoice;
    }
    
    // 设置语音参数
    state.utterance.lang = 'zh-CN';
    state.utterance.rate = 1.0;  // 语速
    state.utterance.pitch = 1.0; // 音调
    state.utterance.volume = 1.0; // 音量
    
    // 播放结束回调
    state.utterance.onend = () => {
        state.ttsPlaying = false;
        updateTTSButton();
    };
    
    // 播放错误回调
    state.utterance.onerror = (event) => {
        console.error('TTS播放错误', event);
        state.ttsPlaying = false;
        updateTTSButton();
        alert('语音播放失败，请检查设备设置');
    };
    
    // 开始播放
    state.speechSynthesis.speak(state.utterance);
    state.ttsPlaying = true;
    updateTTSButton();
}

// 停止TTS播放
function stopTTS() {
    if (state.speechSynthesis) {
        state.speechSynthesis.cancel();
    }
    state.ttsPlaying = false;
    updateTTSButton();
}

// 更新TTS按钮状态
function updateTTSButton() {
    const button = document.getElementById('tts-button');
    const icon = document.getElementById('tts-icon');
    
    if (state.ttsPlaying) {
        button.classList.add('playing');
        icon.className = 'fas fa-pause';
    } else {
        button.classList.remove('playing');
        icon.className = 'fas fa-play';
    }
}

// 工具函数 - 格式化日期
function formatDate(dateString) {
    const date = new Date(dateString);
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
}

// 工具函数 - 格式化文件大小
function formatFileSize(bytes) {
    if (bytes === 0) return '0 B';
    const k = 1024;
    const sizes = ['B', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return Math.round(bytes / Math.pow(k, i) * 100) / 100 + ' ' + sizes[i];
}

// 初始化应用
document.addEventListener('DOMContentLoaded', () => {
    console.log('APP初始化...');
    
    // 加载首页数据
    loadHomeData();
    
    // 确保语音合成API就绪
    if ('speechSynthesis' in window) {
        // 加载可用的语音列表
        speechSynthesis.getVoices();
        
        // 监听语音列表变化（某些浏览器需要）
        if (speechSynthesis.onvoiceschanged !== undefined) {
            speechSynthesis.onvoiceschanged = () => {
                speechSynthesis.getVoices();
            };
        }
    } else {
        console.warn('浏览器不支持语音合成API');
    }
    
    // 防止页面被拉动
    document.body.addEventListener('touchmove', (e) => {
        if (e.target.tagName !== 'DIV' || !e.target.classList.contains('page')) {
            // e.preventDefault();
        }
    }, { passive: false });
});
