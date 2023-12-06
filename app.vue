<template>
  <div class="container">
    <h1><NuxtLink class="headerlink" to="/">Advent of Code 2023</NuxtLink></h1>
    <NuxtPage />
  </div>
</template>

<style lang="scss">
.container{
    display: flex;
    flex-direction: column;
    flex-wrap: wrap;
    align-items: center;
}

.headerlink {
  color: white;
  text-decoration: none;
}
</style>