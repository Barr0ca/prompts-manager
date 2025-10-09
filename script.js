// Seleção dos elementos HTML por ID
const elements = {
  promptTitle: document.getElementById("prompt-title"),
  promptContent: document.getElementById("prompt-content"),
  titleWrapper: document.getElementById("title-wrapper"),
  contentWrapper: document.getElementById("content-wrapper"),
  btnOpen: document.getElementById("btn-open"),
  btnCollapse: document.getElementById("btn-collapse"),
  sidebar: document.querySelector(".sidebar"),
}

// Atualiza o estado do wrapper conforme o conteúdo do elemento
function updateEditableWrapperState(element, wrapper) {
  const hasText = element.textContent.trim().length > 0
  wrapper.classList.toggle("is-empty", !hasText) // A função toggle adiciona ou remove a classe com base na condição
}

// Atualiza o estado de todos os elementos editáveis
function updateAllEditableStates() {
  updateEditableWrapperState(elements.promptTitle, elements.titleWrapper)
  updateEditableWrapperState(elements.promptContent, elements.contentWrapper)
}

// Adiciona ouvintes de evento input para atualização em tempo real
function attachAllEditableHandlers() {
  elements.promptTitle.addEventListener("input", function () {
    updateEditableWrapperState(elements.promptTitle, elements.titleWrapper)
  })
  elements.promptContent.addEventListener("input", function () {
    // A função addEventListener observa mudanças no conteúdo
    updateEditableWrapperState(elements.promptContent, elements.contentWrapper)
  })
  // Atualiza estado inicial
  updateAllEditableStates()
}

// Função para abrir a sidebar
function openSidebar() {
  elements.sidebar.style.display = "flex" // volta ao padrão (visível)
  elements.btnOpen.style.display = "none"
}

// Função para fechar a sidebar
function closeSidebar() {
  elements.sidebar.style.display = "none"
  elements.btnOpen.style.display = "block"
}

// Função de inicialização
function init() {
  attachAllEditableHandlers()
  // Inicialmente, sidebar visível, btnOpen oculto
  elements.btnOpen.style.display = "none"
  elements.btnCollapse.addEventListener("click", closeSidebar)
  elements.btnOpen.addEventListener("click", openSidebar)
}

// Executa a inicialização
init()
