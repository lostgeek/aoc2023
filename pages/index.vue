<template>
    <div class="container">
        <h1>Advent of Code 2023</h1>
        <div class="days">
            <NuxtLink to="/01">01</NuxtLink>
            <NuxtLink to="/02">02</NuxtLink>
            <NuxtLink to="/03">03</NuxtLink>
        </div>
    </div>
</template>

<style lang="scss">

.container{
    display: flex;
    flex-direction: column;
    flex-wrap: wrap;
    align-items: center;
}
.days {
    display: flex;
    flex-direction: row;
    max-width: 14rem;
    flex-wrap: wrap;
    gap: 1rem;

    & a {
        width: 1rem;
        text-align: center;
    }
}
</style>