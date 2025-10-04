document.addEventListener('DOMContentLoaded', function() {
  // JS placeholder for future blog interactivity
});


document.addEventListener('DOMContentLoaded', function () {
  const container = document.querySelector('.scroll-container');
  const cards = document.querySelectorAll('.scroll-card');
  const leftBtn = document.querySelector('.left-btn');
  const rightBtn = document.querySelector('.right-btn');
  const dotsContainer = document.querySelector('.dots-container');

  let currentIndex = 0;
  let autoScrollInterval;
  const cycleDelay = 4000;

  // Create dots
  cards.forEach((_, index) => {
    const dot = document.createElement('span');
    dot.classList.add('dot');
    if (index === 0) dot.classList.add('active');
    dot.addEventListener('click', () => {
      scrollToCard(index);
      resetAutoScroll();
    });
    dotsContainer.appendChild(dot);
  });

  const dots = document.querySelectorAll('.dot');

  function updateDots() {
    dots.forEach((dot, index) => {
      dot.classList.toggle('active', index === currentIndex);
    });
  }

  function scrollToCard(index) {
    currentIndex = (index + cards.length) % cards.length;
    container.scrollTo({
      left: cards[currentIndex].offsetLeft,
      behavior: 'smooth'
    });
    updateDots();
  }

  rightBtn.addEventListener('click', () => {
    scrollToCard(currentIndex + 1);
    resetAutoScroll();
  });

  leftBtn.addEventListener('click', () => {
    scrollToCard(currentIndex - 1);
    resetAutoScroll();
  });

  function startAutoScroll() {
    autoScrollInterval = setInterval(() => {
      scrollToCard(currentIndex + 1);
    }, cycleDelay);
  }
  function stopAutoScroll() {
    clearInterval(autoScrollInterval);
  }
  function resetAutoScroll() {
    stopAutoScroll();
    startAutoScroll();
  }

  // Pause on hover
  container.addEventListener('mouseenter', stopAutoScroll);
  container.addEventListener('mouseleave', startAutoScroll);

  // Swipe support
  let startX = 0;
  container.addEventListener('touchstart', (e) => {
    startX = e.touches[0].clientX;
    stopAutoScroll();
  });
  container.addEventListener('touchend', (e) => {
    let endX = e.changedTouches[0].clientX;
    const diff = startX - endX;
    if (Math.abs(diff) > 50) {
      if (diff > 0) {
        scrollToCard(currentIndex + 1);
      } else {
        scrollToCard(currentIndex - 1);
      }
    }
    startAutoScroll();
  });

  startAutoScroll();
});


// Article grid population
const grid = document.getElementById('grid');

// Fetch and display articles from the JSON file
async function loadArticles() {
  try {
    const response = await fetch('assets/articles.json');
    const articles = await response.json();

    // ✅ Sort by date (newest first)
    articles.sort((a, b) => new Date(b.date) - new Date(a.date));

    grid.innerHTML = '';

    articles.forEach(article => {
      const card = document.createElement('div');
      card.className = 'article';

      card.innerHTML = `
        <a href="${article.link}">
          <img src="${article.image}" alt="${article.title}">
          <h2>${article.title}</h2>
          <p>${article.description}</p>
        </a>
      `;

      grid.appendChild(card);
    });
  } catch (error) {
    console.error('Error loading articles:', error);
    grid.innerHTML = '<p>Failed to load articles.</p>';
  }
}


loadArticles();
