import { verificarTema } from "./utils/themeUtils.js";

const contas = JSON.parse(localStorage.getItem('contas')) || [];
let mesExibir = new Date().getMonth();

addEventListener('DOMContentLoaded', () => {
    verificarTema();
    atualizarDados(mesExibir);
});

const infosRec = JSON.parse(localStorage.getItem('infosReceitas')) || [];
const infosDesp = JSON.parse(localStorage.getItem('infosDespesas')) || [];

const receitasFuturas = JSON.parse(localStorage.getItem('receitasFuturas')) || [];
const despesasFuturas = JSON.parse(localStorage.getItem('despesasFuturas')) || [];

const meses = ['Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho', 'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro'];

const setaEsq = document.querySelector('.fa-angle-left');
const setaDir = document.querySelector('.fa-angle-right');

setaEsq.addEventListener('click', () => {
    mesExibir = mesExibir === 0 ? 11 : mesExibir - 1;
    atualizarDados(mesExibir);
});

setaDir.addEventListener('click', () => {
    mesExibir = mesExibir === 11 ? 0 : mesExibir + 1;
    atualizarDados(mesExibir);
});

function atualizarPmes(mes) {
    document.querySelector('#nomeMes').innerHTML = meses[mes];
}

const pSaldoInicial = document.querySelector('#pSaldoInicial');
const pReceitaTotal = document.querySelector('#pReceitaTotal');
const pDespesaTotal = document.querySelector('#pDespesaTotal');
const pSaldoFinal = document.querySelector('#pSaldoFinal');

let receitaTotal = 0;
let despesaTotal = 0;

function atualizarRelatorio(mes) {
    const saldoInicial = pegarSaldoInicial(mes);
    const saldoFinal = saldoInicial + receitaTotal - despesaTotal;

    pSaldoInicial.innerHTML = saldoInicial.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
    pReceitaTotal.innerHTML = receitaTotal.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
    pDespesaTotal.innerHTML = despesaTotal.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
    pSaldoFinal.innerHTML = saldoFinal.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
}

function atualizarGrafico() {

    const dr = document.querySelector('.dr');
    const divPorcetagens = document.querySelector('.porcetagens');

    let total = receitaTotal + despesaTotal;
    let porcetagemRec = ( receitaTotal / total ) * 100;
    let porcetagemDesp = ( despesaTotal / total ) * 100;

    if (total == 0 ) {
        dr.innerHTML = '<p style="color: var(--texto02)">Nada registrado nesse mês. </p>';
        divPorcetagens.innerHTML = '';
    } else {
        dr.innerHTML = `<div class="desp" style="width: ${porcetagemDesp}%"></div>  <div class="rec" style="width: ${porcetagemRec}%"></div>`;
        divPorcetagens.innerHTML = `<p>${porcetagemDesp.toFixed(2)}%</p> <p>${porcetagemRec.toFixed(2)}%</p>`;
    }

}

const despesas = [...infosDesp, ...despesasFuturas];
function atualizarListaDespesas(mesExibir) {
    let totalDespesas = 0;

    const divDespesas = document.querySelector('.despesas');
    divDespesas.innerHTML = `<h1 style="color:var(--despesas)">Despesas</h1>
                             <div style="color:var(--texto02)">
                                 <p class="pData">Data</p> 
                                 <p class="pNome">Nome</p> 
                                 <p class="pValor">Valor</p>
                             </div>`;

    const despesasDoMes = despesas.filter(item => {
        const mesDaInfo = parseInt(item.data.slice(3, 5));
        if (mesDaInfo === mesExibir + 1) {
            totalDespesas += parseFloat(item.valor);
            return true;
        }
        return false;
    });

    despesasDoMes.forEach(item => {
        const divContainer = document.createElement('div');
        divContainer.innerHTML = `
            <p class="pData">${item.data}</p>
            <p class="pNome">${item.nome}</p>
            <p class="pValor">${item.valor.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}</p>
        `;
        divDespesas.appendChild(divContainer);
    });

    if (despesasDoMes.length == 0) {
        divDespesas.innerHTML = `<h1 style="color:var(--despesas)">Despesas</h1> <p style="color:var(--texto02)">Nenhuma despesa.</p>`;
    }

    despesaTotal = totalDespesas;
}

