const botaoTarefa = document.getElementById("criar-tarefas");
const semTarefas = document.getElementById("sem-tarefas");
const colunas = document.getElementById("colunas");
const colunaAFazer = document.getElementById("afazer");

const formTarefa = document.getElementById("form-novatarefa");
const bntCancelar = document.getElementById("cancelar");
const bntSalvar = document.getElementById("salvar");

botaoTarefa.addEventListener ("click", function (){
    semTarefas.style.display = "none";
    colunas.style.display = "flex";
    formTarefa.classList.remove("oculto");
});

bntCancelar.addEventListener ("click", function (){
    formTarefa.classList.add("oculto");
})

