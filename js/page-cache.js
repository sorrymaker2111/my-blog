// 页面内容缓存和自动更新脚本

// 全局内容缓存存储
const pageCache = {
  // 缓存内容的数据结构
  contents: {},
  // 缓存时间戳
  timestamps: {},
  // 缓存有效期（毫秒）
  maxAge: 3600000, // 默认1小时
  // 移动端特殊标识
  isMobile: /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent),
  // 记录已访问页面
  visitedPages: {},
  
  // 获取缓存键
  getKey: function(url) {
    // 去除URL中的刷新参数和时间戳
    return url.replace(/[?&]refresh=true/, '')
              .replace(/[?&]t=\d+/, '')
              .replace(/[?&]_=\d+/, '');
  },
  
  // 存储内容到缓存
  store: function(url, content) {
    const key = this.getKey(url);
    this.contents[key] = content;
    this.timestamps[key] = Date.now();
    
    // 同时保存到localStorage（如果可用）
    try {
      const cacheObject = {
        content: content,
        timestamp: this.timestamps[key]
      };
      localStorage.setItem(`page_cache_${key}`, JSON.stringify(cacheObject));
    } catch (e) {
      console.warn('无法将缓存写入localStorage', e);
    }
  },
  
  // 从缓存获取内容
  get: function(url) {
    const key = this.getKey(url);
    
    // 首先检查内存缓存
    if (this.contents[key] && this.timestamps[key]) {
      const age = Date.now() - this.timestamps[key];
      if (age < this.maxAge) {
        return this.contents[key];
      }
    }
    
    // 如果内存中没有有效缓存，检查localStorage
    try {
      const storedCache = localStorage.getItem(`page_cache_${key}`);
      if (storedCache) {
        const cacheObject = JSON.parse(storedCache);
        const age = Date.now() - cacheObject.timestamp;
        
        if (age < this.maxAge) {
          // 将缓存加载到内存中
          this.contents[key] = cacheObject.content;
          this.timestamps[key] = cacheObject.timestamp;
          return cacheObject.content;
        } else {
          // 清除过期缓存
          localStorage.removeItem(`page_cache_${key}`);
        }
      }
    } catch (e) {
      console.warn('无法从localStorage读取缓存', e);
    }
    
    return null;
  },
  
  // 清除特定URL的缓存
  clear: function(url) {
    const key = this.getKey(url);
    delete this.contents[key];
    delete this.timestamps[key];
    
    try {
      localStorage.removeItem(`page_cache_${key}`);
    } catch (e) {
      console.warn('无法从localStorage删除缓存', e);
    }
  },
  
  // 清除所有缓存
  clearAll: function() {
    this.contents = {};
    this.timestamps = {};
    
    try {
      // 只清除我们的缓存项，不影响其他localStorage数据
      for (let i = 0; i < localStorage.length; i++) {
        const key = localStorage.key(i);
        if (key.startsWith('page_cache_')) {
          localStorage.removeItem(key);
        }
      }
    } catch (e) {
      console.warn('无法清除localStorage缓存', e);
    }
  }
};

// 检查URL中是否有强制刷新参数
function hasRefreshParam() {
  return window.location.href.indexOf('refresh=true') > -1;
}

// 检查URL中是否有禁止刷新参数
function hasNoRefreshParam() {
  return window.location.href.indexOf('no-refresh=true') > -1;
}

// 预加载页面内容
function preloadPageContent(url, callback) {
  // 移动端首页情况下，降低预加载优先级
  if (pageCache.isMobile && (url === '/' || url.indexOf('index.html') > -1)) {
    // 延迟执行，减轻加载压力
    setTimeout(() => {
      performPreload(url, callback);
    }, 2000); // 延迟2秒
  } else {
    performPreload(url, callback);
  }
}

