let QuestionsEmbaralhadas = [];
let Questions, id, id2, pergunt, correto, DadosQuizz, pai, textResultado, idEntrada;
let newarrey = [];
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
    console.log(quizz);
    idEntrada = quizz;
    let Quizz = axios.get(`https://mock-api.driven.com.br/api/v7/buzzquizz/quizzes/${quizz.id}`);
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
    pai = elemento.parentNode;
    if (pai.classList.contains('selecionado') !== true) {
        pai.classList.add('selecionado');
        optionAnswer(elemento);
    } else {
        return null;
    }
}

function optionAnswer(element) {
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

    let tamanhoNivel = newarrey.length;
    let nive = (tamanhoNivel - 1);

    for (let j = 0; j < tamanhoNivel; j++) {

        if (score >= newarrey[nive]) {
            let nivelcerto = newarrey[nive];
            
            for (let t = 0; t < level.length; t++) {
                if (nivelcerto === level[t].minValue) {
                    
                    textResultado = document.querySelector(".playerScore").innerHTML += `
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
            <div class="button" onClick="reiniciarQuizz()">Reiniciar Quizz</div>
            <h6 class="backHome" onClick="backHome()">Voltar pra home</h6>
        </div>`
                    break;
                }
                else {
                }
            }
            break;
        }
        else {
            nive--;
        }
    }
}
function backHome() {
    window.location.reload(true);
}

function reiniciarQuizz() {
    document.querySelector('.titleQuizz').scrollIntoView({ block: "center", inline: "nearest" });

    soma = 0;
    let indice = 0;

    while (document.querySelectorAll('.selecionado').length !== 0) {
        document.querySelectorAll('.selecionado')[indice].classList.remove('selecionado');
    }

    while (document.querySelectorAll('.esbranquicado').length !== 0) {
        document.querySelectorAll('.esbranquicado')[indice].classList.remove('esbranquicado');
    }


    while (document.querySelectorAll('.verde').length !== 0) {
        document.querySelectorAll('.verde')[indice].classList.remove('verde');
    }

    while (document.querySelectorAll('.vermelho').length !== 0) {
        document.querySelectorAll('.vermelho')[indice].classList.remove('vermelho');
    }

    document.querySelector('.playerScore').parentNode.removeChild(document.querySelector('.playerScore'));
    EntrandoQuizz(idEntrada);
}

// ===================================== Tela 3 (criação do quizz) =====================================================
// ===================================== Tela Inicial (criação do quizz) ===============================================
let checkUrlImage = false, checkTitulo = false, checkQtdPergs = false, checkNivels = false;
let title = "", linKUrl = "", qtdPerguntas, qtdNiveis;

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
    linKUrl = document.querySelector(".linkUrl").value;
    let urlcorreto = (linKUrl.match(/\.(jpeg|jpg|gif|png)$/) !== null);
    checkUrlImage = urlcorreto;
    return checkUrlImage, linKUrl;
}

function checkQtdQuestions() {
    checkQtdPergs = false;
    qtdPerguntas = parseInt(document.querySelector(".qtdPerguntas").value);
    if (qtdPerguntas > 2) checkQtdPergs = true;
    return checkQtdPergs, qtdPerguntas;
}

function checkQtdLevels() {
    checkNivels = false;
    qtdNiveis = parseInt(document.querySelector(".qtdNiveis").value);
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
        title = "";
        linKUrl = "";
        qtdPerguntas = 0;
        qtdNiveis = 0;
        alert('Por favor, preencha os dados corretamente!');
    }

    checkUrlImage = false;
    checkTitulo = false;
    checkQtdPergs = false;
    checkNivels = false;
}

