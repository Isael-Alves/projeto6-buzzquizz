let ArrayOptions = [];

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
        const Questions = DadosQuizz.questions;

        document.querySelector(".titleQuizz").innerHTML += `
           <img src=${DadosQuizz.image} alt="">
           <h2>${DadosQuizz.title}</h2>
        `
        Questions.map((dados, i) => {
            let Option = dados.answers;

            shuffleArray([0,1,1,1]);
            const Card1 = Option[ArrayOptions[0]];
            const Card2 = Option[ArrayOptions[1]];
            const Card3 = Option[ArrayOptions[2]];
            const Card4 = Option[ArrayOptions[3]];

            console.log(dados);
            document.querySelector(".boxQuestions").innerHTML += `
            <article class="questions">
                    <div class="question" style = "background-color:${dados.color};">
                        <p>${dados.title}</p>
                    </div>

                    <ul>
                        <li class="${Card1.isCorrectAnswer}">
                            <img src="${Card1.image}" alt="">
                            <h5>${Card1.text}</h5>
                        </li>
                        <li class="${Card2.isCorrectAnswer}">
                            <img src="${Card2.image}" alt="">
                            <h5>${Card2.text}</h5>
                        </li>
                        <li class="${Card3.isCorrectAnswer}">
                            <img src="${Card3.image}" alt="">
                            <h5>${Card3.text}</h5>
                        </li>
                        <li class="${Card4.isCorrectAnswer}">
                            <img src="${Card4.image}" alt="">
                            <h5>${Card4.text}</h5>
                        </li>
                    </ul>
            </article>`

        });
        FinishingQuizz();

    });
}

//Embarralhador de Arrays
function shuffleArray(arr) {
    for (let i = arr.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [arr[i], arr[j]] = [arr[j], arr[i]];
    }
    ArrayOptions = arr;
    return ArrayOptions;
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