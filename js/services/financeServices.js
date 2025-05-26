function registrarDespesa(tipo, nomeDesp, valorDesp, indice, dataDesp) {
    let contas = JSON.parse(localStorage.getItem('contas'));
    let infosDespesas = JSON.parse(localStorage.getItem('infosDespesas')) || [];
    valorDesp = parseFloat(valorDesp);

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



export {registrarDespesa, registrarReceita, calcularDespAtualMes, calcularRecAtualMes}