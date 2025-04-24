/**
 * 页面两侧的装饰图形
 * 带有消隐效果，避开内容区域
 */
document.addEventListener('DOMContentLoaded', function() {
  // 创建左侧装饰元素
  const leftDecoration = document.createElement('div');
  leftDecoration.className = 'decoration-left';
  document.body.appendChild(leftDecoration);
  
  // 创建右侧装饰元素
  const rightDecoration = document.createElement('div');
  rightDecoration.className = 'decoration-right';
  document.body.appendChild(rightDecoration);
  
  // 创建SVG命名空间
  const svgNS = "http://www.w3.org/2000/svg";
  
  // 左侧SVG
  const leftSvg = document.createElementNS(svgNS, "svg");
  leftSvg.setAttribute("width", "100%");
  leftSvg.setAttribute("height", "100%");
  leftSvg.style.overflow = "visible";
  leftDecoration.appendChild(leftSvg);
  
  // 右侧SVG
  const rightSvg = document.createElementNS(svgNS, "svg");
  rightSvg.setAttribute("width", "100%");
  rightSvg.setAttribute("height", "100%");
  rightSvg.style.overflow = "visible";
  rightDecoration.appendChild(rightSvg);
  
  // 创建左侧装饰图形
  createLeftDecorations(leftSvg);
  
  // 创建右侧装饰图形
  createRightDecorations(rightSvg);
  
  // 动画循环
  animateDecorations();
});

// 创建左侧装饰
function createLeftDecorations(svg) {
  const svgNS = "http://www.w3.org/2000/svg";
  
  // 添加6个圆形，一半填充，一半不填充
  for (let i = 0; i < 6; i++) {
    const circle = document.createElementNS(svgNS, "circle");
    circle.setAttribute("cx", 30 + Math.random() * 50);
    circle.setAttribute("cy", 100 + i * 100);
    circle.setAttribute("r", 5 + Math.random() * 12);
    
    const isFilled = i % 2 === 0;
    if (isFilled) {
      circle.setAttribute("fill", "rgba(173, 216, 230, 0.4)");
      circle.setAttribute("stroke", "rgba(173, 216, 230, 0.6)");
    } else {
      circle.setAttribute("fill", "none");
      circle.setAttribute("stroke", "rgba(173, 216, 230, 0.5)");
    }
    
    circle.setAttribute("stroke-width", "1");
    circle.setAttribute("class", "animated-element");
    circle.dataset.speedX = (Math.random() * 0.2 - 0.1).toString();
    circle.dataset.speedY = (Math.random() * 0.2 - 0.1).toString();
    circle.dataset.opacity = "1";
    circle.dataset.fadeDirection = Math.random() > 0.5 ? "1" : "-1";
    circle.dataset.fadeSpeed = (0.005 + Math.random() * 0.01).toString();
    svg.appendChild(circle);
  }
  
  // 添加4条线
  for (let i = 0; i < 4; i++) {
    const line = document.createElementNS(svgNS, "line");
    line.setAttribute("x1", 20);
    line.setAttribute("y1", 50 + i * 150);
    line.setAttribute("x2", 120);
    line.setAttribute("y2", 100 + i * 150);
    line.setAttribute("stroke", "rgba(173, 216, 230, 0.4)");
    line.setAttribute("stroke-width", "1");
    line.setAttribute("class", "animated-element");
    line.dataset.rotationSpeed = (Math.random() * 0.2 - 0.1).toString();
    line.dataset.centerX = "70";
    line.dataset.centerY = (75 + i * 150).toString();
    line.dataset.opacity = "1";
    line.dataset.fadeDirection = Math.random() > 0.5 ? "1" : "-1";
    line.dataset.fadeSpeed = (0.005 + Math.random() * 0.01).toString();
    svg.appendChild(line);
  }
  
  // 添加3个三角形，一部分填充，一部分不填充
  for (let i = 0; i < 3; i++) {
    const polygon = document.createElementNS(svgNS, "polygon");
    const x = 70 + i * 40;
    const y = 200 + i * 180;
    const points = `${x},${y} ${x + 25},${y + 35} ${x - 25},${y + 35}`;
    polygon.setAttribute("points", points);
    
    const isFilled = i % 2 === 0;
    if (isFilled) {
      polygon.setAttribute("fill", "rgba(173, 216, 230, 0.3)");
      polygon.setAttribute("stroke", "rgba(173, 216, 230, 0.5)");
    } else {
      polygon.setAttribute("fill", "none");
      polygon.setAttribute("stroke", "rgba(173, 216, 230, 0.4)");
    }
    
    polygon.setAttribute("stroke-width", "1");
    polygon.setAttribute("class", "animated-element");
    polygon.dataset.rotationSpeed = (Math.random() * 0.3 - 0.15).toString();
    polygon.dataset.centerX = x.toString();
    polygon.dataset.centerY = (y + 20).toString();
    polygon.dataset.opacity = "1";
    polygon.dataset.fadeDirection = Math.random() > 0.5 ? "1" : "-1";
    polygon.dataset.fadeSpeed = (0.004 + Math.random() * 0.008).toString();
    svg.appendChild(polygon);
  }
  
  // 添加2个十字星
  for (let i = 0; i < 2; i++) {
    const group = document.createElementNS(svgNS, "g");
    const centerX = 50 + i * 60;
    const centerY = 350 + i * 200;
    const size = 8 + Math.random() * 6;
    
    // 水平线
    const line1 = document.createElementNS(svgNS, "line");
    line1.setAttribute("x1", centerX - size);
    line1.setAttribute("y1", centerY);
    line1.setAttribute("x2", centerX + size);
    line1.setAttribute("y2", centerY);
    line1.setAttribute("stroke", "rgba(173, 216, 230, 0.5)");
    line1.setAttribute("stroke-width", "1");
    group.appendChild(line1);
    
    // 垂直线
    const line2 = document.createElementNS(svgNS, "line");
    line2.setAttribute("x1", centerX);
    line2.setAttribute("y1", centerY - size);
    line2.setAttribute("x2", centerX);
    line2.setAttribute("y2", centerY + size);
    line2.setAttribute("stroke", "rgba(173, 216, 230, 0.5)");
    line2.setAttribute("stroke-width", "1");
    group.appendChild(line2);
    
    group.setAttribute("class", "animated-element");
    group.dataset.rotationSpeed = (Math.random() * 0.3 - 0.15).toString();
    group.dataset.centerX = centerX.toString();
    group.dataset.centerY = centerY.toString();
    group.dataset.opacity = "1";
    group.dataset.fadeDirection = Math.random() > 0.5 ? "1" : "-1";
    group.dataset.fadeSpeed = (0.005 + Math.random() * 0.01).toString();
    svg.appendChild(group);
  }
}