// 执行实际预加载
function performPreload(url, callback) {
  // 构建针对每个页面的缓存URL
  let cacheUrl = url;
  
  // 添加时间戳参数以避免缓存
  if (cacheUrl.indexOf('?') > -1) {
    cacheUrl += '&_=' + Date.now();
  } else {
    cacheUrl += '?_=' + Date.now();
  }
  
  fetch(cacheUrl, {
    method: 'GET',
    headers: {'X-Requested-With': 'XMLHttpRequest'},
    // 移动端降低优先级，减少对主线程的影响
    priority: pageCache.isMobile ? 'low' : 'auto'
  })
  .then(response => response.text())
  .then(html => {
    // 解析页面内容
    const parser = new DOMParser();
    const doc = parser.parseFromString(html, 'text/html');
    
    // 获取主要内容部分
    const mainContent = doc.querySelector('.main-content-container');
    
    if (mainContent) {
      // 存储到缓存
      pageCache.store(url, mainContent.innerHTML);
      
      // 如果有回调函数，执行它
      if (callback && typeof callback === 'function') {
        callback(mainContent.innerHTML);
      }
    }
  })
  .catch(error => {
    console.warn('页面预加载失败:', error);
    // 如果有回调函数，仍然执行它，但传递null表示失败
    if (callback && typeof callback === 'function') {
      callback(null);
    }
  });
}

// 自动刷新页面内容
function autoRefreshContent(forceRefresh = false) {
  // 如果是移动端首页，优化刷新策略
  const isHomePage = window.location.pathname === '/' || window.location.pathname === '/index.html';
  
  // 当前URL
  const currentUrl = pageCache.getKey(window.location.href);
  
  // 如果强制刷新，清除缓存
  if (forceRefresh) {
    pageCache.clear(currentUrl);
  }
  
  // 尝试从缓存获取内容
  const cachedContent = !forceRefresh ? pageCache.get(currentUrl) : null;
  
  if (cachedContent) {
    // 使用缓存的内容更新页面
    const currentPosts = document.querySelector('.main-content-container');
    if (currentPosts) {
      // 使用requestAnimationFrame优化DOM更新
      requestAnimationFrame(() => {
        currentPosts.innerHTML = cachedContent;
        
        // 预加载其他页面，移动端主页时减少或禁用预加载
        if (!(pageCache.isMobile && isHomePage)) {
          setTimeout(preloadOtherPages, 1000);
        }
      });
      
      return;
    }
  }
  
  // 如果没有可用的缓存，从服务器获取新内容
  const url = forceRefresh 
    ? window.location.href + (hasRefreshParam() ? '' : (window.location.href.indexOf('?') > -1 ? '&' : '?') + 'refresh=true&t=' + new Date().getTime())
    : window.location.href;
  
  fetch(url, {
    cache: forceRefresh ? 'no-cache' : 'default',
    headers: {'X-Requested-With': 'XMLHttpRequest'},
    // 移动端降低优先级
    priority: pageCache.isMobile ? 'low' : 'auto'
  })
  .then(response => response.text())
  .then(html => {
    // 解析返回的HTML
    const parser = new DOMParser();
    const doc = parser.parseFromString(html, 'text/html');
    
    // 更新文章列表部分
    const newPosts = doc.querySelector('.main-content-container');
    const currentPosts = document.querySelector('.main-content-container');
    
    if (newPosts && currentPosts) {
      // 检查内容是否真的有变化或强制刷新
      if (forceRefresh || newPosts.innerHTML !== currentPosts.innerHTML) {
        // 只更新内容部分，不重载整个页面
        currentPosts.innerHTML = newPosts.innerHTML;
        
        // 将新内容存储到缓存
        pageCache.store(currentUrl, newPosts.innerHTML);
        
        // 预加载其他页面
        setTimeout(preloadOtherPages, 1000);
      }
    }
  })
  .catch(error => {
    console.error("刷新内容时发生错误:", error);
  });
}

