let QuestionsEmbaralhadas = [];
let Questions, id, id2, pergunt, correto, DadosQuizz;
let soma = 0;
let score = 0;
let cont = 1;

function functionsIniciais() {
    IniciandoBuzzQuizz();
    BuscandoQuizzes();
}

function IniciandoBuzzQuizz() {
    document.querySelector(".criarQuizzes").innerHTML += `  
            <h4>Você não criou nenhum quizz ainda :(</h4>
            <div class="buttonCriarQuizz" onclick="IniciarCriacaoQuizz()">Criar Quizz</div>  
    `
}

function BuscandoQuizzes() {
    let promise = axios.get('https://mock-api.driven.com.br/api/v7/buzzquizz/quizzes');
    promise.then((resposta) => {
        const QuizzesAPI = resposta.data;
        QuizzesAPI.map((dados, i) => {
            document.querySelector(".todosQuizzes ul").innerHTML += `
            <li class="quizz" id=${dados.id} key=${i} onclick="EntrandoQuizz(this)">
               <img src="${dados.image}" alt="">
               <h3>${dados.title}</h3>'
            </li>`
        });
    });

    promise.catch((erro) => {
        alert(`Erro ${erro.data}. Por favor, atualize a página!`);
    });
}

function EntrandoQuizz(quizz) {
    document.querySelector(".telaInicial").classList.add("hidden");
    document.querySelector(".telaQuizz").classList.remove("hidden");

    const Quizz = axios.get(`https://mock-api.driven.com.br/api/v7/buzzquizz/quizzes/${quizz.id}`);
    Quizz.then((resposta) => {
        DadosQuizz = resposta.data;
        Questions = DadosQuizz.questions;
        console.log(DadosQuizz.levels);
        document.querySelector(".titleQuizz").innerHTML += `
           <img src=${DadosQuizz.image} alt="">
           <h2>${DadosQuizz.title}</h2>
        `
        Questions.map((dados, i) => {
            let Respostas = dados.answers;

            document.querySelector(".boxQuestions").innerHTML += `
            <section class="questions" key=${i}>
                    <div class="question" style = "background-color:${dados.color};">
                        <p>${dados.title}</p>
                    </div>

                    <ul>
                        ${ColocadorOptionsRespostas(Respostas)}
                    </ul>
            </section>`
        });
        inicioMostraResult();
    });
}

function inicioMostraResult() {
    document.querySelector(".boxQuestions").innerHTML += `
    <article class="playerScore">`
}

function ColocadorOptionsRespostas(Respostas) {

    shuffleArray(Respostas);

    let OptionsRespostas = ``;
    QuestionsEmbaralhadas.map((dados, i) => {

        OptionsRespostas += `
          <li class="${dados.isCorrectAnswer}" key="${i}" onClick="cardSelecionado(this)">
              <img src="${dados.image}" alt="">
              <h5>${dados.text}</h5>
          </li>
          `
    });
    return OptionsRespostas;
}

//Embarralhador de Arrays
function shuffleArray(arr) {
    for (let i = arr.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [arr[i], arr[j]] = [arr[j], arr[i]];
    }
    QuestionsEmbaralhadas = arr;
    return QuestionsEmbaralhadas;
}

function cardSelecionado(elemento) {
    const pai = elemento.parentNode;
    if (pai.classList.contains('selecionado') !== true) {
        pai.classList.add('selecionado');
        optionAnswer(elemento);
    } else {
        return null;
    }
}

function optionAnswer(element) {
    const pai = element.parentNode;
    let filhos = pai.querySelectorAll('img');
    for (let i = 0; i < filhos.length; i++) {
        filhos[i].className += "esbranquicado";
        let remove = element.querySelector("img");
        remove.classList.remove('esbranquicado');
    }
    let filhosTxt = pai.querySelectorAll('h5');
    let filhosLi = pai.querySelectorAll('li');

    for (i = 0; i < filhosTxt.length; i++) {
        if (filhosLi[i].classList.contains('true')) {
            filhosTxt[i].className += "verde";
            correto = filhosLi[i];
        } else {
            filhosTxt[i].className += "vermelho";
        }
    }
    confereResposta(element);
    proximaPerg();
}

