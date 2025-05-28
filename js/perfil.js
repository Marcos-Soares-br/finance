import { verificarTema } from "./utils/themeUtils.js";

addEventListener('DOMContentLoaded', () => {
    verificarTema();
    carregarNome();
    carregarInfos();
});

function carregarNome() {
    let nomeUsuario = localStorage.getItem('nomedouser') || "Visitante";
    document.getElementById('nomeUser').innerHTML = `<strong>${nomeUsuario}</strong>`;
}

function carregarInfos() {
    //let situacao;
    // criar a parte da situação

    let maiorReceita = localStorage.getItem('maiorReceita') || 0.00;
    maiorReceita = parseFloat(maiorReceita).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })
    document.getElementById('pMaiorRec').innerHTML += maiorReceita;

    let maiorDespesa = localStorage.getItem('maiorDespesa') || 0.00;
    maiorDespesa = parseFloat(maiorDespesa).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
    document.getElementById('pMaiorDesp').innerHTML += maiorDespesa;
}
