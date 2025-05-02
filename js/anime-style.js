// 二次元风格的动态效果

document.addEventListener('DOMContentLoaded', function() {
  // 添加谷歌动漫风格字体
  if (!document.getElementById('anime-fonts')) {
    const fontLink = document.createElement('link');
    fontLink.id = 'anime-fonts';
    fontLink.rel = 'stylesheet';
    fontLink.href = 'https://fonts.googleapis.com/css2?family=Mochiy+Pop+One&family=Noto+Sans+SC:wght@400;700&display=swap';
    document.head.appendChild(fontLink);
  }
  
  // 创建浮动装饰元素
  const createFloatingElements = () => {
    // 仅在非移动设备添加装饰元素
    if (/Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent)) {
      return;
    }
    
    const decorElements = ['🌟', '💖', '🎀', '✨', '🌸', '🐰', '🍭'];
    
    // 针对不同页面类型选择合适的容器
    let container = document.querySelector('.main-content-container') || 
                    document.querySelector('.post-container') || 
                    document.querySelector('.page-container') || 
                    document.querySelector('.postlist-container');
    
    if (!container) return;
    
    // 创建5-8个随机装饰元素
    const elemCount = Math.floor(Math.random() * 4) + 5;
    
    for (let i = 0; i < elemCount; i++) {
      const elem = document.createElement('div');
      const randomEmoji = decorElements[Math.floor(Math.random() * decorElements.length)];
      elem.textContent = randomEmoji;
      elem.style.position = 'absolute';
      elem.style.fontSize = (Math.random() * 15 + 15) + 'px';
      elem.style.opacity = (Math.random() * 0.4 + 0.6).toString();
      elem.style.color = '#' + Math.floor(Math.random()*16777215).toString(16);
      elem.className = 'floating-element';
      
      // 随机位置（容器外围）
      const isTop = Math.random() > 0.5;
      const isLeft = Math.random() > 0.5;
      
      if (isTop) {
        elem.style.top = (Math.random() * 40 - 50) + 'px';
      } else {
        elem.style.bottom = (Math.random() * 40 - 50) + 'px';
      }
      
      if (isLeft) {
        elem.style.left = (Math.random() * (container.offsetWidth - 30)) + 'px';
      } else {
        elem.style.right = (Math.random() * (container.offsetWidth - 30)) + 'px';
      }
      
      // 旋转角度
      elem.style.transform = `rotate(${Math.random() * 40 - 20}deg)`;
      
      // 添加到容器
      container.appendChild(elem);
    }
  };
  
  // 鼠标经过文章时添加闪光效果
  const addSparkleEffects = () => {
    const posts = document.querySelectorAll('.post-preview, .post-container, h2, h3');
    posts.forEach(post => {
      post.addEventListener('mouseenter', function() {
        const sparkle = document.createElement('div');
        sparkle.innerHTML = '✨';
        sparkle.style.position = 'absolute';
        sparkle.style.top = '-10px';
        sparkle.style.left = '20px';
        sparkle.style.fontSize = '20px';
        sparkle.style.opacity = '0';
        sparkle.style.transition = 'all 0.5s ease';
        sparkle.style.zIndex = '10';
        
        post.appendChild(sparkle);
        
        // 淡入效果
        setTimeout(() => {
          sparkle.style.opacity = '1';
          sparkle.style.transform = 'translateY(-10px) scale(1.2)';
        }, 10);
        
        // 淡出效果
        setTimeout(() => {
          sparkle.style.opacity = '0';
          setTimeout(() => {
            if (sparkle.parentNode === post) {
              post.removeChild(sparkle);
            }
          }, 500);
        }, 1000);
      });
    });
  };
  
  // 给页面容器添加装饰元素
  const addDecorationToContainers = () => {
    const containers = document.querySelectorAll('.post-container, .page-container, .postlist-container');
    
    containers.forEach(container => {
      // 检查是否已添加装饰，避免重复添加
      if (container.getAttribute('data-decorated') === 'true') {
        return;
      }
      
      // 添加上装饰元素
      const beforeElement = document.createElement('div');
      beforeElement.style.position = 'absolute';
      beforeElement.style.top = '-15px';
      beforeElement.style.left = '20px';
      beforeElement.style.width = '30px';
      beforeElement.style.height = '30px';
      beforeElement.style.backgroundColor = '#FF9CE3';
      beforeElement.style.borderRadius = '50%';
      beforeElement.style.boxShadow = '0 0 0 5px rgba(255, 156, 227, 0.3)';
      beforeElement.style.zIndex = '-1';
      
      const afterElement = document.createElement('div');
      afterElement.style.position = 'absolute';
      afterElement.style.bottom = '-10px';
      afterElement.style.right = '30px';
      afterElement.style.width = '20px';
      afterElement.style.height = '20px';
      afterElement.style.backgroundColor = '#A7C7E7';
      afterElement.style.borderRadius = '50%';
      afterElement.style.boxShadow = '0 0 0 4px rgba(167, 199, 231, 0.3)';
      afterElement.style.zIndex = '-1';
      
      container.style.position = 'relative';
      container.appendChild(beforeElement);
      container.appendChild(afterElement);
      
      // 标记为已装饰
      container.setAttribute('data-decorated', 'true');
    });
  };
  
  // 执行所有装饰效果
  createFloatingElements();
  addSparkleEffects();
  addDecorationToContainers();
  
  // 添加萌系装饰元素到页面标题附近
  const addMoeElements = () => {
    const header = document.querySelector('.intro-header') || document.querySelector('header');
    if (!header) return;
    
    const moeEmojis = ['🌸', '✨', '💖', '🎀'];
    
    // 添加两个浮动元素
    for (let i = 0; i < 2; i++) {
      const moeElem = document.createElement('div');
      moeElem.textContent = moeEmojis[i % moeEmojis.length];
      moeElem.className = 'floating-element';
      moeElem.style.position = 'absolute';
      moeElem.style.fontSize = (i === 0 ? '40px' : '35px');
      moeElem.style.zIndex = '1';
      
      if (i === 0) {
        moeElem.style.top = '-30px';
        moeElem.style.right = '30px';
        moeElem.style.transform = 'rotate(10deg)';
      } else {
        moeElem.style.bottom = '-25px';
        moeElem.style.left = '50px';
        moeElem.style.transform = 'rotate(-5deg)';
      }
      
      header.appendChild(moeElem);
    }
  };
  
  // 添加萌系元素
  addMoeElements();
});

