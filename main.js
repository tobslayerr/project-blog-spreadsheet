const scriptURL = 'https://script.google.com/macros/s/AKfycbyqpy14aqCFq3-y5e2c5tdE8c6lhQB5V3wAJxyWX9TVmaEDCQlWMvuyCEkFqX7FZVnD/exec';

function toggleMenu() {
  const navbarLinks = document.querySelector('.navbar-links');
  const burger = document.querySelector('.burger');
  navbarLinks.classList.toggle('active');
  burger.classList.toggle('active');
}

function toggleReadMore() {
  var paragraph = document.querySelector('#boxtentang p');
  var button = document.querySelector('.toggle-button');

  if (paragraph.classList.contains('hidden')) {
      paragraph.classList.remove('hidden');
      button.textContent = 'Tutup';
  } else {
      paragraph.classList.add('hidden');
      button.textContent = 'Baca';
  }
}

const routes = {
  '/': 'beranda.html',
  '/beranda': 'beranda.html',
  '/perencanaanwilayahdankota': 'perencanaanwilayahdankota.html',
  '/tentang': 'tentang.html',
  '/kontak': 'kontak.html',
  '/apaituurbanplanning': 'apaituurbanplanning.html',
  '/box1': 'box1.html',
  '/box2': 'box2.html',
  '/box3': 'box3.html',
};

const loadContent = async (route) => {
  const contentDiv = document.getElementById('content');
  const filePath = routes[route] || routes['/'];

  try {
    const response = await fetch(filePath);
    if (response.ok) {
      const htmlContent = await response.text();
      contentDiv.innerHTML = htmlContent;
      setActiveLink(route);
      attachFormListener(); // Hanya attach form listener jika form ada
    } else {
      contentDiv.innerHTML = '<p>Halaman tidak ditemukan.</p>';
    }
  } catch (error) {
    contentDiv.innerHTML = '<p>Terjadi kesalahan saat memuat halaman.</p>';
  }
};

const setActiveLink = (route) => {
  document.querySelectorAll('nav a').forEach((link) => {
    if (link.getAttribute('href') === `#${route}`) {
      link.classList.add('active');
    } else {
      link.classList.remove('active');
    }
  });
};

const attachFormListener = () => {
  const form = document.forms['form-kritik-saran'];
  if (!form) return; // Pastikan form ada

  const successPopup = document.getElementById('success-popup');
  const closePopupButton = document.getElementById('close-popup');
  const submitButton = form.querySelector('button[type="submit"]');
  
  if (!submitButton) return; // Pastikan tombol submit ada

  form.addEventListener('submit', (e) => {
    e.preventDefault();
    submitButton.disabled = true;
    submitButton.innerText = 'Loading...';

    fetch(scriptURL, { method: 'POST', body: new FormData(form) })
      .then(response => {
        form.reset();
        successPopup.style.display = 'flex';
      })
      .catch(error => {
        alert('Terjadi kesalahan. Silakan coba lagi.');
      })
      .finally(() => {
        submitButton.disabled = false;
        submitButton.innerText = 'Kirim';
      });
  });

  closePopupButton.addEventListener('click', () => {
    successPopup.style.display = 'none';
  });
};

window.addEventListener('hashchange', () => {
  const route = window.location.hash.slice(1) || '/';
  loadContent(route);
});

document.addEventListener('DOMContentLoaded', () => {
  const initialRoute = window.location.hash.slice(1) || '/';
  loadContent(initialRoute);
});
