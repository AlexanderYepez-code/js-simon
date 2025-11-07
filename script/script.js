const btnconferm = document.querySelector(".btn");
const timerElem = document.querySelector(".contatore");
const risultatoElem = document.querySelector(".Risultato");

const numerone = document.getElementById("number1");
const numertwo = document.getElementById("number2");
const numerthree = document.getElementById("number3");
const numerfour = document.getElementById("number4");
const numerfive = document.getElementById("number5");

const inputs = [numerone, numertwo, numerthree, numerfour, numerfive];

// variabili
let conteggio = 10; // tempo del conto alla rovescia
let intervalId = null;
let randomNumbers = []; // numeri da ricordare

// genera numeri casuali
function generaNumeriCasuali() {
  randomNumbers = [];
  while (randomNumbers.length < 5) {
    const num = Math.floor(Math.random() * 100) + 1;
    if (!randomNumbers.includes(num)) {
      randomNumbers.push(num);
    }
  }

  // mostra i numeri negli input
  inputs.forEach((input, index) => {
    input.value = randomNumbers[index];
  });

  console.log("Numeri da ricordare:", randomNumbers);
}

// ===== FA PARTIRE IL GIOCO =====
btnconferm.addEventListener("click", startGame);

function startGame() {
  // disattiva il bottone durante il countdown
  btnconferm.disabled = true;
  risultatoElem.textContent = "";
  generaNumeriCasuali();
  conteggio = 10;
  timerElem.textContent = `Tempo rimanente: ${conteggio}s`;

  intervalId = setInterval(() => {
    conteggio--;
    timerElem.textContent = `Tempo rimanente: ${conteggio}s`;

    if (conteggio === 0) {
      clearInterval(intervalId);
      nascondiNumeri();
    }
  }, 1000);
}

// ===== NASCONDE I NUMERI =====
function nascondiNumeri() {
  inputs.forEach(input => {
    input.value = ""; // svuota gli input
  });

  timerElem.textContent = "Tempo scaduto! Scrivi i numeri che ricordi ";
  btnconferm.textContent = "Verifica";
  btnconferm.disabled = false;

  // cambia funzione del bottone → ora serve per controllare le risposte
  btnconferm.removeEventListener("click", startGame);
  btnconferm.addEventListener("click", verificaRisposte);
}

// ===== VERIFICA RISPOSTE =====
function verificaRisposte() {
  const userNumbers = [];
  let allValid = true;

  // controllo che ogni valore sia un numero valido
  inputs.forEach(input => {
    input.classList.remove("is-invalid");
    const value = input.value.trim();

    if (value === "" || isNaN(value)) {
      input.classList.add("is-invalid");
      allValid = false;
    } else {
      userNumbers.push(Number(value));
    }
  });

  if (!allValid) {
    risultatoElem.innerHTML = `<span class="text-danger">⚠️ Inserisci solo numeri validi!</span>`;
    return;
  }

  // controlla quanti numeri coincidono (ordine non importante)
  const guessed = userNumbers.filter(num => randomNumbers.includes(num));

  risultatoElem.innerHTML = `
    <p>Hai indovinato <strong>${guessed.length}</strong> numero/i!</p>
    <p>Numeri indovinati: ${guessed.join(", ") || "nessuno 😢"}</p>
    <p>Numeri corretti: ${randomNumbers.join(", ")}</p>
  `;

  // resetta il bottone per poter rigiocare
  btnconferm.textContent = "Ricomincia";
  btnconferm.removeEventListener("click", verificaRisposte);
  btnconferm.addEventListener("click", startGame);
}