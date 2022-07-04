let objeto = [];
function sendQuizzCriado(){
let send = axios.post('https://mock-api.driven.com.br/api/v4/buzzquizz/quizzes0',objeto);
send.then(tratSucesso);
send.catch(tratError);
}

function tratSucesso(dados){
document.querySelector('.niveis').classList.add('.hidden');
document.querySelector('.sucesso').classList.remove('.hidden');
let quizzId = axios.get(`https://mock-api.driven.com.br/api/v7/buzzquizz/quizzes`);
quizzId.then((resposta) => {
    const QuizzesId = resposta.data.id;
    let tamanahoID = ((QuizzesId.length)-1);
})

let telaFinalCria = document.querySelector('.telaCriandoQuizz');
telaFinalCria.innerHTML+= `
<div>
                <h2>Seu quizz está pronto!</h2>
                <div class="quizz">
                    <img src="${linKUrl}" alt="">
                    <h3>${title}</h3>
                </div>
                <div class="button" onClick="EntrandoQuizz((QuizzesId[tamanahoID])+1)">Acessar Quizz</div>
                <h6 class="backHome" onClick="telaInicialAposCriarQuizz()">Voltar pra home</h6>
            </div>
`
}

function telaInicialAposCriarQuizz(){
document.querySelector('.telaCriandoQuizz').classList.add('hidden');
document.querySelector('.telaInicial').classList.remove('hidden');
}
