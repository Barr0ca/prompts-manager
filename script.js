// Chave para identificar os dados salvos pela nossa aplicação no navegador
const STORAGE_KEY = "prompts-storage"

// Estado para carregar os prompts salvos e exibir
const state = {
  prompts: [],
  selectedId: null,
}

// Seleção dos elementos HTML por ID
const elements = {
  promptTitle: document.getElementById("prompt-title"),
  promptContent: document.getElementById("prompt-content"),
  titleWrapper: document.getElementById("title-wrapper"),
  contentWrapper: document.getElementById("content-wrapper"),
  btnOpen: document.getElementById("btn-open"),
  btnCollapse: document.getElementById("btn-collapse"),
  sidebar: document.querySelector(".sidebar"),
  btnSave: document.getElementById("btn-save"),
  list: document.getElementById("prompt-list"),
  search: document.getElementById("search-input"),
  btnNew: document.getElementById("btn-new"),
  btnCopy: document.getElementById("btn-copy"),
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
  elements.sidebar.classList.add("open")
  elements.sidebar.classList.remove("collapsed")
}

// Função para fechar a sidebar
function closeSidebar() {
  elements.sidebar.classList.add("collapsed")
  elements.sidebar.classList.remove("open")
}

function save() {
  const title = elements.promptTitle.textContent.trim()
  const content = elements.promptContent.innerHTML.trim() // Usar innerHTML para preservar formatação diferente do textContent que remove tags (texto cru)
  const hasContent = elements.promptContent.textContent.trim()

  if (!title || !hasContent) {
    alert("O título ou conteúdo não podem estar vazios.")
    return
  }

  if (state.selectedId) {
    // Editar prompt existente
    const existingPrompt = state.prompts.find((p) => p.id === state.selectedId)
    if (existingPrompt) {
      existingPrompt.title = title || "Sem título"
      existingPrompt.content = content || "Sem conteúdo"
    }
  } else {
    // Criar novo prompt
    const newPrompt = {
      id: Date.now().toString(36), // ID simples baseado em timestamp
      title,
      content,
    }

    state.prompts.unshift(newPrompt) // Adiciona ao início do array
    state.selectedId = newPrompt.id // Seleciona o novo prompt
  }

  renderList(elements.search.value)
  persist() // Salva no localStorage
  alert("Prompt salvo com sucesso!")
}

function persist() {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state.prompts))
  } catch (error) {
    console.log("Erro ao salvar no localStorage:", error)
  }
}

function load() {
  try {
    const storage = localStorage.getItem(STORAGE_KEY)
    state.prompts = storage ? JSON.parse(storage) : []
    state.selectedId = null
  } catch (error) {
    console.log("Erro ao carregar do localStorage:", error)
  }
}

function createPromptItem(prompt) {
  const tmp = document.createElement("div")
  tmp.innerHTML = prompt.content
  return `
    <li class="prompt-item" data-id="${prompt.id}" data-action="select">
      <div class="prompt-item-content">
        <span class="prompt-item-title">${prompt.title}</span>
        <span class="prompt-item-description">${tmp.textContent}</span>
      </div>

      <button class="btn-icon" title="Remover" data-action="remove">
        <img src="assets/remove.svg" alt="Remover" class="icon icon-trash"/>
      </button>
    </li>
  `
}

function renderList(filterText = "") {
  const filteredPrompts = state.prompts
    .filter((prompt) =>
      prompt.title.toLowerCase().includes(filterText.toLowerCase().trim())
    )
    .map((p) => createPromptItem(p))
    .join("")

  elements.list.innerHTML = filteredPrompts
}

function newPrompt() {
  state.selectedId = null
  elements.promptTitle.textContent = ""
  elements.promptContent.innerHTML = ""
  updateAllEditableStates()
  elements.promptTitle.focus()
}

function copySelected() {
  try {
    const content = elements.promptContent
    if (!navigator.clipboard){
      console.log("A API Clipboard não é suportada neste navegador.")
      return
    }
    navigator.clipboard.writeText(content.innerText)
    alert("Conteúdo copiado para a área de transferência!")
  } catch (error) {
    console.log("Erro ao copiar para a área de transferência:", error)
  }
}

// Eventos
elements.btnSave.addEventListener("click", save)
elements.btnNew.addEventListener("click", newPrompt)
elements.btnCopy.addEventListener("click", copySelected)

elements.search.addEventListener("input", function (event) {
  renderList(event.target.value)
})

elements.list.addEventListener("click", function (event) {
  const removeBtn = event.target.closest("[data-action='remove']")
  const item = event.target.closest("[data-id]")

  if (!item) return

  const id = item.getAttribute("data-id")
  state.selectedId = id

  if (removeBtn) {
    // Remover prompt
    state.prompts = state.prompts.filter((p) => p.id !== id)
    renderList(elements.search.value)
    persist()
    return
  }

  if (event.target.closest("[data-action='select']")) {
    const prompt = state.prompts.find((p) => p.id === id)

    if (prompt) {
      elements.promptTitle.textContent = prompt.title
      elements.promptContent.innerHTML = prompt.content
      updateAllEditableStates()
    }
  }
})

// Função de inicialização
function init() {
  load() // Carrega os dados salvos
  renderList("") // Renderiza a lista de prompts
  attachAllEditableHandlers()
  updateAllEditableStates()

  // Estado inicial: sidebar aberta (desktop) ou fechada (mobile)
  elements.sidebar.classList.remove("open")
  elements.sidebar.classList.remove("collapsed")

  // Eventos para abrir/fechar sidebar
  elements.btnOpen.addEventListener("click", openSidebar)
  elements.btnCollapse.addEventListener("click", closeSidebar)
}

// Executa a inicialização
init()
