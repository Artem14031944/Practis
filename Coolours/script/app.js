const cols = document.querySelectorAll('.col');
const modal = document.querySelector('.modal');

const messagePressSpace = 'Press spacebar';
const messageHash = 'Copied color';

document.addEventListener('keydown', e => {
    e.preventDefault();
    if(e.code.toLocaleLowerCase() === 'space') {
        setRandomColors();
    };
});

document.addEventListener('click', e => {
    const type = e.target.dataset.type;
    if(type === 'lock') {
        const node = e.target.tagName.toLocaleLowerCase() === 'i'
        ? e.target
        : e.target.children[0]

        node.classList.toggle('fa-lock-open');
        node.classList.toggle('fa-lock');
    } else if(type === 'copy') {
        copyToClickboard(e.target.textContent);
    }
});

function gerenerateRandomColor() {
    const hexCodes = '0123456789ABCDEF';
    let color = '';

    for(let i = 0; i < 6; i++) {
        color += hexCodes[Math.floor(Math.random() * hexCodes.length)];
    }
    return '#' + color;
};

function copyToClickboard(text) {
   
    if(modal.classList.contains('open')) {
        modal.classList.remove('open')
    } else if (!modal.classList.contains('open')) {
        console.log(modal.children)
        modal.classList.add('open')
        modal.textContent = messageHash;
    }
   
    setTimeout(() => modal.classList.remove('open'), 1200);
    return navigator.clipboard.writeText(text);
};

function setRandomColors(isInitial) {
    const colors = isInitial ? getColorsFromHash() : [];

    cols.forEach((col, index) => {
        const isLocked = col.querySelector('i').classList.contains('fa-lock');
        const text = col.querySelector('h2');
        const button = col.querySelector('button');
       
        if(isLocked) {
            colors.push(text.textContent);
            return
        } 

        if(isInitial) {
            modal.classList.add('open');
            modal.textContent = messagePressSpace;
        } else if (!isInitial){
            modal.classList.remove('open')
            modal.textContent = "";
        }

        const color = isInitial 
        ? colors[index]
            ? colors[index]
            : chroma.random()
        : chroma.random();

        if(!isInitial) {
            colors.push(color);
        }

        text.textContent = color;
        col.style.background = color;

        setTextColor(text, color);
        setTextColor(button, color);
    })

    upDateColorsHash(colors);
};

function setTextColor(text, color) {
    const luminance = chroma(color).luminance();
    text.style.color = luminance > .5  ? "#000" : "#fff";
};

function upDateColorsHash(colors = []) {
    document.location.hash = colors.map(col => col.toString().substring(1)).join('-');
};

function getColorsFromHash() {
    if(document.location.hash.length > 1) {
        return document.location.hash.substring(1).split('-').map(color => '#' + color)
    }
    return [];
};

setRandomColors(true); 