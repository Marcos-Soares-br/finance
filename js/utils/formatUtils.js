function formatarMoeda(inputId) {
    const input = document.querySelector(`#${inputId}`);

    input.addEventListener('input', () => {
        let valor = input.value.replace(/\D/g, '');

        if (valor === '') {
            input.value = 'R$ 0,00';
            return;
        }

        if (valor.length === 1) {
            valor = '0' + valor; 
        }

        const reais = valor.slice(0, -2) || '0';
        const centavos = valor.slice(-2); 

        let valorFormatado = `R$ ${Number(reais).toLocaleString('pt-BR')},${centavos}`;

        input.value = valorFormatado;
    });
}

function desformatarMoeda(inputId) {
    const input = document.querySelector(`#${inputId}`);
    
        let valor = input.value.replace(/[^\d,]/g, ''); 

        if (valor === '') {
            input.value = '0';
            return;
        }

        let valorNumerico = valor.replace(',', '.');
        
        const valorFinal = parseFloat(valorNumerico);
        
        return valorFinal;
}

export {formatarMoeda, desformatarMoeda}