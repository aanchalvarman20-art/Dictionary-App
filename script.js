const searchBtn = document.getElementById("searchBtn");
const wordInput = document.getElementById("wordInput");
const resultDiv = document.getElementById("result");
const errorDiv = document.getElementById("error");

const wordEl = document.getElementById("word");
const phoneticEl = document.getElementById("phonetic");
const meaningEl = document.getElementById("meaning");
const exampleEl = document.getElementById("example");
const partOfSpeechEl = document.getElementById("partOfSpeech");
const audioBtn = document.getElementById("audioBtn");

let audio;

// Search button click
searchBtn.addEventListener("click", searchWord);

// Enter key support
wordInput.addEventListener("keypress", (e) => {
    if (e.key === "Enter") {
        searchWord();
    }
});

function searchWord() {
    const word = wordInput.value.trim();

    // Empty input check
    if (word === "") {
        alert("Please enter a word");
        return;
    }

    fetch(`https://api.dictionaryapi.dev/api/v2/entries/en/${word}`)
        .then(response => {
            if (!response.ok) {
                throw new Error("Word not found");
            }
            return response.json();
        })
        .then(data => displayResult(data))
        .catch(() => {
            resultDiv.classList.add("hidden");
            errorDiv.classList.remove("hidden");
            errorDiv.textContent = "Word not found. Please try another word.";
        });
}

function displayResult(data) {
    errorDiv.classList.add("hidden");
    resultDiv.classList.remove("hidden");

    const wordData = data[0];

    wordEl.textContent = wordData.word;

    // Phonetic
    phoneticEl.textContent = wordData.phonetic || "";

    // Meaning & Part of Speech
    const meaningData = wordData.meanings[0];
    partOfSpeechEl.textContent = meaningData.partOfSpeech;
    meaningEl.textContent = meaningData.definitions[0].definition;

    // Example sentence
    exampleEl.textContent =
        meaningData.definitions[0].example || "Example not available";

    // Audio pronunciation
    const phonetics = wordData.phonetics.find(p => p.audio);
    if (phonetics) {
        audio = new Audio(phonetics.audio);
        audioBtn.classList.remove("hidden");
        audioBtn.onclick = () => audio.play();
    } else {
        audioBtn.classList.add("hidden");
    }
}
