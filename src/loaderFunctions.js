export function hideLoader() {
    document.getElementById('menu-loader-bar')
        .style.display = 'none';
}

export function showLoader() {
    document.getElementById('menu-loader-bar')
        .style.background = '#ffffff8c';

    showPreloader()
}

export function hidePreloader() {
    document.getElementById('site-preloader')
        .style.display = 'none';
}

export function showPreloader() {
    document.getElementById('menu-loader-bar')
        .style.display = 'block';
}
export function setPreloaderMessage(text) {
    document.getElementById('site-preloader').innerHTML=text;
}
