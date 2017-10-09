let zip = new JSZip();

function init() {
    let keys = ['fonts', 'preview', 'size', 'color'];
    let defaults = ['Flamenco,Antic Slab,Slabo 13px,Bitter', '', '20', '#000000'];
    for (let i = 0; i < keys.length; i++) {
        let k = keys[i];
        let v = localStorage.getItem(k);
        v = v ? v : defaults[i];
        console.log(v);
        document.querySelector('#' + k).value = v;
    }
    update();
}

function update() {
    let embedding = [];
    let holder = document.querySelector('.holder');

    while (holder.firstChild) {
        holder.removeChild(holder.firstChild);
    }
    let fonts = document.querySelector('#fonts').value.split(',');
    let preview = document.querySelector('#preview').value;
    let color = document.querySelector('#color').value;
    let size = document.querySelector('#size').value;

    for (let f of fonts) {
        embedding.push(f.replace(/\s/g, '+'));
        let ele = document.createElement('h1');
        ele.setAttribute('style', `font-family:"${f}";font-size:${size}px;color:${color}`);
        ele.setAttribute('font', f);
        ele.innerHTML = preview != "" ? preview : f;
        holder.appendChild(ele);
    }
    let css_node = document.querySelector('link');
    css_node.setAttribute('href', 'https://fonts.googleapis.com/css?family=' + embedding.join('|'));
    css_node.setAttribute('rel', 'stylesheet');
}


function save() {
    let samples = document.querySelectorAll('h1');
    window.queue = samples.length;
    let max_height;

    for (let ele of samples) {
        max_height = Math.max(ele.offsetHeight);
    }
    for (let ele of samples) {
        let p = (max_height - ele.offsetHeight) / 2;
        ele.style.paddingTop = ele.style.paddingBottom = p;
    }
    for(let c of document.querySelectorAll('canvas')){
        c.parentNode.removeChild(c);
    }
    for (let ele of samples) {
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
    }
}

function change_value(ele) {
    localStorage.setItem(ele.id, ele.value);
    update();
}

init();