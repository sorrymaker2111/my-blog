/**
 * 使用Three.js实现页面两侧2D几何图形背景
 * 实现鼠标移动时的视差效果
 */

// 检测是否为移动设备
function isMobileDevice() {
  return (window.innerWidth <= 767) || 
    (/Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent));
}

// 等待页面加载完成
document.addEventListener('DOMContentLoaded', function() {
  // 添加Three.js库
  const threeScript = document.createElement('script');
  threeScript.src = 'https://cdn.jsdelivr.net/npm/three@0.132.2/build/three.min.js';
  document.head.appendChild(threeScript);

  threeScript.onload = function() {
    // 初始化背景
    setTimeout(initGeometryBackground, 500); // 延迟执行，确保内容已渲染
  };
});

function initGeometryBackground() {
  // 检查容器是否已存在
  let container = document.getElementById('geometry-background');
  if (!container) {
    // 创建容器元素
    container = document.createElement('div');
    container.id = 'geometry-background';
    container.style.position = 'fixed';
    container.style.top = '0';
    container.style.left = '0';
    container.style.width = '100%';
    container.style.height = '100%';
    container.style.zIndex = '-2';
    container.style.pointerEvents = 'none'; // 确保不会影响页面交互
    
    // 添加半透明背景色，但不设置背景图片，确保可以看到底层图片
    container.style.backgroundColor = 'rgba(230, 240, 250, 0.6)';
    // 移除渐变背景，以免覆盖主背景图片
    // container.style.backgroundImage = 'linear-gradient(120deg, rgba(230, 240, 255, 0.8), rgba(210, 230, 255, 0.8))';
    container.style.overflow = 'hidden'; // 确保不会出现滚动条
    
    document.body.insertBefore(container, document.body.firstChild);
  }

  // 获取内容区域的位置
  const headerElement = document.querySelector('.intro-header');
  const contentElement = document.querySelector('.container .row .postlist-container') || 
                         document.querySelector('.container .row .col-lg-8');
  const sidebarElement = document.querySelector('.sidebar-container');
  
  // 确保我们找到了内容元素
  if (!contentElement) {
    console.error("找不到内容区域元素");
    return;
  }
  
  // 获取内容区域位置
  let contentRect = contentElement.getBoundingClientRect();
  let headerHeight = headerElement ? headerElement.offsetHeight : 0;
  
  // 计算安全区域（内容区域两侧的边距）
  const safeMargin = isMobileDevice() ? 10 : 50; // 移动设备使用更小的边距
  const contentLeft = contentRect.left - safeMargin;
  const contentRight = contentRect.right + safeMargin;

  // 创建内容区域背景矩形
  const contentBg = document.createElement('div');
  contentBg.id = 'content-background';
  contentBg.style.position = 'fixed';
  contentBg.style.top = '0';
  contentBg.style.left = contentLeft + 'px';
  contentBg.style.width = (contentRight - contentLeft) + 'px';
  contentBg.style.height = '100%';
  contentBg.style.backgroundColor = 'rgba(255, 255, 255, 0.4)'; // 半透明白色背景
  contentBg.style.boxShadow = '-5px 0 15px rgba(100, 140, 190, 0.15), 5px 0 15px rgba(100, 140, 190, 0.15)';
  contentBg.style.zIndex = '-1'; // 确保在几何图形之上，但在内容之下
  contentBg.style.borderLeft = '1px solid rgba(150, 180, 220, 0.3)'; // 左边框
  contentBg.style.borderRight = '1px solid rgba(150, 180, 220, 0.3)'; // 右边框
  contentBg.style.backdropFilter = 'blur(8px)'; // 增加模糊效果
  contentBg.style.webkitBackdropFilter = 'blur(8px)'; // Safari支持
  contentBg.style.border = '1px solid rgba(150, 180, 220, 0.3)'; // 边框样式
  document.body.insertBefore(contentBg, container.nextSibling);

  // 处理窗口大小变化时更新内容背景
  function updateContentBackground() {
    if (contentElement) {
      contentRect = contentElement.getBoundingClientRect();
      const isMobile = isMobileDevice();
      const updatedSafeMargin = isMobile ? 10 : 50;
      const updatedContentLeft = contentRect.left - updatedSafeMargin;
      const updatedContentRight = contentRect.right + updatedSafeMargin;
      
      contentBg.style.left = updatedContentLeft + 'px';
      contentBg.style.width = (updatedContentRight - updatedContentLeft) + 'px';
      
      // 更新侧边栏背景位置相关代码也注释掉
      /*
      // 更新侧边栏背景位置（如果存在）
      const sidebarBg = document.getElementById('sidebar-background');
      if (sidebarBg) {
        if (isMobile) {
          sidebarBg.style.display = 'none';
        } else {
          sidebarBg.style.display = 'block';
          sidebarBg.style.left = (updatedContentRight + 20) + 'px';
        }
      }
      */
    }
  }

  // 设置场景、相机和渲染器
  const scene = new THREE.Scene();
  // 使用正交相机，更适合2D效果
  const camera = new THREE.OrthographicCamera(
    window.innerWidth / -2, 
    window.innerWidth / 2, 
    window.innerHeight / 2, 
    window.innerHeight / -2, 
    0.1, 
    1000
  );
  const renderer = new THREE.WebGLRenderer({ alpha: true });
  renderer.setSize(window.innerWidth, window.innerHeight);
  renderer.setClearColor(0x000000, 0); // 透明背景
  container.appendChild(renderer.domElement);

  // 定义全局变量用于跟踪鼠标位置
  let mouseX = 0;
  let mouseY = 0;
  let targetMouseX = 0;
  let targetMouseY = 0;
  let touchEnabled = false; // 是否支持触摸事件

  // 创建几何图形组
  let leftShapes = new THREE.Group();
  let rightShapes = new THREE.Group();
  scene.add(leftShapes);
  scene.add(rightShapes);

  // 材质 - 只有线框，灰色
  const material = new THREE.LineBasicMaterial({ 
    color: 0x666666, // 更深的灰色 (由0x808080改为0x666666)
    transparent: true,
    opacity: isMobileDevice() ? 0.15 : 0.2 // 移动设备上降低不透明度
  });

  // 创建2D几何图形的函数
  function create2DShape(type, size) {
    let shape;
    
    // 扩展图形类型从6种增加到10种
    switch(type) {
      case 0: // 矩形
        shape = new THREE.Shape();
        const width = size * (0.3 + Math.random() * 0.3);
        const height = size * (0.3 + Math.random() * 0.3);
        shape.moveTo(-width/2, -height/2);
        shape.lineTo(width/2, -height/2);
        shape.lineTo(width/2, height/2);
        shape.lineTo(-width/2, height/2);
        shape.lineTo(-width/2, -height/2);
        break;
        
      case 1: // 三角形
        shape = new THREE.Shape();
        const triSize = size * (0.3 + Math.random() * 0.3);
        shape.moveTo(0, -triSize/2);
        shape.lineTo(triSize/2, triSize/2);
        shape.lineTo(-triSize/2, triSize/2);
        shape.lineTo(0, -triSize/2);
        break;
        
      case 2: // 菱形
        shape = new THREE.Shape();
        const diamondSize = size * (0.3 + Math.random() * 0.3);
        shape.moveTo(0, -diamondSize/2);
        shape.lineTo(diamondSize/2, 0);
        shape.lineTo(0, diamondSize/2);
        shape.lineTo(-diamondSize/2, 0);
        shape.lineTo(0, -diamondSize/2);
        break;
        
      case 3: // 五边形
        shape = new THREE.Shape();
        const polySize = size * (0.2 + Math.random() * 0.3);
        const sides = 5;
        const angleStep = (Math.PI * 2) / sides;
        
        for (let i = 0; i < sides; i++) {
          const angle = i * angleStep;
          const x = Math.cos(angle) * polySize;
          const y = Math.sin(angle) * polySize;
          
          if (i === 0) {
            shape.moveTo(x, y);
          } else {
            shape.lineTo(x, y);
          }
        }
        // 闭合路径
        const firstAngle = 0;
        const firstX = Math.cos(firstAngle) * polySize;
        const firstY = Math.sin(firstAngle) * polySize;
        shape.lineTo(firstX, firstY);
        break;
        
      case 4: // 六边形
        shape = new THREE.Shape();
        const hexSize = size * (0.2 + Math.random() * 0.3);
        const hexSides = 6;
        const hexAngleStep = (Math.PI * 2) / hexSides;
        
        for (let i = 0; i < hexSides; i++) {
          const angle = i * hexAngleStep;
          const x = Math.cos(angle) * hexSize;
          const y = Math.sin(angle) * hexSize;
          
          if (i === 0) {
            shape.moveTo(x, y);
          } else {
            shape.lineTo(x, y);
          }
        }
        // 闭合路径
        const firstHexAngle = 0;
        const firstHexX = Math.cos(firstHexAngle) * hexSize;
        const firstHexY = Math.sin(firstHexAngle) * hexSize;
        shape.lineTo(firstHexX, firstHexY);
        break;
        
      case 5: // 星形
        shape = new THREE.Shape();
        const outerRadius = size * (0.3 + Math.random() * 0.2);
        const innerRadius = outerRadius * 0.4;
        const starPoints = 5;
        const angleInc = Math.PI / starPoints;
        
        for (let i = 0; i < starPoints * 2; i++) {
          const angle = i * angleInc;
          const radius = i % 2 === 0 ? outerRadius : innerRadius;
          const x = Math.cos(angle) * radius;
          const y = Math.sin(angle) * radius;
          
          if (i === 0) {
            shape.moveTo(x, y);
          } else {
            shape.lineTo(x, y);
          }
        }
        // 闭合路径
        const firstStarAngle = 0;
        const firstStarX = Math.cos(firstStarAngle) * outerRadius;
        const firstStarY = Math.sin(firstStarAngle) * outerRadius;
        shape.lineTo(firstStarX, firstStarY);
        break;
      
      case 6: // 不规则四边形
        shape = new THREE.Shape();
        const irregQuadSize = size * 0.3;
        // 随机偏移各个顶点，创造不规则性
        const offset1 = 0.7 + Math.random() * 0.6;
        const offset2 = 0.7 + Math.random() * 0.6;
        const offset3 = 0.7 + Math.random() * 0.6;
        const offset4 = 0.7 + Math.random() * 0.6;
        
        shape.moveTo(-irregQuadSize * offset1, -irregQuadSize * offset2);
        shape.lineTo(irregQuadSize * offset3, -irregQuadSize * offset4);
        shape.lineTo(irregQuadSize * offset2, irregQuadSize * offset1);
        shape.lineTo(-irregQuadSize * offset4, irregQuadSize * offset3);
        shape.lineTo(-irregQuadSize * offset1, -irregQuadSize * offset2);
        break;
        
      case 7: // Z形图案
        shape = new THREE.Shape();
        const zSize = size * 0.4;
        shape.moveTo(-zSize, -zSize);
        shape.lineTo(zSize, -zSize);
        shape.lineTo(-zSize, zSize);
        shape.lineTo(zSize, zSize);
        break;
        
      case 8: // 波浪形
        shape = new THREE.Shape();
        const waveSize = size * 0.3;
        const waveCount = 3;
        const waveHeight = waveSize * 0.5;
        
        shape.moveTo(-waveSize, 0);
        
        // 创建上半部分波浪
        for (let i = 0; i <= waveCount; i++) {
          const x = -waveSize + (2 * waveSize / waveCount) * i;
          const y = (i % 2 === 0) ? waveHeight : -waveHeight;
          shape.lineTo(x, y);
        }
        
        // 回到起点
        shape.lineTo(-waveSize, 0);
        break;
        
      case 9: // 八角星
        shape = new THREE.Shape();
        const octaRadius = size * 0.3;
        const octaPoints = 8;
        const octaInnerRadius = octaRadius * 0.4;
        const octaAngleInc = Math.PI / octaPoints;
        
        for (let i = 0; i < octaPoints * 2; i++) {
          const angle = i * octaAngleInc;
          const radius = i % 2 === 0 ? octaRadius : octaInnerRadius;
          const x = Math.cos(angle) * radius;
          const y = Math.sin(angle) * radius;
          
          if (i === 0) {
            shape.moveTo(x, y);
          } else {
            shape.lineTo(x, y);
          }
        }
        
        // 闭合路径
        const firstOctaAngle = 0;
        const firstOctaX = Math.cos(firstOctaAngle) * octaRadius;
        const firstOctaY = Math.sin(firstOctaAngle) * octaRadius;
        shape.lineTo(firstOctaX, firstOctaY);
        break;
    }
    
    // 创建两条线，一条稍大一点来实现"粗线"效果
    const result = new THREE.Group();
    
    // 第一条线 - 原始形状
    const points = shape.getPoints(50);
    const geometry = new THREE.BufferGeometry();
    const vertices = [];
    
    // 创建顶点数组
    for (let i = 0; i < points.length; i++) {
      vertices.push(points[i].x, points[i].y, 0);
    }
    
    // 添加最后一点连接到第一点，闭合形状
    geometry.setAttribute('position', new THREE.Float32BufferAttribute(vertices, 3));
    const originalLine = new THREE.Line(geometry, material);
    result.add(originalLine);
    
    // 第二条线 - 相同形状但更大一点点，创造双线效果
    const thickerMaterial = new THREE.LineBasicMaterial({ 
      color: 0x666666,
      transparent: true,
      opacity: 0.1     // 更透明 (由0.15改为0.1)
    });
    
    const thickerShape = new THREE.Shape();
    // 稍微放大原始形状
    const scaleFactor = 1.10; // 放大10%
    for (let i = 0; i < points.length; i++) {
      const x = points[i].x * scaleFactor;
      const y = points[i].y * scaleFactor;
      
      if (i === 0) {
        thickerShape.moveTo(x, y);
      } else {
        thickerShape.lineTo(x, y);
      }
    }
    
    // 创建更大形状的几何体
    const thickerPoints = thickerShape.getPoints(50);
    const thickerGeometry = new THREE.BufferGeometry();
    const thickerVertices = [];
    
    // 创建顶点数组
    for (let i = 0; i < thickerPoints.length; i++) {
      thickerVertices.push(thickerPoints[i].x, thickerPoints[i].y, 0);
    }
    
    thickerGeometry.setAttribute('position', new THREE.Float32BufferAttribute(thickerVertices, 3));
    const thickerLine = new THREE.Line(thickerGeometry, thickerMaterial);
    result.add(thickerLine);
    
    return result;
  }

  // 创建左侧几何图形
  function createLeftShapes() {
    // 移动设备上减少图形数量
    const shapeCount = isMobileDevice() ? 20 : 50;
    const viewWidth = window.innerWidth;
    const viewHeight = window.innerHeight;
    const maxSize = Math.min(viewWidth, viewHeight) * (isMobileDevice() ? 0.03 : 0.04); // 移动设备上图形更小
    
    // 计算左侧区域的宽度，考虑内容区域的位置
    // 添加额外的安全边距防止图形越界
    const safetyMargin = maxSize * 2; // 安全边距为最大图形尺寸的2倍
    const leftAreaWidth = Math.max(0, contentLeft - safetyMargin);
    
    // 若可用区域太小，减少图形数量
    const adjustedShapeCount = leftAreaWidth < 100 ? Math.floor(shapeCount / 2) : shapeCount;
    
    // 为了均匀分布，我们将空间划分为网格
    const gridCols = isMobileDevice() ? 3 : 5; // 移动设备减少列数
    const gridRows = isMobileDevice() ? 7 : 10; // 移动设备减少行数
    
    const cellWidth = leftAreaWidth / gridCols;
    const cellHeight = viewHeight / gridRows;
    
    for (let i = 0; i < adjustedShapeCount; i++) {
      const shapeType = Math.floor(Math.random() * 10); // 10种形状类型
      const size = maxSize * (0.2 + Math.random() * 0.8); // 随机化尺寸但保持较小
      
      const shape = create2DShape(shapeType, size);
      
      // 计算当前图形应该放在哪个网格
      const col = i % gridCols;
      const row = Math.floor(i / gridCols) % gridRows;
      
      // 在网格单元内随机偏移一点位置，使分布更自然
      const xOffset = (Math.random() * 0.8 + 0.1) * cellWidth; // 10%-90%的单元格宽度
      const yOffset = (Math.random() * 0.8 + 0.1) * cellHeight; // 10%-90%的单元格高度
      
      // 计算最终位置 - 确保所有图形都在左侧区域内，不会越过中心矩形
      // 添加边界限制，确保图形及其边缘不会越过内容区域
      // 在 X 轴位置上添加额外的安全距离
      const safeX = Math.min(col * cellWidth + xOffset, leftAreaWidth - size * 1.5);
      const xPos = safeX - viewWidth/2;
      const yPos = (row * cellHeight + yOffset - viewHeight/2);
      
      // 设置图形位置
      shape.position.x = xPos;
      shape.position.y = yPos;
      shape.position.z = 0; // 保持在2D平面上
      
      // 随机旋转 - 只在z轴旋转，保持2D效果
      shape.rotation.z = Math.random() * Math.PI * 2;
      
      leftShapes.add(shape);
    }
  }

  // 创建右侧几何图形
  function createRightShapes() {
    // 移动设备上减少图形数量
    const shapeCount = isMobileDevice() ? 20 : 50;
    const viewWidth = window.innerWidth;
    const viewHeight = window.innerHeight;
    const maxSize = Math.min(viewWidth, viewHeight) * (isMobileDevice() ? 0.03 : 0.04); // 移动设备上图形更小
    
    // 计算右侧区域开始位置和宽度，添加额外的边距防止越界
    const safetyMargin = maxSize * 2; // 安全边距为最大图形尺寸的2倍
    const rightAreaStart = contentRight + safetyMargin;
    const rightAreaWidth = Math.max(0, viewWidth - rightAreaStart);
    
    // 若可用区域太小，减少图形数量
    const adjustedShapeCount = rightAreaWidth < 100 ? Math.floor(shapeCount / 2) : shapeCount;
    
    // 为了均匀分布，我们将空间划分为网格
    const gridCols = isMobileDevice() ? 3 : 5; // 移动设备减少列数
    const gridRows = isMobileDevice() ? 7 : 10; // 移动设备减少行数
    
    const cellWidth = rightAreaWidth / gridCols;
    const cellHeight = viewHeight / gridRows;
    
    for (let i = 0; i < adjustedShapeCount; i++) {
      const shapeType = Math.floor(Math.random() * 10); // 10种形状类型
      const size = maxSize * (0.2 + Math.random() * 0.8); // 随机化尺寸但保持较小
      
      const shape = create2DShape(shapeType, size);
      
      // 计算当前图形应该放在哪个网格
      const col = i % gridCols;
      const row = Math.floor(i / gridCols) % gridRows;
      
      // 在网格单元内随机偏移一点位置，使分布更自然
      const xOffset = (Math.random() * 0.8 + 0.1) * cellWidth; // 10%-90%的单元格宽度
      const yOffset = (Math.random() * 0.8 + 0.1) * cellHeight; // 10%-90%的单元格高度
      
      // 计算最终位置 - 确保所有图形都在右侧区域内，不会越过中心矩形
      // 添加边界限制，确保图形及其边缘不会越过内容区域
      // 在 X 轴位置上添加额外的安全距离
      const safeX = Math.max(rightAreaStart + col * cellWidth + xOffset, rightAreaStart + size * 1.5);
      const xPos = safeX - viewWidth/2;
      const yPos = (row * cellHeight + yOffset - viewHeight/2);
      
      // 设置图形位置
      shape.position.x = xPos;
      shape.position.y = yPos;
      shape.position.z = 0; // 保持在2D平面上
      
      // 随机旋转 - 只在z轴旋转，保持2D效果
      shape.rotation.z = Math.random() * Math.PI * 2;
      
      rightShapes.add(shape);
    }
  }

  // 创建图形
  createLeftShapes();
  createRightShapes();

  // 设置相机位置
  camera.position.z = 10;

  // 处理窗口大小变化
  function onWindowResize() {
    const width = window.innerWidth;
    const height = window.innerHeight;
    
    // 重设相机
    camera.left = width / -2;
    camera.right = width / 2;
    camera.top = height / 2;
    camera.bottom = height / -2;
    camera.updateProjectionMatrix();
    
    renderer.setSize(width, height);
    
    // 重新创建几何图形，适应新窗口大小
    createLeftShapes();
    createRightShapes();
  }

  // 监听窗口大小变化
  window.addEventListener('resize', onWindowResize);

  // 监听鼠标移动
  document.addEventListener('mousemove', function(event) {
    // 计算鼠标位置的归一化值 (-1 到 1)
    targetMouseX = (event.clientX / window.innerWidth) * 2 - 1;
    targetMouseY = -(event.clientY / window.innerHeight) * 2 + 1;
    touchEnabled = false; // 使用鼠标时禁用触摸模式
  });
  
  // 监听触摸移动（移动设备）
  document.addEventListener('touchmove', function(event) {
    if (event.touches.length > 0) {
      // 计算触摸位置的归一化值
      targetMouseX = (event.touches[0].clientX / window.innerWidth) * 2 - 1;
      targetMouseY = -(event.touches[0].clientY / window.innerHeight) * 2 + 1;
      touchEnabled = true; // 启用触摸模式
    }
  }, { passive: true }); // 使用 passive: true 提高滚动性能

  // 动画循环和性能优化
  let lastFrameTime = 0;
  const FPS_LIMIT = isMobileDevice() ? 30 : 60; // 移动设备限制FPS
  const FRAME_THRESHOLD = 1000 / FPS_LIMIT;
  
  function animate(currentTime) {
    requestAnimationFrame(animate);
    
    // 限制帧率以提高性能
    if (currentTime - lastFrameTime < FRAME_THRESHOLD) {
      return; // 跳过这一帧
    }
    lastFrameTime = currentTime;
    
    // 如果页面不可见，则暂停动画更新
    if (document.hidden) {
      return;
    }
    
    // 平滑过渡到目标鼠标位置，触摸设备上响应速度更慢
    const smoothFactor = touchEnabled || isMobileDevice() ? 0.01 : 0.05; // 降低移动端更新频率
    mouseX += (targetMouseX - mouseX) * smoothFactor;
    mouseY += (targetMouseY - mouseY) * smoothFactor;
    
    // 根据鼠标位置调整图形组的位置，实现跟随效果
    // 限制移动范围，确保不会越过中心区域
    const maxMove = window.innerWidth * (isMobileDevice() ? 0.005 : 0.03); // 移动设备上进一步减小移动距离
    
    // 使用更简单的方法计算移动距离
    // 当鼠标在页面左侧时，限制右侧图形向左移动
    // 当鼠标在页面右侧时，限制左侧图形向右移动
    
    // 在移动设备上减少动画效果，提高性能
    const moveFactor = isMobileDevice() ? 0.05 : 0.3; // 降低移动设备上的移动系数
    
    // 左侧图形组的移动 - 仅在鼠标在页面右侧(mouseX>0)时限制向右移动
    let leftMoveX = -mouseX * maxMove;
    if (mouseX < 0) {
      // 向右移动幅度降低，减少移动到内容区域的可能性
      leftMoveX = -mouseX * maxMove * moveFactor;
    }
    
    // 右侧图形组的移动 - 仅在鼠标在页面左侧(mouseX<0)时限制向左移动
    let rightMoveX = -mouseX * maxMove;
    if (mouseX > 0) {
      // 向左移动幅度降低，减少移动到内容区域的可能性
      rightMoveX = -mouseX * maxMove * moveFactor;
    }
    
    // 垂直移动幅度在移动设备上更小
    const verticalMoveFactor = isMobileDevice() ? 0.005 : 0.02; // 减小垂直移动系数
    
    // 应用计算后的移动
    leftShapes.position.x = leftMoveX;
    leftShapes.position.y = -mouseY * window.innerHeight * verticalMoveFactor;
    
    rightShapes.position.x = rightMoveX;
    rightShapes.position.y = -mouseY * window.innerHeight * verticalMoveFactor;
    
    renderer.render(scene, camera);
  }

  // 检测页面可见性变化
  document.addEventListener('visibilitychange', function() {
    if (!document.hidden && isMobileDevice()) {
      // 页面恢复可见时重置动画状态
      lastFrameTime = 0;
    }
  });

  // 开始动画
  animate(0);

  // 确保背景总是全屏
  function ensureFullscreenBackground() {
    if (container) {
      container.style.height = '100vh';
      container.style.width = '100vw';
      container.style.position = 'fixed';
      container.style.top = '0';
      container.style.left = '0';
      container.style.zIndex = '-2';
    }
  }

  // 定期检查背景是否完全覆盖视窗
  setInterval(ensureFullscreenBackground, 2000);
} 