// 创建右侧装饰
function createRightDecorations(svg) {
  const svgNS = "http://www.w3.org/2000/svg";
  
  // 添加4个方形，一半填充，一半不填充
  for (let i = 0; i < 4; i++) {
    const rect = document.createElementNS(svgNS, "rect");
    rect.setAttribute("x", 30 + Math.random() * 50);
    rect.setAttribute("y", 80 + i * 140);
    rect.setAttribute("width", 15 + Math.random() * 20);
    rect.setAttribute("height", 15 + Math.random() * 20);
    
    const isFilled = i % 2 === 0;
    if (isFilled) {
      rect.setAttribute("fill", "rgba(173, 216, 230, 0.3)");
      rect.setAttribute("stroke", "rgba(173, 216, 230, 0.5)");
    } else {
      rect.setAttribute("fill", "none");
      rect.setAttribute("stroke", "rgba(173, 216, 230, 0.5)");
    }
    
    rect.setAttribute("stroke-width", "1");
    rect.setAttribute("class", "animated-element");
    rect.dataset.rotationSpeed = (Math.random() * 0.3 - 0.15).toString();
    const rectX = parseFloat(rect.getAttribute("x"));
    const rectW = parseFloat(rect.getAttribute("width"));
    const rectY = parseFloat(rect.getAttribute("y"));
    const rectH = parseFloat(rect.getAttribute("height"));
    rect.dataset.centerX = (rectX + rectW * 0.5).toString();
    rect.dataset.centerY = (rectY + rectH * 0.5).toString();
    rect.dataset.opacity = "1";
    rect.dataset.fadeDirection = Math.random() > 0.5 ? "1" : "-1";
    rect.dataset.fadeSpeed = (0.005 + Math.random() * 0.01).toString();
    svg.appendChild(rect);
  }
  
  // 添加5个圆形，一部分填充，一部分不填充
  for (let i = 0; i < 5; i++) {
    const circle = document.createElementNS(svgNS, "circle");
    circle.setAttribute("cx", 120 - i * 10);
    circle.setAttribute("cy", 100 + i * 120);
    circle.setAttribute("r", 4 + Math.random() * 10);
    
    const isFilled = i % 2 !== 0;
    if (isFilled) {
      circle.setAttribute("fill", "rgba(173, 216, 230, 0.3)");
      circle.setAttribute("stroke", "rgba(173, 216, 230, 0.5)");
    } else {
      circle.setAttribute("fill", "none");
      circle.setAttribute("stroke", "rgba(173, 216, 230, 0.4)");
    }
    
    circle.setAttribute("stroke-width", "1");
    circle.setAttribute("class", "animated-element");
    circle.dataset.speedX = (Math.random() * 0.2 - 0.1).toString();
    circle.dataset.speedY = (Math.random() * 0.2 - 0.1).toString();
    circle.dataset.opacity = "1";
    circle.dataset.fadeDirection = Math.random() > 0.5 ? "1" : "-1";
    circle.dataset.fadeSpeed = (0.005 + Math.random() * 0.01).toString();
    svg.appendChild(circle);
  }
  
  // 添加3条曲线
  for (let i = 0; i < 3; i++) {
    const path = document.createElementNS(svgNS, "path");
    const startX = 20 + i * 40;
    const startY = 160 + i * 150;
    const d = `M ${startX} ${startY} C ${startX + 50} ${startY - 50}, ${startX + 80} ${startY + 50}, ${startX + 120} ${startY}`;
    path.setAttribute("d", d);
    path.setAttribute("fill", "none");
    path.setAttribute("stroke", "rgba(173, 216, 230, 0.4)");
    path.setAttribute("stroke-width", "1");
    path.setAttribute("class", "animated-element");
    path.dataset.offsetY = "0";
    path.dataset.offsetSpeed = (Math.random() * 0.4 - 0.2).toString();
    path.dataset.opacity = "1";
    path.dataset.fadeDirection = Math.random() > 0.5 ? "1" : "-1";
    path.dataset.fadeSpeed = (0.003 + Math.random() * 0.01).toString();
    svg.appendChild(path);
  }
  
  // 添加2个菱形
  for (let i = 0; i < 2; i++) {
    const diamond = document.createElementNS(svgNS, "polygon");
    const x = 100 - i * 30;
    const y = 250 + i * 200;
    const size = 10 + Math.random() * 10;
    const points = `${x},${y-size} ${x+size},${y} ${x},${y+size} ${x-size},${y}`;
    diamond.setAttribute("points", points);
    
    const isFilled = i % 2 === 0;
    if (isFilled) {
      diamond.setAttribute("fill", "rgba(173, 216, 230, 0.3)");
      diamond.setAttribute("stroke", "rgba(173, 216, 230, 0.5)");
    } else {
      diamond.setAttribute("fill", "none");
      diamond.setAttribute("stroke", "rgba(173, 216, 230, 0.4)");
    }
    
    diamond.setAttribute("stroke-width", "1");
    diamond.setAttribute("class", "animated-element");
    diamond.dataset.rotationSpeed = (Math.random() * 0.3 - 0.15).toString();
    diamond.dataset.centerX = x.toString();
    diamond.dataset.centerY = y.toString();
    diamond.dataset.opacity = "1";
    diamond.dataset.fadeDirection = Math.random() > 0.5 ? "1" : "-1";
    diamond.dataset.fadeSpeed = (0.004 + Math.random() * 0.008).toString();
    svg.appendChild(diamond);
  }
}

