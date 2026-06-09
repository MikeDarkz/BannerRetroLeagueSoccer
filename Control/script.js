import { initializeApp } from "https://www.gstatic.com/firebasejs/12.14.0/firebase-app.js";

import {
  getFirestore,
  doc,
  setDoc
} from "https://www.gstatic.com/firebasejs/12.14.0/firebase-firestore.js";

const firebaseConfig = {
  apiKey: "AIzaSyC7coC2dDI-7s3xlCVitTvk489PkbPOyy0",
  authDomain: "bannerrlsiss.firebaseapp.com",
  projectId: "bannerrlsiss",
  storageBucket: "bannerrlsiss.firebasestorage.app",
  messagingSenderId: "567726625420",
  appId: "1:567726625420:web:c41fd668879e32682ee1a9"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

const participants = [
  { id: 1, name: "GirlWhoPlays", country: "CO" },
  { id: 2, name: "Nando_retro", country: "CR" },
  { id: 3, name: "Danireds", country: "CR" },
  { id: 4, name: "AiwassJuega", country: "CO" },
  { id: 5, name: "Retrogabits", country: "ES" },
  { id: 6, name: "Carogamer3369", country: "CO" },
  { id: 7, name: "Rich22hmo", country: "MX" },
  { id: 8, name: "ChaguaCrows", country: "CO" },
  { id: 9, name: "JotaRojas25", country: "CR" },
  { id: 10, name: "Onquitos", country: "CR" },
  { id: 11, name: "Chico02184", country: "CR" },
  { id: 12, name: "MrXorTv", country: "VE" },
  { id: 13, name: "Acedosed", country: "CO" },
  { id: 14, name: "EljorgitoRetro", country: "CO" },
  { id: 15, name: "TheMaxter", country: "CO" },
  { id: 16, name: "8ch8bits", country: "CO" }
];

const participantsContainer = document.getElementById("participants");
const redTeam = document.getElementById("redTeam");
const blueTeam = document.getElementById("blueTeam");
const customName = document.getElementById("customName");
const updateButton = document.getElementById("updateOverlay");

let selectedRed = null;
let selectedBlue = null;

function getParticipantHtml(participant) {
  const flagImg = participant.country
    ? `<img 
        class="flag-img" 
        src="https://flagcdn.com/w40/${participant.country.toLowerCase()}.png" 
        alt="${participant.country}"
      />`
    : "";

  return `
    ${flagImg}
    <span>${participant.name}</span>
  `;
}

function updateOverlayButtonState() {
  const enabled = selectedRed !== null && selectedBlue !== null;

  updateButton.disabled = !enabled;

  if (enabled) {
    updateButton.classList.remove("disabled");
  } else {
    updateButton.classList.add("disabled");
  }
}

function renderParticipants() {
  participantsContainer.innerHTML = "";

  participants.forEach((participant) => {
    const button = document.createElement("button");
    button.className = "participant-btn";
    button.innerHTML = getParticipantHtml(participant);

    if (
      selectedRed?.id === participant.id ||
      selectedBlue?.id === participant.id
    ) {
      button.classList.add("used");
    }

    button.addEventListener("click", () => {
      if (selectedRed && selectedBlue) return;

      const team = !selectedRed ? "red" : "blue";
      addToTeam(participant, team);
    });

    participantsContainer.appendChild(button);
  });
}

function addToTeam(participant, team) {
  if (team === "red") {
    selectedRed = participant;
    redTeam.innerHTML = "";
    redTeam.appendChild(createSelectedPlayer(participant, "red"));
  }

  if (team === "blue") {
    selectedBlue = participant;
    blueTeam.innerHTML = "";
    blueTeam.appendChild(createSelectedPlayer(participant, "blue"));
  }

  renderParticipants();
  updateOverlayButtonState();
}

function createSelectedPlayer(participant, team) {
  const player = document.createElement("button");
  player.className = "selected-player";
  player.innerHTML = getParticipantHtml(participant);

  player.addEventListener("click", () => {
    if (team === "red") {
      selectedRed = null;
      redTeam.innerHTML = "";
    }

    if (team === "blue") {
      selectedBlue = null;
      blueTeam.innerHTML = "";
    }

    renderParticipants();
    updateOverlayButtonState();
  });

  return player;
}

document.getElementById("addRed").addEventListener("click", () => {
  const name = customName.value.trim();

  if (!name || selectedRed) return;

  const participant = {
    id: `custom-red-${Date.now()}`,
    name
  };

  addToTeam(participant, "red");

  customName.value = "";
});

document.getElementById("addBlue").addEventListener("click", () => {
  const name = customName.value.trim();

  if (!name || selectedBlue) return;

  const participant = {
    id: `custom-blue-${Date.now()}`,
    name
  };

  addToTeam(participant, "blue");

  customName.value = "";
});

document.getElementById("resetBtn").addEventListener("click", () => {
  const temp = selectedRed;

  selectedRed = selectedBlue;
  selectedBlue = temp;

  redTeam.innerHTML = "";
  blueTeam.innerHTML = "";

  if (selectedRed) {
    redTeam.appendChild(createSelectedPlayer(selectedRed, "red"));
  }

  if (selectedBlue) {
    blueTeam.appendChild(createSelectedPlayer(selectedBlue, "blue"));
  }

  renderParticipants();
  updateOverlayButtonState();
});

updateButton.addEventListener("click", async () => {
  if (!selectedRed || !selectedBlue) return;

  const overlayData = {
    equipoRojo: selectedRed,
    equipoAzul: selectedBlue,
    updatedAt: new Date().toISOString()
  };

  console.log("Datos para Firebase:", overlayData);

  await setDoc(doc(db, "torneoOverlay", "actual"), overlayData);
  console.log("Overlay actualizado en Firebase:", overlayData);
});

renderParticipants();
updateOverlayButtonState();