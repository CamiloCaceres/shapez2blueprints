<script setup lang="ts">
import PocketBase from 'pocketbase';

const pb = new PocketBase('https://shapez2blueprints.pockethost.io');
pb.autoCancellation(false);


// fetch a paginated records list
const resultList = await pb.collection('blueprints').getList(1, 50, {
    filter: 'created >= "2022-01-01 00:00:00"',
});

</script>

<template>
<pre>
    {{ resultList }}
    <Login />
</pre></template>