const insuranceOverlay = document.getElementById("insurance-overlay");
const cardStage = document.getElementById("card-stage");
const selectedCard = document.getElementById("selected-card");
const selectedCardDot = document.getElementById("selected-card-dot");
const signaturePad = document.getElementById("signature-pad");
const signatureValidateButton = document.getElementById("signature-validate-btn");
const experienceRoot = document.querySelector(".experience");
const topLogoRepick = document.getElementById("top-logo-repick");
const languageSwitcher = document.getElementById("language-switcher");
const languageToggleButton = document.getElementById("language-toggle-btn");

const insuranceTitle = document.getElementById("insurance-title");
const insuranceCopy1 = document.getElementById("insurance-copy-1");
const insuranceCopy2 = document.getElementById("insurance-copy-2");
const insuranceCopy3 = document.getElementById("insurance-copy-3");
const insuranceCopy4 = document.getElementById("insurance-copy-4");
const insuranceMeta = document.getElementById("insurance-meta");
const signatureZone = document.querySelector(".signature-zone");
const signatureLabel = document.getElementById("signature-label");
const cardScene = document.querySelector(".card-scene");
const reviewTitle = document.getElementById("review-title");
const reviewLead = document.getElementById("review-lead");

const reviewStars = document.getElementById("review-stars");

const OVERLAY_REOPEN_GUARD_MS = 1200;
const CARD_ASSETS = ["BC1.png", "RC1.png", "CARDTBT1.png"];
const REVIEW_URL_BY_LANGUAGE = {
  en: "https://www.instagram.com/thebelgiantouch/",
  fr: "https://www.instagram.com/thebelgiantouch/",
};
const LOCAL_STORAGE_LANGUAGE_KEY = "wc1_language";

const TRANSLATIONS = {
  en: {
    pageTitle: "Magic Experience",
    topLogoAria: "Choose another card",
    languageSelectorAria: "Language selector",
    switchLanguageLabel: "French",
    insuranceTitle: "Magician's Insurance",
    contractCopy1:
      "By this document, it is certified that The Belgian Touch, a specialist in digital and immersive experiences, is covered under professional liability for any event occurring as part of its services and that may be perceived by third parties as improbable, unexplained, or technically impossible.",
    contractCopy2:
      "The coverage notably includes the appearance and disappearance of objects carried out within the contractual framework of performances. It also covers early reveals and predictions presented to the audience. Situations involving effects that influence temporal or sensory perception are also included, as well as significant collective reactions resulting from the performance.",
    contractCopy3:
      "Any situation considered \"unrealistic\" by a spectator will be deemed to fall within the artistic and scenographic framework of the performance and cannot constitute grounds for dispute based on material impossibility.",
    contractCopy4:
      "This contract is valid for any service provided by The Belgian Touch within a professional and contractual framework.",
    insuranceMetaLine1: "Effective date: Immediate",
    insuranceMetaLine2: "Validity: For the full duration of the insured performances",
    insuranceOverlayAria: "Card selection",
    overlayCardLabels: ["Blue card", "Red card", "Brand card", "Signature card"],
    signatureZoneAria: "Signature area",
    signatureLabel: "Signature",
    signaturePadAria: "Sign here",
    validateSignature: "Validate signature",
    selectedCardAria: "Selected card",
    selectedCardAlt: "Selected card",
    reviewTitle: "Let us know what you think!",
    reviewLead:
      "Your feedback matters. If you had a magical experience with The Belgian Touch, click 5 stars to share your thoughts.",
    reviewStarsAria: "Rating selection",
    reviewStarAriaLabels: ["1 star", "2 stars", "3 stars", "4 stars", "5 stars"],
  },
  fr: {
    pageTitle: "Expérience Magique",
    topLogoAria: "Rechoisir une carte",
    languageSelectorAria: "Sélecteur de langue",
    switchLanguageLabel: "Anglais",
    insuranceTitle: "Assurance de magicien",
    contractCopy1:
      "Par le présent document, il est certifié que The Belgian Touch, spécialiste des expériences digitales et immersives, est couvert au titre de sa responsabilité professionnelle pour tout événement survenant dans le cadre de ses prestations et pouvant être perçu comme improbable, inexpliqué ou techniquement impossible par des tiers.",
    contractCopy2:
      "La garantie inclut notamment les apparitions et disparitions d’objets réalisées dans le cadre contractuel des performances. Elle couvre également les révélations anticipées et les prédictions présentées au public. Sont également comprises les situations impliquant des effets influençant la perception temporelle ou sensorielle, ainsi que les réactions collectives significatives consécutives à la prestation.",
    contractCopy3:
      "Toute situation considérée comme « irréaliste » par un spectateur sera réputée relever du cadre artistique et scénographique de la performance et ne pourra constituer un motif de contestation fondé sur une impossibilité matérielle.",
    contractCopy4:
      "Ce contrat est valable pour toute prestation réalisée par The Belgian Touch dans un cadre professionnel et contractuel.",
    insuranceMetaLine1: "Date d’effet : Immédiate",
    insuranceMetaLine2: "Validité : Pour toute la durée des prestations assurées",
    insuranceOverlayAria: "Sélection de carte",
    overlayCardLabels: ["Carte bleue", "Carte rouge", "Carte branding", "Carte signature"],
    signatureZoneAria: "Zone de signature",
    signatureLabel: "Signature",
    signaturePadAria: "Signer ici",
    validateSignature: "Valider la signature",
    selectedCardAria: "Carte sélectionnée",
    selectedCardAlt: "Carte sélectionnée",
    reviewTitle: "Faites nous connaitre votre avis !",
    reviewLead:
      "Votre avis compte. Si vous avez vécu une expérience magique avec The Belgian Touch, cliquez sur 5 étoiles pour partager votre ressenti.",
    reviewStarsAria: "Choix de note",
    reviewStarAriaLabels: ["1 étoile", "2 étoiles", "3 étoiles", "4 étoiles", "5 étoiles"],
  },
};