// 为了确保动态加载的内容也能获得动画效果，添加一个MutationObserver
const observer = new MutationObserver(function(mutations) {
  mutations.forEach(function(mutation) {
    if (mutation.addedNodes && mutation.addedNodes.length > 0) {
      // 只在添加了新元素时运行
      const hasNewElements = Array.from(mutation.addedNodes).some(node => 
        node.nodeType === 1 && (
          node.classList.contains('post-preview') || 
          node.classList.contains('post-container') || 
          node.classList.contains('page-container')
        )
      );
      
      if (hasNewElements) {
        // 重新应用动画效果
        const script = document.createElement('script');
        script.textContent = `
          (function() {
            // 重新添加鼠标经过闪光效果
            const posts = document.querySelectorAll('.post-preview, .post-container, h2, h3');
            posts.forEach(post => {
              if (!post.hasSparkleEffect) {
                post.hasSparkleEffect = true;
                post.addEventListener('mouseenter', function() {
                  const sparkle = document.createElement('div');
                  sparkle.innerHTML = '✨';
                  sparkle.style.position = 'absolute';
                  sparkle.style.top = '-10px';
                  sparkle.style.left = '20px';
                  sparkle.style.fontSize = '20px';
                  sparkle.style.opacity = '0';
                  sparkle.style.transition = 'all 0.5s ease';
                  sparkle.style.zIndex = '10';
                  
                  post.appendChild(sparkle);
                  
                  setTimeout(() => {
                    sparkle.style.opacity = '1';
                    sparkle.style.transform = 'translateY(-10px) scale(1.2)';
                  }, 10);
                  
                  setTimeout(() => {
                    sparkle.style.opacity = '0';
                    setTimeout(() => {
                      if (sparkle.parentNode === post) {
                        post.removeChild(sparkle);
                      }
                    }, 500);
                  }, 1000);
                });
              }
            });
          })();
        `;
        document.body.appendChild(script);
        document.body.removeChild(script);
      }
    }
  });
});

// 观察整个文档的变化
observer.observe(document.body, {
  childList: true,
  subtree: true
}); 