// 动画函数
function animateDecorations() {
  // 获取所有可动画元素
  const elements = document.querySelectorAll('.animated-element');
  
  elements.forEach(element => {
    // 更新透明度 - 处理消隐效果
    let opacity = parseFloat(element.dataset.opacity);
    const fadeDirection = parseFloat(element.dataset.fadeDirection);
    const fadeSpeed = parseFloat(element.dataset.fadeSpeed);
    
    opacity += fadeDirection * fadeSpeed;
    
    // 当透明度变化到极限时改变方向
    if (opacity <= 0.1) {
      element.dataset.fadeDirection = "1";
      opacity = 0.1;
    } else if (opacity >= 1) {
      element.dataset.fadeDirection = "-1";
      opacity = 1;
    }
    
    element.dataset.opacity = opacity.toString();
    element.style.opacity = opacity.toString();
    
    // 移动圆形
    if (element.tagName === 'circle') {
      const cx = parseFloat(element.getAttribute('cx'));
      const cy = parseFloat(element.getAttribute('cy'));
      const speedX = parseFloat(element.dataset.speedX);
      const speedY = parseFloat(element.dataset.speedY);
      
      element.setAttribute('cx', cx + speedX);
      element.setAttribute('cy', cy + speedY);
      
      // 定期改变方向
      if (Math.random() < 0.01) {
        element.dataset.speedX = (speedX * -1).toString();
      }
      if (Math.random() < 0.01) {
        element.dataset.speedY = (speedY * -1).toString();
      }
    }
    
    // 旋转线条
    if (element.tagName === 'line') {
      const rotationSpeed = parseFloat(element.dataset.rotationSpeed);
      const centerX = parseFloat(element.dataset.centerX);
      const centerY = parseFloat(element.dataset.centerY);
      
      const x1 = parseFloat(element.getAttribute('x1'));
      const y1 = parseFloat(element.getAttribute('y1'));
      const x2 = parseFloat(element.getAttribute('x2'));
      const y2 = parseFloat(element.getAttribute('y2'));
      
      // 计算当前角度
      const angle1 = Math.atan2(y1 - centerY, x1 - centerX);
      const angle2 = Math.atan2(y2 - centerY, x2 - centerX);
      
      // 计算距离
      const distance1 = Math.sqrt((x1 - centerX) ** 2 + (y1 - centerY) ** 2);
      const distance2 = Math.sqrt((x2 - centerX) ** 2 + (y2 - centerY) ** 2);
      
      // 旋转角度
      const newAngle1 = angle1 + rotationSpeed;
      const newAngle2 = angle2 + rotationSpeed;
      
      // 计算新坐标
      const newX1 = centerX + distance1 * Math.cos(newAngle1);
      const newY1 = centerY + distance1 * Math.sin(newAngle1);
      const newX2 = centerX + distance2 * Math.cos(newAngle2);
      const newY2 = centerY + distance2 * Math.sin(newAngle2);
      
      // 更新坐标
      element.setAttribute('x1', newX1);
      element.setAttribute('y1', newY1);
      element.setAttribute('x2', newX2);
      element.setAttribute('y2', newY2);
    }
    
    // 旋转多边形和矩形 和 组
    if (element.tagName === 'polygon' || element.tagName === 'rect' || element.tagName === 'g') {
      const rotationSpeed = parseFloat(element.dataset.rotationSpeed);
      const centerX = parseFloat(element.dataset.centerX);
      const centerY = parseFloat(element.dataset.centerY);
      
      // 获取当前旋转角度
      let currentRotation = element.getAttribute('transform');
      let angle = 0;
      
      if (currentRotation) {
        const match = currentRotation.match(/rotate\(([^,]+),([^,]+),([^)]+)\)/);
        if (match) {
          angle = parseFloat(match[1]);
        }
      }
      
      // 计算新角度
      angle += rotationSpeed;
      
      // 设置旋转
      element.setAttribute('transform', `rotate(${angle}, ${centerX}, ${centerY})`);
    }
    
    // 波动路径
    if (element.tagName === 'path') {
      const offsetSpeed = parseFloat(element.dataset.offsetSpeed);
      let offsetY = parseFloat(element.dataset.offsetY);
      
      offsetY += offsetSpeed;
      
      // 当偏移值过大时反转方向
      if (Math.abs(offsetY) > 10) {
        element.dataset.offsetSpeed = (offsetSpeed * -1).toString();
      }
      
      element.dataset.offsetY = offsetY.toString();
      
      // 解析路径数据
      const d = element.getAttribute('d');
      const parts = d.split(' ');
      
      // 修改控制点的Y坐标以创建波动效果
      if (parts.length >= 9) {
        const startY = parseFloat(parts[2]);
        const cp1Y = parseFloat(parts[4]) + offsetY;
        const cp2Y = parseFloat(parts[6]) + offsetY;
        const endY = parseFloat(parts[8]);
        
        const newD = `${parts[0]} ${parts[1]} ${startY} ${parts[3]} ${parts[4].split(',')[0]},${cp1Y}, ${parts[5]} ${parts[6].split(',')[0]},${cp2Y}, ${parts[7]} ${parts[8].split(',')[0]},${endY}`;
        
        element.setAttribute('d', newD);
      }
    }
  });
  
  requestAnimationFrame(animateDecorations);
} 