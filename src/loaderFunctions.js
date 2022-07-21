export function hideLoader() {
    const loader = document.getElementById('menu-loader-bar')
    if(loader)
        loader.style.display = 'none';
}

export function showLoader() {
    const loader = document.getElementById('menu-loader-bar')
    if(loader)
        loader.style.background = '#ffffff8c';

    showPreloader()
}

export function hidePreloader() {
    const loader = document.getElementById('site-preloader')

    if(loader)
        loader.style.display = 'none';
}

export function showPreloader() {
    const loader = document.getElementById('menu-loader-bar')

    if(loader) 
        loader.style.display = 'block';
}
export function setPreloaderMessage(text) {
    const loader = document.getElementById('site-preloader')
    if(loader)
        loader.innerHTML=text;
}