// ===================================== Tela de criação das Perguntas (criação do quizz) ===============================================
let checkCor = false, checkPergunta = false, checkUrlImageQuestions = false, checkRespostas = false;
let codCor = "";
let textoPergunta = "";
let ArrayUrls = [];
let ArrayRespostasCriadas = [];
let QuestoesCriadas = [];
let contador = 0;

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
               
                <div class="prosseguirNiveis button">Prosseguir pra criar níveis</div>
            </section>
        </section>`;
}

function InserirOutrasPerguntas() {
    let Perguntas = "";

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

    if (checkPergunta && checkCor && checkUrlImageQuestions && checkRespostas && Verificador) {
        CriacaoDasQuestionsOBJETO();
        inserirInputs(valor);
        contador+=1;
        if(contador === (qtdPerguntas - 1)){
            document.querySelector(".prosseguirNiveis").addEventListener("click", telaCriandoNiveis);
        }
        
    } else {

        ArrayRespostasCriadas = [];
        ArrayUrls = [];
        textoPergunta = "";
        codCor = "";
        return alert("Tem algo de errado, verifique se tudo está preenchido de forma correta.")
    }
    ArrayRespostasCriadas = [];
    ArrayUrls = [];
    textoPergunta = "";
    codCor = "";
}

function CriacaoDasQuestionsOBJETO() {

    let ArrayAnswersCriadas = [];
    let AnswerCriada = {};
    let PerguntaCriada = {};
    for (let i = 0; i < ArrayRespostasCriadas.length; i++) {

        let CorrectAnswer = false;
        if (i === 0) {
            CorrectAnswer = true;
        }

        AnswerCriada = {
            text: ArrayRespostasCriadas[i],
            image: ArrayUrls[i],
            isCorrectAnswer: CorrectAnswer
        }
        ArrayAnswersCriadas.push(AnswerCriada);
    }

    PerguntaCriada = {
        title: textoPergunta,
        color: codCor,
        answers: ArrayAnswersCriadas
    }
    QuestoesCriadas.push(PerguntaCriada);
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
                    <input type="text" class="textsRespostaCorreta" placeholder="Resposta correta">
                    <input type="text" class="linkUrlCorreto" placeholder="URL da imagem">
                </div>
            </div>    
            <div class="incorretaCriador">
                <div>    
                    <h2>Respostas incorretas</h2>
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
        `;
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
    let ArrayCor = [];
    let HexCor = [];

    const cor = document.querySelector(".corFundoTelaQuestions").value;
    const alfabetoENumeros = ["0", "1", "2", "3", "4", "5", "6", "7", "8", "9", "a", "b", "c", "d", "e", "f", "A", "B", "C", "D", "E", "F"];

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
    let linKUrlCorreto = document.querySelector(".linkUrlCorreto").value;
    let linksUrlErrados = document.querySelectorAll(".linkUrl");

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

    if (ArrayUrls.length > 1) {
        checkUrlImageQuestions = true;
        return checkUrlImageQuestions, ArrayUrls;
    }
    return checkUrlImageQuestions;
}

function checkRespostasTelaPerguntas() {
    checkRespostas = false;
    let ArrayRespostasFalsas = [];
    let RespostaCorreta = document.querySelector(".textsRespostaCorreta").value;
    let RespostasErradas = document.querySelectorAll(".textsRespostaIncorreta");

    for (let i = 0; i < RespostasErradas.length; i++) {
        if (RespostasErradas[i].value !== "") {
            ArrayRespostasFalsas.push(RespostasErradas[i].value);
        }
    }

    if (RespostaCorreta !== "" && ArrayRespostasFalsas.length > 0) {
        ArrayRespostasCriadas.push(RespostaCorreta);

        for (let j = 0; j < ArrayRespostasFalsas.length; j++) {
            ArrayRespostasCriadas.push(ArrayRespostasFalsas[j]);
        }

        checkRespostas = true;
        return checkRespostas, ArrayRespostasCriadas;
    }
    return checkRespostas;
}

// ===================================== Tela de criação dos Níveis (criação do quizz) ===============================================
let textoNvl = "", Porcent = "", UrlNiveis = "", DescNiveis = "";
let checkNivTelaNivel = false, checkPorcentNiveis = false, checkUrlNiveis = false, checkDescNiveis = false;
let LevelsCriados = [];
let contadorNiveis= 0;

