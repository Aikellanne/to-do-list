const botaoTarefa = document.getElementById("criar-tarefas");
const semTarefas = document.getElementById("sem-tarefas");
const colunas = document.getElementById("colunas");

const formTarefa = document.getElementById("form-novatarefa");
const bntCancelar = document.getElementById("cancelar");
const bntSalvar = document.getElementById("salvar");

const inputTitulo = document.getElementById("titulo");
const inputDescricao = document.getElementById("descricao");
const calendario = document.getElementById("data");

// Mostrar formulário
botaoTarefa.addEventListener("click", function () {
  semTarefas.classList.add("oculto");
  formTarefa.classList.remove("oculto");
});

// Cancelar criação
bntCancelar.addEventListener("click", function () {
  formTarefa.classList.add("oculto");
});

// Salvar nova tarefa
bntSalvar.addEventListener("click", function () {
  const titulo = inputTitulo.value.trim();
  const descricao = inputDescricao.value.trim();
  const dataBruta = calendario.value;

  if (titulo === "") {
    alert("Por favor, insira um título para a tarefa.");
    return;
  }

  // formatar a data para DD/MM/AAAA
  let dataFormatada = "";
  if (dataBruta) {
    const [ano, mes, dia] = dataBruta.split("-");
    dataFormatada = `${dia}/${mes}/${ano}`;
  }

  // criar o card
  const card = document.createElement("div");
  card.classList.add("card");
  card.id = "card-" + Date.now();
  card.setAttribute("draggable", "true");

  card.innerHTML = `
    <div class="card-header">
      <div class="menu-info">
        <h3>${titulo}</h3>
        <p>${descricao}</p>
      </div>
      <div class="menu-container">
        <button class="menu-btn">⋮</button>
        <div class="menu-opcoes oculto">
          <button class="editar">Editar</button>
          <button class="excluir">Excluir</button>
        </div>
      </div>
    </div>
    <small>${dataFormatada}</small>
  `;

  // Menu excluir/editar
  const menuBtn = card.querySelector(".menu-btn");
  const menuOpcoes = card.querySelector(".menu-opcoes");

  menuBtn.addEventListener("click", function () {
    menuOpcoes.classList.toggle("oculto");
  });

  menuOpcoes.querySelector(".excluir").addEventListener("click", function () {
    card.remove();
  });

  menuOpcoes.querySelector(".editar").addEventListener("click", function () {
    inputTitulo.value = titulo;
    inputDescricao.value = descricao;
    calendario.value = dataBruta;
    card.remove();
    formTarefa.classList.remove("oculto");
  });

  // Eventos de arrastar
  card.addEventListener("dragstart", function (e) {
    e.dataTransfer.setData("text/plain", card.id);
    card.classList.add("arrastando");
  });

  card.addEventListener("dragend", function () {
    card.classList.remove("arrastando");
  });

  // adicionar no pendente
  const tarefaPendente = document.querySelector("#pendente .tarefas");
  tarefaPendente.appendChild(card);

  // limpar formulário
  inputTitulo.value = "";
  inputDescricao.value = "";
  calendario.value = "";

  formTarefa.classList.add("oculto");
  colunas.style.display = "flex";
});

// Permitir drop em todas as colunas
const TodasColunas = document.querySelectorAll(".coluna .tarefas");

TodasColunas.forEach((coluna) => {
  coluna.addEventListener("dragover", function (e) {
    e.preventDefault();
    coluna.classList.add("coluna-destino");
  });

  coluna.addEventListener("dragleave", function () {
    coluna.classList.remove("coluna-destino");
  });

  coluna.addEventListener("drop", function (e) {
    e.preventDefault();
    coluna.classList.remove("coluna-destino");
    const cardId = e.dataTransfer.getData("text/plain");
    const dragging = document.getElementById(cardId);
    if (dragging) {
      coluna.appendChild(dragging);
    }
  });
});
