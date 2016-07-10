import window from './window';
import dizmo from './dizmo';

window.showBack = () => {
    dizmo.showBack();
};
window.showFront = () => {
    dizmo.showFront();
};

window.i18n((err:string, t:(key:string, options?:any) => string) => {
    let cell = document.getElementsByClassName('table-cell')[0];
    cell.textContent = t('greeting');
    let done = document.getElementById('done');
    done.textContent = t('done');
});

document.addEventListener('dizmoready', () => {
    document.getElementById('done').onclick = () => {
        dizmo.showFront();
    };
});