function telaCriandoNiveis() {
    checkPerguntaTelaQuestion();
    checkURLPerguntas();
    corFundoTelaQuestions();
    checkRespostasTelaPerguntas();

    let Verificador = false;
    if (ArrayRespostasCriadas.length === ArrayUrls.length) {
        Verificador = true;
    }

    if (checkPergunta && checkCor && checkUrlImageQuestions && checkRespostas && Verificador) {
        CriacaoDasQuestionsOBJETO();

        document.querySelector('.telaCriandoQuizz').innerHTML = `

        <section class="tela niveis">
            <section class="criaQuizz">
                <div class="criaQuizzTitulo">
                    <h1>Agora, decida os níveis</h1>
                </div>
                <div id="1" class="criadorDadosIniciais2 aberto2">
                        <h2>Nível 1</h2>
                    <div class="inputs">
                        <input type="text"   class = "textNivel"           placeholder="Título do nível">
                        <input type="number" class = "textPorcentMin"      placeholder="% de acerto mínima">
                        <input type="text"   class = "textUrlImg"          placeholder="URL da imagem do nível">
                        <input type="text"   class = "textoDescricaoNivel" placeholder="Descrição do nível">
                    </div>
                </div>
                ${InserirListaNiveis()}
                <div class="prosseguirFinalizar button">Finalizar Quizz</div>
            </section>
        </section>`

    } else {

        ArrayRespostasCriadas = [];
        ArrayUrls = [];
        textoPergunta = "";
        codCor = "";
        return alert("Tem algo de errado, verifique se tudo está preenchido de forma correta.");
    }

    ArrayRespostasCriadas = [];
    ArrayUrls = [];
    textoPergunta = "";
    codCor = "";
}

function InserirListaNiveis() {
    let levels;

    for (let i = 1; i < qtdNiveis; i++) {
        levels += `
          <div id=${i + 1} class="criadorDadosIniciais2">
              <h2>Nível ${i + 1}</h2>
              <ion-icon onclick="criarProximoNivel(this)" name="create-outline"></ion-icon>
           </div>`
    }
    return levels;
}

function criarProximoNivel(valor) {
    contadorNiveis+=1;S
    checkTituloNivel();
    ckeckPorctTelaNiv();
    CheckUrlTelaNiveis();
    checkDescricoesNiveis();

    if (checkNivTelaNivel && checkPorcent && checkUrlNiveis && checkDescNiveis) {
        CriacaoDosNiveisOBJETO();

        let niv = valor.parentNode;
        let verNivelAberto = document.querySelector(".aberto2");

        if (verNivelAberto !== null) {
            verNivelAberto.classList.remove("aberto2");
            verNivelAberto.innerHTML = `<h2>Nível ${verNivelAberto.id}</h2>`;
        }

        niv.classList.add("aberto2");
        niv.innerHTML =
            `<div>
            <h2>Nível ${niv.id}</h2>
            <div class="inputs">
                <input type="text"   class = "textNivel"           placeholder="Título do nível">
                <input type="number" class = "textPorcentMin"      placeholder="% de acerto mínima">
                <input type="text"   class = "textUrlImg"          placeholder="URL da imagem do nível">
                <input type="text"   class = "textoDescricaoNivel" placeholder="Descrição do nível">
            </div>
        </div>`
        
        if(contadorNiveis === qtdNiveis - 1){
            () => { document.querySelector(".prosseguirFinalizar").addEventListener("click", VerificarNiveis)}
        }

    } else {
        textoNvl = "";
        Porcent = "";
        UrlNiveis = "";
        DescNiveis = "";
        alert("Tem algo de errado, verifique se os tudo está preenchido de forma correta.");
    }
    textoNvl = "";
    Porcent = "";
    UrlNiveis = "";
    DescNiveis = "";
}

function CriacaoDosNiveisOBJETO() {

    NivelCriado = {
        title: textoNvl,
        image: UrlNiveis,
        text: DescNiveis,
        minValue: Porcent
    },
        LevelsCriados.push(NivelCriado);
}

