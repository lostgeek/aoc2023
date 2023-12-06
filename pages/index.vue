<template>
    <div class="container">
        <div class="days">
            <NuxtLink to="/01">01</NuxtLink>
            <NuxtLink to="/02">02</NuxtLink>
            <NuxtLink to="/03">03</NuxtLink>
            <NuxtLink to="/04">04</NuxtLink>
            <NuxtLink class="disabled" to="/">05</NuxtLink>
            <NuxtLink class="disabled" to="/">06</NuxtLink>
            <NuxtLink class="disabled" to="/">07</NuxtLink>
            <NuxtLink class="disabled" to="/">08</NuxtLink>
            <NuxtLink class="disabled" to="/">09</NuxtLink>
            <NuxtLink class="disabled" to="/">11</NuxtLink>
            <NuxtLink class="disabled" to="/">12</NuxtLink>
            <NuxtLink class="disabled" to="/">13</NuxtLink>
            <NuxtLink class="disabled" to="/">14</NuxtLink>
            <NuxtLink class="disabled" to="/">15</NuxtLink>
            <NuxtLink class="disabled" to="/">16</NuxtLink>
            <NuxtLink class="disabled" to="/">17</NuxtLink>
            <NuxtLink class="disabled" to="/">18</NuxtLink>
            <NuxtLink class="disabled" to="/">19</NuxtLink>
            <NuxtLink class="disabled" to="/">20</NuxtLink>
            <NuxtLink class="disabled" to="/">21</NuxtLink>
            <NuxtLink class="disabled" to="/">22</NuxtLink>
            <NuxtLink class="disabled" to="/">23</NuxtLink>
            <NuxtLink class="disabled" to="/">24</NuxtLink>
            <NuxtLink class="disabled" to="/">25</NuxtLink>
        </div>
        <a href="https://github.com/lostgeek/aoc2023" target="_blank" class="github"><GitHub /> GitHub</a>
    </div>
</template>

<style lang="scss">
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

    & a.disabled {
        color: grey;
        text-decoration: none;
    }
}

.github {
    margin-top: 3rem;
    display: flex;
    flex-direction:row;
    align-items: center;
    gap: .5rem;

    & svg {
        fill: white;
    }
}
</style>