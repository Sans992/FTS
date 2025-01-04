    // După 4 secunde, ascundem ecranul de încărcare și animăm pagina principală
    setTimeout(() => {
        const loadingScreen = document.getElementById('loading-screen');
        loadingScreen.style.transition = 'transform 1s ease-in-out';
        loadingScreen.style.transform = 'translateY(-60%)'; // Ridicăm ecranul

        setTimeout(() => {
            loadingScreen.style.display = 'none'; // Ascundem complet după animație
            const mainContent = document.getElementById('main-content');
            mainContent.style.display = 'block'; // Afișăm conținutul
            setTimeout(() => {
                mainContent.style.opacity = 1; // Aplicăm efectul de fade-in
            }, 50); // Mică întârziere pentru tranziție
        }, 800); // Așteptăm ca animația să se termine
    }, 2300); // Setăm durata totală la 3 secunde


document.addEventListener('DOMContentLoaded', () => {
  const containerAnimatie = document.querySelector('.container-animatie');
  const sectiune1 = document.getElementById('sectiune1');
  const sectiune2 = document.getElementById('sectiune2');
  
  function updateRotation() {
    const scrollPosition = window.pageYOffset;
    const windowHeight = window.innerHeight;
    const startPosition = windowHeight * 3.5; //viewport
    const endPosition = startPosition + windowHeight; 
    
    let progress = (scrollPosition - startPosition) / (endPosition - startPosition);
    progress = Math.max(0, Math.min(1, progress));
    
    const rotation = progress * 180;
    
    sectiune1.style.transform = `rotateX(${rotation}deg)`;
    sectiune2.style.transform = `rotateX(${180 + rotation}deg)`;
    
    if (scrollPosition >= startPosition * 0.8 && scrollPosition <= endPosition * 1.2) {
      containerAnimatie.style.opacity = '1';
      containerAnimatie.style.visibility = 'visible';
    } else {
      containerAnimatie.style.opacity = '0';
      containerAnimatie.style.visibility = 'hidden';
    }
  }

  window.addEventListener('scroll', () => {
    requestAnimationFrame(updateRotation);
  });

  updateRotation();
});