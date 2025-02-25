<script setup lang="ts">
const emit = defineEmits(['confirm', 'cancel']);

const saveDeleteTask = () => {
  emit('confirm');
  closeDeleteModal();
};

const closeDeleteModal = () => {
  emit('cancel');
};
</script>

<template>
  <div class="modal-overlay">
    <div class="modal-container">
      <div class="modal-body">
        <p>¿Estás seguro de que deseas eliminar esta tarea?</p>
      </div>

      <div class="modal-actions">
        <q-btn
          color="red"
          icon="delete"
          label="Confirmar"
          unelevated
          @click="saveDeleteTask"
        />
        <q-btn
          color="grey"
          label="Cancelar"
          unelevated
          @click="closeDeleteModal"
        />
      </div>
    </div>
  </div>
</template>

<style scoped>
.modal-overlay {
  position: fixed;
  inset: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  background: rgba(0, 0, 0, 0.4);
}

.modal-container {
  background: rgb(244, 244, 244);
  padding: 20px;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.2);
  height: 20%;
  width: 100%;
  max-width: 350px;
  text-align: center;
}

.modal-body {
  padding: 20px;
  font-size: 16px;
  color: #333;
}

.modal-actions {
  display: flex;
  justify-content: space-between;
  padding: 10px 20px;
}
</style>
