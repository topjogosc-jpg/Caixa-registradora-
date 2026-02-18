
export const speak = (text: string) => {
  if (!('speechSynthesis' in window)) {
    console.error("Este navegador não suporta síntese de voz.");
    return;
  }

  // Cancela falas anteriores para não encavalar
  window.speechSynthesis.cancel();

  const utterance = new SpeechSynthesisUtterance(text);
  utterance.lang = 'pt-BR';
  utterance.rate = 1.1; // Um pouco mais rápido para parecer um caixa eficiente
  utterance.pitch = 1.0;

  window.speechSynthesis.speak(utterance);
};
