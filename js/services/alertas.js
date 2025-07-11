function exibirMensagem(mensagem) {
    const texto = document.createElement('div');
    texto.classList.add('mensagem');

    texto.innerHTML = mensagem;
    document.body.appendChild(texto);
    setTimeout(fecharTexto, 3000);

    function fecharTexto() {
        document.body.removeChild(texto);
    }
}

function exibirAlerta(mensagem) {

    const background = document.querySelector('.background');
    background.classList.remove('ocultar');

    const alerta = document.createElement('div');
    alerta.classList.add('alerta');

    alerta.innerHTML = `<h1> Alerta de Erro </h1>
                        <p> ${mensagem} </p>`;

    const botao = document.createElement('button');
    botao.textContent = 'OK';
    botao.addEventListener('click', () => {
        document.body.removeChild(alerta);
        background.classList.add('ocultar');
    })
    
    alerta.appendChild(botao);
    document.body.appendChild(alerta);


}

export {exibirMensagem, exibirAlerta}