<template>
  <div>
    <h1>{{greet}}, {{msg}}</h1>
  </div>
</template>

<script>
export default {
  props: {
    greet: String,
  },
  data() {
    return {
      msg: 'World!'
    }
  },
}
</script>