function proximaPerg() {
    pergunt = document.querySelectorAll('.questions');

    if (cont < pergunt.length) {
        id = setInterval(scrollaParaProximaPergunta, 2000);
    }
    else {
        calculatePerformance();
        id2 = setInterval(scrollaParaResultado, 2000);
    }
}

function scrollaParaProximaPergunta() {
    pergunt[cont].scrollIntoView();
    clearInterval(id);
    cont++;
}

function scrollaParaResultado() {
    const irParaCaixadeResultado = document.querySelector('.playerScore');
    irParaCaixadeResultado.scrollIntoView();
    clearInterval(id2);
}

function confereResposta(element) {
    if (element === correto) {
        soma++;
        console.log(soma);
    }
}

function calculatePerformance() {
    score = Math.round(((soma) / (pergunt.length)) * 100);
    console.log(score);
    FinishingQuizz(score);
}
let newarrey = [];

function FinishingQuizz(score) {
    let i;
    let arrey = [];

    let level = DadosQuizz.levels;
    for (let t = 0; t < level.length; t++) {
        level.map((dados, i) => {
            arrey.push(dados.minValue);
        });
    }
    newarrey = [... new Set(arrey)];
    newarrey.sort((a, b) => (a - b));
    console.log(newarrey);
    let tamanhoNivel = newarrey.length;
    let nive = (tamanhoNivel - 1);

    for (let j = 0; j < tamanhoNivel; j++) {

        if (score >= newarrey[nive]) {

            let nivelcerto = newarrey[nive];
            console.log(nivelcerto);
            console.log(level[1]);
            console.log(level.length);
            for (let t = 0; t < level.length; t++) {

                console.log(level[t].minValue);
                if (nivelcerto === level[t].minValue) {
                    console.log(nivelcerto);
                    document.querySelector(".playerScore").innerHTML += `
            <div class="text">
                <p>
                    ${score}% de acerto: ${level[t].title}!
                </p>
            </div>

            <ul>
                <li>
                    <div>
                        <img src="${level[t].image}" alt="">
                    </div>
                </li>
                <li>
                    <h6>${level[t].text}</h6>
                </li>
            </ul>
        </article>
        <div class="finishQuizz">
            <div class="button">Reiniciar Quizz</div>
            <h6 class="backHome">Voltar pra home</h6>
        </div>`
                    break;
                } else {
                }
            }
        }
    }
}

functionsIniciais();

// ===================================== Tela 3 (criação do quizz) =====================================================
// ===================================== Tela Inicial (criação do quizz) ===============================================
let checkUrlImage = false, checkTitulo = false, checkQtdPergs = false, checkNivels = false;
let title = "", linKUrl = "", qtdPerguntas, qtdNiveis;
let textoNvl =[];

function IniciarCriacaoQuizz() {
    document.querySelector(".telaInicial").classList.add('hidden');
    document.querySelector(".telaCriandoQuizz").classList.remove('hidden');

    document.querySelector(".telaCriandoQuizz").innerHTML +=
        `<section class="tela informacoesBasicas">
        <section>
        
            <h1>Comece pelo começo</h1>

            <div class="criadorDadosIniciais2">
                <input type="text" class="titulo"       placeholder="Título do seu quizz">
                <input type="text" class="linkUrl"      placeholder="URL da imagem do seu quizz">
                <input type="text" class="qtdPerguntas" placeholder="Quantidade de perguntas do quizz">
                <input type="text" class="qtdNiveis"    placeholder="Quantidade de níveis do quizz">
            </div>

            <div class="botaoCriarPerguntas button" onclick="checkInicial()">Prosseguir pra criar perguntas</div>
        </section>
    </section>`
}