// 预加载所有相关页面
function preloadOtherPages() {
  // 移动端首页时，减少或禁用预加载
  if (pageCache.isMobile && (window.location.pathname === '/' || window.location.pathname === '/index.html')) {
    // 移动端首页时，只预加载下一页，减少资源消耗
    const nextPageLink = document.querySelector('.pagination .next a');
    if (nextPageLink && nextPageLink.href) {
      const nextPageUrl = pageCache.getKey(nextPageLink.href);
      if (!pageCache.get(nextPageUrl)) {
        preloadPageContent(nextPageUrl);
      }
    }
    return;
  }
  
  // 桌面端或非首页的常规预加载逻辑
  // 获取所有链接
  const links = document.querySelectorAll('a');
  const internalLinks = new Set();
  const baseUrl = document.querySelector('meta[name="baseurl"]')?.content || '';
  const domain = window.location.origin;
  
  // 收集所有内部链接
  links.forEach(link => {
    if (link.href && (link.href.startsWith(domain) || link.href.startsWith(baseUrl) || link.href.startsWith('/'))) {
      // 只处理相对路径内部链接和分页链接
      if (link.href.indexOf('/page/') > -1 || link.href.indexOf('index.html') > -1 || 
          link.href === domain + '/' || link.href === baseUrl + '/' || link.href === '/') {
        internalLinks.add(pageCache.getKey(link.href));
      }
    }
  });
  
  // 预加载所有内部链接（桌面最多5个，移动端最多2个，避免过多请求）
  let maxPreloads = pageCache.isMobile ? 2 : 5;
  let count = 0;
  for (const link of internalLinks) {
    if (count >= maxPreloads) break;
    
    // 只预加载尚未缓存的页面
    if (!pageCache.get(link)) {
      preloadPageContent(link);
      count++;
    }
  }
}

// 修改所有内部链接，优化点击体验
function modifyInternalLinks() {
  const domain = window.location.origin;
  const baseUrl = document.querySelector('meta[name="baseurl"]')?.content || '';
  const links = document.querySelectorAll('a');
  
  links.forEach(link => {
    // 只处理内部链接
    if (link.href && (link.href.startsWith(domain) || link.href.startsWith(baseUrl) || link.href.startsWith('/'))) {
      // 标记链接已处理，防止重复添加事件
      if (link.getAttribute('data-enhanced') === 'true') {
        return;
      }
      link.setAttribute('data-enhanced', 'true');
      
      // 保存原始的点击事件
      const originalClick = link.onclick;
      
      // 添加新的点击事件处理
      link.onclick = function(e) {
        const targetUrl = pageCache.getKey(link.href);
        
        // 记录链接URL
        sessionStorage.setItem('lastClickUrl', targetUrl);
        
        // 检查是否已访问过该页面（有缓存）
        const cachedContent = pageCache.get(targetUrl);
        const isPageVisited = pageCache.visitedPages[targetUrl] === true;
        const isInternalPageLink = link.href.indexOf('/page/') > -1 || 
                                  link.href.indexOf('index.html') > -1 || 
                                  link.href === domain + '/' || 
                                  link.href === baseUrl + '/' || 
                                  link.href === '/';
        
        // 如果有缓存并且是内部页面链接
        if (cachedContent && isInternalPageLink) {
          // 阻止默认行为
          e.preventDefault();
          
          // 应用缓存内容
          const currentPosts = document.querySelector('.main-content-container');
          if (currentPosts) {
            // 使用requestAnimationFrame优化DOM更新
            requestAnimationFrame(() => {
              currentPosts.innerHTML = cachedContent;
              
              // 更新URL但不刷新页面
              if (window.history && window.history.pushState) {
                window.history.pushState({
                  url: link.href,
                  cached: true
                }, document.title, link.href);
              }
              
              // 标记不需要刷新
              sessionStorage.setItem('needsRefresh', 'false');
              
              // 记录已访问
              pageCache.visitedPages[targetUrl] = true;
              try {
                localStorage.setItem('visitedPages', JSON.stringify(pageCache.visitedPages));
              } catch (e) {
                console.warn('无法保存访问历史', e);
              }
            });
          }
          return false;
        }
        
        // 对于已访问过的页面，禁止刷新参数
        if (isPageVisited) {
          // 移除refresh参数，确保使用缓存
          let cleanHref = link.href.replace(/[?&]refresh=true/, '').replace(/[?&]t=\d+/, '');
          
          // 添加no-refresh标记
          const separator = cleanHref.indexOf('?') > -1 ? '&' : '?';
          link.href = cleanHref + separator + 'no-refresh=true';
          
          // 设置会话标志，表示不需要刷新
          sessionStorage.setItem('needsRefresh', 'false');
        } else if (link.href.indexOf('refresh=true') === -1 && link.href.indexOf('no-refresh=true') === -1) {
          // 对于首次访问的页面，添加刷新参数
          const separator = link.href.indexOf('?') > -1 ? '&' : '?';
          link.href = link.href + separator + 'refresh=true';
        }
        
        // 调用原始点击事件处理（如果有）
        if (originalClick) {
          return originalClick.call(this, e);
        }
      };
    }
  });
}

