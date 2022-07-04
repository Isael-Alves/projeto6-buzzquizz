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
armazenaDadosQuizzCriado();
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

function armazenaDadosQuizzCriado(){
    const dadosSerializados = JSON.stringify(respostaLancamento);
    localStorage.setItem("lista", dadosSerializados); 
}