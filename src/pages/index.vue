<script lang="ts" setup>
import { useRouter } from 'vue-router';

const router = useRouter();
router.replace('/login');
</script>

<route lang="yaml">
meta:
  layout: standalone
</route>
