import { verificarTema } from "./utils/themeUtils.js";
import { formatarMoeda, desformatarMoeda } from "./utils/formatUtils.js";
import { exibirAlerta } from "./services/alertas.js";

const divMinhasContas = document.querySelector('.divMinhasContas');
const background = document.querySelector('.background');

addEventListener('DOMContentLoaded', () => {
    carregarDivContas();
    verificarTema();
});

let contas = JSON.parse(localStorage.getItem('contas') ) || [];
let i=0;

function carregarDivContas() {
    if( contas.length > 0 ) {
        contas.forEach( async (conta) => {
            const divConta = document.createElement('div');
            divConta.setAttribute('class', 'divConta');

            const img = document.createElement('img');
            const src = await atribuirSrc(conta.nome.toLowerCase());
            img.setAttribute('src', src);

            const pNome = document.createElement('p');
            pNome.setAttribute('class', 'nomeConta');
            pNome.innerHTML = conta.nome;

            const pValor = document.createElement('p');
            pValor.setAttribute('class', 'valorConta');
            pValor.innerHTML = parseFloat(conta.saldo).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });

            const icEditar = `<i class="fa-solid fa-xmark" style="z-index: 90" id="${i}"></i>`;
            i++;


            divConta.appendChild(img);
            divConta.appendChild(pNome);
            divConta.appendChild(pValor);
            divConta.innerHTML += icEditar;

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
             await eventoClickApagar();
            
            // CRIANDO EVENTO PARA CLICK APAGAR
            async function eventoClickApagar() {
                let btnExcluir = document.getElementById(i-1);
                btnExcluir.addEventListener('click', (evt) => {

                    let id = evt.target.id;
                    const confirmacao = confirm('Você realmente quer apagar essa conta?');

                    if (confirmacao) {
                        let contas = localStorage.getItem('contas') || [];
                        contas = JSON.parse(contas);

                        let novoArrayContas = contas.filter((conta) => conta.nome != contas[id].nome);

                        localStorage.removeItem('contas');
                        localStorage.setItem('contas', JSON.stringify(novoArrayContas) );

                        location.reload()
                    }
                });
            }

        });

        const bntAdcConta = document.createElement('button');
        bntAdcConta.textContent = 'Adicionar Conta';
        bntAdcConta.addEventListener('click', () => {abrirDivCriarConta(); });
        divMinhasContas.appendChild(bntAdcConta); 


    } else {
        let aContas = []
        aContas.unshift({ nome: "Carteira", saldo: 0.00 });
        localStorage.setItem('contas', JSON.stringify(aContas));
        location.reload();
    }
    
}

// FUNÇÃO ABRIR E FECHAR DIV CRIAR CONTA
const divCriarConta = document.querySelector('.divCriarConta');
function abrirDivCriarConta() {
    background.classList.remove('ocultar');
    divCriarConta.classList.remove('ocultar');

    formatarMoeda('saldoConta');
}

function fecharDiv() {
    background.classList.add('ocultar');
    divCriarConta.classList.add('ocultar');
}

document.querySelector('#fecharCriarConta').addEventListener('click', () => {fecharDiv(); });
background.addEventListener('click', () => {fecharDiv(); });


// FUNÇÃO PARA CRIAR NOVAS CONTAS
document.querySelector('#criarConta').addEventListener('click', () => { criarConta()})

function criarConta() {
    let conta = { nome: "", saldo: 0.00 };

    let saldoConta = document.querySelector('#saldoConta');
    saldoConta.value = desformatarMoeda('saldoConta');
    let nomeDaConta = document.querySelector('#nomeDaConta');

    saldoConta = saldoConta.value;
    nomeDaConta = nomeDaConta.value;

    if(nomeDaConta.trim() != '') {
        conta.nome = nomeDaConta;
        conta.saldo = saldoConta== 'undefined' ? '0.00' : saldoConta;

        let arrayContas = JSON.parse(localStorage.getItem('contas')) || [];

        arrayContas.push(conta);

        localStorage.setItem('contas', JSON.stringify(arrayContas));
        location.reload();

    } else {
        exibirAlerta('Preencha um nome para a conta!');
    }

}