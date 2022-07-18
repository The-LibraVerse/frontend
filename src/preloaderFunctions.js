export function hidePreloader() {
    document.getElementById('site-preloader')
        .style.display = 'none';
}

export function setPreloaderMessage(text) {
    document.getElementById('site-preloader').innerHTML=text;
}
