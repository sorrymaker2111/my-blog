/**
 * 使用Three.js实现页面两侧2D几何图形背景
 * 实现鼠标移动时的视差效果
 */

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
  // 创建容器元素
  const container = document.createElement('div');
  container.id = 'geometry-background';
  container.style.position = 'fixed';
  container.style.top = '0';
  container.style.left = '0';
  container.style.width = '100%';
  container.style.height = '100%';
  container.style.zIndex = '-1';
  container.style.pointerEvents = 'none'; // 确保不会影响页面交互
  document.body.insertBefore(container, document.body.firstChild);

  // 获取内容区域的位置
  const headerElement = document.querySelector('.intro-header');
  const contentElement = document.querySelector('.container .row .postlist-container') || 
                         document.querySelector('.container .row .col-lg-8');
  
  // 确保我们找到了内容元素
  if (!contentElement) {
    console.error("找不到内容区域元素");
    return;
  }
  
  // 获取内容区域位置
  let contentRect = contentElement.getBoundingClientRect();
  let headerHeight = headerElement ? headerElement.offsetHeight : 0;
  
  // 计算安全区域（内容区域两侧的边距）
  const safeMargin = 50; // 内容两侧额外的安全间距
  const contentLeft = contentRect.left - safeMargin;
  const contentRight = contentRect.right + safeMargin;

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

  // 创建几何图形组
  let leftShapes = new THREE.Group();
  let rightShapes = new THREE.Group();
  scene.add(leftShapes);
  scene.add(rightShapes);

  // 材质 - 只有线框，灰色
  const material = new THREE.LineBasicMaterial({ 
    color: 0x666666, // 更深的灰色 (由0x808080改为0x666666)
    transparent: true,
    opacity: 0.2     // 降低不透明度 (由0.25改为0.2)
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
    const shapeCount = 50; // 数量减半为50个
    const viewWidth = window.innerWidth;
    const viewHeight = window.innerHeight;
    const maxSize = Math.min(viewWidth, viewHeight) * 0.04; // 小尺寸，视窗的4%
    
    // 计算左侧区域宽度
    const leftAreaWidth = contentLeft;
    
    // 为了均匀分布，我们将空间划分为网格
    const gridCols = 5; // 水平方向划分为5列
    const gridRows = 10; // 垂直方向划分为10行
    
    const cellWidth = leftAreaWidth / gridCols;
    const cellHeight = viewHeight / gridRows;
    
    for (let i = 0; i < shapeCount; i++) {
      const shapeType = Math.floor(Math.random() * 10); // 10种形状类型
      const size = maxSize * (0.2 + Math.random() * 0.8); // 随机化尺寸但保持较小
      
      const shape = create2DShape(shapeType, size);
      
      // 计算当前图形应该放在哪个网格
      const col = i % gridCols;
      const row = Math.floor(i / gridCols) % gridRows;
      
      // 在网格单元内随机偏移一点位置，使分布更自然
      const xOffset = (Math.random() * 0.8 + 0.1) * cellWidth; // 10%-90%的单元格宽度
      const yOffset = (Math.random() * 0.8 + 0.1) * cellHeight; // 10%-90%的单元格高度
      
      // 计算最终位置
      const xPos = col * cellWidth + xOffset - viewWidth/2;
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
    const shapeCount = 50; // 数量减半为50个
    const viewWidth = window.innerWidth;
    const viewHeight = window.innerHeight;
    const maxSize = Math.min(viewWidth, viewHeight) * 0.04; // 小尺寸，视窗的4%
    
    // 计算右侧区域开始位置和宽度
    const rightAreaStart = contentRight;
    const rightAreaWidth = viewWidth - rightAreaStart;
    
    // 为了均匀分布，我们将空间划分为网格
    const gridCols = 5; // 水平方向划分为5列
    const gridRows = 10; // 垂直方向划分为10行
    
    const cellWidth = rightAreaWidth / gridCols;
    const cellHeight = viewHeight / gridRows;
    
    for (let i = 0; i < shapeCount; i++) {
      const shapeType = Math.floor(Math.random() * 10); // 10种形状类型
      const size = maxSize * (0.2 + Math.random() * 0.8); // 随机化尺寸但保持较小
      
      const shape = create2DShape(shapeType, size);
      
      // 计算当前图形应该放在哪个网格
      const col = i % gridCols;
      const row = Math.floor(i / gridCols) % gridRows;
      
      // 在网格单元内随机偏移一点位置，使分布更自然
      const xOffset = (Math.random() * 0.8 + 0.1) * cellWidth; // 10%-90%的单元格宽度
      const yOffset = (Math.random() * 0.8 + 0.1) * cellHeight; // 10%-90%的单元格高度
      
      // 计算最终位置
      const xPos = rightAreaStart + col * cellWidth + xOffset - viewWidth/2;
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
    
    // 更新相机
    camera.left = width / -2;
    camera.right = width / 2;
    camera.top = height / 2;
    camera.bottom = height / -2;
    camera.updateProjectionMatrix();
    
    renderer.setSize(width, height);
    
    // 更新内容区域位置
    if (contentElement) {
      contentRect = contentElement.getBoundingClientRect();
      
      // 更新安全区域
      const contentLeft = contentRect.left - safeMargin;
      const contentRight = contentRect.right + safeMargin;
    }
    
    // 重新调整图形位置以适应新的屏幕尺寸
    scene.remove(leftShapes);
    scene.remove(rightShapes);
    
    leftShapes = new THREE.Group();
    rightShapes = new THREE.Group();
    scene.add(leftShapes);
    scene.add(rightShapes);
    
    createLeftShapes();
    createRightShapes();
  }

  // 监听窗口大小变化
  window.addEventListener('resize', onWindowResize);

  // 监听鼠标移动
  document.addEventListener('mousemove', function(event) {
    // 计算鼠标位置在 -1 到 1 之间的标准化坐标
    targetMouseX = (event.clientX / window.innerWidth) * 2 - 1;
    targetMouseY = -(event.clientY / window.innerHeight) * 2 + 1;
  });

  // 动画循环
  function animate() {
    requestAnimationFrame(animate);
    
    // 平滑过渡到目标鼠标位置
    mouseX += (targetMouseX - mouseX) * 0.05;
    mouseY += (targetMouseY - mouseY) * 0.05;
    
    // 根据鼠标位置调整图形组的位置，实现跟随效果
    leftShapes.position.x = -mouseX * window.innerWidth * 0.03;
    leftShapes.position.y = -mouseY * window.innerHeight * 0.02;
    
    rightShapes.position.x = -mouseX * window.innerWidth * 0.03;
    rightShapes.position.y = -mouseY * window.innerHeight * 0.02;
    
    renderer.render(scene, camera);
  }

  // 添加调试辅助函数
  function drawDebugSafeArea() {
    // 创建一个表示内容安全区域的线框
    const safeAreaGeometry = new THREE.BufferGeometry();
    const vertices = new Float32Array([
      contentLeft - window.innerWidth/2, -window.innerHeight/2, 0,
      contentLeft - window.innerWidth/2, window.innerHeight/2, 0,
      contentRight - window.innerWidth/2, window.innerHeight/2, 0,
      contentRight - window.innerWidth/2, -window.innerHeight/2, 0,
      contentLeft - window.innerWidth/2, -window.innerHeight/2, 0
    ]);
    safeAreaGeometry.setAttribute('position', new THREE.BufferAttribute(vertices, 3));
    
    const safeAreaMaterial = new THREE.LineBasicMaterial({
      color: 0xff0000,
      transparent: true,
      opacity: 0.5
    });
    
    const safeAreaLine = new THREE.Line(safeAreaGeometry, safeAreaMaterial);
    scene.add(safeAreaLine);
  }
  
  // 如果需要调试，取消下面一行的注释
  // drawDebugSafeArea();

  // 开始动画
  animate();
} 