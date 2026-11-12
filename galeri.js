(function () {
  // ---------- galeri: küçük görsele basınca büyük görsel ve açıklaması değişir,
  // büyük görsele basınca tam boy açılır.
  var isik = document.querySelector('.isik');
  var isikResim = isik.querySelector('img');
  var isikYazi = isik.querySelector('p');

  document.querySelectorAll('[data-galeri]').forEach(function (galeri) {
    var buyuk = galeri.querySelector('[data-buyut]');
    var resim = buyuk.querySelector('img');
    var yazi = galeri.querySelector('figcaption');
    var kucukler = galeri.querySelectorAll('.kucukler button');

    kucukler.forEach(function (dugme) {
      dugme.addEventListener('click', function () {
        kucukler.forEach(function (d) { d.setAttribute('aria-pressed', 'false'); });
        dugme.setAttribute('aria-pressed', 'true');
        resim.src = dugme.dataset.src;
        resim.alt = dugme.querySelector('img').alt;
        yazi.textContent = dugme.dataset.yazi;
        buyuk.classList.toggle('dik-gorsel', dugme.classList.contains('dik'));
      });
    });

    buyuk.addEventListener('click', function () {
      isikResim.src = resim.src;
      isikResim.alt = resim.alt;
      isikYazi.textContent = yazi.textContent;
      isik.showModal();
    });
  });

  isik.addEventListener('click', function (olay) {
    if (olay.target === isik) isik.close();
  });

  // ---------- kaydırınca belirme.
  // Bir şey ters giderse içerik gizli kalmasın diye hepsini açan bir emniyet var.
  var belirecekler = document.querySelectorAll('[data-belir]');
  function hepsiniGoster() {
    belirecekler.forEach(function (el) { el.classList.add('gorundu'); });
  }

  // Adresin sonuna ?duz eklenirse (PDF almak için) belirme hareketi atlanır.
  var duz = /[?&]duz\b/.test(location.search);
  if (duz) document.documentElement.classList.remove('js');

  if (duz || !('IntersectionObserver' in window) || document.visibilityState !== 'visible') {
    hepsiniGoster();
  } else {
    var gozcu = new IntersectionObserver(function (kayitlar) {
      kayitlar.forEach(function (kayit) {
        if (kayit.isIntersecting) {
          kayit.target.classList.add('gorundu');
          gozcu.unobserve(kayit.target);
        }
      });
    }, { rootMargin: '0px 0px -8% 0px', threshold: 0.08 });
    belirecekler.forEach(function (el) { gozcu.observe(el); });
    document.addEventListener('visibilitychange', function () {
      if (document.visibilityState !== 'visible') hepsiniGoster();
    });
  }
  window.addEventListener('beforeprint', hepsiniGoster);

  // ---------- giriş sahnesinde hafif derinlik: kaydırdıkça katmanlar farklı hızda kayar.
  var sahne = document.querySelector('.sahne');
  var azHareket = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (sahne && !azHareket) {
    var bekliyor = false;
    window.addEventListener('scroll', function () {
      if (bekliyor) return;
      bekliyor = true;
      requestAnimationFrame(function () {
        var y = Math.min(window.scrollY, 1200);
        sahne.style.setProperty('--kay-arka', (y * 0.05).toFixed(1) + 'px');
        sahne.style.setProperty('--kay-on', (y * -0.02).toFixed(1) + 'px');
        sahne.style.setProperty('--kay-tel', (y * -0.07).toFixed(1) + 'px');
        bekliyor = false;
      });
    }, { passive: true });
  }
})();
