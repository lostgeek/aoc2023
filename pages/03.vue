<template>
    <div class="main">
        <div>
            <p>Enter schematics:</p>
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
        <div v-if="schematics_ref">
            <p>Result: {{ result }}</p>
            <div v-if="animate" class="map" :key="anim_state">
                <div v-for="line in schematics_ref">
                    <span v-for="char in line" :class="char.type">{{ char.char }}</span>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup>
const entered = ref(false);
const step2 = ref(false);
const input = ref("");
const result = ref("");
const schematics_ref = ref([]);
const animate = ref(true);
const anim_state = ref(0);
const speed = ref(200);

function fill1() {
    input.value = "467..114..\n...*......\n..35..633.\n......#...\n617*......\n.....+.58.\n..592.....\n......755.\n...$.*....\n.664.598..";
}
function fill2() {
    input.value = "467..114..\n...*......\n..35..633.\n......#...\n617*......\n.....+.58.\n..592.....\n......755.\n...$.*....\n.664.598..";
    step2.value = true;
}

async function submit() {
    var lines = input.value.trim().split('\n');
    var schematics = lines.map((l) => l.split(''));
    schematics_ref.value = schematics.map((line, i) => {
        return line.map((c, j) => {
            return {char: c,
                    type: 'none'};
        });
    });

    if(step2.value) {
        result.value = await solve2(schematics);
    } else {
        result.value = await solve1(schematics);
    }

    entered.value = true;
}


const anim_step = (n) => {
    if(animate.value) {
        anim_state.value++;
        return new Promise(resolve => setTimeout(resolve, n*speed.value));
    } else {
        return;
    }
};

async function solve1(schematics){
    var result = 0;

    for (const [i, line] of schematics.entries()) {
        for (const match of Array.from(line.join('').matchAll(/\d+/g))) {
            if(animate.value) {
                for(var j=match.index; j < match.index + match[0].length; j++){
                    schematics_ref.value[i][j].type = 'checking-number'
                }
                await anim_step(1);
            }

            var toCheck = [];
            var lower_j = Math.max(match.index-1, 0);
            var upper_j = Math.min(match.index+match[0].length, line.length-1); // or rather (length-1) +1

            var ii = []
            if (i-1 >= 0) {
                ii.push(i-1)
            }
            ii.push(i)
            if (i+1 < schematics.length) {
                ii.push(i+1)
            }

            ii.forEach(x => {
                for (var y = lower_j; y <= upper_j; y++) {
                    toCheck.push([x,y]);
                }
            });

            var use_number = false;
            for (const coords of toCheck) {

                if(animate.value) {
                    var before_type = schematics_ref.value[coords[0]][coords[1]].type;
                    schematics_ref.value[coords[0]][coords[1]].type = 'checking-symbol';
                    await anim_step(.5);

                    if (! /(\.|\d)/.test(schematics[coords[0]][coords[1]])) {
                        schematics_ref.value[coords[0]][coords[1]].type = 'found-symbol';
                        await anim_step(5);
                        schematics_ref.value[coords[0]][coords[1]].type = before_type;
                    } else {
                        schematics_ref.value[coords[0]][coords[1]].type = before_type;
                    }
                }

                // checks whether symbol (i.e. not '.' or \d)
                if (! /(\.|\d)/.test(schematics[coords[0]][coords[1]])) {
                    use_number = true;
                    break;
                }
            }

            if(animate.value) {
                if (use_number) {
                    for(var j=match.index; j < match.index + match[0].length; j++){
                        schematics_ref.value[i][j].type = 'number'
                    }
                    await anim_step(1);
                } else {
                    for(var j=match.index; j < match.index + match[0].length; j++){
                        schematics_ref.value[i][j].type = 'visited'
                    }
                    await anim_step(1);
                }
            }

            if (use_number) {
                result += parseInt(match[0]);
            } 
        }
    }

    return result;
}

