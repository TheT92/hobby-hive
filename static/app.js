window.addEventListener('load', () => {
    let user_info = JSON.parse(sessionStorage.getItem('user_info') || '{}');
    if(!user_info || !user_info['email']) {
        window.location.href='/login';
    }
})
window.handleLogout = function () {
    sessionStorage.removeItem('user_info');
    window.location.href='/login';
}