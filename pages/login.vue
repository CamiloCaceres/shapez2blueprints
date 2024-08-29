<script setup lang="ts">
import { ref, computed } from "vue";
import { pb, currentUser } from "@/utils/pocketbase";

const username = ref("");
const password = ref("");

async function login() {
  try {
    await pb
      .collection("users")
      .authWithPassword(username.value, password.value);
  } catch (err) {
    console.error("Login failed:", err);
  }
}

async function signUp() {
  try {
    const data = {
      username: username.value,
      password: password.value,
      passwordConfirm: password.value,
      name: "hi mom!",
    };
    await pb.collection("users").create(data);
    await login();
  } catch (err) {
    console.error("Sign up failed:", err);
  }
}

function signOut() {
  pb.authStore.clear();
}
</script>

<template>
    
  <UCard class="max-w-sm mt-10 mx-auto">
    <template #header>
      <h1 class="">Login</h1>
    </template>

    <UFormGroup class="mb-4" label="Email">
      <UInput placeholder="you@example.com" icon="i-heroicons-envelope" />
    </UFormGroup>

    <UFormGroup class="mb-4" label="Password">
        <template #hint>
      <NuxtLink class="underline cursor-pointer" to="">Forgot password?</NuxtLink>
    </template>
      <UInput icon="i-heroicons-key" />
    </UFormGroup>
    <UButton block class="">Login</UButton>
      <p class="text-center my-2">
        Don't have an account?
        <NuxtLink class="underline cursor-pointer" to="/signup">Sign up</NuxtLink>
      </p>


  </UCard>
</template>
