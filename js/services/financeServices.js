import { aumentarUmaSemana, aumentarUmMes } from "../utils/dateUtils.js";

function registrarDespesa(tipo, nomeDesp, valorDesp, indice, dataDesp) {
    let contas = JSON.parse(localStorage.getItem('contas'));
    let infosDespesas = JSON.parse(localStorage.getItem('infosDespesas')) || [];
    valorDesp = parseFloat(valorDesp);

    console.log('indice:' + indice + ' conta: '+ contas[indice] + ' saldo: ' + contas[indice] +' valorDesp: ' + valorDesp)
    contas[indice].saldo = parseFloat(contas[indice].saldo) - valorDesp;

    let infos = { nome: nomeDesp, valor: valorDesp, contaDeDesconto: contas[indice].nome, data: dataDesp, lancamento: tipo }

    infosDespesas.push(infos);
    
    localStorage.setItem('infosDespesas', JSON.stringify(infosDespesas));
    localStorage.setItem('contas', JSON.stringify(contas));

    let objetivos = JSON.parse(localStorage.getItem('objetivos')) || [];
    objetivos.forEach( (objetivo) => {
      if (objetivo.nome == nomeDesp) {

        objetivo.ValorReservado += valorDesp;

        objetivo.valorRestante = objetivo.valor - objetivo.ValorReservado;
      }
    });

    localStorage.setItem('objetivos', JSON.stringify(objetivos));
}

function registrarDespFuturas(tipo, nome, valor, conta, data) {
  let despesasFuturas = JSON.parse(localStorage.getItem('despesasFuturas')) || [];
  let anoAtual = new Date();
  anoAtual = anoAtual.getFullYear();
  
  let dataRecebida = data;
  let anoData = data.split('/');
  anoData = parseInt(anoData[2]);

  if (tipo == 'unico') {
    let infos = { nome: nome, valor: valor, contaDeDesconto: conta, data: data, lancamento: tipo };

    despesasFuturas.push(infos);

    localStorage.setItem('despesasFuturas', JSON.stringify(despesasFuturas));

  } else if (tipo == 'semanal') {
      while (anoData < (anoAtual + 1)) {
        dataRecebida = aumentarUmaSemana(dataRecebida);
        let partes = dataRecebida.split('/');
        anoData = parseInt(partes[2]);

        let infos = { nome: nome, valor: valor, contaDeDesconto: conta, data: dataRecebida, lancamento: 'unico' };

        despesasFuturas.push(infos);

        localStorage.setItem('despesasFuturas', JSON.stringify(despesasFuturas));

      }

  } else if (tipo == 'mensal') {
    while (anoData < (anoAtual + 1)) {
        dataRecebida = aumentarUmMes(dataRecebida);
        let partes = dataRecebida.split('/');
        anoData = partes[2];
        if (anoData == anoAtual+1) {
          break;
        }

        let infos = { nome: nome, valor: valor, contaDeDesconto: conta, data: dataRecebida, lancamento: 'unico' };

        despesasFuturas.push(infos);

        localStorage.setItem('despesasFuturas', JSON.stringify(despesasFuturas));

    }

  }
}


function registrarReceita(tipo, nomeRec, valorRec, contaRec, dataRec) { 
    let contas = JSON.parse(localStorage.getItem('contas'));
    let infosReceitas = JSON.parse(localStorage.getItem('infosReceitas')) || [];

    contas.map( (conta) => {
      if(conta.nome == contaRec) {
        conta.saldo = parseFloat(conta.saldo) + parseFloat(valorRec);
      }

    });

    let infos = {nome: nomeRec, valor: valorRec, contaRecebimento: contaRec, data: dataRec, lancamento: tipo }

    infosReceitas.push(infos);
    
    localStorage.setItem('infosReceitas', JSON.stringify(infosReceitas));
    localStorage.setItem('contas', JSON.stringify(contas));
}