// 页面加载完成后立即执行初始化
document.addEventListener('DOMContentLoaded', function() {
  // 移动端检测和优化
  const isMobile = pageCache.isMobile;
  const isHomePage = window.location.pathname === '/' || window.location.pathname === '/index.html';
  
  // 尝试从localStorage恢复访问历史
  try {
    const visitedPagesJson = localStorage.getItem('visitedPages');
    if (visitedPagesJson) {
      pageCache.visitedPages = JSON.parse(visitedPagesJson);
    }
  } catch (e) {
    console.warn('无法恢复访问历史', e);
    pageCache.visitedPages = {};
  }
  
  // 检查本地缓存，确保首次加载能从缓存获取
  const currentUrl = pageCache.getKey(window.location.href);
  let cachedContent = pageCache.get(currentUrl);
  
  // 标记当前页面已访问
  pageCache.visitedPages[currentUrl] = true;
  try {
    localStorage.setItem('visitedPages', JSON.stringify(pageCache.visitedPages));
  } catch (e) {
    console.warn('无法保存访问历史', e);
  }
  
  // 如果找到有效缓存，立即使用它
  if (cachedContent) {
    const contentContainer = document.querySelector('.main-content-container');
    if (contentContainer) {
      // 使用requestAnimationFrame优化DOM更新
      requestAnimationFrame(() => {
        contentContainer.innerHTML = cachedContent;
      });
    }
  }
  
  // 检查是否需要强制刷新（来自其他页面跳转）
  const needsForceRefresh = hasRefreshParam() || (sessionStorage.getItem('needsRefresh') === 'true' && !hasNoRefreshParam());
  
  // 检查是否是从内部页面返回主页
  const isReturningToHomePage = isHomePage && 
                               sessionStorage.getItem('lastVisitedPage') && 
                               sessionStorage.getItem('homePageCacheApplied') === 'true';
  
  // 检查是否是已访问过的页面
  const isVisitedPage = pageCache.visitedPages[currentUrl] === true && !hasRefreshParam();
  
  // 只有在需要刷新的情况下才执行刷新
  if (!isReturningToHomePage && !isVisitedPage) {
    // 执行刷新
    autoRefreshContent(needsForceRefresh);
  } else {
    console.log('使用缓存内容，不刷新');
    
    // 从URL中移除刷新参数
    if ((hasRefreshParam() || hasNoRefreshParam()) && window.history && window.history.replaceState) {
      const cleanUrl = window.location.href
        .replace(/[?&]refresh=true/, '')
        .replace(/[?&]no-refresh=true/, '')
        .replace(/[?&]t=\d+/, '');
      window.history.replaceState({}, document.title, cleanUrl);
    }
  }
  
  // 重置刷新标志
  sessionStorage.setItem('needsRefresh', 'false');
  
  // 修改所有内部链接
  modifyInternalLinks();
  
  // 监听页面可见性变化（当用户从其他标签页回到此页面时）
  document.addEventListener('visibilitychange', function() {
    if (document.visibilityState === 'visible') {
      // 用户回到页面，检查缓存是否仍然有效
      if (pageCache.get(currentUrl)) {
        // 如果缓存有效，检查更新但不强制刷新
        autoRefreshContent(false);
      } else {
        // 如果缓存过期，执行强制刷新
        autoRefreshContent(true);
      }
    }
  });
  
  // 监听浏览器前进/后退事件
  window.addEventListener('popstate', function(event) {
    // 获取历史状态
    const state = event.state || {};
    
    // 获取当前URL的缓存内容
    const newUrl = pageCache.getKey(window.location.href);
    const cacheContent = pageCache.get(newUrl);
    
    // 如果有缓存，或者状态标记为已缓存
    if (cacheContent || state.cached) {
      // 应用缓存内容而不重新加载
      const contentContainer = document.querySelector('.main-content-container');
      if (contentContainer) {
        // 使用requestAnimationFrame优化DOM更新
        requestAnimationFrame(() => {
          contentContainer.innerHTML = cacheContent;
        });
      }
    } else {
      // 如果没有缓存，刷新当前页面
      autoRefreshContent(true);
    }
  });
  
  // 之后每隔一段时间检查一次更新，移动端降低频率
  const refreshInterval = isMobile ? 120000 : 60000; // 移动端2分钟，桌面端1分钟
  setInterval(() => autoRefreshContent(false), refreshInterval);
});

