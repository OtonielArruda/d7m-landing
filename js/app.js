/* D7M Landing — progressive enhancement and interaction controls. */
document.addEventListener('DOMContentLoaded', () => {
  const toast = document.querySelector('.toast');
  let toastTimer;
  const showToast = (message) => { toast.textContent = message; toast.classList.add('show'); clearTimeout(toastTimer); toastTimer = setTimeout(() => toast.classList.remove('show'), 2600); };

  // Reveal content smoothly; display it immediately when observers are unsupported.
  const items = document.querySelectorAll('.reveal');
  if ('IntersectionObserver' in window) {
    const observer = new IntersectionObserver((entries) => entries.forEach((entry) => { if (entry.isIntersecting) { entry.target.classList.add('visible'); observer.unobserve(entry.target); } }), { threshold: .1 });
    items.forEach((item) => observer.observe(item));
  } else { items.forEach((item) => item.classList.add('visible')); }

  // Use the navigator language only as a visual suggestion; both surveys remain equally accessible.
  const language = (navigator.language || '').toLowerCase();
  const preferredCard = document.querySelector(`[data-language="${language.startsWith('pt') ? 'pt' : language.startsWith('en') ? 'en' : ''}"]`);
  if (preferredCard) preferredCard.classList.add('is-preferred');

  document.querySelectorAll('.copy-link').forEach((button) => button.addEventListener('click', async () => {
    try { await navigator.clipboard.writeText(button.dataset.url); showToast(button.closest('[data-language]').dataset.language === 'pt' ? 'Link copiado!' : 'Link copied!'); }
    catch { showToast('Não foi possível copiar o link.'); }
  }));

  document.querySelectorAll('.share-link').forEach((button) => button.addEventListener('click', async () => {
    const data = { title: button.dataset.title, url: button.dataset.url };
    if (navigator.share) { try { await navigator.share(data); } catch (error) { if (error.name !== 'AbortError') showToast('Não foi possível compartilhar.'); } }
    else { try { await navigator.clipboard.writeText(data.url); showToast('Link copiado para compartilhar!'); } catch { showToast('Copie o link pelo botão ao lado.'); } }
  }));

  // Create a contained ripple from the pointer position without affecting keyboard activation.
  document.querySelectorAll('.ripple').forEach((button) => button.addEventListener('pointerdown', (event) => {
    const rect = button.getBoundingClientRect(); const ripple = document.createElement('span'); const size = Math.max(rect.width, rect.height);
    ripple.className = 'ripple-effect'; ripple.style.width = ripple.style.height = `${size}px`; ripple.style.left = `${event.clientX - rect.left - size / 2}px`; ripple.style.top = `${event.clientY - rect.top - size / 2}px`;
    button.appendChild(ripple); ripple.addEventListener('animationend', () => ripple.remove());
  }));
});
