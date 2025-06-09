import { desformatarMoeda } from "./utils/formatUtils.js";
import { DateUtils, formatarData } from "./utils/dateUtils.js";
import {registrarReceita, registrarRecFuturas, registrarDespesa, registrarDespFuturas, registarTransf, calcularDespAtualMes, calcularRecAtualMes} from "./services/financeServices.js";

// VALIDAR E REGISTRAR RECEITAS //

const btnRegistrarRec = document.querySelector('#registrarReceita');
let nomeRec = document.querySelector('#nomeRec');
let contaRec = document.querySelector('#contaRec');
let dataRec = document.querySelector('#dataRec');

btnRegistrarRec.addEventListener('click', () => {
  const lancamentoRec = document.querySelector('input[name="radioRec"]:checked');
  if (lancamentoRec == null ) { alert('Escolha um tipo de lançamento!'); return}

  let valor = desformatarMoeda('valorRec');
  validarReceita(nomeRec.value, valor, contaRec.value, dataRec.value, lancamentoRec.value);
});

function validarReceita(nomeRec, valorRec, contaRec, dataRec, lancamentoRec) {
    let data = new DateUtils(dataRec);

    if (!data.eValida()) { alert('Data inválida!'); return}
    if (nomeRec.trim() == '') { alert('Nome inválido!'); return}
    if (valorRec <= 0 ) { alert('Valor inválido!'); return}

    if (data.eAtual()) {
      console.log(lancamentoRec)
      if (lancamentoRec == 'unico') {
        registrarReceita(lancamentoRec ,nomeRec, valorRec, contaRec, dataRec);

      } else if (lancamentoRec == 'semanal') {

        registrarReceita(lancamentoRec, nomeRec, valorRec, contaRec, dataRec);
        registrarRecFuturas(lancamentoRec, nomeRec, valorRec, contaRec, dataRec);
        // semanal

      } else if (lancamentoRec == 'mensal') {

        registrarReceita(lancamentoRec, nomeRec, valorRec, contaRec, dataRec);
        registrarRecFuturas(lancamentoRec, nomeRec, valorRec, contaRec, dataRec);
        // mensal
      }

      calcularRecAtualMes();

    } else if (data.eFutura()) {
        if (lancamentoRec == 'unico') {
          registrarRecFuturas(lancamentoRec, nomeRec, valorRec, contaRec, dataRec);

        } else if (lancamentoRec == 'semanal') {
          registrarRecFuturas(lancamentoRec, nomeRec, valorRec, contaRec, dataRec);

        } else if (lancamentoRec == 'mensal') {
          registrarRecFuturas(lancamentoRec, nomeRec, valorRec, contaRec, dataRec);
        }
      }  else {
        return;
      }

      location.reload();

}


// REGISTRAR DESPESAS //

const btnRegistrarDesp = document.querySelector('#registrarDespesa');
let nomeDesp = document.querySelector('#nomeDesp');
let contaDesp = document.querySelector('#contaDesp');
let dataDesp = document.querySelector('#dataDesp');

btnRegistrarDesp.addEventListener('click', () => {
  const lancamentoDesp = document.querySelector('input[name="radioDesp"]:checked');
  if ( lancamentoDesp == null ) { alert('Escolha um tipo de lançamento!'); return}

  let valor = desformatarMoeda('valorDesp');
  validarDespesa(nomeDesp.value, valor, contaDesp.value, dataDesp.value, lancamentoDesp.value);
});

function validarDespesa(nomeDesp, valorDesp, contaDesp, dataDesp, lancamentoDesp) {
  let contas = JSON.parse(localStorage.getItem('contas'));
  let data = new DateUtils(dataDesp);
  let despesaPossivel = true;
  let indiceConta;

    if (!data.eValida()) { alert('Data inválida!'); return}
    if (nomeDesp.trim() == '') { alert('Nome inválido!'); return}
    if (valorDesp <= 0 ) { alert('Valor inválido!'); return}

    contas.map( (conta, i) => {
      if(conta.nome == contaDesp) {
        indiceConta = i;
        if (conta.saldo < valorDesp) {
          despesaPossivel = false;
        } 
      }
    });

    if (data.eAtual() && despesaPossivel) {
      if (lancamentoDesp == 'unico') {
        registrarDespesa(lancamentoDesp ,nomeDesp, valorDesp, indiceConta, dataDesp);

      } else if (lancamentoDesp == 'semanal') {

        registrarDespesa(lancamentoDesp, nomeDesp, valorDesp, indiceConta, dataDesp);
        registrarDespFuturas(lancamentoDesp, nomeDesp, valorDesp, contaDesp, dataDesp);

      } else if (lancamentoDesp == 'mensal') {

        registrarDespesa(lancamentoDesp, nomeDesp, valorDesp, indiceConta, dataDesp);
        registrarDespFuturas(lancamentoDesp, nomeDesp, valorDesp, contaDesp, dataDesp);
      }

      calcularDespAtualMes();

    } else if (data.eFutura()) {
        if (lancamentoDesp == 'unico') {
          registrarDespFuturas(lancamentoDesp, nomeDesp, valorDesp, contaDesp, dataDesp);

        } else if (lancamentoDesp == 'semanal') {
          registrarDespFuturas(lancamentoDesp, nomeDesp, valorDesp, contaDesp, dataDesp);

        } else if (lancamentoDesp == 'mensal') {
          registrarDespFuturas('unico', nomeDesp, valorDesp, contaDesp, dataDesp);
        }
      } 

      if(data.eFutura() && !despesaPossivel) { alert('Despesa futura registrada, porém seu saldo atual não é suficiente.'); }
      if(data.eAtual() && !despesaPossivel) { alert('Saldo insuficiente, tá liso?'); return }

      location.reload();

}


// REGISTRAR TRANSFERÊNCIAS //

const btnRegistrarTransf = document.querySelector('#realizarTransf');
let contaOrigem = document.querySelector('#contaOrigem');
let contaDestino = document.querySelector('#contaDestino');

btnRegistrarTransf.addEventListener('click', () => {
  let valor = desformatarMoeda('valorTransf');
  registarTransf(contaOrigem.value, valor, contaDestino.value);
});



dataDesp.addEventListener('input', () => {formatarData('dataDesp'); });
dataDesp.addEventListener('focus', () => dataDesp.value = '');

dataRec.addEventListener('input', () => {formatarData('dataRec'); });
dataRec.addEventListener('focus', () =>  dataRec.value = '');