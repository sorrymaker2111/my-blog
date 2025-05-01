/**
 * 打字机效果JS
 */
class TypeWriter {
    constructor(textElement, words, waitTime = 3000) {
        this.textElement = textElement;
        this.words = words;
        this.txt = '';
        this.wordIndex = 0;
        this.waitTime = parseInt(waitTime, 10);
        this.type();
        this.isDeleting = false;
    }

    type() {
        // 当前单词的索引
        const current = this.wordIndex % this.words.length;
        // 获取当前单词的全文
        const fullTxt = this.words[current];

        // 检查是删除还是输入
        if (this.isDeleting) {
            // 删除字符
            this.txt = fullTxt.substring(0, this.txt.length - 1);
        } else {
            // 添加字符
            this.txt = fullTxt.substring(0, this.txt.length + 1);
        }

        // 将文本插入元素，确保居中对齐
        this.textElement.innerHTML = `<span class="txt">${this.txt}</span>`;

        // 初始化打字速度，添加一些随机性
        let typeSpeed = 200;
        if (Math.random() < 0.1) {
            // 10%的概率有停顿感
            typeSpeed = 400;
        }

        if (this.isDeleting) {
            typeSpeed /= 2; // 删除速度更快
        }

        // 如果单词完成
        if (!this.isDeleting && this.txt === fullTxt) {
            // 输入完成后暂停
            typeSpeed = this.waitTime;
            // 设置删除状态
            this.isDeleting = true;
        } else if (this.isDeleting && this.txt === '') {
            this.isDeleting = false;
            // 移动到下一个单词
            this.wordIndex++;
            // 输入前暂停
            typeSpeed = 500;
        }

        setTimeout(() => this.type(), typeSpeed);
    }
}

/**
 * 同步的打字机效果
 */
class SyncedTypeWriter {
    constructor(elements, textSets, waitTime = 3000) {
        this.elements = elements; // 元素数组
        this.textSets = textSets; // 文本集数组
        this.currentSetIndex = 0; // 当前文本集索引
        this.txts = elements.map(() => ''); // 每个元素的当前文本
        this.waitTime = parseInt(waitTime, 10);
        this.isDeleting = false;
        this.type();
        
        // 确保元素居中对齐
        this.ensureCenteredText();
    }
    
    // 确保文本居中对齐的方法
    ensureCenteredText() {
        for (let i = 0; i < this.elements.length; i++) {
            this.elements[i].style.textAlign = 'center';
            this.elements[i].style.width = '100%';
            this.elements[i].style.display = 'block';
            this.elements[i].style.margin = '0 auto';
        }
    }

    type() {
        // 当前的文本集
        const current = this.currentSetIndex % this.textSets.length;
        const currentTexts = this.textSets[current];

        let allComplete = true;
        let allEmpty = true;
        
        // 为每个元素处理打字或删除
        for (let i = 0; i < this.elements.length; i++) {
            const fullTxt = currentTexts[i];
            
            if (this.isDeleting) {
                // 删除字符
                this.txts[i] = fullTxt.substring(0, this.txts[i].length - 1);
            } else {
                // 添加字符
                this.txts[i] = fullTxt.substring(0, this.txts[i].length + 1);
            }
            
            // 将文本插入元素，确保居中对齐
            this.elements[i].innerHTML = `<span class="txt">${this.txts[i]}</span>`;
            
            // 检查是否所有文本都完成或都为空
            if (this.txts[i] !== fullTxt) allComplete = false;
            if (this.txts[i] !== '') allEmpty = false;
        }

        // 初始化打字速度
        let typeSpeed = 200;
        // 移动设备上减慢打字速度，降低资源消耗
        if (isMobileDevice()) {
            typeSpeed = 250;
        }
        
        if (Math.random() < 0.1) {
            // 10%的概率有停顿感
            typeSpeed = 400;
        }

        if (this.isDeleting) {
            typeSpeed /= 2; // 删除速度更快
        }

        // 状态变化条件
        if (!this.isDeleting && allComplete) {
            // 所有文本都输入完成后暂停
            typeSpeed = this.waitTime;
            // 设置删除状态
            this.isDeleting = true;
        } else if (this.isDeleting && allEmpty) {
            this.isDeleting = false;
            // 移动到下一个文本集
            this.currentSetIndex++;
            // 输入前暂停
            typeSpeed = 500;
        }

        setTimeout(() => this.type(), typeSpeed);
    }
}

// 检测设备类型
function isMobileDevice() {
    return (window.innerWidth <= 767) || 
        (/Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent));
}