async function solve2(schematics){
    var result = 0;

    for (const [i, line] of schematics.entries()) {
        for (const match of Array.from(line.join('').matchAll(/\*/g))) {
            if(animate.value) {
                for(var j=match.index; j < match.index + match[0].length; j++){
                    schematics_ref.value[i][match.index].type = 'checking-gear'
                }
                await anim_step(1);
            }

            var numbers = [];
            function set_neighbour(di, dj, type) {
                if(i+di < 0 || i+di >= schematics.length
                   || j+dj < 0 || j+dj >= schematics[i+di].length) {
                    return false;
                }
                schematics_ref.value[i+di][match.index+dj].type = type;
            }

            async function check_neighbour(di, dj) {
                if(i+di < 0 || i+di >= schematics.length
                   || j+dj < 0 || j+dj >= schematics[i+di].length) {
                    return false;
                }

                if(animate.value) {
                    var before_type = schematics_ref.value[i+di][match.index+dj].type;
                    set_neighbour(di, dj, 'checking-symbol');
                    await anim_step(1);
                    if(/\d/.test(schematics[i+di][match.index+dj])){
                        set_neighbour(di, dj, 'found-symbol');
                        await anim_step(1);
                    } else {
                        set_neighbour(di, dj, before_type);
                        await anim_step(1);
                    }
                }

                if(/\d/.test(schematics[i+di][match.index+dj])){
                    numbers.push([i+di, match.index+dj]);
                    return true;
                }
            }

            if(! (await check_neighbour(-1, 0))){
                await check_neighbour(-1, -1);
                await check_neighbour(-1, +1);
            };
            await check_neighbour(0, -1);
            await check_neighbour(0, +1);
            if(! (await check_neighbour(+1, 0))){
                await check_neighbour(+1, -1);
                await check_neighbour(+1, +1);
            };

            var gear_ratio = 1;
            if(numbers.length == 2) {
                for(const coords of numbers){
                    var start_j = coords[1];
                    while(/\d/.test(schematics[coords[0]][start_j])) {
                        if(animate.value) {
                            schematics_ref.value[coords[0]][start_j].type = 'number';
                            await anim_step(.5);
                        }

                        start_j--;
                        if(start_j < 0) {
                            break;
                        }
                    }
                    start_j++;

                    var end_j = coords[1];
                    while(/\d/.test(schematics[coords[0]][end_j])) {
                        if(animate.value) {
                            schematics_ref.value[coords[0]][end_j].type = 'number';
                            await anim_step(.5);
                        }
                        end_j++;
                        if(end_j >= schematics[coords[0]].length) {
                            break;
                        }
                    }
                    end_j--;

                    gear_ratio *= parseInt(schematics[coords[0]].slice(start_j, end_j+1).join(''));
                }
            result += gear_ratio;

            } else {
                if(animate.value){
                    set_neighbour(-1, -1, 'visited');
                    set_neighbour(-1, 0, 'visited');
                    set_neighbour(-1, +1, 'visited');
                    set_neighbour(0, -1, 'visited');
                    set_neighbour(0, 0, 'visited');
                    set_neighbour(0, +1, 'visited');
                    set_neighbour(+1, -1, 'visited');
                    set_neighbour(+1, 0, 'visited');
                    set_neighbour(+1, +1, 'visited');
                    await anim_step(1);
                }
            }
        }
    }

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

.map {
    font-family: monospace;

    .checking-number, .checking-gear {
        color: yellow;
        text-shadow: 0 0 3px yellow;
    }

    .checking-symbol {
        color: #0088ff;
        text-shadow: 0 0 3px #0088ff;
    }
    .found-symbol {
        color: #db0fb3;
        text-shadow: 0 0 3px #db0fb3;
    }

    .number {
        color: greenyellow;
        text-shadow: 0 0 3px greenyellow;
    }

    .visited {
        color: gray;
    }
}
</style>