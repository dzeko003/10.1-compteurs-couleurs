const racine = document.documentElement;
const avatarEl = document.querySelector("#avatar");
const codeEl = document.querySelector("#code");
const messageEl = document.querySelector("#message");
const boutonGenerer = document.querySelector("#generer");
const boutonCopier = document.querySelector("#copier");

let minuterieMessage;

// Un entier au hasard entre 0 et max inclus.
function entierAleatoire(max) {
  return Math.floor(Math.random() * (max + 1));
}

// Convertit une composante 0-255 en deux caractères hexadécimaux ("0f", "c4"...).
function versHex(composante) {
  return composante.toString(16).padStart(2, "0");
}

// Luminosité perçue, entre 0 (noir) et 255 (blanc). L'œil est plus sensible au
// vert qu'au rouge, et plus au rouge qu'au bleu : d'où les trois coefficients.
function luminosite(rouge, vert, bleu) {
  return 0.299 * rouge + 0.587 * vert + 0.114 * bleu;
}

function afficherMessage(texte) {
  messageEl.textContent = texte;
  clearTimeout(minuterieMessage);
  minuterieMessage = setTimeout(() => {
    messageEl.textContent = "";
  }, 2500);
}

function genererCouleur() {
  const rouge = entierAleatoire(255);
  const vert = entierAleatoire(255);
  const bleu = entierAleatoire(255);

  const couleur = "#" + versHex(rouge) + versHex(vert) + versHex(bleu);

  // Une seule ligne repeint tout le personnage : le CSS fait le reste.
  racine.style.setProperty("--tenue", couleur);

  // Bonus : sur une couleur sombre le code s'écrit en clair, et inversement.
  const couleurSombre = luminosite(rouge, vert, bleu) < 140;
  racine.style.setProperty(
    "--encre-code",
    couleurSombre ? "#ffffff" : "#12162a",
  );

  codeEl.textContent = couleur.toUpperCase();
  messageEl.textContent = "";

  feter();
}

// Indie bondit une fois pour saluer sa nouvelle tenue.
function feter() {
  avatarEl.classList.remove("avatar-saute");
  void avatarEl.offsetWidth; // force le navigateur à repartir de zéro
  avatarEl.classList.add("avatar-saute");
}

avatarEl.addEventListener("animationend", (evenement) => {
  if (evenement.animationName === "saute") {
    avatarEl.classList.remove("avatar-saute");
  }
});

boutonGenerer.addEventListener("click", genererCouleur);

// L'API presse-papiers n'est pas disponible partout : on prévient l'utilisateur
// au lieu de laisser le bouton muet.
boutonCopier.addEventListener("click", async () => {
  if (!navigator.clipboard) {
    afficherMessage("Copie automatique indisponible — sélectionnez le code.");
    return;
  }

  try {
    await navigator.clipboard.writeText(codeEl.textContent);
    afficherMessage("Code copié dans le presse-papiers.");
  } catch (erreur) {
    console.error("Copie impossible :", erreur);
    afficherMessage("Copie refusée — sélectionnez le code à la main.");
  }
});

genererCouleur();
