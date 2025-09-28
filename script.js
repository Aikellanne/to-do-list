// ELEMENTOS
const botaoTarefa = document.getElementById("criar-tarefas");
const bntCancelar = document.getElementById("cancelar");
const bntSalvar = document.getElementById("salvar");
const colunasContainer = document.getElementById("colunas");

const formTarefa = document.getElementById("form-novatarefa");
const semTarefas = document.getElementById("sem-tarefas");

const inputTitulo = document.getElementById("titulo");
const inputDescricao = document.getElementById("descricao");
const calendario = document.getElementById("data");
const inputPesquisar = document.getElementById("pesquisar");

let cardEmEdicao = null;

// CRIAR MENSAGENS DE ERRO
let erroTitulo = document.createElement("div");
erroTitulo.style.color = "red";
erroTitulo.style.fontSize = "12px";
erroTitulo.style.marginTop = "2px";
inputTitulo.parentNode.appendChild(erroTitulo);

let erroDescricao = document.createElement("div");
erroDescricao.style.color = "red";
erroDescricao.style.fontSize = "12px";
erroDescricao.style.marginTop = "2px";
inputDescricao.parentNode.appendChild(erroDescricao);

// ABRIR FORM
botaoTarefa.addEventListener("click", () => {
    formTarefa.classList.remove("oculto");
    semTarefas.style.display = "none";
    colunasContainer.style.display = "none";

    if (document.querySelectorAll(".card").length > 0) {
        colunasContainer.style.display = "flex";
    }
});

// CANCELAR FORM
bntCancelar.addEventListener("click", () => {
    formTarefa.classList.add("oculto");
    limparCampos();
    cardEmEdicao = null;
    checarSemTarefas();
});

// SALVAR TAREFA
bntSalvar.addEventListener("click", () => {
    let valido = true;
    erroTitulo.textContent = "";
    erroDescricao.textContent = "";
    inputTitulo.style.border = "1px solid #ccc";
    inputDescricao.style.border = "1px solid #ccc";
    formTarefa.classList.remove("erro");

    let titulo = inputTitulo.value.trim();
    let descricao = inputDescricao.value.trim();
    const dataBruta = calendario.value;

    if (!titulo) {
        valido = false;
        erroTitulo.textContent = "* Título obrigatório";
        inputTitulo.style.border = "1px solid red";
    }
    if (!descricao) {
        valido = false;
        erroDescricao.textContent = "* Descrição obrigatória";
        inputDescricao.style.border = "1px solid red";
    }
    if (!valido) {
        formTarefa.classList.add("erro"); 
        return;
    }

    const tituloCard = titulo.length > 20 ? titulo.substring(0,20) + "..." : titulo;
    const descricaoCard = descricao.length > 30 ? descricao.substring(0,30) + "..." : descricao;

    let dataFormatada = "";
    if (dataBruta) {
        const [ano, mes, dia] = dataBruta.split("-");
        dataFormatada = `${dia}/${mes}/${ano}`;
    } else if (cardEmEdicao && cardEmEdicao.dataset.dataCompleta) {
        dataFormatada = cardEmEdicao.dataset.dataCompleta;
    }

    if (cardEmEdicao) {
        cardEmEdicao.querySelector("h3").textContent = tituloCard;
        cardEmEdicao.querySelector("p").textContent = descricaoCard;
        cardEmEdicao.dataset.tituloCompleto = titulo;
        cardEmEdicao.dataset.descricaoCompleta = descricao;
        cardEmEdicao.dataset.dataCompleta = dataFormatada;
        cardEmEdicao.querySelector("small").textContent = dataFormatada;
        cardEmEdicao = null;
    } else {
        criarCard(titulo, descricao, tituloCard, descricaoCard, dataFormatada);
    }

    formTarefa.classList.add("oculto");
    limparCampos();
    colunasContainer.style.display = "flex";
});

