const botaoTarefa = document.getElementById("criar-tarefas");
const semTarefas = document.getElementById("sem-tarefas");
const colunas = document.getElementById("colunas");
const colunaPendente = document.getElementById("pendente");

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
   const dataBruta = calendario.value; 
   const [ano, mes, dia] = dataBruta.split("-"); // quebrar em partes
   const dataFormatada = `${dia}/${mes}/${ano}`; // juntar no formato certo  

    const card = document.createElement("div");
    card.classList.add("card");
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
    menuBtn.addEventListener ("click", function(){
      menuOpcoes.classList.toggle("oculto");
    });

    menuOpcoes.querySelector(".excluir").addEventListener("click", function(){
      card.remove();
    });
    
    menuOpcoes.querySelector(".editar").addEventListener("click", function(){
      inputTitulo.value = titulo;
      inputDescricao.value = descricao;
      calendario.value = dataBruta;
      card.remove();
      formTarefa.classList.remove("oculto");
    })

    card.setAttribute("draggable", "true"); //isso torna o card arrastável
    

    const tarefaPendente = document.querySelector("#pendente .tarefas");
    tarefaPendente.appendChild(card);

    inputTitulo.value = "";
    inputDescricao.value = "";

    formTarefa.classList.add("oculto");
    colunas.style.display = "flex";
})

