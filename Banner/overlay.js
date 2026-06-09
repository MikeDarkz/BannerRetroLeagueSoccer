import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.4/firebase-app.js";
import {
  getFirestore,
  doc,
  onSnapshot
} from "https://www.gstatic.com/firebasejs/10.12.4/firebase-firestore.js";

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

const redName = document.getElementById("redName");
const blueName = document.getElementById("blueName");
const redFlag = document.getElementById("redFlag");
const blueFlag = document.getElementById("blueFlag");

const redSide = document.querySelector(".red-side");
const blueSide = document.querySelector(".blue-side");

let currentRedPlayer = null;
let currentBluePlayer = null;

function isSamePlayer(playerA, playerB) {
  return JSON.stringify(playerA) === JSON.stringify(playerB);
}

function setPlayerContent({ nameElement, flagElement, player, fallback }) {
  nameElement.textContent = player?.name || fallback;

  if (player?.country) {
    flagElement.src = `https://flagcdn.com/w80/${player.country.toLowerCase()}.png`;
    flagElement.alt = player.country;
    flagElement.style.display = "block";
  } else {
    flagElement.removeAttribute("src");
    flagElement.style.display = "none";
  }
}

function setPlayerWithTransition({
  sideElement,
  nameElement,
  flagElement,
  player,
  fallback,
  currentPlayer,
  setCurrentPlayer
}) {
  if (isSamePlayer(player, currentPlayer)) return;

  sideElement.classList.add("changing");

  setTimeout(() => {
    setPlayerContent({
      nameElement,
      flagElement,
      player,
      fallback
    });

    setCurrentPlayer(player || null);

    sideElement.classList.remove("changing");
  }, 350);
}

const overlayRef = doc(db, "torneoOverlay", "actual");

onSnapshot(overlayRef, (snapshot) => {
  if (!snapshot.exists()) return;

  const data = snapshot.data();

  setPlayerWithTransition({
    sideElement: redSide,
    nameElement: redName,
    flagElement: redFlag,
    player: data.equipoRojo,
    fallback: "Equipo Rojo",
    currentPlayer: currentRedPlayer,
    setCurrentPlayer: (player) => {
      currentRedPlayer = player;
    }
  });

  setPlayerWithTransition({
    sideElement: blueSide,
    nameElement: blueName,
    flagElement: blueFlag,
    player: data.equipoAzul,
    fallback: "Equipo Azul",
    currentPlayer: currentBluePlayer,
    setCurrentPlayer: (player) => {
      currentBluePlayer = player;
    }
  });
});