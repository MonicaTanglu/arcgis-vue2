<template>
  <transition name="fade">
    <div class="modal-root" v-if="modalVisible">
      <div class="dialog">
        <div class="drag-modal" v-bind:style="{ width: width }" v-drag>
          <div class="modal-title" v-dragHandle>
            <h2>{{ title }}</h2>
            <a-icon type="close" @click="close" class="close" />
          </div>
          <div class="modal-content">
            <slot name="content"></slot>
          </div>
        </div>
      </div>
      <div class="modal-mask"></div>
    </div>
  </transition>
</template>
<script>
export default {
  name: "DragModal",
  props: {
    visible: {
      type: Boolean,
      default: false,
      required: true,
    },
    title: {
      type: String,
      default: "",
    },
    width: {
      type: String,
      default: "520px",
    },
  },
  watch: {
    visible(val) {
      this.modalVisible = val;
    },
  },
  data() {
    return {
      modalVisible: this.visible,
    };
  },
  methods: {
    close() {
      this.modalVisible = false;
      console.log(this.modalVisible);
    },
  },
};
</script>
<style  scoped>
.modal-mask {
  position: fixed;
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;
  z-index: 1000;
  background-color: rgba(0, 0, 0, 0.45);
}
.dialog {
  position: fixed;
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;
  z-index: 1001;
  overflow: auto;
  outline: 0;
}
.drag-modal {
  position: relative;
  top: 200px;
  background: #fff;
  margin: 0 auto;
  border-radius: 4px;
}
.modal-title {
  display: flex;
  height: 44px;
  justify-content: space-between;
  align-items: center;
  padding: 8px 16px;
  border-bottom: 1px solid #e8e8e8;
}
h2 {
  margin: 0;
}
.close {
  cursor: pointer;
}
.modal-content {
  min-height: 200px;
  padding: 16px 10px;
}
</style>