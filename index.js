const products = [
  { id:1, name:'HP 15s-fq5000', cat:'Ordinateurs', icon:'💻', price:320000, desc:'Intel Core i5, 8GB RAM, 256GB SSD. Idéal pour le bureau.', badge:'Populaire' },
  { id:2, name:'Lenovo IdeaPad 3', cat:'Ordinateurs', icon:'💻', price:275000, oldPrice:310000, desc:'AMD Ryzen 5, 8GB RAM, 512GB SSD. Excellent rapport qualité-prix.', badge:'Promo' },
  { id:3, name:'Dell Inspiron 15', cat:'Ordinateurs', icon:'💻', price:395000, desc:'Intel Core i7, 16GB RAM, 512GB SSD. Performance maximale.', badge:'Nouveau' },
  { id:4, name:'Canon PIXMA G3420', cat:'Imprimantes', icon:'🖨️', price:85000, desc:'Imprimante multifonction WiFi avec réservoir d\'encre rechargeable.', badge:'Populaire' },
  { id:5, name:'HP LaserJet M110w', cat:'Imprimantes', icon:'🖨️', price:120000, oldPrice:140000, desc:'Imprimante laser noir et blanc, WiFi, impression rapide.', badge:'Promo' },
  { id:6, name:'Epson EcoTank L3250', cat:'Imprimantes', icon:'🖨️', price:95000, desc:'Multifonction couleur, faible coût d\'impression par page.' },
  { id:7, name:'Souris Logitech MX Master 3', cat:'Accessoires', icon:'🖱️', price:35000, desc:'Souris ergonomique sans fil, précision ultra-haute.' },
  { id:8, name:'Clavier Mécanique Redragon', cat:'Accessoires', icon:'⌨️', price:28000, desc:'Clavier gaming mécanique rétroéclairé RGB. Touches durables.' },
  { id:9, name:'Routeur TP-Link Archer C6', cat:'Réseaux', icon:'📡', price:32000, desc:'WiFi AC1200 dual band, idéal pour maison ou bureau.', badge:'Populaire' },
  { id:10, name:'Disque dur externe 1TB', cat:'Stockage', icon:'💾', price:45000, desc:'Seagate Expansion, USB 3.0, compact et fiable.' },
  { id:11, name:'SSD Samsung 870 EVO 500GB', cat:'Stockage', icon:'💾', price:55000, desc:'SSD SATA III, vitesse lecture 560 MB/s. Boostez votre PC.' },
  { id:12, name:'Webcam Logitech C920', cat:'Accessoires', icon:'📷', price:42000, desc:'Full HD 1080p, idéale pour les réunions en ligne.' },
];

let cart = [];
let activeFilter = 'Tous';

function renderProducts(filter) {
  const grid = document.getElementById('products-grid');
  const filtered = filter === 'Tous' ? products : products.filter(p => p.cat === filter || (filter === 'Ordinateurs' && p.cat === 'Ordinateurs'));
  grid.innerHTML = filtered.map(p => `
    <div class="product-card">
      <div class="product-img">
        <span style="font-size:4rem">${p.icon}</span>
        ${p.badge ? `<span class="product-badge ${p.badge==='Promo'?'promo':''}">${p.badge}</span>` : ''}
      </div>
      <div class="product-body">
        <div class="product-cat">${p.cat}</div>
        <div class="product-name">${p.name}</div>
        <div class="product-desc">${p.desc}</div>
        <div class="product-footer">
          <div>
            <span class="product-price">${p.price.toLocaleString('fr-FR')} FCFA</span>
            ${p.oldPrice ? `<span class="product-price-old">${p.oldPrice.toLocaleString('fr-FR')}</span>` : ''}
          </div>
          <button class="add-cart" onclick="addToCart(${p.id})">+ Panier</button>
        </div>
      </div>
    </div>
  `).join('');
}

function filterProducts(filter, btn) {
  activeFilter = filter;
  document.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
  if (btn) btn.classList.add('active');
  renderProducts(filter);
  document.getElementById('produits').scrollIntoView({behavior:'smooth'});
}

function addToCart(id) {
  const product = products.find(p => p.id === id);
  const existing = cart.find(i => i.id === id);
  if (existing) {
    existing.qty++;
  } else {
    cart.push({...product, qty: 1});
  }
  updateCartUI();
  showToast(`✅ ${product.name} ajouté au panier !`);
}

function updateCartUI() {
  const count = cart.reduce((a, i) => a + i.qty, 0);
  document.getElementById('cart-count').textContent = count;
  const total = cart.reduce((a, i) => a + i.price * i.qty, 0);
  document.getElementById('cart-total').textContent = total.toLocaleString('fr-FR') + ' FCFA';
  const itemsEl = document.getElementById('cart-items');
  if (cart.length === 0) {
    itemsEl.innerHTML = '<div class="cart-empty"><div>🛒</div><p>Votre panier est vide</p></div>';
  } else {
    itemsEl.innerHTML = cart.map(item => `
      <div class="cart-item">
        <div class="cart-item-icon">${item.icon}</div>
        <div class="cart-item-info">
          <div class="cart-item-name">${item.name}</div>
          <div class="cart-item-price">${(item.price * item.qty).toLocaleString('fr-FR')} FCFA</div>
          <div class="cart-item-qty">
            <button class="qty-btn" onclick="changeQty(${item.id}, -1)">−</button>
            <span class="qty-num">${item.qty}</span>
            <button class="qty-btn" onclick="changeQty(${item.id}, 1)">+</button>
          </div>
        </div>
        <button class="cart-remove" onclick="removeFromCart(${item.id})">✕</button>
      </div>
    `).join('');
  }
}

function changeQty(id, delta) {
  const item = cart.find(i => i.id === id);
  if (!item) return;
  item.qty += delta;
  if (item.qty <= 0) cart = cart.filter(i => i.id !== id);
  updateCartUI();
}

function removeFromCart(id) {
  cart = cart.filter(i => i.id !== id);
  updateCartUI();
}

function toggleCart(e) {
  e.preventDefault();
  document.getElementById('cart-sidebar').classList.toggle('open');
  document.getElementById('cart-overlay').classList.toggle('open');
}

function checkout() {
  if (cart.length === 0) { showToast('⚠️ Votre panier est vide !'); return; }
  showToast('✅ Commande confirmée ! Nous vous contactons bientôt.');
  cart = [];
  updateCartUI();
  document.getElementById('cart-sidebar').classList.remove('open');
  document.getElementById('cart-overlay').classList.remove('open');
}

function orderWhatsapp() {
  if (cart.length === 0) { showToast('⚠️ Votre panier est vide !'); return; }
  const total = cart.reduce((a, i) => a + i.price * i.qty, 0);
  let msg = 'Bonjour Salam Tech ! Je souhaite commander :\n\n';
  cart.forEach(i => { msg += `• ${i.name} x${i.qty} — ${(i.price*i.qty).toLocaleString('fr-FR')} FCFA\n`; });
  msg += `\nTOTAL : ${total.toLocaleString('fr-FR')} FCFA\n\nMerci !`;
  window.open('https://wa.me/22399998391?text=' + encodeURIComponent(msg), '_blank');
}

function submitForm() {
  showToast('✅ Message envoyé ! Nous vous répondons bientôt.');
}

function showToast(msg) {
  const t = document.getElementById('toast');
  t.textContent = msg;
  t.classList.add('show');
  setTimeout(() => t.classList.remove('show'), 3000);
}

function toggleMenu() {}

renderProducts('Tous');
