let QuestionsEmbaralhadas = [];
let Questions, id, pergunt;
let cont=1;

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
        const DadosQuizz = resposta.data;
        Questions = DadosQuizz.questions;

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
        FinishingQuizz();
    });
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

function cardSelecionado(elemento){
    const pai = elemento.parentNode;
if(pai.classList.contains('selecionado')!==true){
    pai.classList.add('selecionado');
optionAnswer(elemento);
}else{
return null;}
}

function optionAnswer(element){
    const pai = element.parentNode;
    let filhos = pai.querySelectorAll('img');
for(let i = 0; i < filhos.length; i++) {
    filhos[i].className += "esbranquicado";
    let remove = element.querySelector("img");
    remove.classList.remove('esbranquicado');
}
    let filhosTxt = pai.querySelectorAll('h5');
    let filhosLi = pai.querySelectorAll('li');
    
    for(i = 0; i < filhosTxt.length; i++) {
    if(filhosLi[i].classList.contains('true')){
        filhosTxt[i].className += "verde";
    } else{
    filhosTxt[i].className += "vermelho";
    }
}
proximaPag();
}

function proximaPag(){
    pergunt = document.querySelectorAll('.questions'); 
    if(cont<pergunt.length){
    id = setInterval(scrollaParaProximaPergunta,2000);}
    else{
        return null;
    }
}

function scrollaParaProximaPergunta(){
       pergunt[cont].scrollIntoView();
       clearInterval(id);
    cont++;
    } 


function FinishingQuizz() {
    document.querySelector(".boxQuestions").innerHTML += `
        <article class="playerScore">
            <div class="text">
                <p>
                    88% de acerto: Você é praticamente um aluno de Hogwarts!
                </p>
            </div>

            <ul>
                <li>
                    <div>
                        <img src="img/image 10.svg" alt="">
                    </div>
                </li>
                <li>
                    <h6>Parabéns Potterhead! Bem-vindx a Hogwarts, aproveite o loop infinito de comida e clique no
                        botão
                        abaixo para usar o vira-tempo e reiniciar este teste.</h6>
                </li>
            </ul>
        </article>
        <div class="finishQuizz">
            <div class="button">Reiniciar Quizz</div>
            <h6 class="backHome">Voltar pra home</h6>
        </div>`
}

functionsIniciais();


// ===================================== Tela 3 ===============================================
let checkUrlImage, checkTitulo, checkQtdPergs, nivels;

function IniciarCriacaoQuizz(){
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

    const title = document.querySelector(".titulo").value;
    let tlt = title.length;
    if (tlt > 20 && tlt < 65) {
        titulos = true;
        checkTitulo = true;
    }
    return checkTitulo;
}

function checkURL() {
    const linkurl = document.querySelector(".linkUrl").value;
    const urlcorreto = (linkurl.match(/\.(jpeg|jpg|gif|png)$/) !== null);
    checkUrlImage = urlcorreto;
    return checkUrlImage;
}

function checkQtdQuestions() {
    checkQtdPergs = false;
    const questions = document.querySelector(".qtdPerguntas").value;
    if (questions > 2) checkQtdPergs = true;
    return checkQtdPergs;
}

function checkQtdLevels() {
    nivels = false;
    const levels = document.querySelector(".qtdNiveis").value;
    if (levels > 1) nivels = true;
    return nivels;
}

function checkInicial() {
    checkTitle();
    checkURL();
    checkQtdQuestions();
    checkQtdLevels();

    if (checkTitulo && checkUrlImage && checkQtdPergs && nivels) {

        document.querySelector(".informacoesBasicas").classList.add("hidden");

        document.querySelector(".telaCriandoQuizz").innerHTML +=`
        <section class="tela perguntas">
            <section class="criaQuizz">

                <h1>Crie suas perguntas</h1>

                <div class="criadorDadosIniciais2">
                    <div>
                        <h2>Pergunta 1</h2>

                        <div class="inputs">
                            <input type="text" placeholder="Texto da pergunta">
                            <input type="text" placeholder="Cor de fundo da pergunta">
                        </div>
                    </div>
                    <div class="corretaCriador">
                        <h2>Resposta correta</h2>
                        <div class="inputs">
                            <input type="text" placeholder="Resposta correta">
                            <input type="text" placeholder="URL da imagem">
                        </div>
                    </div>
                    <div class="incorretaCriador">
                        <h2>Respostas incorretas</h2>
                        <div>
                            <input type="text" placeholder="Resposta incorreta 1">
                            <input type="text" placeholder="URL da imagem 1">
                        </div>
                        <div>
                            <input type="text" placeholder="Resposta incorreta 2">
                            <input type="text" placeholder="URL da imagem 2">
                        </div>
                        <div>
                            <input type="text" placeholder="Resposta incorreta 3">
                            <input type="text" placeholder="URL da imagem 3">
                        </div>
                    </div>
                </div>

                <div class="criadorDadosIniciais2">
                    <h2>Pergunta 2</h2>
                    <ion-icon name="create-outline"></ion-icon>
                </div>

                <div class="criadorDadosIniciais2">
                    <h2>Pergunta 3</h2>
                    <ion-icon name="create-outline"></ion-icon>
                </div>

                <div class="prosseguirNiveis button" onclick="checkInicial()">Prosseguir pra criar níveis</div>
            </section>
        </section>
        `;
    
    
    } else {
        alert('Por favor, preencha os dados corretamente!');
    }
}
