export function hideToast() {
    const toast = document.getElementById('site-toast')

    toast.style.opacity = 0;
    setTimeout(() => toast.style.display='none', 1000);
}

export function showToast(content, type='error', hideToast=true) {
    const toast = document.getElementById('site-toast');
    console.log('toast:', toast);

    switch(type) {
        case 'error':
        default:
            toast.classList.add('notice_error');
            break;
    }

    toast.innerHTML= "<p class='notice__message'>" + content + "</p>";

    toast.style.display = 'block';
    toast.style.opacity = 1;

    if(hideToast === true)
        setTimeout(hideToast, 5000);
}
