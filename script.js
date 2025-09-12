//elementos
const botaoTarefa = document.getElementById("criar-tarefas");
const semTarefas = document.getElementById("sem-tarefas");
const colunas = document.getElementById("colunas");

const formTarefa = document.getElementById("form-novatarefa");
const bntCancelar = document.getElementById("cancelar");
const bntSalvar = document.getElementById("salvar");

const inputTitulo = document.getElementById("titulo");
const inputDescricao = document.getElementById("descricao");
const calendario = document.getElementById("data");
const inputPesquisar = document.getElementById("pesquisar");

let cardEmEdicao = null;

//funçao p/ fechar todos os menus
function fecharTodosMenus (){
    document.querySelectorAll(".menu-opcoes").forEach(menu => {
      menu.classList.add("oculto");
    });
  }

//pesquisa
inputPesquisar.addEventListener("input", function() {
    const termo = this.value.toLowerCase();
    const todasTarefas = document.querySelectorAll(".card");

    todasTarefas.forEach(card => {
        const titulo = card.querySelector("h3").textContent.toLowerCase();
        const descricao = card.querySelector("p").textContent.toLowerCase();

        if (titulo.includes(termo) || descricao.includes(termo)) {
            card.style.display = "block";
        } else {
            card.style.display = "none";
        }
    });
});

//abrir formulario
botaoTarefa.addEventListener("click", function () {
  semTarefas.classList.add("oculto");
  formTarefa.classList.remove("oculto");
});

//cancelar
bntCancelar.addEventListener("click", function () {
  formTarefa.classList.add("oculto");
  inputTitulo.value = "";
  inputDescricao.value = "";
  calendario.value = "";
  cardEmEdicao = null;
});

//salvar
bntSalvar.addEventListener("click", function () {
  let titulo = inputTitulo.value.trim();
  let descricao = inputDescricao.value.trim();
  const dataBruta = calendario.value;

  if (titulo === "") {
    alert("Por favor, insira um título para a tarefa.");
    return;
  }

  titulo = titulo.length > 20 ? titulo.substring(0, 20) + "..." : titulo;
  descricao = descricao.length > 30 ? descricao.substring(0, 30) + "..." : descricao;

  let dataFormatada = "";
  if (dataBruta) {
    const [ano, mes, dia] = dataBruta.split("-");
    dataFormatada = `${dia}/${mes}/${ano}`;
  }

  if (cardEmEdicao) {
   cardEmEdicao.querySelector("h3").textContent = titulo;
   cardEmEdicao.querySelector("p").textContent = descricao;
   cardEmEdicao.querySelector("small").textContent = dataFormatada;
   cardEmEdicao = null;
  }else{

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

  const menuBtn = card.querySelector(".menu-btn");
  const menuOpcoes = card.querySelector(".menu-opcoes");

  //botao
  menuBtn.addEventListener("click", function (e) {
    e.stopPropagation();
    fecharTodosMenus();
    menuOpcoes.classList.toggle("oculto");
  });

  //excluir
  menuOpcoes.querySelector(".excluir").addEventListener("click", function () {
    card.remove();
    ContarTarefas();
  });

  //editar
  menuOpcoes.querySelector(".editar").addEventListener("click", function () {
    inputTitulo.value = card.querySelector("h3").textContent;
    inputDescricao.value = card.querySelector("p").textContent;

    const dataTexto = card.querySelector("small").textContent;
      if (dataTexto) {
        const [dia, mes, ano] = dataTexto.split("/");
        calendario.value = `${ano}-${mes}-${dia}`;
      }

    cardEmEdicao = card; 
    formTarefa.classList.remove("oculto");
  });

  // eventos de arrastar
  card.addEventListener("dragstart", function (e) {
    e.dataTransfer.setData("text/plain", card.id);
    card.classList.add("arrastando");
  });

  card.addEventListener("dragend", function () {
    card.classList.remove("arrastando");
  });

  //adiciona na coluna pendente
  const tarefaPendente = document.querySelector("#pendente .tarefas");
  tarefaPendente.appendChild(card);
  }

  //limpa formulario
  inputTitulo.value = "";
  inputDescricao.value = "";
  calendario.value = "";

  formTarefa.classList.add("oculto");
  colunas.style.display = "flex";

  ContarTarefas();
});

// Fecha menus ao clicar fora
document.addEventListener("click", () => {
  fecharTodosMenus();
});

//permiti drop em todas as colunas
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
      ContarTarefas();
    }
  });
});

function ContarTarefas (){
    document.querySelectorAll(".coluna").forEach(coluna => {
      const tarefas = coluna.querySelectorAll('.tarefas .card'); 
      const contador = coluna.querySelector('.contador');
      contador.textContent = `(${tarefas.length})`;
    });
  }