function checkTitle() {
    checkTitulo = false;

    title = document.querySelector(".titulo").value;
    let tlt = title.length;
    if (tlt > 20 && tlt < 65) {
        titulos = true;
        checkTitulo = true;
    }
    return checkTitulo, title;
}

function checkURL() {
    const linKUrl = document.querySelector(".linkUrl").value;
    const urlcorreto = (linKUrl.match(/\.(jpeg|jpg|gif|png)$/) !== null);
    checkUrlImage = urlcorreto;
    return checkUrlImage, linKUrl;
}

function checkQtdQuestions() {
    checkQtdPergs = false;
    qtdPerguntas = document.querySelector(".qtdPerguntas").value;
    if (qtdPerguntas > 2) checkQtdPergs = true;
    return (checkQtdPergs, qtdPerguntas);
}

function checkQtdLevels() {
    checkNivels = false;
    const qtdNiveis = document.querySelector(".qtdNiveis").value;
    if (qtdNiveis > 1) checkNivels = true;

    return checkNivels, qtdNiveis;
}

function checkInicial() {
    checkTitle();
    checkURL();
    checkQtdQuestions();
    checkQtdLevels();

    if (checkTitulo && checkUrlImage && checkQtdPergs && checkNivels) {
        InserirListaPerguntas();
    } else {
        alert('Por favor, preencha os dados corretamente!');
    }
    console.log(qtdNiveis);
    checkUrlImage = false;
    checkTitulo = false;
    checkQtdPergs = false;
    checkNivels = false;
}

// ===================================== Tela de criação das Perguntas (criação do quizz) ===============================================
let checkCor = checkPergunta = checkUrlImageQuestions = checkRespostas = false;
let codCor = "";
let textoPergunta = "";
let ArrayUrls = [];
let ArrayRespostasCriadas = [];

function InserirListaPerguntas() {

    document.querySelector(".informacoesBasicas").classList.add("hidden");

    document.querySelector(".telaCriandoQuizz").innerHTML += `
        <section class="tela perguntas">
            <section class="criaQuizz">

                <h1>Crie suas perguntas</h1>

                <div id="1" class="criadorDadosIniciais2 aberto">
                    <div>
                        <h2>Pergunta 1</h2>

                        <div class="inputs">
                            <input type="text" class = "textsQuestions" placeholder="Texto da pergunta">
                            <input type="text" class = "corFundoTelaQuestions" placeholder="Cor de fundo da pergunta">
                        </div>
                    </div>
                    <div class="corretaCriador">
                        <h2>Resposta correta</h2>
                        <div class="inputs">
                            <input type="text" class="textsRespostaCorreta" placeholder="Resposta correta">
                            <input type="text" class="linkUrlCorreto" placeholder="URL da imagem">
                        </div>
                    </div>
                    <div class="incorretaCriador">
                        <h2>Respostas incorretas</h2>
                        <div>
                            <input type="text" class="textsRespostaIncorreta" placeholder="Resposta incorreta 1">
                            <input type="text" class="linkUrl" placeholder="URL da imagem 1">
                        </div>
                        <div>
                            <input type="text" class="textsRespostaIncorreta" placeholder="Resposta incorreta 2">
                            <input type="text" class="linkUrl" placeholder="URL da imagem 2">
                        </div>
                        <div>
                            <input type="text" class="textsRespostaIncorreta" placeholder="Resposta incorreta 3">
                            <input type="text" class="linkUrl" placeholder="URL da imagem 3">
                        </div>
                    </div>
                </div>

                ${InserirOutrasPerguntas()}
               
                <div class="prosseguirNiveis button" onclick="checkInicial()">Prosseguir pra criar níveis</div>
            </section>
        </section>`;

}

function InserirOutrasPerguntas() {
    let Perguntas = "";
    console.log(qtdPerguntas);
    for (let i = 1; i < qtdPerguntas; i++) {
        Perguntas +=
            `<div id=${i + 1} class="criadorDadosIniciais2">
              <h2>Pergunta ${i + 1}</h2>
              <ion-icon onclick="criarProximaPergunta(this)" name="create-outline"></ion-icon>
        </div>`
    }
    return Perguntas;
}