let pickedCard = null;
let cardRemoved = false;
let cardPermanentlyRemoved = false;
let hasCardAppeared = false;
let signatureValidated = false;
let overlaySelectionUnlockedAt = 0;
let overlayGuardTimer = null;

let isDragging = false;
let dragOffsetX = 0;
let dragOffsetY = 0;
let cardWidth = 0;
let cardHeight = 0;
let cardPosX = 0;
let cardPosY = 0;

let signatureReady = false;
let signatureLocked = true;
let signatureIsDrawing = false;
let signatureLastX = 0;
let signatureLastY = 0;
let signatureContext = null;
let cardDotColor = "";
let currentLanguage = "en";
const preloadedCardImages = [];

function updateLanguageToggleButton(translation) {
  if (!languageToggleButton) return;
  const nextLanguage = currentLanguage === "fr" ? "en" : "fr";
  languageToggleButton.setAttribute("data-next-lang", nextLanguage);
  languageToggleButton.textContent = nextLanguage === "fr" ? "🇫🇷" : "🇬🇧";
  languageToggleButton.setAttribute("aria-label", translation.switchLanguageLabel);
  languageToggleButton.setAttribute("title", translation.switchLanguageLabel);
}

function getInitialLanguage() {
  try {
    const savedLanguage = window.localStorage.getItem(LOCAL_STORAGE_LANGUAGE_KEY);
    if (savedLanguage && TRANSLATIONS[savedLanguage]) {
      return savedLanguage;
    }
  } catch {}

  const browserLanguage = (window.navigator.language || "").toLowerCase();
  if (browserLanguage.startsWith("fr")) return "fr";
  return "en";
}