// 用户离开当前页面时，设置刷新标志
window.addEventListener('beforeunload', function(e) {
  // 只有在非主页时才设置刷新标志
  if (!(window.location.pathname === '/' || window.location.pathname === '/index.html')) {
    // 将当前页面标记为最后访问的页面
    const currentUrl = pageCache.getKey(window.location.href);
    sessionStorage.setItem('lastVisitedPage', currentUrl);
    sessionStorage.setItem('needsRefresh', 'true');
  } else {
    // 在主页面时，不设置刷新标志，保持缓存
    sessionStorage.setItem('needsRefresh', 'false');
  }
});

// 主页特殊缓存处理
(function() {
  const isHomePage = window.location.pathname === '/' || window.location.pathname === '/index.html';
  const lastPage = sessionStorage.getItem('lastVisitedPage') || '';
  const cameFromInternalPage = lastPage.includes(window.location.hostname) || lastPage.startsWith('/');
  
  // 如果是主页且是从内部页面返回的，使用缓存版本
  if (isHomePage && cameFromInternalPage) {
    // 标记已经处理过，避免重复处理
    sessionStorage.setItem('homePageCacheApplied', 'true');
    
    // 使用Performance API检测导航类型
    if (window.performance && performance.navigation) {
      if (performance.navigation.type === 2) { // 2表示通过后退/前进按钮导航
        console.log('通过后退/前进返回主页，保持缓存内容');
        // 阻止页面重新加载
        sessionStorage.setItem('needsRefresh', 'false');
        
        // 直接从缓存获取内容
        const currentUrl = window.location.href.split('?')[0]; // 不含参数的URL
        try {
          // 检查是否有本地缓存
          const cachedContent = pageCache.get(currentUrl);
          if (cachedContent) {
            const contentContainer = document.querySelector('.main-content-container');
            if (contentContainer) {
              // 应用缓存内容
              contentContainer.innerHTML = cachedContent;
              console.log('已应用本地缓存的主页内容');
            }
          }
        } catch (e) {
          console.warn('应用缓存内容时出错:', e);
        }
      }
    }
    
    // 从浏览器缓存中获取主页
    if ('caches' in window) {
      caches.open('homepage-cache').then(cache => {
        const homepageUrl = window.location.href.split('?')[0]; // 不含参数的URL
        cache.match(homepageUrl).then(response => {
          if (response) {
            console.log('主页已存在于浏览器缓存中');
          } else {
            // 如果不存在则添加
            cache.add(homepageUrl).then(() => {
              console.log('主页已添加到浏览器缓存');
            });
          }
        });
      }).catch(err => {
        console.warn('缓存操作失败:', err);
      });
    }
  } else if (isHomePage) {
    // 首次加载主页，存储到浏览器缓存
    sessionStorage.removeItem('homePageCacheApplied');
    if ('caches' in window) {
      const homepageUrl = window.location.href.split('?')[0]; // 不含参数的URL
      caches.open('homepage-cache').then(cache => {
        // 先检查缓存中是否存在
        cache.match(homepageUrl).then(response => {
          if (!response) {
            // 不存在则添加
            cache.add(homepageUrl).then(() => {
              console.log('主页首次添加到浏览器缓存');
            });
          } else {
            // 存在则更新
            cache.delete(homepageUrl).then(() => {
              cache.add(homepageUrl).then(() => {
                console.log('主页缓存已更新');
              });
            });
          }
        });
      }).catch(err => {
        console.warn('初始缓存操作失败:', err);
      });
    }
    
    // 同时保存到本地缓存系统
    const currentUrl = pageCache.getKey(window.location.href);
    const mainContent = document.querySelector('.main-content-container');
    if (mainContent) {
      pageCache.store(currentUrl, mainContent.innerHTML);
      console.log('主页内容已保存到本地缓存');
    }
  }
})(); 