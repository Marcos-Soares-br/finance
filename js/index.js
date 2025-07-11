import { verificarTema } from "./utils/themeUtils.js";
import { DateUtils, escreverData  } from "./utils/dateUtils.js";
import { formatarMoeda } from "./utils/formatUtils.js";
import { registrarDespesa, registrarReceita, calcularRecAtualMes, calcularDespAtualMes} from "./services/financeServices.js";
import { exibirAlerta } from "./services/alertas.js"

addEventListener('DOMContentLoaded', () => {
    verificarTema();
    carregarSaudacao();
    carregarSaldoGeral();
    carregarReceitaDoMes();
    carregarDespesaDoMes();
    carregarDivContas();
    carregarDivObjetivos();
    verificarReceitas();
    verificarDespesas();
    calcularDadosMensais();
    limparDadosAnuais();
});

const contas = JSON.parse(localStorage.getItem('contas')) || [];

function carregarSaudacao() {
    const nomeUsuario = localStorage.getItem('nomedouser') || "Visitante";
    const saudacao = document.querySelector('#saudacao');
    const data = new Date();
    const hora = data.getHours();
    
    if (hora > 5 && hora < 14) {
        saudacao.innerHTML = `Bom dia, <strong>${nomeUsuario}!</strong>`;

    } else if (hora >= 14 && hora < 18) {
        saudacao.innerHTML = `Boa tarde, <strong>${nomeUsuario}!</strong>`;

    } else {
        saudacao.innerHTML = `Boa noite, <strong>${nomeUsuario}!</strong>`;
    }

}

function carregarSaldoGeral() {
    const divSaldoGeral = document.querySelector('#saldoGeral');
    let pSaldoGeral = document.createElement('span');
    pSaldoGeral.classList.add('valor');

    let saldo = 0; 
    contas.map( (conta) => { saldo += parseFloat(conta.saldo); });
    pSaldoGeral.innerHTML = saldo.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
    divSaldoGeral.prepend(pSaldoGeral);

    if (saldo >= 5000) { localStorage.setItem('conquistaSaldo5k', 'sim'); } 

    if (saldo >= 10000) { localStorage.setItem('conquistaSaldo10k', 'sim'); }
    
    if (saldo >= 50000) { localStorage.setItem('conquistaSaldo50k', 'sim'); }


    const maiorSaldo = localStorage.getItem('maiorSaldo') || 0;
    if (saldo > maiorSaldo) {
        localStorage.setItem('maiorSaldo', saldo);
    }

}

const olho = document.querySelector('#olho');
olho.addEventListener('click', () => {ocultarValores()})

function ocultarValores() {
    const valores = [...document.querySelectorAll('.valor')];

    if (olho.title == 'Ocultar') {
        valores.forEach( (el) => {
            el.style.filter = 'blur(7px)';
        });

        olho.title = 'Mostrar';
        olho.classList.remove('bxs-show');
        olho.classList.add('bxs-hide');

    } else {
        valores.forEach( (el) => {
            el.style.filter = 'blur(0px)';
        });

        olho.title = 'Ocultar';
        olho.classList.add('bxs-show');
        olho.classList.remove('bxs-hide');
    }

}

function carregarReceitaDoMes() {
    const pRecMes = document.querySelector('.pRec');

    let receitaDoMes = localStorage.getItem('receitaMesAtual'); 
    receitaDoMes = Math.round(receitaDoMes * 100) / 100;
    receitaDoMes = receitaDoMes.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });

    pRecMes.innerHTML = `+ ${receitaDoMes}`;
}

function carregarDespesaDoMes() {
    const pDespMes= document.querySelector('.pDesp');

    let despesaDoMes = localStorage.getItem('despesaMesAtual'); 
    despesaDoMes = Math.round(despesaDoMes * 100) / 100;
    despesaDoMes = despesaDoMes.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });

    pDespMes.innerHTML = `- ${despesaDoMes}`;
}

