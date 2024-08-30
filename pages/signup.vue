<script setup lang="ts">
import { z } from "zod";
import type { FormSubmitEvent } from "#ui/types";
import { pb, currentUser } from "@/utils/pocketbase";

const router = useRouter();

const isLoading = ref(false)

const schema = z.object({
  username: z.string().min(3, "Username must be at least 3 characters"),
  email: z.string().email("Invalid email address"),
  password: z.string().min(8, "Password must be at least 8 characters"),
});

type Schema = z.output<typeof schema>;

const state = reactive({
  username: undefined,
  email: undefined,
  password: undefined,
});

async function login() {
  try {
    await pb
      .collection("users")
      .authWithPassword(state.email, state.password);
   
      router.push('/');
    
  } catch (err) {
    console.error("Login failed:", err);
  }
}

async function onSubmit(event: FormSubmitEvent<Schema>) {
  isLoading.value = true
  try {
    const data = {
      ...event.data,
      passwordConfirm: event.data.password,
    };
    await pb.collection("users").create(data);
    await login();
  } catch (err) {
    console.error("Sign up failed:", err);
  }
}
</script>

<template>
  <UCard class="max-w-sm mt-10 mx-auto">
    <template #header>
      <h1 class="">Sign Up</h1>
    </template>
    <UForm :schema="schema" :state="state" class="space-y-4" @submit="onSubmit">
      <UFormGroup label="Username" name="username">
        <UInput
          v-model="state.username"
          placeholder="MAM Builder"
          icon="i-heroicons-user"
        />
      </UFormGroup>
      <UFormGroup label="Email" name="email">
        <UInput
          v-model="state.email"
          placeholder="you@example.com"
          icon="i-heroicons-envelope"
        />
      </UFormGroup>
      <UFormGroup label="Password" name="password">
        <UInput
          v-model="state.password"
          type="password"
          icon="i-heroicons-key"
        />
      </UFormGroup>
      <UButton :loading="isLoading" type="submit" block> Create an account </UButton>
    </UForm>
    <p class="text-center my-2">
      Already have an account?
      <NuxtLink class="underline cursor-pointer" to="/login">Login</NuxtLink>
    </p>
  </UCard>
</template>
