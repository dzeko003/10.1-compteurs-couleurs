const valeurEl = document.querySelector("#valeur");
const noteEl = document.querySelector("#note");
const avatarEl = document.querySelector("#avatar");
const niveauEl = document.querySelector("#niveau");
const jaugeEl = document.querySelector("#jauge");
const jaugeBarreEl = document.querySelector("#jauge-barre");
const coeurs = document.querySelectorAll("#vies .coeur");

const boutonPlus = document.querySelector("#plus");
const boutonMoins = document.querySelector("#moins");
const boutonReset = document.querySelector("#reset");

// Nombre de points à gagner pour passer au niveau suivant.
const POINTS_PAR_NIVEAU = 5;

let compteur = 0;

/* ---------------- Affichage ---------------- */

// Applique une seule classe parmi une liste, et retire les autres.
function poserClasse(element, classes, active) {
  element.classList.remove(...classes);
  if (active) element.classList.add(active);
}

function majScore() {
  valeurEl.textContent = compteur;

  if (compteur > 0) {
    poserClasse(
      valeurEl,
      ["score-zero", "score-positif", "score-negatif"],
      "score-positif",
    );
    poserClasse(noteEl, ["badge-positif", "badge-negatif"], "badge-positif");
    noteEl.textContent = "Indie saute de joie";
  } else if (compteur < 0) {
    poserClasse(
      valeurEl,
      ["score-zero", "score-positif", "score-negatif"],
      "score-negatif",
    );
    poserClasse(noteEl, ["badge-positif", "badge-negatif"], "badge-negatif");
    noteEl.textContent = "Indie est au bord des larmes";
  } else {
    poserClasse(
      valeurEl,
      ["score-zero", "score-positif", "score-negatif"],
      "score-zero",
    );
    poserClasse(noteEl, ["badge-positif", "badge-negatif"], null);
    noteEl.textContent = "Indie attend vos ordres";
  }
}

// L'humeur de la mascotte : une classe sur le <svg>, tout le reste est du CSS.
// Elle fixe l'expression du visage, pas le mouvement.
function majHumeur() {
  const humeur =
    compteur > 0
      ? "avatar-joyeux"
      : compteur < 0
        ? "avatar-triste"
        : "avatar-neutre";
  poserClasse(
    avatarEl,
    ["avatar-neutre", "avatar-joyeux", "avatar-triste"],
    humeur,
  );
}

// Un saut, une seule fois. La classe est retirée dès que l'animation se termine,
// ce qui permet de la reposer au clic suivant.
function sauter() {
  avatarEl.classList.remove("avatar-saute");
  void avatarEl.offsetWidth; // force le navigateur à repartir de zéro
  avatarEl.classList.add("avatar-saute");
}

// L'événement remonte depuis le groupe .corps jusqu'à la racine du SVG.
// On ne réagit qu'au saut : les autres animations tournent en boucle et
// ne déclenchent jamais animationend.
avatarEl.addEventListener("animationend", (evenement) => {
  if (evenement.animationName === "saute") {
    avatarEl.classList.remove("avatar-saute");
  }
});

// Barre de progression et niveau : seuls les points positifs comptent.
function majProgression() {
  const points = Math.max(0, compteur);
  const niveau = Math.floor(points / POINTS_PAR_NIVEAU) + 1;
  const avancement = (points % POINTS_PAR_NIVEAU) * (100 / POINTS_PAR_NIVEAU);

  niveauEl.textContent = "Niveau " + niveau;
  jaugeBarreEl.style.setProperty("--avancement", avancement + "%");
  jaugeEl.setAttribute("aria-valuenow", Math.round(avancement));
}

// Chaque point négatif coûte un cœur.
function majVies() {
  const perdus = Math.min(coeurs.length, Math.max(0, -compteur));

  coeurs.forEach((coeur, index) => {
    coeur.classList.toggle("coeur-vide", index >= coeurs.length - perdus);
  });
}

// Relance l'animation du score : on retire la classe, on force le navigateur
// à recalculer la mise en page, puis on la remet.
function rebondir() {
  valeurEl.classList.remove("score-anime");
  void valeurEl.offsetWidth;
  valeurEl.classList.add("score-anime");
}

function afficher(animer) {
  majScore();
  majHumeur();
  majProgression();
  majVies();
  if (animer) rebondir();
}

/* ---------------- Actions ---------------- */

function modifier(pas) {
  compteur = compteur + pas;
  afficher(true);

  // Indie ne bondit que lorsque le score monte.
  if (pas > 0) sauter();
}

function remettreAZero() {
  compteur = 0;
  afficher(true);
}

/* ---------------- Événements ---------------- */

boutonPlus.addEventListener("click", () => modifier(1));
boutonMoins.addEventListener("click", () => modifier(-1));
boutonReset.addEventListener("click", remettreAZero);

// Raccourcis clavier : la page reste jouable sans souris.
document.addEventListener("keydown", (evenement) => {
  const touche = evenement.key;

  if (touche === "ArrowUp" || touche === "+") {
    modifier(1);
  } else if (touche === "ArrowDown" || touche === "-") {
    modifier(-1);
  } else if (touche === "r" || touche === "R") {
    remettreAZero();
  } else {
    return;
  }

  evenement.preventDefault();
});

afficher(false);