function inserirInputsNivel(valor) {
    let niv = valor.parentNode;

    let verificarNivelAberto = document.querySelector(".aberto");

    if (verificarNivelAberto !== null) {
        verificarNivelAberto.classList.remove("aberto");
        verificarNivelAberto.innerHTML = `<h2>Nível ${verificarNivelAberto.id}</h2>`;
    }

    niv.classList.add("aberto");

    niv.innerHTML = `
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

function checkTituloNivel() {
    checkNivTelaNivel = false;
    nive = document.querySelector(".textNivel").value;
    let nvl = nive.length;

    if (nvl > 10) {
        checkNivTelaNivel = true;
        textoNvl = nive;
    }
    return checkNivTelaNivel;
}

function ckeckPorctTelaNiv() {
    checkPorcent = false;
    let porcent = document.querySelector(".textPorcentMin").value;
    porcent = parseInt(porcent);

    if (porcent >= 0 && porcent <= 100) {
        checkPorcent = true;
        Porcent = porcent;
    }

    return checkPorcent;
}

function CheckUrlTelaNiveis() {
    checkUrlNiveis = false;
    const UrlNivel = document.querySelector(".textUrlImg").value;
    const urlcorreto = (UrlNivel.match(/\.(jpeg|jpg|gif|png)$/) !== null);
    if (urlcorreto) {
        checkUrlNiveis = urlcorreto;
        UrlNiveis = UrlNivel;
    }

    return checkUrlNiveis;
}

function checkDescricoesNiveis() {
    checkDescNiveis = false;
    Des = document.querySelector(".textNivel").value;
    let Length = Des.length;

    if (Length > 30) {
        checkDescNiveis = true;
        DescNiveis = Des;
    }
    return checkDescNiveis;
}

function CriacaoFinalDoObjetoQuizz() {
    QuizzFinal = {
        title: title,
        image: linKUrl,
        questions: QuestoesCriadas,
        levels: LevelsCriados
    };
    console.log(QuizzFinal);
}

function VerificarNiveis() {
    checkTituloNivel();
    ckeckPorctTelaNiv();
    CheckUrlTelaNiveis();
    checkDescricoesNiveis();
    let ContZeroPorcent = 0;

    for (let i = 0; i < LevelsCriados.length; i++) {
        if(LevelsCriados[i].minValue === 0){
            ContZeroPorcent++;
        }
    }
    if(Porcent === 0){
        ContZeroPorcent++;
    }

    if (ContZeroPorcent > 0 && checkNivTelaNivel && checkPorcent && checkUrlNiveis && checkDescNiveis) {
        CriacaoDosNiveisOBJETO();

        document.querySelector(".niveis").classList.add("hidden");
        CriacaoFinalDoObjetoQuizz();
        AbrirTeladeSucessos();

    } else {
        textoNvl = "";
        Porcent = "";
        UrlNiveis = "";
        DescNiveis = "";
        alert(`Tem algo de errado, verifique se tudo está preenchido de forma correta.
        Verifique se existe pelo menos um nível com 0 de porcentagem mínima.`);
    }
    textoNvl = "";
    Porcent = "";
    UrlNiveis = "";
    DescNiveis = "";
}

functionsIniciais();
// ===================================== Tela de Sucesso (criação do quizz) =========================================
function AbrirTeladeSucessos(){
    alert("estou funcionando", QuizzFinal);
    let send = axios.post('https://mock-api.driven.com.br/api/v7/buzzquizz/quizzes', QuizzFinal);
    send.then(tratSucesso);
}

function tratSucesso(dados) {
    document.querySelector('.niveis').classList.add('hidden');
    let telaFinalCria = document.querySelector('.telaCriandoQuizz').innerHTML = `
    <section class="tela sucesso hidden"> </section>`;
    document.querySelector('.sucesso').classList.remove('hidden');
    let respostaLancamento = dados.data;
    console.log(dados.data);
    let quizzRespostaID = respostaLancamento.id;
    console.log(quizzRespostaID);
    let telaFinalCria2 = document.querySelector('.sucesso');
    telaFinalCria2.innerHTML= `
        <div>
            <h2>Seu quizz está pronto!</h2>
            <div class="quizz">
                <img src="${respostaLancamento.image}" alt="">
                <h3>${respostaLancamento.title}</h3>
            </div>
            <div class="button" onClick="EntrandoQuizz1(${respostaLancamento.id})">Acessar Quizz</div>
            <h6 class="backHome" onClick="telaInicialAposCriarQuizz()">Voltar pra home</h6>
        </div>
`
}

function telaInicialAposCriarQuizz() {
    window.location.reload();
}

function EntrandoQuizz1(idQuizzCriado) {
    console.log(idQuizzCriado);
    document.querySelector(".telaQuizz").classList.remove("hidden");
    document.querySelector(".sucesso").classList.add("hidden");
    document.querySelector(".telaCriandoQuizz").classList.add("hidden");
    let Quizz2 = axios.get(`https://mock-api.driven.com.br/api/v7/buzzquizz/quizzes/${idQuizzCriado}`);
    Quizz2.then((resposta) => {
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