// 调整主页滚动行为和移动设备适配
function setupHomePage() {
    // 如果是主页
    if (document.body.classList.contains('home-page')) {
        // 获取标题元素
        const titleElement = document.getElementById('typewriter-title');
        const subtitleElement = document.getElementById('typewriter-subtitle');
        
        // 确保元素居中对齐并设置适当宽度
        if (titleElement && subtitleElement) {
            titleElement.style.textAlign = 'center';
            subtitleElement.style.textAlign = 'center';
            titleElement.style.width = '100%';
            subtitleElement.style.width = '100%';
            titleElement.style.maxWidth = '800px';
            subtitleElement.style.maxWidth = '800px';
            titleElement.style.margin = '0 auto';
            subtitleElement.style.margin = '0 auto';
            titleElement.style.display = 'block';
            subtitleElement.style.display = 'block';
            
            // 确保容器也居中
            const container = titleElement.closest('.typewriter-container');
            if (container) {
                container.style.textAlign = 'center';
                container.style.width = '100%';
                container.style.maxWidth = '100%';
                container.style.margin = '0 auto';
                container.style.display = 'flex';
                container.style.flexDirection = 'column';
                container.style.alignItems = 'center';
                container.style.justifyContent = 'center';
            }
        }
        
        // 移动设备适配
        if (isMobileDevice()) {
            // 为移动设备设置特定样式
            document.body.classList.add('mobile-device');
            
            // 如果标题文本过长，可以为移动设备设置更短的文本版本
            if (titleElement) {
                // 获取更短的移动版本文本，如果有设置的话
                const mobileTitleText = titleElement.getAttribute('data-mobile-text');
                if (mobileTitleText && mobileTitleText !== titleElement.getAttribute('data-text')) {
                    titleElement.setAttribute('data-text', mobileTitleText);
                }
                
                // 移动设备上减小字体
                titleElement.style.fontSize = '32px';
                if (subtitleElement) {
                    subtitleElement.style.fontSize = '16px';
                }
            }
            
            // 获取副标题的移动版本
            if (subtitleElement) {
                const mobileSubtitleText = subtitleElement.getAttribute('data-mobile-text');
                if (mobileSubtitleText && mobileSubtitleText !== subtitleElement.getAttribute('data-text')) {
                    subtitleElement.setAttribute('data-text', mobileSubtitleText);
                }
            }
        }
        
        // 优化滚动事件处理
        let lastScrollY = 0;
        let scrollAnimationFrame = null;
        let lastScrollHandleTime = 0;
        const SCROLL_THROTTLE = isMobileDevice() ? 150 : 50; // 移动设备上增加间隔
        
        // 创建节流函数，限制事件触发频率
        function throttle(func, limit) {
            let inThrottle;
            return function() {
                const args = arguments;
                const context = this;
                if (!inThrottle) {
                    func.apply(context, args);
                    inThrottle = true;
                    setTimeout(() => inThrottle = false, limit);
                }
            };
        }
        
        // 处理滚动事件，使用节流和RAF优化
        const handleScroll = throttle(function() {
            const now = Date.now();
            
            // 如果距离上次处理时间不够长，则等待
            if (now - lastScrollHandleTime < SCROLL_THROTTLE) {
                return;
            }
            
            lastScrollHandleTime = now;
            
            // 获取滚动位置
            let scrollTop = window.pageYOffset || document.documentElement.scrollTop;

            // 避免小的抖动触发处理
            if (Math.abs(scrollTop - lastScrollY) < 5) {
                return;
            }
            
            lastScrollY = scrollTop;
            
            if (titleElement && subtitleElement) {
                // 根据滚动位置调整透明度，创建视差效果
                if (scrollTop < window.innerHeight) {
                    const opacity = 1 - (scrollTop / (window.innerHeight * 0.5));
                    const translateY = scrollTop * (isMobileDevice() ? 0.15 : 0.3); // 减小移动端的视差效果
                    
                    // 使用transform属性进行硬件加速
                    titleElement.style.opacity = Math.max(0, opacity);
                    subtitleElement.style.opacity = Math.max(0, opacity);
                    
                    titleElement.style.transform = `translateY(${translateY}px) translateZ(0)`;
                    subtitleElement.style.transform = `translateY(${translateY}px) translateZ(0)`;
                }
            }
        }, 50); // 50ms的节流时间
        
        // 优化的滚动事件监听器
        window.addEventListener('scroll', function() {
            // 使用requestAnimationFrame限制处理频率
            if (scrollAnimationFrame) return;
            
            scrollAnimationFrame = requestAnimationFrame(function() {
                handleScroll();
                scrollAnimationFrame = null;
            });
        }, { passive: true }); // 使用passive提高滚动性能
        
        
        // 监听窗口大小变化，动态调整布局
        let resizeTimeout;
        window.addEventListener('resize', function() {
            // 使用防抖优化调整频率
            clearTimeout(resizeTimeout);
            resizeTimeout = setTimeout(function() {
                if (titleElement && subtitleElement) {
                    // 重新设置对齐方式
                    titleElement.style.textAlign = 'center';
                    subtitleElement.style.textAlign = 'center';
                    
                    // 如果是移动设备但没有添加标记
                    if (isMobileDevice() && !document.body.classList.contains('mobile-device')) {
                        document.body.classList.add('mobile-device');
                        
                        // 应用移动设备样式
                        titleElement.style.fontSize = '32px';
                        subtitleElement.style.fontSize = '16px';
                        
                        // 应用移动版本文本
                        const mobileTitleText = titleElement.getAttribute('data-mobile-text');
                        if (mobileTitleText && mobileTitleText !== titleElement.getAttribute('data-text')) {
                            titleElement.setAttribute('data-text', mobileTitleText);
                        }
                        
                        const mobileSubtitleText = subtitleElement.getAttribute('data-mobile-text');
                        if (mobileSubtitleText && mobileSubtitleText !== subtitleElement.getAttribute('data-text')) {
                            subtitleElement.setAttribute('data-text', mobileSubtitleText);
                        }
                    } 
                    // 如果不是移动设备但有标记
                    else if (!isMobileDevice() && document.body.classList.contains('mobile-device')) {
                        document.body.classList.remove('mobile-device');
                        
                        // 恢复桌面样式
                        titleElement.style.fontSize = '60px';
                        subtitleElement.style.fontSize = '30px';
                        
                        // 恢复原始文本
                        const originalTitleText = titleElement.getAttribute('data-original-text') || 
                                             titleElement.getAttribute('data-text');
                        if (originalTitleText) {
                            titleElement.setAttribute('data-text', originalTitleText);
                        }
                        
                        const originalSubtitleText = subtitleElement.getAttribute('data-original-text') || 
                                                subtitleElement.getAttribute('data-text');
                        if (originalSubtitleText) {
                            subtitleElement.setAttribute('data-text', originalSubtitleText);
                        }
                    }
                }
            }, 100);
        });
    }
}

