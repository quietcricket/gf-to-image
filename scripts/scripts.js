let zip = new JSZip();

function init() {
    let keys = ['fonts', 'preview', 'size', 'color'];
    let defaults = ['Flamenco,Antic Slab,Slabo 13px,Bitter', '', '20', '#000000'];
    for (let i = 0; i < keys.length; i++) {
        let k = keys[i];
        let v = localStorage.getItem(k);
        v = v ? v : defaults[i];
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
        holder.appendChild(document.createElement('br'));
    }
    let css_node = document.querySelector('link');
    css_node.setAttribute('href', 'https://fonts.googleapis.com/css?family=' + embedding.join('|'));
    css_node.setAttribute('rel', 'stylesheet');
}


function save(big_one) {
    let samples = document.querySelectorAll('h1');
    window.queue = samples.length;
    let max_height=0;
    let max_width=0;

    for (let ele of samples) {
        max_height = Math.max(max_height, ele.offsetHeight);
        max_width=Math.max(max_width, ele.offsetWidth);
    }
    for (let ele of samples) {
        let p = (max_height - ele.offsetHeight) / 2;
        ele.style.paddingTop = ele.style.paddingBottom = p;
    }
    if(big_one){
        html2canvas(document.querySelector('.holder'),{
            width:max_width, 
            background:'#ffffff',
            onrendered:canvas=>canvas.toBlob(blob=>saveAs(blob,'fonts-preview.png'),'image/png')
        });
    }else{
        save_one();
    }
}


function save_one() {
    let ele = document.querySelectorAll('.holder h1')[queue-1];
    let config = {
        width: ele.offsetWidth,
        onrendered: (canvas) => {
            let content = canvas.toDataURL('image/png');
            content = content.substr(content.indexOf(','));
            zip.file(ele.getAttribute('font') + '.png', content, {base64: true});
            if (--queue == 0) {
                zip.generateAsync({type: 'blob'}).then((content) => saveAs(content, 'fonts.zip'));
            } else {
                this.save_one();
            }
        }
    };
    html2canvas(ele, config);
}

function change_value(ele) {
    localStorage.setItem(ele.id, ele.value);
    update();
}

setTimeout(init, 100);