function registrarRecFuturas(tipo, nome, valor, conta, data) {
  let receitasFuturas = JSON.parse(localStorage.getItem('receitasFuturas')) || [];
  let anoAtual = new Date();
  anoAtual = anoAtual.getFullYear();
  
  let dataRecebida = data;
  let anoData = data.split('/');
  anoData = parseInt(anoData[2]);

  if (tipo == 'unico') {
    let infos = { nome: nome, valor: valor, contaRecebimento: conta, data: data, lancamento: tipo };

    receitasFuturas.push(infos);

    localStorage.setItem('receitasFuturas', JSON.stringify(receitasFuturas));

  } else if (tipo == 'semanal') {
      while (anoData < (anoAtual + 1)) {
        dataRecebida = aumentarUmaSemana(dataRecebida);
        let partes = dataRecebida.split('/');
        anoData = partes[2];

        let infos = { nome: nome, valor: valor, contaRecebimento: conta, data: dataRecebida, lancamento: 'unico' };

        receitasFuturas.push(infos);

        localStorage.setItem('receitasFuturas', JSON.stringify(receitasFuturas));

      }

  } else if (tipo == 'mensal') {
    while (anoData < (anoAtual + 1)) {
        dataRecebida = aumentarUmMes(dataRecebida);
        let partes = dataRecebida.split('/');
        anoData = partes[2];
        if (anoData == anoAtual+1) {
          break;
        }

        let infos = { nome: nome, valor: valor, contaRecebimento: conta, data: dataRecebida, lancamento: 'unico' };

        receitasFuturas.push(infos);

        localStorage.setItem('receitasFuturas', JSON.stringify(receitasFuturas));

    }

  }
}

function registarTransf(contaOrigem, valor, contaDestino) {
  let contas = JSON.parse(localStorage.getItem('contas'));
  let transfPossivel = false;

  contas.map( (conta) => {
    if (conta.nome == contaOrigem && conta.saldo >= valor) {
      transfPossivel = true;
      conta.saldo = parseFloat(conta.saldo) - parseFloat(valor);
    }
  });

  if(!transfPossivel) { alert('Transferência não realizada, saldo insuficiente na conta origem.'); return;}

  contas.map( (conta) => {
    console.log('Conta do array: ' + conta.nome + 'conta do select: ' + contaDestino)
    if (conta.nome == contaDestino && transfPossivel) {
      conta.saldo = parseFloat(conta.saldo) + parseFloat(valor);
    }
  });

  localStorage.setItem('contas', JSON.stringify(contas));

  location.reload();

}

function calcularRecAtualMes() {
  let receitaMesAtual = 0.00;
  let infosReceitas = JSON.parse(localStorage.getItem('infosReceitas')) || [];
  let mes = new Date();
  mes = mes.getMonth();
  
  infosReceitas.forEach((el) => {
    let partes = el.data.split('/');

    if (parseInt(partes[1]) == mes+1) {
      receitaMesAtual += parseFloat(el.valor);
    }
  });

  localStorage.setItem('receitaMesAtual', receitaMesAtual);

  let maiorReceita = localStorage.getItem('maiorReceita') || 0.00;

  if (receitaMesAtual > maiorReceita) {
    maiorReceita = receitaMesAtual;

    localStorage.setItem('maiorReceita', maiorReceita);
  }
}

function calcularDespAtualMes() {
  let despesaMesAtual = 0.00;
  let infosDespesas = JSON.parse(localStorage.getItem('infosDespesas')) || [];
  let mes = new Date();
  mes = mes.getMonth();

  infosDespesas.forEach((el) => {
    let partes = el.data.split('/');
    if (parseInt(partes[1]) == mes+1) {
      despesaMesAtual += parseFloat(el.valor);
    }
  });

  localStorage.setItem('despesaMesAtual', despesaMesAtual);

  let maiorDespesa = localStorage.getItem('maiorDespesa') || 0.00;

  if (despesaMesAtual > maiorDespesa) {
     maiorDespesa = despesaMesAtual;

     localStorage.setItem('maiorDespesa', maiorDespesa);
  }

}



export {registrarDespesa, registrarDespFuturas, registrarReceita, registrarRecFuturas, registarTransf, calcularDespAtualMes, calcularRecAtualMes}