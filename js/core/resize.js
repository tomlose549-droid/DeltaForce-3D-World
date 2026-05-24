// js/core/resize.js
// 窗口尺寸变化响应

export function initResize(camera, renderer) {
  window.addEventListener('resize', () => {
    camera.aspect = innerWidth / innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(innerWidth, innerHeight);
  });
}
