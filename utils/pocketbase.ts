import PocketBase from 'pocketbase';

export const pb = new PocketBase('https://shapez2blueprints.pockethost.io/'); // remote

export const currentUser = ref(pb.authStore.model);

pb.authStore.onChange((auth) => {
    console.log('authStore changed', auth);
    currentUser.value = pb.authStore.model;
});