function carregarDivContas() {
    const divMinhasContas = document.querySelector('#divContasIndex');
    divMinhasContas.innerHTML = '';

    if( contas.length > 0 ) {
        contas.forEach( async (conta) => {
            const divConta = document.createElement('div');

            const img = document.createElement('img');
            const src = await atribuirSrc(conta.nome.toLowerCase());
            img.setAttribute('src', src);

            const pNome = document.createElement('p');
            pNome.setAttribute('class', 'nomeConta');
            pNome.innerHTML = conta.nome;

            const divDaEsquerda = document.createElement('div');
            divDaEsquerda.appendChild(img)
            divDaEsquerda.appendChild(pNome)

            const pValor = document.createElement('p');
            pValor.setAttribute('class', 'saldoContas valor');
            pValor.innerHTML = parseFloat(conta.saldo).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });

            divConta.appendChild(divDaEsquerda)
            divConta.appendChild(pValor);

            divMinhasContas.prepend(divConta);

            async function atribuirSrc(nome) {
                const res = await fetch('../icons/bancos.json');
                const dado = await res.json();
                for (const el of dado) {
                    if (nome.includes(el.nome)) {
                        return el.src;
                    }
                }
                return '../icons/wallet.png';
            }

        });

        const btngerenciarContas = document.querySelector('#btnGerenciarContas')
            btngerenciarContas.addEventListener('click', () => {
                location.href = 'pages/gerenciarContas.html';
            });


    } else {
        let aContas = []
        aContas.unshift({ nome: "Carteira", saldo: 0.00 });
        localStorage.setItem('contas', JSON.stringify(aContas));
        location.reload();
    }

}

const objetivos = JSON.parse(localStorage.getItem('objetivos')) || [];

function carregarDivObjetivos() {
    const divMeusObjetivos = document.querySelector('#divObjetivosIndex');
    if (objetivos.length > 0) {
        
        objetivos.forEach( (el) => { 

        const container = document.createElement('div');

        const divItem = document.createElement('div');
        
        divItem.innerHTML =`${el.icone} <p class="nomeObj">${el.nome}</p>`;

        container.appendChild(divItem);

        const divItem2 = document.createElement('div');

        const pValormeta = document.createElement('p');
        pValormeta.setAttribute('class', 'valorObj valor');
        pValormeta.innerHTML = `${el.valorRestante.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}`;

        divItem2.appendChild(pValormeta);
        container.appendChild(divItem2);

        divMeusObjetivos.prepend(container);

    });
    } else {
        const mensagem = document.createElement('p');
        mensagem.innerHTML = 'Nenhum objetivo adicionado.';
        mensagem.style.color = 'var(--texto02)';
        mensagem.style.margin = '10px auto';
        divMeusObjetivos.prepend(mensagem);
    }

}

document.querySelector('#btnDetalhesObj').addEventListener('click', () => {
    location.href = 'pages/objetivos.html';
});

function carregarDivProx() {
    const divProximos = document.querySelector('.divProxLanc');
    divProximos.innerHTML = '';

    const recFuturas = JSON.parse(localStorage.getItem('receitasFuturas')) || [];
    const despFuturas = JSON.parse(localStorage.getItem('despesasFuturas')) || [];
    despFuturas.forEach( (el) => {
        el.despesa = 'true';
    });

    const todos = [...recFuturas, ...despFuturas];

    function parseData(dataStr) {
        if (dataStr.includes('/')) {
            const [dia, mes, ano] = dataStr.split('/');
            return new Date(`${ano}-${mes}-${dia}`);
        }
        return new Date(dataStr);
    }

    todos.sort((a, b) => {
        const dataA = parseData(a.data);
        const dataB = parseData(b.data);
        return dataA - dataB;
    });

    const proximos = todos.slice(0, 5);

    proximos.forEach((elemento) => {
        const div = document.createElement('div');
        const valor = document.createElement('p');
        valor.setAttribute('class', 'valor');
        const data = document.createElement('p');
        let icone;

        if (elemento.despesa == 'true') {
            icone = `<i class="fa-solid fa-dollar-sign" style="color: #f74949;"></i> <span style="color: #f74949;">${elemento.nome}</span>`;
            valor.innerHTML = `-${elemento.valor.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}`;
            valor.setAttribute('style', 'color: #f74949');

        } else {
            icone = `<i class="fa-solid fa-dollar-sign" style="color: #0ff77e;"></i> <span style="color: #0ff77e;">${elemento.nome}</span>`;
            valor.innerHTML = `+${elemento.valor.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}`;
            valor.setAttribute('style', 'color: #0ff77e'); 
        } 

        div.setAttribute('class', 'container-proximos-lancamentos');
        data.innerHTML = elemento.data;

        div.innerHTML = icone;
        div.appendChild(valor);
        div.appendChild(data);

        divProximos.appendChild(div);
    });

    if (divProximos.childElementCount == 0) {
        divProximos.innerHTML += '<br> <p style="color: var(--texto02)"> Nenhum lançamento próximo. </p> <br>'
    }
}