// 初始化打字机效果
function initTypeWriter() {
    // 获取元素
    const titleElement = document.getElementById('typewriter-title');
    const subtitleElement = document.getElementById('typewriter-subtitle');
    
    if (titleElement && subtitleElement) {
        // 保存原始文本
        if (!titleElement.getAttribute('data-original-text')) {
            titleElement.setAttribute('data-original-text', titleElement.getAttribute('data-text'));
        }
        
        if (!subtitleElement.getAttribute('data-original-text')) {
            subtitleElement.setAttribute('data-original-text', subtitleElement.getAttribute('data-text'));
        }
        
        // 确保元素居中对齐
        titleElement.style.textAlign = 'center';
        subtitleElement.style.textAlign = 'center';
        
        // 标题和副标题的文本集
        const titleText = titleElement.getAttribute('data-text');
        const subtitleText = subtitleElement.getAttribute('data-text');
        
        // 文本集 - 根据设备类型可能有不同的展示方式
        let textSets = [
            [titleText, subtitleText],
            ["MyGO!!!!!", "「组一辈子乐队吧！」"],
            ["欧内该", "「你还真是高高在上呢」"],
            ["为什么要演奏春日影", "「软弱的我已经死了」"]
        ];
        
        // 在移动设备上可以选择使用更简短的文本
        if (isMobileDevice()) {
            const mobileTitleText = titleElement.getAttribute('data-mobile-text');
            const mobileSubtitleText = subtitleElement.getAttribute('data-mobile-text');
            
            textSets = [
                [mobileTitleText || titleText, mobileSubtitleText || subtitleText],
                ["MyGO!!", "「组乐队吧」"],
                ["欧内该", "「高高在上」"],
                ["春日影", "「软弱已死」"]
            ];
        }
        
        // 创建同步打字机
        new SyncedTypeWriter([titleElement, subtitleElement], textSets, 2000);
    } else {
        // 如果只有一个元素存在，则单独处理
        if (titleElement) {
            titleElement.style.textAlign = 'center';
            const titleVariations = [
                titleElement.getAttribute('data-text'),
                "MyGO!!!!!", 
                "欧内该",
                "为什么要演奏春日影"
            ];
            
            // 移动设备上使用更短的文本
            if (isMobileDevice()) {
                const mobileTitleText = titleElement.getAttribute('data-mobile-text');
                if (mobileTitleText) {
                    titleVariations[0] = mobileTitleText;
                }
            }
            
            new TypeWriter(titleElement, titleVariations, 2000);
        }
        
        if (subtitleElement) {
            subtitleElement.style.textAlign = 'center';
            let subtitleVariations = [
                subtitleElement.getAttribute('data-text'),
                "「组一辈子乐队吧！」",
                "「你还真是高高在上呢」",
                "「软弱的我已经死了」"
            ];
            
            // 移动设备上使用更短的文本
            if (isMobileDevice()) {
                const mobileSubtitleText = subtitleElement.getAttribute('data-mobile-text');
                if (mobileSubtitleText) {
                    subtitleVariations[0] = mobileSubtitleText;
                }
                
                // 使用更短的变体
                subtitleVariations = [
                    mobileSubtitleText || subtitleElement.getAttribute('data-text'),
                    "「组乐队吧」",
                    "「高高在上」",
                    "「软弱已死」"
                ];
            }
            
            new TypeWriter(subtitleElement, subtitleVariations, 2000);
        }
    }
}

// 在DOM加载完成后初始化
document.addEventListener('DOMContentLoaded', function() {
    setupHomePage();
    initTypeWriter();
}); 