// FUNÇÃO CRIAR CARD
function criarCard(tituloCompleto, descricaoCompleta, tituloCard, descricaoCard, data) {
    const card = document.createElement("div");
    card.classList.add("card");
    card.setAttribute("draggable", "true");
    card.dataset.tituloCompleto = tituloCompleto;
    card.dataset.descricaoCompleta = descricaoCompleta;
    card.dataset.dataCompleta = data;

    card.innerHTML = `
        <div class="menu-info">
            <h3>${tituloCard}</h3>
            <p>${descricaoCard}</p>
            <small>${data}</small>
        </div>
        <div class="menu-container">
            <button class="menu-btn">⋮</button>
            <div class="menu-opcoes oculto">
                <button class="visualizar">Visualizar</button>
                <button class="editar">Editar</button>
                <button class="excluir">Excluir</button>
            </div>
        </div>
    `;

    const menuBtn = card.querySelector(".menu-btn");
    const menuOpcoes = card.querySelector(".menu-opcoes");

    // Abrir/fechar menu
    menuBtn.addEventListener("click", e => {
        e.stopPropagation();
        document.querySelectorAll(".menu-opcoes").forEach(m => {
            if (m !== menuOpcoes) m.classList.add("oculto");
        });
        menuOpcoes.classList.toggle("oculto");
    });

    menuOpcoes.querySelectorAll("button").forEach(opcao => {
        opcao.addEventListener("click", () => {
            menuOpcoes.classList.add("oculto");
        });
    });

    // Visualizar
    menuOpcoes.querySelector(".visualizar").addEventListener("click", () => {
        document.getElementById("viewTitulo").textContent = card.dataset.tituloCompleto;
        document.getElementById("viewDescricao").textContent = card.dataset.descricaoCompleta;
        document.getElementById("viewData").textContent = data || "";
        document.getElementById("modalVisualizar").classList.remove("oculto");
        menuOpcoes.classList.add("oculto");
    });

    // Editar
    menuOpcoes.querySelector(".editar").addEventListener("click", () => {
        inputTitulo.value = card.dataset.tituloCompleto;
        inputDescricao.value = card.dataset.descricaoCompleta;

        if (card.dataset.dataCompleta) {
            const partes = card.dataset.dataCompleta.split("/");
            if (partes.length === 3) {
                calendario.value = `${partes[2]}-${partes[1]}-${partes[0]}`;
            }
        } else {
            calendario.value = "";
        }

        cardEmEdicao = card;
        formTarefa.classList.remove("oculto");
        menuOpcoes.classList.add("oculto");
    });

    // Excluir
    menuOpcoes.querySelector(".excluir").addEventListener("click", () => {
        card.remove();
        atualizarContadores();
        checarSemTarefas();
    });

    // Adicionar à primeira coluna
    const primeiraColuna = document.querySelector("#pendente .coluna-conteudo");
    primeiraColuna.appendChild(card);

    atualizarContadores();
}

// LIMPAR CAMPOS
function limparCampos() {
    inputTitulo.value = "";
    inputDescricao.value = "";
    calendario.value = "";
    inputTitulo.style.border = "none";
    inputDescricao.style.border = "";
    erroTitulo.textContent = "";
    erroDescricao.textContent = "";
    formTarefa.classList.remove("erro");
}

// Drag & Drop
document.querySelectorAll(".coluna-conteudo").forEach(conteudo => {
    conteudo.addEventListener("dragover", e => {
        e.preventDefault();
        const dragging = document.querySelector(".arrastando");
        const afterElement = getDragAfterElement(conteudo, e.clientY);

        if (afterElement == null) {
            conteudo.appendChild(dragging);
        } else {
            conteudo.insertBefore(dragging, afterElement);
        }
    });

    conteudo.addEventListener("drop", () => {
        atualizarContadores();
        checarSemTarefas();
    });
});

// Drag start/end global
document.addEventListener("dragstart", e => {
    if (e.target.classList.contains("card")) e.target.classList.add("arrastando");
});

document.addEventListener("dragend", e => {
    if (e.target.classList.contains("card")) e.target.classList.remove("arrastando");
});

// Função para achar o card abaixo do cursor
function getDragAfterElement(container, y) {
    const draggableElements = [...container.querySelectorAll(".card:not(.arrastando)")];

    return draggableElements.reduce((closest, child) => {
        const box = child.getBoundingClientRect();
        const offset = y - box.top - box.height / 2;
        if (offset < 0 && offset > closest.offset) {
            return { offset: offset, element: child };
        } else {
            return closest;
        }
    }, { offset: Number.NEGATIVE_INFINITY }).element;
}

// Atualizar contadores
function atualizarContadores() {
    document.querySelectorAll(".coluna").forEach(coluna => {
        const contador = coluna.querySelector(".contador");
        const qtd = coluna.querySelectorAll(".coluna-conteudo .card").length;
        contador.textContent = `(${qtd})`;
    });
}

// Checar se não há tarefas
function checarSemTarefas() {
    const total = document.querySelectorAll(".card").length;
    if (total === 0) {
        colunasContainer.style.display = "none";
        semTarefas.style.display = "block";
    }
}

// PESQUISAR
inputPesquisar.addEventListener("input", function () {
    const termo = this.value.toLowerCase();
    document.querySelectorAll(".card").forEach(card => {
        const titulo = card.dataset.tituloCompleto.toLowerCase();
        const descricao = card.dataset.descricaoCompleta.toLowerCase();
        card.style.display = titulo.includes(termo) || descricao.includes(termo) ? "flex" : "none";
    });
});

// FECHAR MODAL
document.getElementById("fecharVisualizar").addEventListener("click", () => {
    document.getElementById("modalVisualizar").classList.add("oculto");
});

// Fechar modal clicando fora do conteúdo
const modalVisualizar = document.getElementById("modalVisualizar");
modalVisualizar.addEventListener("click", e => {
    if (e.target === modalVisualizar) modalVisualizar.classList.add("oculto");
});

// FECHAR MENUS AO CLICAR FORA
document.addEventListener("click", () => {
    document.querySelectorAll(".menu-opcoes").forEach(menu => menu.classList.add("oculto"));
});
