import {currentUser} from "@/utils/pocketbase";

export default defineNuxtRouteMiddleware((to, from) => {
    if (to.path === "/add-blueprint" && currentUser.value == null) {
        return navigateTo("/login");
    }
    

});