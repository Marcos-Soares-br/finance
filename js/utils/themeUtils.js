function verificarTema() {
    const tema = localStorage.getItem('tema');
    if (tema == 'claro') {
        document.body.classList.remove('temaEscuro');
    } 
}

export { verificarTema };