function criarProximaPergunta(valor) {
    checkPerguntaTelaQuestion();
    checkURLPerguntas();
    corFundoTelaQuestions();
    checkRespostasTelaPerguntas();


    let Verificador = false;
    if (ArrayRespostasCriadas.length === ArrayUrls.length) {
        Verificador = true;
    }
    console.log(checkPergunta, checkCor, checkUrlImageQuestions, checkRespostas, Verificador);
    
    if (checkPergunta && checkCor && checkUrlImageQuestions && checkRespostas && Verificador) {
        inserirInputs(valor);
    } else {
        alert("Tem algo de errado, verifique se os tudo está preenchido de forma correta.");
    }

    checkCor = checkPergunta = checkUrlImageQuestions = checkRespostas = false;
    codCor = "";
    textoPergunta = "";
    ArrayUrls = [];
    ArrayRespostasCriadas = [];
}

function inserirInputs(valor) {
    pergunta = valor.parentNode;
    let VerificarPerguntaAberta = document.querySelector(".aberto");

    if (VerificarPerguntaAberta !== null) {
        VerificarPerguntaAberta.classList.remove("aberto");
        VerificarPerguntaAberta.innerHTML = `<h2>Pergunta ${VerificarPerguntaAberta.id}</h2>`;
    }

    pergunta.classList.add("aberto");

    pergunta.innerHTML = `
            <div>
                <h2>Pergunta ${pergunta.id}</h2>

                <div class="inputs">
                    <input type="text" class = "textsQuestions" placeholder="Texto da pergunta">
                    <input type="text" class = "corFundoTelaQuestions" placeholder="Cor de fundo da pergunta">
                </div>
            </div>
            <div class="corretaCriador">
                <h2>Resposta correta</h2>
                <div class="inputs">
                    <input type="text" class="textsResposta" placeholder="Resposta correta">
                    <input type="text" class="linkUrl" placeholder="URL da imagem">
                </div>
            </div>
            <div class="incorretaCriador">
                <h2>Respostas incorretas</h2>
                <div>
                    <input type="text" class="textsResposta" placeholder="Resposta incorreta 1">
                    <input type="text" class="linkUrl" placeholder="URL da imagem 1">
                </div>
                <div>
                    <input type="text" class="textsResposta" placeholder="Resposta incorreta 2">
                    <input type="text" class="linkUrl" placeholder="URL da imagem 2">
                </div>
                <div>
                    <input type="text" class="textsResposta" placeholder="Resposta incorreta 3">
                    <input type="text" class="linkUrl" placeholder="URL da imagem 3">
                </div>
            </div>`;
}

function checkPerguntaTelaQuestion() {
    checkPergunta = false;

    Pergunta = document.querySelector(".textsQuestions").value;
    let tlt = Pergunta.length;
    if (tlt > 19) {
        checkPergunta = true;
        textoPergunta = Pergunta;
    }
    return checkPergunta, textoPergunta;
}

function corFundoTelaQuestions() {
    checkCor = false;
    const ArrayCor = [];
    let HexCor = [];

    const cor = document.querySelector(".corFundoTelaQuestions").value;
    const alfabetoENumeros = ["0", "1", "2", "3", "4", "5", "6", "7", "8", "9", "a", "b", "c", "d", "e", "f"];

    if (cor[0] === "#" && cor.length === 7) {

        for (let i = 1; i < 7; i++) {
            ArrayCor.push(cor[i]);
        }

        for (let i = 0; i < ArrayCor.length; i++) {
            let a = ArrayCor[i];

            for (let j = 0; j < alfabetoENumeros.length; j++) {
                let b = alfabetoENumeros[j];

                if (a === b) {
                    HexCor.push(a);
                }
            }
        }

        let contador = 0;
        for (let k = 0; k < 6; k++) {
            if (ArrayCor[k] === HexCor[k]) {
                contador += 1;
            }
        }

        if (contador === 6) {
            checkCor = true;
            codCor = cor;
            return checkCor, codCor;
        }
    }
    return checkCor;
}