const receitas = [...infosRec, ...receitasFuturas];
function atualizarListaReceitas(mesExibir) {
    let totalReceitas = 0;

    const divReceitas = document.querySelector('.receitas');
    divReceitas.innerHTML = `<h1 style="color:var(--primaria)">Receitas</h1>
                             <div style="color:var(--texto02)">
                                 <p class="pData">Data</p> 
                                 <p class="pNome">Nome</p> 
                                 <p class="pValor">Valor</p>
                             </div>`;

    const receitasDoMes = receitas.filter(item => {
        const mesDaInfo = parseInt(item.data.slice(3, 5));
        if (mesDaInfo === mesExibir + 1) {
            totalReceitas += parseFloat(item.valor);
            return true;
        }
        return false;
    });

    receitasDoMes.forEach(item => {
        const divContainer = document.createElement('div');
        divContainer.innerHTML = `
            <p class="pData">${item.data}</p>
            <p class="pNome">${item.nome}</p>
            <p class="pValor">${item.valor.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}</p>
        `;
        divReceitas.appendChild(divContainer);
    });

    if (receitasDoMes.length == 0) {
        divReceitas.innerHTML = `<h1 style="color:var(--primaria)">Receitas</h1> <p style="color:var(--texto02)">Nenhuma receita.</p>`;
    }

    receitaTotal = totalReceitas;
}

function atualizarDados(mes) {
    receitaTotal = 0;
    despesaTotal = 0;

    atualizarPmes(mes);
    atualizarListaReceitas(mes);
    atualizarListaDespesas(mes);
    atualizarRelatorio(mes);
    atualizarGrafico();
}

function pegarSaldoInicial(mes) {
    let  saldoInic = contas.reduce((acc, conta) => acc + parseFloat(conta.saldo), 0);
    const mesAtual = new Date().getMonth() + 1;
    const diaAtual = new Date().getDate();

    if( mes+1 == mesAtual ) {
        //para saldo inicial do mes atual
        receitas.forEach( (rec) => {
            const mesDaInfo = parseInt(rec.data.slice(3, 5));
            const diaDaInfo = parseInt(rec.data);

            if ( mesDaInfo == mes+1 && diaDaInfo <= diaAtual) {
                saldoInic -= parseFloat(rec.valor);
            }
        });

        despesas.forEach( (desp) => {
            const mesDaInfo = parseInt(desp.data.slice(3, 5));
            const diaDaInfo = parseInt(desp.data);

            if ( mesDaInfo == mes+1 && diaDaInfo <= diaAtual) {
                saldoInic += parseFloat(desp.valor);
            }
        });

    } else if( mes+1 < mesAtual) {
        //para saldo inicial de meses passados
        receitas.forEach( (rec) => {
            const mesDaInfo = parseInt(rec.data.slice(3, 5));

            if ( mesDaInfo >= mes+1 ) {
                saldoInic -= parseFloat(rec.valor);
            }
        });

        despesas.forEach( (desp) => {
            const mesDaInfo = parseInt(desp.data.slice(3, 5));

            if ( mesDaInfo >= mes+1 ) {
                saldoInic += parseFloat(desp.valor);
            }
        });
        
    } else {
        //para saldo inicial de meses futuros
        receitas.forEach( (rec) => {
            const mesDaInfo = parseInt(rec.data.slice(3, 5));
            const diaDaInfo = parseInt(rec.data);

            if ( mesDaInfo > mesAtual && mesDaInfo < mes+1 ) {
                saldoInic += parseFloat(rec.valor);

            } else if (mesDaInfo == mesAtual && diaDaInfo > diaAtual) {
                saldoInic += parseFloat(rec.valor);
            }
        });

        despesas.forEach( (desp) => {
            const mesDaInfo = parseInt(desp.data.slice(3, 5));
            const diaDaInfo = parseInt(desp.data);

            if ( mesDaInfo > mesAtual && mesDaInfo < mes+1 ) {
                saldoInic -= parseFloat(desp.valor);

            }  else if (mesDaInfo == mesAtual && diaDaInfo > diaAtual) {
                saldoInic -= parseFloat(desp.valor);
            }
        });
    }

    return saldoInic;
}