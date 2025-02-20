<script setup lang="ts">
import { ref } from 'vue';

const username = ref('');
const password = ref('');
const isPasswordVisible = ref(false);
</script>

<template>
  <div class="login">
    <div class="login__form">
      <h1 class="login__title">Login to TaskManagerProject</h1>

      <q-input
        v-model="username"
        label="Username"
        placeholder="Enter your username"
        filled
        dark
        class="login__input"
        color="white"
        bg-color="gray"
        outlined
      />

      <q-input
        v-model="password"
        :type="isPasswordVisible ? 'text' : 'password'"
        label="Password"
        placeholder="Enter your password"
        filled
        dark
        class="login__input"
        color="white"
        bg-color="gray"
        outlined
      >
        <template v-slot:append>
          <q-icon
            :name="isPasswordVisible ? 'visibility' : 'visibility_off'"
            class="login__icon"
            @click="isPasswordVisible = !isPasswordVisible"
          />
        </template>
      </q-input>

      <q-btn label="Login" color="grey-7" class="login__button" no-caps />

      <router-link to="/register-user" class="login__link">
        registrar usuario
      </router-link>
    </div>

    <div class="login__picture-container">
      <img src="../assets/notes.jpeg" alt="Task Board" class="login__picture" />
    </div>
  </div>
</template>

<style scoped>
/* formulario */
.login {
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: center;
  gap: 50px;
  background-color: black;
  height: 100vh;
  padding: 5%;
  color: white;
  text-align: center;
}

.login__form {
  max-width: 700px;
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 15px;
  padding: 20px;
  border-radius: 10px;
  text-align: left;
}

.login__title {
  font-size: 36px;
  line-height: 1.2;
  margin-bottom: 5px;
  white-space: nowrap;
}

.login__input,
.login__button {
  width: 100%;
  height: 56px;
  font-size: 20px;
}

.login__button {
  border-radius: 5px;
}

.login__link {
  color: white;
  text-align: center;
  text-decoration: none;
  margin-top: 10px;
  display: block;
}

/* Ícono de visibilidad */
.login__icon {
  cursor: pointer;
  color: white;
}

/* Imagen */
.login__picture-container {
  max-width: 700px;
  flex: 1;
  display: flex;
  justify-content: center;
}

.login__picture {
  width: 100%;
  max-width: 500px;
  object-fit: cover;
  border-radius: 8px;
}
</style>
