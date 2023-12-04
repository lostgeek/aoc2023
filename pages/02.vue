<template>
    <div class="main">
        <div>
            <p>Enter game information:</p>
            <textarea v-model="input" cols="80" rows="10"></textarea>
            <p class="options">
                <input type="checkbox" id="step2" name="step2" value="step2" v-model="step2" />
                <label for="step2">Step 2 of challenge?</label>
                <button type="button" @click="fill1">Example 1</button>
                <button type="button" @click="fill2">Example 2</button>
                <span class="hfill"></span>
                <button type="button" @click="submit">Start</button>
            </p>
        </div>
        <div v-if="entered">
            Result: {{ result }}
        </div>
    </div>
</template>

<script setup>
const entered = ref(false);
const step2 = ref(false);
const input = ref("");
const result = ref("");

function fill1() {
    input.value = "Game 1: 3 blue, 4 red; 1 red, 2 green, 6 blue; 2 green\nGame 2: 1 blue, 2 green; 3 green, 4 blue, 1 red; 1 green, 1 blue\nGame 3: 8 green, 6 blue, 20 red; 5 blue, 4 red, 13 green; 5 green, 1 red\nGame 4: 1 green, 3 red, 6 blue; 3 green, 6 red; 3 green, 15 blue, 14 red\nGame 5: 6 red, 1 blue, 3 green; 2 blue, 1 red, 2 green";
}
function fill2() {
    input.value = "Game 1: 3 blue, 4 red; 1 red, 2 green, 6 blue; 2 green\nGame 2: 1 blue, 2 green; 3 green, 4 blue, 1 red; 1 green, 1 blue\nGame 3: 8 green, 6 blue, 20 red; 5 blue, 4 red, 13 green; 5 green, 1 red\nGame 4: 1 green, 3 red, 6 blue; 3 green, 6 red; 3 green, 15 blue, 14 red\nGame 5: 6 red, 1 blue, 3 green; 2 blue, 1 red, 2 green";
    step2.value = true;
}

function submit() {
    if(step2.value) {
        result.value = solve2(input.value);
    } else {
        result.value = solve1(input.value);
    }

    entered.value = true;
}

function solve1(input){
    const goal = {red: 12, green: 13, blue: 14};

    var lines = input.trim().split('\n');
    var games = lines.map((l) => {
        var info = l.split(': ')[1];
        var pulls = info.split('; ');
        return pulls.map(p => {
            var pull = {};
            p.split(', ').map(x=>x.split(' ')).forEach(pair => {pull[pair[1]] = parseInt(pair[0])});
            return pull;
        });
    })

    var result = 0;
    games.forEach((game, idx) => {
        var possibles = game.map((pull) => {
            if(pull["red"] > goal["red"] ||
               pull["green"] > goal["green"] ||
               pull["blue"] > goal["blue"]) {
                return false; // game impossible
               } else {
                return true; // game possible
               }
        });
        if(possibles.every(x=>x)) {
            result += idx+1;
        }
    });

    return result;
}

function solve2(input){
    var lines = input.trim().split('\n');
    var games = lines.map((l) => {
        var info = l.split(': ')[1];
        var pulls = info.split('; ');
        return pulls.map(p => {
            var pull = {};
            p.split(', ').map(x=>x.split(' ')).forEach(pair => {pull[pair[1]] = parseInt(pair[0])});
            return pull;
        });
    })

    var result = 0;
    games.forEach((game, idx) => {
        var minimal = {red: 0, green: 0, blue: 0};
        var possibles = game.forEach((pull) => {
            if(pull["red"] > minimal["red"]) {
                minimal["red"] = pull["red"];
            }
            if(pull["green"] > minimal["green"]) {
                minimal["green"] = pull["green"];
            }
            if(pull["blue"] > minimal["blue"]) {
                minimal["blue"] = pull["blue"];
            }
        });
        var power = minimal["red"]* minimal["green"]* minimal["blue"];
        result += power;
    });

    return result;
}
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
</style>