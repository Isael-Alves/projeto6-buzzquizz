let QuestionsEmbaralhadas = [];

function functionsIniciais() {
    IniciandoBuzzQuizz();
    BuscandoQuizzes();
}

function IniciandoBuzzQuizz() {
    document.querySelector(".criarQuizzes").innerHTML += `  
            <h4>Você não criou nenhum quizz ainda :(</h4>
            <div class="buttonCriarQuizz">Criar Quizz</div>  
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
               <h3>${dados.title}</h3>
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
        let Questions = DadosQuizz.questions;

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
          <li class="${dados.isCorrectAnswer}" key="${i}">
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

function checkURL() {
    const linkurl = document.getElementById("linkurl").value;
    const urlcorreto = (linkurl.match(/\.(jpeg|jpg|gif|png)$/) != null);
    arrayproximoNivel.push(urlcorreto);
    urlNivel = linkurl;
    return urlNivel;
}