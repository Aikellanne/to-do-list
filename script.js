const botaoTarefa = document.getElementById("criar-tarefas");
const semTarefas = document.getElementById("sem-tarefas");
const colunas = document.getElementById("colunas");
const colunaAFazer = document.getElementById("afazer");

const formTarefa = document.getElementById("form-novatarefa");
const bntCancelar = document.getElementById("cancelar");
const bntSalvar = document.getElementById("salvar");

const inputTitulo = document.getElementById("titulo");
const inputDescricao = document.getElementById("descricao");
const calendario = document.getElementById("data");

botaoTarefa.addEventListener ("click", function (){
    semTarefas.classList.add("oculto");
    formTarefa.classList.remove("oculto");
});

bntCancelar.addEventListener ("click", function (){
    formTarefa.classList.add("oculto");
});

bntSalvar.addEventListener ("click", function (){
    const titulo = inputTitulo.value.trim();
    const descricao = inputDescricao.value.trim();
    const data = calendario.value;

    if (titulo === ""){
        alert("Por favor, insera um título para a tarefa.");
        return;
    }

    // formatar a data para DD/MM/AAAA
   const dataBruta = calendario.value; // Exemplo: "2025-08-14"
   const [ano, mes, dia] = dataBruta.split("-"); // Quebra em partes
   const dataFormatada = `${dia}/${mes}/${ano}`; // Junta no formato desejado  

    const card = document.createElement("div");
    card.classList.add("card");
    card.innerHTML = `
        <h3>${titulo}</h3>
        <p>${descricao}</p>
        <small>${dataFormatada}</small>
    `;

    const tarefaAFazer = document.querySelector("#afazer .tarefas");
    tarefaAFazer.appendChild(card);

    inputTitulo.value = "";
    inputDescricao.value = "";

    formTarefa.classList.add("oculto");
    colunas.style.display = "flex";
})