// ABERTURA E FECHAMENTOS DE DIVS FLUTUANTES 
const divBackg = document.querySelector('.background');
const grid = document.querySelector('.grid');

function abrirDivFlutuante(popupDiv) {
    grid.classList.add('ocultar');
    divBackg.classList.remove('ocultar');
    popupDiv.classList.remove('ocultar');

    const selects = [...document.querySelectorAll('.selects')];

    selects.forEach( (select) => {
        select.innerHTML = '';
        contas.forEach( (conta) => {
            const opcao = document.createElement('option');
            opcao.text = conta.nome;
            select.appendChild(opcao);
        })
    })

}

function fecharDivFlutuante(popupDiv) {
    popupDiv.classList.add('ocultar');
    grid.classList.remove('ocultar');
    divBackg.classList.add('ocultar');
}

divBackg.addEventListener('click', () => {
    divDespesa.classList.add('ocultar');
    divReceita.classList.add('ocultar');
    divTransf.classList.add('ocultar');
    divBackg.classList.add('ocultar');
    grid.classList.remove('ocultar');
});

// DIV RECEITAS
const divReceita = document.querySelector('#divRegistrarReceitas');
const adcReceita = document.querySelector('#adcReceita');

adcReceita.addEventListener('click', () => { 
    abrirDivFlutuante(divReceita); 
    formatarMoeda('valorRec');
    escreverData(divReceita.children[8].id);

});

const btnFecharRec = document.querySelector('#fecharDivRec');
btnFecharRec.addEventListener('click', () => { fecharDivFlutuante(divReceita); } );

// DIV DESPESA
const divDespesa = document.querySelector('#divRegistrarDespesas');
const adcDespesa = document.querySelector('#adcDespesa');

adcDespesa.addEventListener('click', () => { 
    abrirDivFlutuante(divDespesa);
    formatarMoeda('valorDesp');
    escreverData(divDespesa.children[8].id);; 
});

const btnFecharDesp = document.querySelector('#fecharDivDesp');
btnFecharDesp.addEventListener('click', () => { fecharDivFlutuante(divDespesa); });


// DIV TRANSFERENCIA
const divTransf = document.querySelector('#divRealizarTransf');
const adcTrasnferencia = document.querySelector('#adcTransferencia');

adcTrasnferencia.addEventListener('click', () => { 
    abrirDivFlutuante(divTransf); 
    formatarMoeda('valorTransf');
});

const btnFecharTransf = document.querySelector('#fecharDivTransf');
btnFecharTransf.addEventListener('click', () => { fecharDivFlutuante(divTransf) });


//FUNÇÃO PARA RECALCULAR A RECEITA E DESPESA ATUAL DO MES
function  calcularDadosMensais() {
    
    let hoje = new Date();
    let mes = hoje.getMonth() + 1; 
    let ano = hoje.getFullYear(); 
  
    let recalcularDespRec = localStorage.getItem('recalcularDespRec');

    if ((ano > 2025 || (ano == 2025 && mes >= 6)) && recalcularDespRec !== `${ano}-${mes}`) {
        
        calcularRecAtualMes();
        calcularDespAtualMes();

        localStorage.setItem('recalcularDespRec', `${ano}-${mes}`);

        carregarReceitaDoMes();
        carregarDespesaDoMes();
    } 
} 

