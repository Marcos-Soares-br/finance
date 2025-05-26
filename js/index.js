import { verificarTema} from "./utils/themeUtils.js";
import { DateUtils } from "./utils/dateUtils.js";
import { formatarMoeda } from "./utils/formatUtils.js";
import { registrarDespesa, registrarReceita, calcularRecAtualMes, calcularDespAtualMes} from "./services/financeServices.js";

addEventListener('DOMContentLoaded', () => {
    //verificarTema();
    carregarSaudacao();
    carregarSaldoGeral();
    carregarReceitaDoMes();
    carregarDespesaDoMes();
    carregarDivContas();
    carregarDivObjetivos();
    //carregarDivProx();
    //verificarReceitas();
    //verificarDespesas();
    //calcularDadosMensais();
    //limparDadosAnuais();
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
    const pSaldoGeral = document.querySelector('#saldoGeral');
    let saldoGeral = 0;
    contas.map( (conta) => { saldoGeral += parseFloat(conta.saldo); });
    saldoGeral = saldoGeral.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });

    pSaldoGeral.innerHTML = saldoGeral;
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

    if( contas.length > 0 ) {
        contas.forEach( async (conta) => {
            const divConta = document.createElement('div');

            const img = document.createElement('img');
            const src = await atribuirSrc(conta.nome.toLowerCase());
            img.setAttribute('src', src);

            const pNome = document.createElement('p');
            pNome.setAttribute('class', 'nomeConta');
            pNome.innerHTML = conta.nome;

            const pValor = document.createElement('p');
            pValor.setAttribute('class', 'saldoContas valor');
            pValor.innerHTML = parseFloat(conta.saldo).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });

            divConta.appendChild(img);
            divConta.appendChild(pNome);
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
        mensagem.style.margin = '10px auto';
        divMeusObjetivos.prepend(mensagem);
    }

}