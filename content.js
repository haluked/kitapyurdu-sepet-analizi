let bookData = [];

function extractData() {
    const items = [];
    document.querySelectorAll('section').forEach(sec => {
        const nameEl = sec.querySelector('.product-name');
        const priceEl = sec.querySelector('.product-info-container p.fs-14.fw-bold');
        const linkEl = sec.querySelector('a.product-cover');
        const imgEl = sec.querySelector('.product-img');

        if (nameEl && priceEl) {
            const name = nameEl.innerText.trim();
            const priceRaw = priceEl.innerText.replace('TL', '').trim();
            const priceNum = parseFloat(priceRaw.replace('.', '').replace(',', '.'));
            const link = linkEl ? linkEl.href : '#';
            const imgSrc = imgEl ? imgEl.src : '';
            
            items.push({ name, priceText: priceRaw + ' TL', priceNum, link, imgSrc });
        }
    });
    return items;
}

function renderList(sortType) {
    let sortedData = [...bookData];
    
    if (sortType === 'price-asc') sortedData.sort((a, b) => a.priceNum - b.priceNum);
    if (sortType === 'price-desc') sortedData.sort((a, b) => b.priceNum - a.priceNum);
    if (sortType === 'name-asc') sortedData.sort((a, b) => a.name.localeCompare(b.name));
    if (sortType === 'name-desc') sortedData.sort((a, b) => b.name.localeCompare(a.name));

    const container = document.getElementById('ky-list-container');
    container.innerHTML = '';

    sortedData.forEach(item => {
        const div = document.createElement('div');
        div.className = 'ky-item';
        div.innerHTML = `
            <div class="ky-item-info">
                <img class="ky-book-img" src="${item.imgSrc}" alt="book cover">
                <a href="${item.link}" target="_blank">${item.name}</a>
            </div>
            <span class="ky-price">${item.priceText}</span>
        `;
        container.appendChild(div);
    });
}

function createOverlay() {
    if (document.getElementById('ky-overlay')) return;

    bookData = extractData();

    const overlay = document.createElement('div');
    overlay.id = 'ky-overlay';

    overlay.innerHTML = `
        <div id="ky-overlay-header">
            <h2>Sepet Listesi (${bookData.length} Ürün)</h2>
            <div id="ky-controls">
                <select id="ky-sort">
                    <option value="none">Sıralama Seç</option>
                    <option value="price-asc">Fiyat: Düşükten Yükseğe</option>
                    <option value="price-desc">Fiyat: Yüksekten Düşüğe</option>
                    <option value="name-asc">İsim: A - Z</option>
                    <option value="name-desc">İsim: Z - A</option>
                </select>
                <button id="ky-close-btn">Kapat</button>
            </div>
        </div>
        <div id="ky-list-container"></div>
    `;

    document.body.appendChild(overlay);

    document.getElementById('ky-close-btn').addEventListener('click', () => {
        overlay.remove();
    });

    document.getElementById('ky-sort').addEventListener('change', (e) => {
        renderList(e.target.value);
    });

    renderList('none');
}

function init() {
    const btn = document.createElement('button');
    btn.id = 'ky-extension-btn';
    btn.innerText = 'Listeyi Aç';
    btn.addEventListener('click', createOverlay);
    document.body.appendChild(btn);
}

init();