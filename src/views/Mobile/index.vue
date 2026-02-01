<template>
  <div class="mobile-restricted">
    <div class="content">
      <div class="icon">💻</div>
      <h2>Vui lòng truy cập bằng máy tính</h2>
      <p>Ứng dụng này được tối ưu hóa cho máy tính để bàn. Vui lòng sử dụng máy tính để có trải nghiệm tốt nhất.</p>
    </div>
  </div>
</template>

<script lang="ts" setup>
// Mobile view is restricted
</script>

<style lang="scss" scoped>
.mobile-restricted {
  height: 100%;
  width: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  background-color: #f0f2f5;
  color: #333;
  padding: 20px;
  position: absolute;
  top: 0;
  left: 0;
  z-index: 9999;

  .content {
    background: white;
    padding: 40px 30px;
    border-radius: 16px;
    box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
    text-align: center;
    max-width: 400px;
    width: 100%;
  }

  .icon {
    font-size: 64px;
    margin-bottom: 24px;
    line-height: 1;
  }

  h2 {
    margin: 0 0 12px;
    font-size: 20px;
    font-weight: 600;
    color: #1a1a1a;
  }

  p {
    margin: 0;
    font-size: 15px;
    line-height: 1.6;
    color: #666;
  }
}
</style>