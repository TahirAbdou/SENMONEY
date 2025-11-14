// =========================
// 1. Données initiales
// =========================

let tabNumeros = [
  "773577515",
  "783299641",
  "703559825",
  "706995809",
  "761892003",
];
let tabSoldes = [100000, 85000, 120000, 50000, 150000];
let tabCodes = ["1111", "2222", "3333", "4444", "5555"];
let nbreNum = tabNumeros.length;
let numCourant = "";
let textes = [];

// =========================
// 2. Chargement des langues (Ajax)
// =========================
function chargerLangue(langue) {
  $.ajax({
    url: `donnees_${langue}.txt`,
    success: function (data) {
      textes = data.split("\n");
      $("#titre").text(textes[0] || "Sen Money");
      $("#labelNum").text(textes[1] || "Choisissez votre numéro :");
      $("#btnMenu").text(textes[2] || "#221#");
      $("label[for='langue']").text(textes[3] || "Langue :");
      $("#titreHist").text(textes[4] || "Historique");
      $("#vider").text(textes[5] || "Vider l'historique");
    },
  });
}

// =========================
// 3. Initialisation de la page
// =========================
$(document).ready(function () {
  for (let i = 0; i < nbreNum; i++) {
    $("#num").append(
      `<option value="${tabNumeros[i]}">${tabNumeros[i]}</option>`
    );
  }

  chargerLangue("fr");

  $("#langue").change(function () {
    chargerLangue($(this).val());
  });

  $("#btnMenu").click(function () {
    main();
  });

  $("#vider").click(function () {
    viderHistorique();
  });
});

// =========================
// 4. MENU PRINCIPAL
// =========================
function menu() {
  let msg = "-----MENU SENMONEY-----\n";
  msg += "------" + numCourant + "-------\n";
  msg += textes[15] || "Tapez le numéro du service choisi\n";
  msg += `1. ${textes[16] || "Solde de mon compte"}\n`;
  msg += `2. ${textes[17] || "Transfert d'argent"}\n`;
  msg += `3. ${textes[18] || "Paiement de facture"}\n`;
  msg += `4. ${textes[19] || "Options"}`;
  return prompt(msg);
}

// =========================
// 5. MAIN
// =========================
function main() {
  numCourant = $("#num").val();
  let rep = menu();

  if (rep === "1") {
    afficherSolde();
  } else if (rep === "2") {
    transfertArgent();
  } else if (rep === "3") {
    paiementFacture();
  } else if (rep === "4") {
    alert("Choix invalide !");
  } else {
    etapeSuivant();
  }
}

// =========================
// 6. AFFICHER SOLDE
// =========================
function afficherSolde() {
  let index = tabNumeros.indexOf(numCourant);
  let code = prompt(textes[6] || "Entrez votre code de sécurité :");

  if (code === tabCodes[index]) {
    alert(`${textes[7] || "Votre solde est de"} ${tabSoldes[index]} FCFA`);
  } else {
    alert(textes[8] || "Code incorrect !");
  }
  etapeSuivant();
}

// =========================
// 7. TRANSFERT D'ARGENT
// =========================
function transfertArgent() {
  let indexExp = tabNumeros.indexOf(numCourant);
  let code = prompt(textes[6] || "Entrez votre code de sécurité :");

  if (code !== tabCodes[indexExp]) {
    alert(textes[8] || "Code incorrect !");
    return etapeSuivant();
  }

  let destinataire = prompt(textes[9] || "Entrez le numéro destinataire :");
  let montant = parseInt(prompt(textes[10] || "Montant à transférer :"));
  const frais = 100;
  let indexDest = tabNumeros.indexOf(destinataire);

  if (indexDest === -1) {
    alert(textes[11] || "Numéro invalide !");
    return etapeSuivant();
  }

  if (isNaN(montant) || montant <= 0) {
    alert("Montant invalide !");
    return etapeSuivant();
  }

  if (tabSoldes[indexExp] >= montant + frais) {
    tabSoldes[indexExp] -= montant + frais;
    tabSoldes[indexDest] += montant;
    alert(`${textes[12] || "Transfert réussi !"}\nFrais : ${frais} FCFA`);
    ajouterTransaction("Transfert", `Envoyé ${montant} FCFA à ${destinataire}`);
  } else {
    alert(textes[13] || "Solde insuffisant !");
  }

  etapeSuivant();
}

// =========================
// 8. PAIEMENT DE FACTURE
// =========================
function paiementFacture() {
  let i = tabNumeros.indexOf(numCourant);
  let code = prompt("Entrez votre code de sécurité :");
  if (code !== tabCodes[i]) {
    if (code !== null) alert("Code incorrect !");
    return etapeSuivant();
  }

  let choix = prompt("Choisissez la facture :\n1. Senelec\n2. SDE\n3. Woyofal");
  let service = "";

  if (choix === "1") service = "Senelec";
  else if (choix === "2") service = "SDE";
  else if (choix === "3") service = "Woyofal";
  else {
    alert("Option invalide.");
    return etapeSuivant();
  }

  //  Saisie manuelle du montant
  let montant = parseInt(prompt(`Entrez le montant à payer pour ${service} :`));
  if (isNaN(montant) || montant <= 0) {
    alert("Montant invalide !");
    return etapeSuivant();
  }

  let frais = 200;
  if (tabSoldes[i] >= montant + frais) {
    tabSoldes[i] -= montant + frais;
    alert(
      `Paiement de ${service} effectué avec succès !\nMontant : ${montant} FCFA\nFrais : ${frais} FCFA`
    );
    ajouterTransaction("Facture", `${service} payée : ${montant} FCFA`);
  } else {
    alert("Solde insuffisant !");
  }
  etapeSuivant();
}

// =========================
// 9. HISTORIQUE
// =========================
let historique = [];

function ajouterTransaction(type, detail) {
  let date = new Date().toLocaleString();
  let ligne = `[${date}] ${type} - ${detail}`;
  historique.unshift(ligne);
  $("#historique").prepend(`<div class='tx'>${ligne}</div>`);
}

function afficherHistorique() {
  if (historique.length === 0) {
    alert("Aucune transaction effectuée.");
  } else {
    alert(historique.join("\n"));
  }
}

function viderHistorique() {
  if (historique.length === 0) {
    alert("Aucune transaction à effacer.");
    return;
  }
  if (confirm("Voulez-vous vraiment vider l'historique ?")) {
    historique = [];
    $("#historique").empty();
    alert("Historique vidé !");
  }
}

// =========================
// 10. ÉTAPE SUIVANTE
// =========================
function etapeSuivant() {
  let rep = confirm("Voulez-vous retourner au menu principal ?");
  if (rep) {
    main();
  } else {
    alert("Au revoir !");
  }
}
