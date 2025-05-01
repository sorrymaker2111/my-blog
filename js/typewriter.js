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

        // 将文本插入元素
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
            
            // 将文本插入元素
            this.elements[i].innerHTML = `<span class="txt">${this.txts[i]}</span>`;
            
            // 检查是否所有文本都完成或都为空
            if (this.txts[i] !== fullTxt) allComplete = false;
            if (this.txts[i] !== '') allEmpty = false;
        }

        // 初始化打字速度
        let typeSpeed = 200;
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

// 调整主页滚动行为
function setupHomePage() {
    // 如果是主页
    if (document.body.classList.contains('home-page')) {
        // 添加滚动事件监听
        window.addEventListener('scroll', function() {
            // 获取滚动位置
            let scrollTop = window.pageYOffset || document.documentElement.scrollTop;
            
            // 标题元素
            const titleElement = document.getElementById('typewriter-title');
            const subtitleElement = document.getElementById('typewriter-subtitle');
            
            if (titleElement && subtitleElement) {
                // 根据滚动位置调整透明度，创建视差效果
                if (scrollTop < window.innerHeight) {
                    const opacity = 1 - (scrollTop / (window.innerHeight * 0.5));
                    const translateY = scrollTop * 0.3; // 视差效果
                    
                    titleElement.style.opacity = Math.max(0, opacity);
                    subtitleElement.style.opacity = Math.max(0, opacity);
                    
                    titleElement.style.transform = `translateY(${translateY}px)`;
                    subtitleElement.style.transform = `translateY(${translateY}px)`;
                }
            }
        });
    }
}

// 初始化打字机效果
function initTypeWriter() {
    // 获取元素
    const titleElement = document.getElementById('typewriter-title');
    const subtitleElement = document.getElementById('typewriter-subtitle');
    
    if (titleElement && subtitleElement) {
        // 标题和副标题的文本集
        const titleText = titleElement.getAttribute('data-text');
        const subtitleText = subtitleElement.getAttribute('data-text');
        
        // 文本集
        const textSets = [
            [titleText, subtitleText],
            ["MyGO!!!!!", "「组一辈子乐队吧！」"],
            ["欧内该", "「你还真是高高在上呢」"],
            ["为什么要演奏春日影", "「软弱的我已经死了」"]
        ];
        
        // 创建同步打字机
        new SyncedTypeWriter([titleElement, subtitleElement], textSets, 2000);
    } else {
        // 如果只有一个元素存在，则单独处理
        if (titleElement) {
            const titleVariations = [
                titleElement.getAttribute('data-text'),
                "MyGO!!!!!", 
                "欧内该",
                "为什么要演奏春日影"
            ];
            new TypeWriter(titleElement, titleVariations, 2000);
        }
        
        if (subtitleElement) {
            const subtitleVariations = [
                subtitleElement.getAttribute('data-text'),
                "「组一辈子乐队吧！」",
                "「你还真是高高在上呢」",
                "「软弱的我已经死了」"
            ];
            new TypeWriter(subtitleElement, subtitleVariations, 1500);
        }
    }
    
    // 设置主页滚动效果
    setupHomePage();
}

// 页面加载后初始化
document.addEventListener('DOMContentLoaded', initTypeWriter); 