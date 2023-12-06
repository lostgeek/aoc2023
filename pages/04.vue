<template>
    <div class="main">
        <div>
            <p>Enter information:</p>
            <textarea v-model="input" cols="80" rows="10"></textarea>
            <p class="options">
                <input type="checkbox" id="step2" v-model="step2" />
                <label for="step2">Step 2 of challenge?</label>
                <button type="button" @click="fill1">Example 1</button>
                <button type="button" @click="fill2">Example 2</button>
                <span class="hfill"></span>
                <button type="button" @click="submit">Start</button>
            </p>
            <p class="options">
                <input type="checkbox" id="animate" v-model="animate" />
                <label for="animate">Animate solve</label>
                <label style="margin-left: 1rem" for="speed" v-if="animate">Animation delay: </label>
                <input v-if="animate" type="range" min="10" max="1000" step="10" id="speed" v-model="speed">
                <span v-if="animate">{{ speed }}</span>
            </p>
        </div>
        <div v-if="!step2 && result!==null">
            <p>Result: {{ result }}</p>
        </div>
        <div v-if="step2">
            <p>Result: {{ result2 }}</p>
        </div>
        <div class="cards" v-if="cards" :key="anim_state">
            <div v-if="!step2" class="card" v-for="card in cards" :class="card.type">
                <div class="card-nr">Card {{ card.nr }} | Winning: {{ card.winning_nrs.map((nr) => nr.nr).join(', ') }} | Points: {{ card.points }}</div>
                <div class="own-nrs"><span class="nr" v-for="nr in card.own_nrs" :class="nr.type">{{ nr.nr }}</span></div>
            </div>
            <div v-if="step2" class="cards-step2">
                <div class="card-step2" v-for="card in cards" :class="card.type">
                    <div class="card-nr">{{ card.nr }}</div>
                    <div class="card-count">{{ card.count }}</div>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup>
const entered = ref(false);
const step2 = ref(false);
const animate = ref(true);
const anim_state = ref(0);
const speed = ref(200);

const input = ref("");
const result = ref(null);
const cards = ref([]);

const result2 = computed(() => {
    return cards.value.map(c => c.count).reduce((a,b) => a+b, 0);
})



function fill1() {
    input.value = "Card 1: 41 48 83 86 17 | 83 86  6 31 17  9 48 53\nCard 2: 13 32 20 16 61 | 61 30 68 82 17 32 24 19\nCard 3:  1 21 53 59 44 | 69 82 63 72 16 21 14  1\nCard 4: 41 92 73 84 69 | 59 84 76 51 58  5 54 83\nCard 5: 87 83 26 28 32 | 88 30 70 12 93 22 82 36\nCard 6: 31 18 13 56 72 | 74 77 10 23 35 67 36 11";
}
function fill2() {
    input.value = "Card 1: 41 48 83 86 17 | 83 86  6 31 17  9 48 53\nCard 2: 13 32 20 16 61 | 61 30 68 82 17 32 24 19\nCard 3:  1 21 53 59 44 | 69 82 63 72 16 21 14  1\nCard 4: 41 92 73 84 69 | 59 84 76 51 58  5 54 83\nCard 5: 87 83 26 28 32 | 88 30 70 12 93 22 82 36\nCard 6: 31 18 13 56 72 | 74 77 10 23 35 67 36 11";
    step2.value = true;
}

async function submit() {
    parse(input.value.trim().split('\n'));

    if(step2.value) {
        await solve2();
    } else {
        await solve1();
    }

    entered.value = true;
}

function parse(lines) {
    cards.value = lines.map((l) => {
        var data = l.split(': ');
        var nr = parseInt(data[0].match(/Card\s*(\d+)/)[1]);
        var tmp = data[1].split(' | ');
        var winning_nrs = tmp[0].trim().replaceAll("  ", " ").split(' ').map((x) => {return {nr: parseInt(x)};});
        var own_nrs = tmp[1].trim().replaceAll("  ", " ").split(' ').map((x) => {return {nr: parseInt(x)};});
        return {nr: nr,
            type: null,
            hits: 0,
            points: 0,
            count: 1,
            winning_nrs: winning_nrs,
            own_nrs: own_nrs};
    });
}

const anim_step = (n) => {
    if(animate.value) {
        anim_state.value++;
        return new Promise(resolve => setTimeout(resolve, n*speed.value));
    } else {
        return;
    }
};

async function solve1(){
    result.value = 0;

    for(const card of cards.value) {
        card.type = 'checking'
        await anim_step(1);

        var hits = 0;
        card.own_nrs.map((x) => {
            if(card.winning_nrs.map(x => x.nr).includes(x.nr)) {
                x.type = "winning"
                hits++;
            }
            return x;
        });

        card.hits = hits;
        card.points = Math.floor(Math.pow(2, hits-1));
        result.value += card.points;

        card.type = 'checked'
    }
}

async function solve2(){
    var pre_value = animate.value;
    animate.value = false;
    await solve1();
    animate.value = pre_value;
    cards.value.forEach(c => {c.type = null});

    for(const [i, card] of cards.value.entries()) {
        card.type = 'checking';
        await anim_step(1);

        for(var j = i+1; j <= i+card.hits; j++) {
            if(j >= cards.value.length) {
                break;
            }

            cards.value[j].type = 'added';
            cards.value[j].count += card.count;
            await anim_step(1);
        }

        card.type = 'checked';
        await anim_step(2);
        
        cards.value.forEach(c => {c.type = null});
    }

}

fill1();
</script>

<style lang="scss">
.main {
    width: 100%;
    display: flex;
    flex-direction:column;
    align-items: center;
}

label {
    font-size: 90%;
}

.options {
    width:100%;
    display:flex;

    .hfill {
        flex-grow: 1;
        height:0;
    }
}

.cards {
    width: 100%;
    display:flex;
    flex-direction: row;
    flex-wrap: wrap;
    justify-content: center;
    gap: .5rem;
}

.card {
    padding: .5rem;
    width: 10rem;
    border: 1px white solid;
    border-radius: 1rem;
    display: flex;
    flex-direction: column;
    gap: .5rem;

    &.checking {
        border: 1px yellow solid;
        box-shadow: 0px 0px 5px yellow;
    }
    &.checked {
        border: 1px green solid;
        box-shadow: 0px 0px 5px green;
    }
}

.own-nrs {
    display: flex;
    flex-direction: row;
    flex-wrap: wrap;
    justify-content: center;
    gap: .2rem;
}

.nr {
    border: 2px white solid;
    border-radius: 50%;
    width: 2ex;
    height: 2ex;
    line-height: 2ex;
    padding: .5ex;
    text-align: center;

    &.winning {
        border: 2px limegreen solid;
        box-shadow: 0px 0px 5px limegreen;
    }
}

.cards-step2 {
    width: 100%;
    display: flex;
    flex-direction: column;
    flex-wrap: wrap;
    height: 50vh;
    gap: .5rem;
    align-items: center;
    overflow-x: scroll;
}

.card-step2 {
    width: fit-content;
    display:flex;
    gap: 1rem;

    border: 1px white solid;
    border-radius: .25rem;

    &.checking {
        border: 1px magenta solid;
        box-shadow: 0 0 2px magenta;
    }
    &.added {
        border: 1px yellow solid;
        box-shadow: 0 0 5px yellow;
    }
    &.checked {
        border: 1px limegreen solid;
        box-shadow: 0 0 5px limegreen;
    }

    .card-nr {
        width: 2rem;
        text-align: right;
    }
    .card-count {
        width: 5rem;
    }
}
</style>