function setLanguage(language) {
  if (!TRANSLATIONS[language]) return;
  currentLanguage = language;
  const translation = TRANSLATIONS[language];

  document.documentElement.lang = language;
  document.title = translation.pageTitle;

  if (topLogoRepick) {
    topLogoRepick.setAttribute("aria-label", translation.topLogoAria);
  }

  if (languageSwitcher) {
    languageSwitcher.setAttribute("aria-label", translation.languageSelectorAria);
  }
  updateLanguageToggleButton(translation);

  if (insuranceTitle) insuranceTitle.textContent = translation.insuranceTitle;
  if (insuranceCopy1) insuranceCopy1.textContent = translation.contractCopy1;
  if (insuranceCopy2) insuranceCopy2.textContent = translation.contractCopy2;
  if (insuranceCopy3) insuranceCopy3.textContent = translation.contractCopy3;
  if (insuranceCopy4) insuranceCopy4.textContent = translation.contractCopy4;
  if (insuranceMeta) insuranceMeta.innerHTML = `${translation.insuranceMetaLine1}<br />${translation.insuranceMetaLine2}`;

  if (insuranceOverlay) {
    insuranceOverlay.setAttribute("aria-label", translation.insuranceOverlayAria);
    const overlayButtons = insuranceOverlay.querySelectorAll("button[data-card]");
    overlayButtons.forEach((button, index) => {
      const label = translation.overlayCardLabels[index];
      if (label) {
        button.setAttribute("aria-label", label);
      }
    });
  }

  if (signatureZone) signatureZone.setAttribute("aria-label", translation.signatureZoneAria);
  if (signatureLabel) signatureLabel.textContent = translation.signatureLabel;
  if (signaturePad) signaturePad.setAttribute("aria-label", translation.signaturePadAria);
  if (signatureValidateButton) signatureValidateButton.textContent = translation.validateSignature;
  if (cardScene) cardScene.setAttribute("aria-label", translation.selectedCardAria);
  if (selectedCard) selectedCard.setAttribute("alt", translation.selectedCardAlt);

  if (reviewTitle) reviewTitle.textContent = translation.reviewTitle;
  if (reviewLead) reviewLead.textContent = translation.reviewLead;
  if (reviewStars) {
    reviewStars.setAttribute("aria-label", translation.reviewStarsAria);
    const starButtons = reviewStars.querySelectorAll("button[data-rating]");
    starButtons.forEach((button, index) => {
      const label = translation.reviewStarAriaLabels[index];
      if (label) {
        button.setAttribute("aria-label", label);
      }
    });
  }

  try {
    window.localStorage.setItem(LOCAL_STORAGE_LANGUAGE_KEY, language);
  } catch {}
}

function onLanguageSwitcherClick(event) {
  const button = event.target.closest("#language-toggle-btn");
  if (!button) return;
  const language = button.getAttribute("data-next-lang");
  if (!language) return;
  setLanguage(language);
}

function preloadCardAssets() {
  for (const src of CARD_ASSETS) {
    const image = new Image();
    image.decoding = "async";
    image.src = src;
    if (typeof image.decode === "function") {
      image.decode().catch(() => {});
    }
    preloadedCardImages.push(image);
  }
}

function updateCardMetrics() {
  const rect = selectedCard.getBoundingClientRect();
  cardWidth = rect.width;
  cardHeight = rect.height;
}

function getCardDotColor(src) {
  const normalized = (src || "").split("?")[0].split("#")[0];
  const fileName = normalized.split("/").pop()?.toUpperCase() || "";
  if (fileName === "BC1.PNG") return "#1a73e8";
  if (fileName === "RC1.PNG") return "#d93025";
  if (fileName === "CARDTBT1.PNG") return "#111111";
  return "";
}

function hideCardDot() {
  if (!selectedCardDot) return;
  selectedCardDot.classList.remove("is-visible");
}

function showCardDot() {
  if (!selectedCardDot || !cardDotColor) {
    hideCardDot();
    return;
  }
  selectedCardDot.style.background = cardDotColor;
  selectedCardDot.classList.add("is-visible");
}

function setCardPosition(x, y) {
  cardPosX = x;
  cardPosY = y;
  selectedCard.style.left = `${x}px`;
  selectedCard.style.top = `${y}px`;
}

function centerCard() {
  updateCardMetrics();
  const left = (cardStage.clientWidth - cardWidth) / 2;
  const top = (cardStage.clientHeight - cardHeight) / 2;
  setCardPosition(left, top);
}

function hideCard() {
  selectedCard.classList.remove("is-visible");
  selectedCard.setAttribute("aria-hidden", "true");
  selectedCard.style.left = "";
  selectedCard.style.top = "";
}

function showCard() {
  const centerAfterRender = () => {
    window.requestAnimationFrame(() => {
      centerCard();
      showCardDot();
    });
  };

  hasCardAppeared = true;
  updateSignatureValidationButton();
  selectedCard.classList.add("is-visible");
  selectedCard.setAttribute("aria-hidden", "false");
  centerAfterRender();
  if (!selectedCard.complete) {
    selectedCard.addEventListener("load", centerAfterRender, { once: true });
  }
}

function applyPickedCardToScene() {
  if (cardPermanentlyRemoved || !pickedCard || !signatureReady || !signatureValidated || cardRemoved) {
    hideCard();
    return;
  }

  cardDotColor = getCardDotColor(pickedCard.src);
  selectedCard.src = pickedCard.src;
  selectedCard.style.width = "auto";
  selectedCard.style.height = pickedCard.height;
  selectedCard.style.maxHeight = "";
  selectedCard.style.transform = `rotate(${pickedCard.rotation}deg)`;
  showCard();
}

