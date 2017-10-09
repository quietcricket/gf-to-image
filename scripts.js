let zip = new JSZip();
let fonts = ['Flamenco', 'Antic Slab', 'Slabo 13px', 'Bitter'];

function init() {
    let embedding = [];
    let holder = document.querySelector('.holder');
    for (let f of fonts) {
        embedding.push(f.replace(/\s/g, '+'));
        let ele = document.createElement('h1');
        ele.setAttribute('style', `font-family:"${f}";`);
        ele.setAttribute('font', f);
        ele.innerHTML = f;
        holder.appendChild(ele);
    }
    let css = document.createElement('link');
    css.setAttribute('href', 'https://fonts.googleapis.com/css?family=' + embedding.join('|'));
    css.setAttribute('rel', 'stylesheet');
    document.querySelector('head').appendChild(css);
}


function equalize_height() {
    let samples = document.querySelectorAll('h1');
    let max_height;

    for (let ele of samples) {
        max_height = Math.max(ele.offsetHeight);
    }
    for (let ele of samples) {
        let p = (max_height - ele.offsetHeight) / 2;
        ele.style.paddingTop = ele.style.paddingBottom = p;

    }
}

function save() {
    equalize_height();
    window.queue = fonts.length;
    document.querySelectorAll('h1').forEach((ele)=> {
        let config = {
            width: ele.offsetWidth,
            onrendered: (canvas) => {
                document.body.appendChild(canvas);
                let content = canvas.toDataURL('image/png');
                console.log(content);
                content = content.substr(content.indexOf(','));

                zip.file(ele.getAttribute('font') + '.png', content, {base64: true});
                if (--queue == 0) {
                    zip.generateAsync({type: 'blob'}).then((content) => saveAs(content, 'fonts.zip'));
                }
            }
        };
        html2canvas(ele, config);
    });
}

function change_text(ele) {
    for (let f of document.querySelectorAll('h1')) {
        f.innerHTML = ele.value;
    }
}

init();