function checkURLPerguntas() {
    checkUrlImageQuestions = false;
    ArrayUrls = [];
    const linKUrlCorreto = document.querySelector(".linkUrlCorreto").value;
    const linksUrlErrados = document.querySelectorAll(".linkUrl");

    let verifidorUrl = false;
    if (linKUrlCorreto.match(/\.(jpeg|jpg|gif|png)$/) !== null) {
        verifidorUrl = true;
    }

    if (linksUrlErrados.length > 0 && verifidorUrl) {
        ArrayUrls.push(linKUrlCorreto);

        for (let i = 0; i < linksUrlErrados.length; i++) {
            let verificarURL = linksUrlErrados[i].value;

            let urlcorreto = (verificarURL.match(/\.(jpeg|jpg|gif|png)$/) !== null);
            if (urlcorreto) {
                ArrayUrls.push(linksUrlErrados[i].value);
            }
        }
    }
    
    console.log(ArrayUrls);
    checkUrlImage = true;
    return checkUrlImage, ArrayUrls;
}


function telaCriandoNiveis (){
document.querySelector('.telaCriandoQuizz').innerHTML+=`

<section class="tela niveis hidden">
            <section class="criaQuizz">
                <div class="criaQuizzTitulo">
                    <h1>Agora, decida os níveis</h1>
                </div>
                <div id="1" class="criadorDadosIniciais2 aberto">
                        <h2>Nível 1</h2>
                    <div class="inputs">
                        <input type="text" placeholder="Título do nível">
                        <input type="text" placeholder="% de acerto mínima">
                        <input type="text" placeholder="URL da imagem do nível">
                        <input type="text" placeholder="Descrição do nível">
                    </div>
                </div>
                ${InserirListaNiveis()}
                <div class="prosseguirFinalizar button">Finalizar Quizz</div>
            </section>
        </section>`

}

function InserirListaNiveis() {
    console.log(qtdLevels);
    let leveis;

    for (let i = 1; i < qtdLevels; i++) {
        leveis += `
          <div id=${i + 1} class="criadorDadosIniciais2">
              <h2>Nível ${i + 1}</h2>
              <ion-icon onclick="criarProximoNivel(this)" name="create-outline"></ion-icon>
           </div>`
    }
    return leveis;
}

function criarProximoNivel (valor){
    checkTituloNivel();
    checkPorcentagemMinima();//tem que ter um 0
    checkUrlNivel();
    checkDescricaoMin();


    if (checkPergunta) {
        inserirInputsNivel(valor);
    } else {
        alert("Tem algo de errado, verifique se os tudo está preenchido de forma correta.");
    } 
}

function inserirInputsNivel(valor){
 let niv = valor.parentNode;

 let verificarNivelAberto = document.querySelector(".aberto");

    if (verificarNivelAberto !== null) {
        verificarNivelAberto.classList.remove("aberto");
        verificarNivelAberto.innerHTML = `<h2>Nível ${verificarNivelAberto.id}</h2>`;
    }

    niv.classList.add("aberto");

    niv.innerHTML= `
        <div>
            <h2>Nível ${niv.id}</h2>
            <div class="inputs">
            <input type="text" class="textNivel" placeholder="Título do nível">
            <input type="text" class="textPorcentMin" placeholder="% de acerto mínima">
            <input type="text" class="textPorcentMin" placeholder="URL da imagem do nível">
            <input type="text" placeholder="Descrição do nível">
        </div>
    </div>
    `
}
  
function checkTituloNivel(){

checkNiv = false;

    nive = document.querySelector(".textNivel").value;
    console.log(nive);
    let nvl = nive.length;
    if (nvl > 10) {
        checkNiv = true;
        textoNvl.push(nive);
    }
    return checkNiv, textoNvl;
}