function handleInsuranceSelection(event) {
  if (hasCardAppeared) return;
  if (cardPermanentlyRemoved) return;
  if (Date.now() < overlaySelectionUnlockedAt) return;

  const button = event.target.closest("button[data-card]");
  if (!button) return;

  pickedCard = {
    src: button.getAttribute("data-card") || "BC1.png",
    width: button.getAttribute("data-card-width") || "38%",
    height: button.getAttribute("data-card-height") || button.getAttribute("data-card-width") || "38%",
    rotation: Number(button.getAttribute("data-card-rotate") || "0"),
  };

  cardDotColor = getCardDotColor(pickedCard.src);
  showCardDot();
  selectedCard.src = pickedCard.src;
  if (typeof selectedCard.decode === "function") {
    selectedCard.decode().catch(() => {});
  }

  insuranceOverlay.classList.add("is-complete");
  if (experienceRoot) {
    experienceRoot.classList.remove("is-entry-locked");
  }
  document.body.classList.remove("is-entry-locked");
  signatureValidated = false;
  setSignatureLocked(false);
  cardRemoved = false;
  applyPickedCardToScene();
}

function reopenInsuranceOverlay() {
  if (!insuranceOverlay) return;
  if (hasCardAppeared) return;
  if (cardPermanentlyRemoved) return;
  overlaySelectionUnlockedAt = Date.now() + OVERLAY_REOPEN_GUARD_MS;
  insuranceOverlay.classList.remove("is-complete");
  insuranceOverlay.classList.add("is-guarded");
  if (overlayGuardTimer !== null) {
    window.clearTimeout(overlayGuardTimer);
  }
  overlayGuardTimer = window.setTimeout(() => {
    overlayGuardTimer = null;
    insuranceOverlay.classList.remove("is-guarded");
  }, OVERLAY_REOPEN_GUARD_MS);
}

function isCardHalfOutOfViewport() {
  const rect = selectedCard.getBoundingClientRect();
  const cardArea = rect.width * rect.height;
  if (cardArea <= 0) return false;

  const visibleWidth = Math.max(0, Math.min(rect.right, window.innerWidth) - Math.max(rect.left, 0));
  const visibleHeight = Math.max(0, Math.min(rect.bottom, window.innerHeight) - Math.max(rect.top, 0));
  const visibleArea = visibleWidth * visibleHeight;
  const hiddenRatio = 1 - visibleArea / cardArea;

  return hiddenRatio >= 0.3;
}

function onCardPointerDown(event) {
  if (!selectedCard.classList.contains("is-visible")) return;

  updateCardMetrics();
  isDragging = true;

  const rect = selectedCard.getBoundingClientRect();
  dragOffsetX = event.clientX - rect.left;
  dragOffsetY = event.clientY - rect.top;
  selectedCard.setPointerCapture(event.pointerId);
}

function onCardPointerMove(event) {
  if (!isDragging) return;

  const stageRect = cardStage.getBoundingClientRect();
  const rawLeft = event.clientX - stageRect.left - dragOffsetX;
  const rawTop = event.clientY - stageRect.top - dragOffsetY;
  setCardPosition(rawLeft, rawTop);

  if (isCardHalfOutOfViewport()) {
    isDragging = false;
    if (selectedCard.hasPointerCapture(event.pointerId)) {
      selectedCard.releasePointerCapture(event.pointerId);
    }
    cardPermanentlyRemoved = true;
    cardRemoved = true;
    signatureValidated = false;
    pickedCard = null;
    insuranceOverlay.classList.add("is-complete");
    insuranceOverlay.classList.remove("is-guarded");
    if (overlayGuardTimer !== null) {
      window.clearTimeout(overlayGuardTimer);
      overlayGuardTimer = null;
    }
    hideCard();
    hideCardDot();
    updateSignatureValidationButton();
  }
}

function onCardPointerUp(event) {
  if (!isDragging) return;
  isDragging = false;
  if (selectedCard.hasPointerCapture(event.pointerId)) {
    selectedCard.releasePointerCapture(event.pointerId);
  }
}

function onReviewStarClick(event) {
  const starButton = event.target.closest("button[data-rating]");
  if (!starButton) return;
  const reviewUrl = REVIEW_URL_BY_LANGUAGE[currentLanguage] || REVIEW_URL_BY_LANGUAGE.en;
  window.location.replace(reviewUrl);
}

