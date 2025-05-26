function verificarTema() {
    const tema = localStorage.getItem('tema');
    if (tema == 'escuro') {
        document.body.setAttribute('class', 'tema-escuro');
    }
}

export { verificarTema };
