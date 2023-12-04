<template>
    <div class="main">
        <div>
            <p>Enter calibration document:</p>
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
    input.value = "1abc2\npqr3stu8vwx\na1b2c3d4e5f\ntreb7uchet";
}
function fill2() {
    input.value = "two1nine\neightwothree\nabcone2threexyz\nxtwone3four\n4nineeightseven2\nzoneight234\n7pqrstsixteen";
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
    var lines = input.split('\n');
    var result = 0;

    const re = /\d/g;
    lines.forEach((line)=> {
        const matches = Array.from(line.matchAll(re));
        if(matches.length > 0) {
            result += parseInt(matches[0][0]) * 10 + parseInt(matches[matches.length-1][0]);
        }
    })

    return result;
}

function solve2(input){
    var lines = input.split('\n');
    var result = 0;

    const lookup = {
        '0': 0,
        '1': 1,
        '2': 2,
        '3': 3,
        '4': 4,
        '5': 5,
        '6': 6,
        '7': 7,
        '8': 8,
        '9': 9,
        'zero': 0,
        'one': 1,
        'two': 2,
        'three': 3,
        'four': 4,
        'five': 5,
        'six': 6,
        'seven': 7,
        'eight': 8,
        'nine': 9,
    }

    lines.forEach((line)=> {
        var matches = [];
        matches = matches.concat(Array.from(line.matchAll(/\d/g)));
        matches = matches.concat(Array.from(line.matchAll(/one/g)));
        matches = matches.concat(Array.from(line.matchAll(/two/g)));
        matches = matches.concat(Array.from(line.matchAll(/three/g)));
        matches = matches.concat(Array.from(line.matchAll(/four/g)));
        matches = matches.concat(Array.from(line.matchAll(/five/g)));
        matches = matches.concat(Array.from(line.matchAll(/six/g)));
        matches = matches.concat(Array.from(line.matchAll(/seven/g)));
        matches = matches.concat(Array.from(line.matchAll(/eight/g)));
        matches = matches.concat(Array.from(line.matchAll(/nine/g)));

        matches = matches.sort((x,y)=> x.index-y.index);

        if(matches.length > 0) {
            result += lookup[matches[0][0]] * 10 + lookup[matches[matches.length-1][0]];
        }

    })

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