function setSignatureLocked(isLocked) {
  signatureLocked = isLocked;
  signaturePad.classList.toggle("is-locked", isLocked);
  updateSignatureValidationButton();
}

function updateSignatureValidationButton() {
  if (!signatureValidateButton) return;
  signatureValidateButton.disabled = signatureLocked || !signatureReady || hasCardAppeared || cardPermanentlyRemoved;
}

function setupSignatureContext() {
  if (!signaturePad) return;

  const previousSignature = signatureReady ? signaturePad.toDataURL() : null;
  const rect = signaturePad.getBoundingClientRect();
  if (!rect.width || !rect.height) return;

  const ratio = Math.max(window.devicePixelRatio || 1, 1);
  signaturePad.width = Math.floor(rect.width * ratio);
  signaturePad.height = Math.floor(rect.height * ratio);

  signatureContext = signaturePad.getContext("2d");
  signatureContext.setTransform(ratio, 0, 0, ratio, 0, 0);
  signatureContext.lineCap = "round";
  signatureContext.lineJoin = "round";
  signatureContext.lineWidth = 2;
  signatureContext.strokeStyle = "#111111";

  if (previousSignature) {
    const image = new Image();
    image.onload = () => {
      signatureContext.drawImage(image, 0, 0, rect.width, rect.height);
    };
    image.src = previousSignature;
  }
}

function signaturePoint(event) {
  const rect = signaturePad.getBoundingClientRect();
  return {
    x: event.clientX - rect.left,
    y: event.clientY - rect.top,
  };
}

function onSignaturePointerDown(event) {
  if (signatureLocked || !signatureContext) return;

  signatureIsDrawing = true;
  signaturePad.setPointerCapture(event.pointerId);

  const point = signaturePoint(event);
  signatureLastX = point.x;
  signatureLastY = point.y;
}

function onSignaturePointerMove(event) {
  if (!signatureIsDrawing || signatureLocked || !signatureContext) return;

  const point = signaturePoint(event);
  signatureContext.beginPath();
  signatureContext.moveTo(signatureLastX, signatureLastY);
  signatureContext.lineTo(point.x, point.y);
  signatureContext.stroke();
  signatureLastX = point.x;
  signatureLastY = point.y;

  if (!signatureReady) {
    signatureReady = true;
    cardRemoved = false;
    updateSignatureValidationButton();
  }
}

function onSignaturePointerUp(event) {
  if (!signatureIsDrawing) return;
  signatureIsDrawing = false;
  if (signaturePad.hasPointerCapture(event.pointerId)) {
    signaturePad.releasePointerCapture(event.pointerId);
  }
}

function setupSignaturePad() {
  if (!signaturePad) return;

  setupSignatureContext();
  setSignatureLocked(true);
  updateSignatureValidationButton();

  signaturePad.addEventListener("pointerdown", onSignaturePointerDown);
  signaturePad.addEventListener("pointermove", onSignaturePointerMove);
  signaturePad.addEventListener("pointerup", onSignaturePointerUp);
  signaturePad.addEventListener("pointercancel", onSignaturePointerUp);
}

function onValidateSignatureClick() {
  if (!pickedCard || signatureLocked || !signatureReady || hasCardAppeared || cardPermanentlyRemoved) return;
  signatureValidated = true;
  cardRemoved = false;
  applyPickedCardToScene();
}

insuranceOverlay.addEventListener("click", handleInsuranceSelection);
selectedCard.addEventListener("pointerdown", onCardPointerDown);
window.addEventListener("pointermove", onCardPointerMove);
window.addEventListener("pointerup", onCardPointerUp);
window.addEventListener("pointercancel", onCardPointerUp);

window.addEventListener("resize", () => {
  setupSignatureContext();
  if (!selectedCard.classList.contains("is-visible")) return;
  updateCardMetrics();
  setCardPosition(cardPosX, cardPosY);
});

cardStage.addEventListener("dragstart", (event) => {
  event.preventDefault();
});

if (reviewStars) {
  reviewStars.addEventListener("click", onReviewStarClick);
}

if (topLogoRepick) {
  topLogoRepick.addEventListener("click", reopenInsuranceOverlay);
}

if (languageSwitcher) {
  languageSwitcher.addEventListener("click", onLanguageSwitcherClick);
}

if (signatureValidateButton) {
  signatureValidateButton.addEventListener("click", onValidateSignatureClick);
}

setLanguage(getInitialLanguage());
preloadCardAssets();
setupSignaturePad();
