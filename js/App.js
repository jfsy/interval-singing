const notes = [
    "C",
    "C#",
    "D",
    "D#",
    "E",
    "F",
    "F#",
    "G",
    "G#",
    "A",
    "A#",
    "B",
]
const octaves = [3, 4, 5]
const directionToSign = {
    "ascending": 1,
    "descending": -1,
}
const intervalToHalfSteps = {
    "minor 2nd": 1,
    "major 2nd": 2,
    "minor 3rd": 3,
    "major 3rd": 4,
    "perfect 4th": 5,
    "tritone": 6,
    "perfect 5th": 7,
    "minor 6th": 8,
    "major 6th": 9,
    "minor 7th": 10,
    "major 7th": 11,
    "octave": 12,
}

let currentProblem = null;
let currentSolution = null;
const synth = new Tone.Synth().toDestination();

function playPitch(pitch) {
    synth.triggerAttackRelease(pitch, "4n");
}

function playInterval(pitch1, pitch2) {
    const now = Tone.now();
    synth.triggerAttackRelease(pitch1, "4n", now);
    synth.triggerAttackRelease(pitch2, "4n", now + 1);
}

function getRandomInt(max) {
    return Math.floor(Math.random() * max);
}

function getRandomKey(obj) {
    const keys = Object.keys(obj);
    return keys[getRandomInt(keys.length)];
}

function updateProblem() {
    const noteIdx = getRandomInt(notes.length);
    const octave = 4;
    const direction = getRandomKey(directionToSign);
    const interval = getRandomKey(intervalToHalfSteps);
    currentProblem = [noteIdx, octave, direction, interval];
    return currentProblem;
}

function getProblemPitch() {
    const [noteIdx, octave, direction, interval] = currentProblem;
    const pitch = `${notes[noteIdx]}${octave}`;
    return pitch;
}

function getProblemText() {
    const [noteIdx, octave, direction, interval] = currentProblem;
    return `${notes[noteIdx]} ${direction} ${interval}`;
}

function solveProblem(problemComponents) {
    let [noteStartIdx, octave, direction, interval] = currentProblem;
    let noteEndIdx = noteStartIdx + directionToSign[direction] * intervalToHalfSteps[interval];
    if (noteEndIdx < 0) {
        noteEndIdx += 12;
        octave -= 1;
    } else if (noteEndIdx > 11) {
        noteEndIdx %= 12;
        octave += 1;
    }
    currentSolution = [noteEndIdx, octave];
    return currentSolution;
}

function getSolutionPitch() {
    const [noteIdx, octave] = currentSolution;
    return `${notes[noteIdx]}${octave}`;
}
function getSolutionText() {
    const [noteIdx, octave] = currentSolution;
    return `${notes[noteIdx]}`;
}

function showNewProblem() {
    updateProblem();
    document.getElementById("problem").innerHTML = getProblemText();
    document.getElementById("btn-update").innerHTML = "Next";
    document.getElementById("btn-show-solution").style.display = "block";
    playPitch(getProblemPitch());
}

function showSolution() {
    solveProblem();
    document.getElementById("solution").innerHTML = getSolutionText();
    playInterval(getProblemPitch(), getSolutionPitch());
}

document.getElementById("btn-update").addEventListener("click", showNewProblem);
document.getElementById("btn-show-solution").addEventListener("click", showSolution);