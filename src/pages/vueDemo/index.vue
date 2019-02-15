<template>
  <div>
    <hello-word :greet="msg" />
  </div>
</template>

<script>
import HelloWord from './components/helloword.vue'

export default {
  data() {
    return {
      msg: 'Hello'
    }
  },
  components: {
    HelloWord
  }
}
</script>
