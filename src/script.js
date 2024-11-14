const typingText = document.querySelector(".typing-text p"),
  inpField = document.querySelector(".wrapper .input-field"),
  timeTag = document.querySelector(".time span b"),
  mistakeTag = document.querySelector(".mistake span"),
  wpmTag = document.querySelector(".wpm span"),
  cpmTag = document.querySelector(".cpm span"),
  tryAgainBtn = document.querySelector("button");

let timer,
  maxTime = 60,  // Tempo máximo do jogo (em segundos)
  timeLeft = maxTime,  // Tempo restante
  charIndex = (mistakes = isTyping = 0);  // Índice de caracteres, erros e estado de digitação

// Declarar os parágrafos como uma constante global
let paragraphs = [];
let shownParagraphs = []; // Isto irá rastrear os parágrafos já mostrados

// Função assíncrona para buscar citações e preencher o array de parágrafos
const fetchAndFillParagraphs = async () => {
  try {
    // Utiliza o link da API com os parâmetros desejados para buscar 50 citações
    const response = await fetch("https://api.quotable.io/quotes/random?minLength=200&maxLength=500&limit=50");
    const data = await response.json();

    // Limpa os dados anteriores, se necessário
    paragraphs = []; // Reseta os parágrafos antes de preenchê-los com novos dados
    shownParagraphs = []; // Reseta os parágrafos mostrados

    // Extrai apenas o "conteúdo" de cada objeto de citação e preenche o array de parágrafos
    data.forEach((quote) => paragraphs.push(quote.content));

    // Inicia o jogo com os novos dados assim que forem carregados
    randomParagraph();

  } catch (error) {
    console.error("Erro ao buscar dados:", error);
  }
};

// Função para mostrar um parágrafo aleatório que ainda não tenha sido mostrado
function randomParagraph() {
  if (paragraphs.length === 0) return; // Garante que o array de parágrafos está preenchido

  // Pega os parágrafos restantes que ainda não foram mostrados
  const remainingParagraphs = paragraphs.filter((_, index) => !shownParagraphs.includes(index));

  if (remainingParagraphs.length === 0) {
    // Se todos os parágrafos já foram mostrados, faz uma nova chamada à API para buscar mais citações
    console.log("Todos os parágrafos foram mostrados, buscando novos...");
    fetchAndFillParagraphs(); // Chama para buscar novos parágrafos
    return;
  }

  // Escolhe um parágrafo aleatório dos que ainda não foram mostrados
  let randIndex = Math.floor(Math.random() * remainingParagraphs.length);
  let selectedParagraph = remainingParagraphs[randIndex];

  // Marca o parágrafo como mostrado
  let selectedIndex = paragraphs.indexOf(selectedParagraph);
  shownParagraphs.push(selectedIndex);

  // Exibe o parágrafo selecionado
  selectedParagraph.split("").forEach((span) => {
    let spanTag = `<span>${span}</span>`;
    typingText.innerHTML += spanTag;
  });
  typingText.querySelectorAll("span")[0].classList.add("active");

  document.addEventListener("keydown", () => inpField.focus());
  typingText.addEventListener("click", () => inpField.focus());
}

function initTyping() {
  const characters = typingText.querySelectorAll("span");
  let typedChar = inpField.value.split("")[charIndex];

  if (charIndex < characters.length - 1 && timeLeft > 0) {
    if (!isTyping) {
      // Quando o temporizador começar, ele não será reiniciado a cada tecla pressionada
      timer = setInterval(initTimer, 1000);
      isTyping = true;
    }

    if (typedChar == null) {
      if (characters[charIndex].classList.contains("incorrect")) {
        mistakes--;
      }
      charIndex--;
      characters[charIndex].classList.remove("correct", "incorrect");
    } else {
      if (characters[charIndex].innerText === typedChar) {
        // Se o caractere digitado e o caractere mostrado forem iguais, adiciona a classe "correct"
        characters[charIndex].classList.add("correct");
      } else {
        mistakes++; // Se forem diferentes, aumenta o número de erros
        characters[charIndex].classList.add("incorrect");
      }
      charIndex++; // Incrementa o índice de caracteres, independentemente de o usuário digitar corretamente ou não
    }

    // Atualiza a classe ativa para o próximo caractere
    characters.forEach((span) => span.classList.remove("active"));
    characters[charIndex].classList.add("active");

    let wpm = Math.round(
      ((charIndex - mistakes) / 5 / (maxTime - timeLeft)) * 60
    );
    // Se o valor de wpm for 0, vazio ou infinito, define o valor como 0
    wpm = wpm < 0 || !wpm || wpm === Infinity ? 0 : wpm;
    mistakeTag.innerText = mistakes;
    wpmTag.innerText = wpm;
    cpmTag.innerText = charIndex - mistakes;
  } else {
    clearInterval(timer);
  }
}

function initTimer() {
  // Se o tempo restante for maior que 0, diminui o tempo restante, caso contrário, limpa o temporizador
  if (timeLeft > 0) {
    timeLeft--;
    timeTag.innerText = timeLeft;
  } else {
    inpField.value = "";  // Limpa o campo de entrada quando o tempo acaba
    clearInterval(timer);
  }
}

function resetGame() {
  typingText.innerHTML = ""; // Limpa o texto anterior
  randomParagraph();  // Exibe um novo parágrafo
  inpField.value = ""; // Limpa o campo de entrada
  clearInterval(timer);
  timeLeft = maxTime; // Reseta o tempo
  charIndex = mistakes = isTyping = 0; // Reseta os índices e o estado de digitação
  timeTag.innerText = timeLeft;
  mistakeTag.innerText = mistakes;
  wpmTag.innerText = 0;
  cpmTag.innerText = 0;
  
  console.log(shownParagraphs.length);
  console.log(paragraphs.length);
  // Verifica se todos os parágrafos foram mostrados antes de buscar novos
  if (shownParagraphs.length === paragraphs.length + 1) {
    fetchAndFillParagraphs(); // Busca novos 50 parágrafos se todos os anteriores foram mostrados
  }
}

// Busca os parágrafos e inicia o jogo assim que os dados estiverem disponíveis
fetchAndFillParagraphs();

// Event listeners
inpField.addEventListener("input", initTyping);  // Chama a função de digitação ao digitar
tryAgainBtn.addEventListener("click", resetGame);  // Reinicia o jogo ao clicar no botão "Tentar novamente"





