import { verificarTema } from "./utils/themeUtils.js";
import { exibirMensagem } from "./services/alertas.js"

addEventListener('DOMContentLoaded', () => {
    verificarTema();
    carregarNome();
    carregarInfos();
    verificarConquistas();
});

function carregarNome() {
    let nomeUsuario = localStorage.getItem('nomedouser') || "Visitante";
    document.getElementById('nomeUser').innerHTML = `<strong>${nomeUsuario}</strong>`;
}

function carregarInfos() {

    const foto = document.getElementById('foto');
    let maiorSaldo = localStorage.getItem('maiorSaldo') || 0;

    if (maiorSaldo >= 15000) {
        foto.src = '../icons/prospera.png';

    } else if (maiorSaldo >= 10000) {
        foto.src = '../icons/estavel.png';

    } else {
        foto.src = '../icons/desfavorecida.png';
    }


    maiorSaldo = parseFloat(maiorSaldo).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })
    document.getElementById('pMaiorSaldo').innerHTML += maiorSaldo;

    let maiorReceita = localStorage.getItem('maiorReceita') || 0.00;
    maiorReceita = parseFloat(maiorReceita).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })
    document.getElementById('pMaiorRec').innerHTML += maiorReceita;

    let maiorDespesa = localStorage.getItem('maiorDespesa') || 0.00;
    maiorDespesa = parseFloat(maiorDespesa).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
    document.getElementById('pMaiorDesp').innerHTML += maiorDespesa;

}

const iconeSaldo5k = document.querySelector('#iconeSaldo5k');
const iconeSaldo10k = document.querySelector('#iconeSaldo10k');
const iconeSaldo50k = document.querySelector('#iconeSaldo50k');

function verificarConquistas() {
    const saldo5k = localStorage.getItem('conquistaSaldo5k');
    const saldo10k = localStorage.getItem('conquistaSaldo10k');
    const saldo50k = localStorage.getItem('conquistaSaldo50k');


    if ( saldo5k == 'sim') {  iconeSaldo5k.style.filter =  `blur(0px) opacity(100%) brightness(2)` ;}
    if ( saldo10k == 'sim') { iconeSaldo10k.style.filter = `blur(0px) opacity(100%) brightness(2)` ;}
    if ( saldo50k == 'sim' ) {iconeSaldo50k.style.filter = `blur(0px) opacity(100%) brightness(2)` ;}
}

iconeSaldo5k.addEventListener('click', () => exibirMensagem('Liberado quando saldo maior que R$5.000!'));

iconeSaldo10k.addEventListener('click', () => exibirMensagem('Liberado quando saldo maior que R$10.000!'));

iconeSaldo50k.addEventListener('click', () => exibirMensagem('Liberado quando saldo maior que R$50.000!'));
