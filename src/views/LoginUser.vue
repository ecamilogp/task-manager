<script setup lang="ts">
import { computed, ref } from 'vue';
import { useRouter } from 'vue-router';
import { helpers, required } from '@vuelidate/validators';
import useVuelidate from '@vuelidate/core';
import { useTaskStore } from '@/stores/userTaskStore';
import type { LoginForm } from '@/interfaces/loginInterface';

const taskStore = useTaskStore();
const router = useRouter();
const PasswordVisible = ref(false);
const loading = ref(false);
const showError = ref(false);

const userLogin = 'task100@gmail.com';
const userPassword = 'colombia2025';

//form
const formLogin = ref<LoginForm>({
  username: '',
  password: '',
});

// validation of user
const incorrectUser = computed(() =>
  helpers.withMessage(
    'Usuario o contraseña incorrectos',
    () => !showError.value
  )
);

// Validation rules
const rules = computed(() => ({
  username: [helpers.withMessage('Este campo es requerido', required)],
  password: [
    helpers.withMessage('Este campo es requerido', required),
    incorrectUser.value,
  ],
}));

const v$ = useVuelidate(rules, formLogin);

// enable login
function login() {
  showError.value = false;
  v$.value.$touch();

  loading.value = true;

  setTimeout(() => {
    if (
      formLogin.value.username === userLogin &&
      formLogin.value.password === userPassword
    ) {
      taskStore.fetchTasks();
      console.log(taskStore.fetchTasks());

      router.push('/task-list');
    } else {
      showError.value = true;
      v$.value.$validate();
    }
    loading.value = false;
  }, 2000);
}
</script>

<template>
  <div class="login">
    <div class="login__form">
      <h1 class="login__title">Login to TaskManagerProject</h1>

      <q-input
        v-model="formLogin.username"
        label="Username"
        placeholder="Enter your username"
        filled
        dark
        class="login__input"
        color="white"
        bg-color="gray"
        outlined
        :error="v$.username.$dirty && v$.username.$invalid"
        :error-message="v$.username.$errors[0]?.$message"
      />

      <q-input
        v-model="formLogin.password"
        :type="PasswordVisible ? 'text' : 'password'"
        label="Password"
        placeholder="Enter your password"
        filled
        dark
        class="login__input"
        color="white"
        bg-color="gray"
        outlined
        :error="v$.password.$dirty && v$.password.$invalid"
        :error-message="v$.password.$errors[0]?.$message"
      >
        <template v-slot:append>
          <q-icon
            :name="PasswordVisible ? 'visibility' : 'visibility_off'"
            class="login__icon"
            @click="PasswordVisible = !PasswordVisible"
          />
        </template>
      </q-input>

      <q-btn
        :disable="loading"
        color="grey-7"
        class="login__button"
        no-caps
        @click="login"
      >
        <template v-if="loading">
          <q-spinner size="20px" color="white" />
          Cargando...
        </template>
        <template v-else> Login </template>
      </q-btn>
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
  text-align: start;
  font-size: 36px;
  margin-left: 10px;
  margin-bottom: 5px;
  white-space: nowrap;
}

.login__input,
.login__button {
  display: flex;
  flex-direction: column;
  width: 100%;
  height: 56px;
  font-size: 20px;
  margin: 10px;
}

.login__button {
  border-radius: 5px;
}

/* Ícono de visibilidad */
.login__icon {
  cursor: pointer;
  color: white;
}

/* Imagen */
.login__picture-container {
  max-width: 600px;
  flex: 1;
  display: flex;
  justify-content: center;
  margin-left: 100px;
}

.login__picture {
  width: 100%;
  max-width: 600px;
  object-fit: cover;
  border-radius: 8px;
}
</style>
