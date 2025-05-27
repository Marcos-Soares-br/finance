class DateUtils {
  constructor( dataRecebida ) {
    this.dataRecebida = dataRecebida; // => dd/mm/yyyy
    this.data = new Date();
    this.diaAtual = (this.data.getDate() < 10 ? `0${this.data.getDate()}` : this.data.getDate() )
    this.mesAtual = (this.data.getMonth()+1 < 10 ? `0${this.data.getMonth()+1}` : this.data.getMonth()+1 )
    this.anoAtual = this.data.getFullYear();
    this.dataAtual = `${this.diaAtual}/${this.mesAtual}/${this.anoAtual}`;
    this.partesData = dataRecebida.split('/');
  }

  eAtual() {
    if( this.dataRecebida == this.dataAtual) {
      return true;
    }
    return false;
  }

  eFutura() {
    let dia = parseInt(this.partesData[0], 10);
    let mes = parseInt(this.partesData[1], 10);
    let ano = parseInt(this.partesData[2], 10);
  
    if (ano > parseInt(this.anoAtual)) {
        return true;
    }

    if (ano === parseInt(this.anoAtual) && mes > parseInt(this.mesAtual)) {
        return true;
    }
    
    if (ano === parseInt(this.anoAtual) && mes === parseInt(this.mesAtual) && dia > parseInt(this.diaAtual)) {
        return true;
    }
    
    return false;
  }


  eValida() {
    let dia = parseInt(this.partesData[0], 10);
    let mes = parseInt(this.partesData[1], 10);
    let ano = parseInt(this.partesData[2], 10);

    if (mes < 1 || mes > 12) {
        return false;
    }

    const diasPorMes = [31, (this.eBissexto(ano) ? 29 : 28), 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];

    if (dia < 1 || dia > diasPorMes[mes - 1]) {
        return false;
    }

    return true;
  }

  eBissexto(ano) { return (ano % 4 === 0 && (ano % 100 !== 0 || ano % 400 === 0));}
  
}

function escreverData(id) {
  const input = document.getElementById(id);
  const dataAtual = new Date();
  const dia = String(dataAtual.getDate()).padStart(2, '0');
  const mes = String(dataAtual.getMonth() + 1).padStart(2, '0');
  const ano = dataAtual.getFullYear();

  input.value = `${dia}/${mes}/${ano}`;
};

// FORMATAR CAMPOS DATA //
function formatarData(id) {
      const input = document.getElementById(id);
      let valor = input.value.replace(/\D/g, '');

      let dataFormatada = '';

      if (valor.length >= 2) {
        dataFormatada += valor.substring(0, 2) + '/';
        valor = valor.substring(2);
      }
      if (valor.length >= 2) {
        dataFormatada += valor.substring(0, 2) + '/';
        valor = valor.substring(2);
      }
      if (valor.length >= 4) {
        dataFormatada += valor.substring(0, 4);
      } else {
        dataFormatada += valor;
      }

      input.value = dataFormatada;
}

function aumentarUmaSemana(dataRecebida) {
    let partesData = dataRecebida.split('/');
    let objetoData = new Date(`${partesData[2]}-${partesData[1]}-${partesData[0]}`);

    let timeStamp = objetoData.getTime();
    let seteDiasEmMs = 8 * 24 * 60 * 60 * 1000;
    timeStamp += seteDiasEmMs;

    objetoData = new Date(timeStamp);

    let dia = (objetoData.getDate() < 10 ? `0${objetoData.getDate()}` : objetoData.getDate() )
    let mes = (objetoData.getMonth()+1 < 10 ? `0${objetoData.getMonth()+1}` : objetoData.getMonth()+1 )
    let ano = objetoData.getFullYear();
    let dataNova  = `${dia}/${mes}/${ano}`;
    
    return dataNova;

  }


function aumentarUmMes(dataRecebida)  {
  let partesData = dataRecebida.split('/');
  let mes = partesData[1];
  mes = (mes[0] == '0' ? mes.replace('0', '') : mes)
  mes = parseInt(mes);
  mes = (mes+1 > 12 ? '01' : mes+1);

  if (mes == '01') {
    partesData[2] = parseInt(partesData[2]) + 1; 
  }

  mes = (mes < 10 ? '0'+mes : mes);

  let dataNova = `${partesData[0]}/${mes}/${partesData[2]}`;

  return dataNova;
}

export {DateUtils, escreverData, aumentarUmaSemana, aumentarUmMes, formatarData}