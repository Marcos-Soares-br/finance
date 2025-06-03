import { exibirAlerta, exibirMensagem } from "./alertas.js";

const main = document.querySelector('.grid');
const background = document.querySelector('.background');

// ABRIR DIV CONFIGURAÇÕES
const btnConfig = document.querySelector('.config');
const divConfigs = document.querySelector('.grid2');

btnConfig.addEventListener('click', () => {
    main.classList.add('ocultar');
    divConfigs.classList.remove('ocultar');
});

// FECHAR DIV CONFIGURAÇÕES
document.querySelector('.fa-arrow-left').addEventListener('click', () => {
    divConfigs.classList.add('ocultar');
    main.classList.remove('ocultar');
});

// ABRIR E FECHAR ALTERAR NOME
const altNome = document.querySelector('#altNome');
const divAlterarNome = document.querySelector('.divAlterarNome');
altNome.addEventListener('click', () => {
    abrirDivFlutuante(divAlterarNome);
});

document.getElementById('fecharAltNome').addEventListener('click', () => {
    fecharTudo();
});

// FUNÇÃO ALTERAR NOME
const confirmarTrocaNome = document.getElementById('confirmarTrocaNome');
const nomeNovo = document.getElementById('nomeNovo');

confirmarTrocaNome.addEventListener('click', () => {
    if (nomeNovo.value.trim() == '') {
        exibirAlerta('Preencha o campo novo nome!');
        return;

    } else {
        localStorage.setItem('nomedouser', nomeNovo.value);
        fecharTudo();

        exibirMensagem('Nome alterado com sucesso!');

        document.getElementById('nomeUser').innerHTML = `<strong>${nomeNovo.value}</strong>`;

    }
});


// ABRIR E FECHAR ALTERAR TEMA
const altTema = document.querySelector('#altTema');
const divAlterarTema = document.querySelector('.divAlterarTema');
const body = document.body;
const btnTemaClaro = document.getElementById('temaClaro');
const btnTemaEscuro = document.getElementById('temaEscuro');
altTema.addEventListener('click', () => {
    abrirDivFlutuante(divAlterarTema);
});

btnTemaClaro.addEventListener('click', () => {
    body.removeAttribute('class', 'temaEscuro');
    localStorage.setItem('tema', 'claro');
});

btnTemaEscuro.addEventListener('click', () => {
    body.setAttribute('class', 'temaEscuro');
    localStorage.setItem('tema', 'escuro');
});

document.getElementById('fecharAltTema').addEventListener('click', () => {
    fecharTudo();
});


function abrirDivFlutuante(divPopup) {
    background.classList.remove('ocultar');
    divPopup.classList.remove('ocultar');
}

background.addEventListener('click', () => {fecharTudo()})
function fecharTudo() {
    background.classList.add('ocultar');
    divAlterarNome.classList.add('ocultar');
    divAlterarTema.classList.add('ocultar');
}

// APAGAR TODAS AS PRÓXIMAS RECEITAS
const apagProxRec = document.querySelector('#apagProxRec');
apagProxRec.addEventListener('click', () => {
    const apagar = confirm('Realmente quer apagar as próximas receitas?');
    if (apagar) {
        localStorage.removeItem('receitasFuturas');

        exibirMensagem('Próximas receitas apagadas!');

    }
});

// APAGAR TODAS AS PRÓXIMAS DESPESAS
const apagProxDesp = document.querySelector('#apagProxDesp');
apagProxDesp.addEventListener('click', () => {
    const apagar = confirm('Realmente quer apagar as próximas despesas?');
    if (apagar) {
        localStorage.removeItem('despesasFuturas');

        exibirMensagem('Próximas despesas apagadas!');
    }
});

// RESETAR O SISTEMA
const apagTudo = document.querySelector('#apagTudo');
apagTudo.addEventListener('click', () => {
    const apagar = confirm('Realmente quer apagar TODAS informações do sistema?');
    if (apagar) {
        localStorage.clear();
        
        location.href = 'index.html';
    }
});

// RELATAR UM ERRO
const relatErro = document.querySelector('#relatErro');
relatErro.addEventListener('click', () => {
    const pergunta = prompt('Qual erro você identificou?');
    console.log(pergunta)
});
