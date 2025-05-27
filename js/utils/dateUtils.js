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
export {DateUtils, escreverData}