import { verificarTema } from "./utils/themeUtils.js";
import { formatarMoeda, desformatarMoeda } from "./utils/formatUtils.js";
import { exibirAlerta } from "./services/alertas.js";

const background = document.querySelector('.background');
let objetivos = JSON.parse(localStorage.getItem('objetivos')) || [];
let i=0;

addEventListener('DOMContentLoaded', () => {
    gerarDivObjetivos();
    verificarTema();
});


const divMeusOjetivos = document.querySelector('#divObjetivos');
function gerarDivObjetivos() {

    if (objetivos.length > 0) {
        
        objetivos.forEach( (el) => { 
        const container = document.createElement('div');
        container.setAttribute('class', 'container');

        const divItem = document.createElement('div');
        divItem.setAttribute('class', 'divItem');
        
        divItem.innerHTML =`${el.icone} 
                            <p class="nomeObj">${el.nome}</p>
                            <i class="fa-solid fa-pen-to-square" id="${i}"></i>`;
                            i++;

        container.appendChild(divItem);

        const divItem2 = document.createElement('div');
        divItem2.setAttribute('class', 'divItem2');

        divItem2.innerHTML = `<p>Valor meta:</p>`;

        const pValormeta = document.createElement('p');
        pValormeta.setAttribute('class', 'valorObj');
        pValormeta.innerHTML = `${el.valor.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}`;

        divItem2.appendChild(pValormeta);
        container.appendChild(divItem2);

        const divItem3 = document.createElement('div');
        divItem3.setAttribute('class', 'divItem2');

        divItem3.innerHTML = `<p>Valor pago:</p>`;

        const pValorReservado = document.createElement('p');
        pValorReservado.setAttribute('class', 'valorObj');
        pValorReservado.innerHTML = `${el.ValorReservado.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}`;

        divItem3.appendChild(pValorReservado);
        container.appendChild(divItem3);


        const divItem4 = document.createElement('div');
        divItem4.setAttribute('class', 'divItem2');

        divItem4.innerHTML = `<p>Valor restante:</p>`;

        const pValorRest = document.createElement('p');
        pValorRest.setAttribute('class', 'valorObj');
        pValorRest.innerHTML = `${el.valorRestante.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}`;

        divItem4.appendChild(pValorRest);
        container.appendChild(divItem4);

        divMeusOjetivos.prepend(container);

    });
    } else {
        const mensagem = document.createElement('p');
        mensagem.style.color = 'var(--texto02)';
        mensagem.innerHTML = 'Nenhum objetivo adicionado.';
        divMeusOjetivos.prepend(mensagem);
    }

    for (let j = 0; j < i; j++) {
        let btnEdit = document.getElementById(j);
        btnEdit.addEventListener('click', (evt) => {
            abrirDivEditar(evt.target);
        })
    }

}

const btnadcObjetivos = document.querySelector('#adcObjetivos');
const divCriarObj = document.querySelector('#divCriarObj');

btnadcObjetivos.addEventListener('click', () => {
    background.classList.remove('ocultar');
    divCriarObj.classList.remove('ocultar');
    formatarMoeda('valorObj');
});


const btnfecharCriarObj = document.querySelector('#fecharCriarObj');
const divEditar = document.querySelector('#divEditar');

btnfecharCriarObj.addEventListener('click', () => { fecharDiv(); });

background.addEventListener('click', () => { fecharDiv(); });

function fecharDiv() {
    background.classList.add('ocultar');
    divCriarObj.classList.add('ocultar');
    divEditar.classList.add('ocultar');
}

const btncriarObjetivo = document.querySelector('#criarObjetivo');

btncriarObjetivo.addEventListener('click', () => { criarObjetivo()});

class Objetivo {
    constructor(nomeObjetivo, valorObjetivo, icone) {
        this.nome = nomeObjetivo;
        this.valor = valorObjetivo;
        this.ValorReservado = 0.00;
        this.valorRestante = valorObjetivo;
        this.icone =  icone;
    }
}

async function criarObjetivo() {
    const nomeObjetivo = document.querySelector('#nomeDaMeta');

    let valor = desformatarMoeda('valorObj');

    if (nomeObjetivo.value.trim() !== '' && valor > 0) {
        const icone = await atribuirIcone(nomeObjetivo.value.toLowerCase());

        const objetivo = new Objetivo( nomeObjetivo.value, parseFloat(valor), icone );

        const objetivos = JSON.parse(localStorage.getItem('objetivos')) || [];

        objetivos.push(objetivo);

        localStorage.setItem('objetivos', JSON.stringify(objetivos) );

        location.reload();
    } else {
        exibirAlerta('Preencha os dados corretamente');
    }
}

async function atribuirIcone(nome) {
    const res = await fetch('../icons/icones.json');
    const data = await res.json();
    for (const el of data) {
        if (el.tags.includes( nome ) ) {
            return el.icone;
        }
    }
    return '<i class="fa-solid fa-dollar-sign"></i>';
}

function abrirDivEditar(disparador) {
    background.classList.remove('ocultar');
    divEditar.classList.remove('ocultar');

    let n = disparador.parentNode.children[1].textContent;
    document.getElementById('tituloObj').innerHTML = `Objetivo: ${n}`;

    let novoNome = document.querySelector('#novoNomeObj');
    let id = disparador.id;

    novoNome.value = n;

    formatarMoeda('novoValorObj');

    // Editar nome ou valor de um objetivo
    document.getElementById('confirmarEdicao').addEventListener('click', async () => {
        let obj = localStorage.getItem('objetivos') || [];
        obj = JSON.parse(obj);

        let novoValor = desformatarMoeda('novoValorObj');

        obj[id].nome = novoNome.value;
        obj[id].valor = parseFloat(novoValor);
        obj[id].icone = await atribuirIcone(novoNome.value.toLowerCase());
        obj[id].valorRestante = parseFloat(novoValor) - parseFloat(obj[id].ValorReservado) ;

        localStorage.removeItem('objetivos');
        localStorage.setItem('objetivos', JSON.stringify(obj) );

        location.reload()
    });

    // Apagar objetivo
    document.getElementById('deletarObj').addEventListener('click', () => {
        const confirmacao = confirm('Você realmente quer apagar esse objetivo?');
        if (confirmacao) {
            let obj = localStorage.getItem('objetivos') || [];
            obj = JSON.parse(obj);

            let novoObj = obj.filter((el) => el.nome != obj[id].nome);

            localStorage.removeItem('objetivos');
            localStorage.setItem('objetivos', JSON.stringify(novoObj) );

            location.reload()
        }
        
    } );

    document.getElementById('fecharEditarObj').addEventListener('click', () => { fecharDiv(); });
}