//FUNÇÃO PARA limpar dados temporários de ano em ano
function limparDadosAnuais() {
    let hoje = new Date();
    let ano = hoje.getFullYear(); 

    let anoLimpeza = localStorage.getItem('anoLimpeza');

    if (ano >= 2026 && anoLimpeza !== String(ano)) {

        localStorage.removeItem('infosReceitas');
        localStorage.removeItem('infosDespesas');
        localStorage.removeItem('receitasFuturas');
        localStorage.removeItem('despesasFuturas');

        localStorage.setItem('anoLimpeza', String(ano));

        location.reload();

    }
}

//Funções para verificar se tem despesas ou receitas a serem efetuadas
let despesasFuturas = JSON.parse(localStorage.getItem('despesasFuturas')) || [];
let receitasFuturas = JSON.parse(localStorage.getItem('receitasFuturas')) || [];

function verificarReceitas() {
    receitasFuturas = receitasFuturas.filter((receita) => {
        const dataRec = new DateUtils(receita.data);

        if (!dataRec.eFutura()) {
            const contaExiste = contas.some(conta => conta.nome == receita.contaRecebimento);

            if (contaExiste) {
                registrarReceita('unico', receita.nome, receita.valor, receita.contaRecebimento, receita.data);
                calcularRecAtualMes();
                carregarReceitaDoMes();
                carregarDivContas();
            } else {
                exibirAlerta('Uma receita agendada não foi registrada, conta de recebimento inexistente!');
            }

            return false; // Remove receita processada
        }
        return true; 
    });

    localStorage.setItem('receitasFuturas', JSON.stringify(receitasFuturas));
    carregarDivProx();
}


function verificarDespesas() {
    despesasFuturas = despesasFuturas.filter((despesa) => {
        const dataDesp = new DateUtils(despesa.data);

        if (!dataDesp.eFutura()) {
            const indiceConta = contas.findIndex(conta => conta.nome == despesa.contaDeDesconto);

            if (indiceConta != -1 && contas[indiceConta].saldo >= despesa.valor) {
                registrarDespesa('unico', despesa.nome, despesa.valor, indiceConta, despesa.data)
                calcularDespAtualMes();
                carregarDespesaDoMes();
                carregarDivContas();
            } else if (indiceConta == -1) {

                exibirAlerta('Uma despesa agendada não foi registrada, conta de desconto inexistente!');
            } else {
                
                exibirAlerta('Uma despesa agendada não foi registrada por falta de saldo!');
            }

            return false; // Remove despesa processada
        }

        return true; 
    });

    localStorage.setItem('despesasFuturas', JSON.stringify(despesasFuturas));
    carregarDivProx();
}


//ADICIONANDO EVENTOS DE CLICK PARA SELECIONAR O TIPO DO LANÇAMENTO

document.getElementById('radioUnicoRec').addEventListener('click', (evt) => { selecionarRadio(evt.target)     });
document.getElementById('radioSemanalRec').addEventListener('click', (evt) => { selecionarRadio(evt.target)    });
document.getElementById('radioMensalRec').addEventListener('click', (evt) => {  selecionarRadio(evt.target)    });


document.getElementById('radioUnicoDesp').addEventListener('click', (evt) => { selecionarRadio(evt.target)     });
document.getElementById('radioSemanalDesp').addEventListener('click', (evt) => { selecionarRadio(evt.target)    });
document.getElementById('radioMensalDesp').addEventListener('click', (evt) => {  selecionarRadio(evt.target)    });

const selecionarRadio = (evt) => {
    const todosRadios = [...document.querySelectorAll('.inputsRadios')];

    todosRadios.map( (el) => {  el.removeAttribute('checked')  });
    
    evt.setAttribute('checked', true);
}