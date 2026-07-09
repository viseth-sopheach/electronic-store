<script setup>
const authStore = useAuthStore();
const router = useRouter();
const route = useRoute();

const email = ref("");
const password = ref("");
const error = ref("");
const submitting = ref(false);

async function handleLogin() {
  error.value = "";
  submitting.value = true;
  try {
    await authStore.login(email.value, password.value);
    router.push(route.query.redirect || "/");
  } catch (e) {
    error.value = e?.data?.statusMessage || "Login failed.";
  } finally {
    submitting.value = false;
  }
}
</script>
