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


// --- Article Grid Population ---
const grid = document.getElementById('grid');

// --- Detect Which Tag This Page Should Show ---
function getTagForPage() {
  const path = window.location.pathname.toLowerCase();
  if (path.includes('guide')) return 'guide';
  if (path.includes('review')) return 'review';
  if (path.includes('feature')) return 'feature';
  return null; // Default = index page
}

// --- Render Article Cards ---
function renderArticles(articles) {
  grid.innerHTML = '';

  if (!articles.length) {
    grid.innerHTML = `<p>No articles found for this page.</p>`;
    return;
  }

  articles.forEach(article => {
    const card = document.createElement('div');
    card.className = 'article';

    const tagsHTML = article.tags
      ? article.tags.map(t => `<a href="${t}.html" class="tag">${t}</a>`).join(' ')
      : '';
card.innerHTML = `
      <a href="${article.link}">
    <img src="${article.image}" alt="${article.title}">
    <div class="card-text">
      <h2>${article.title}</h2>
      <p>${article.description}</p>
    </div>
  </a>
  <div class="tags">${tagsHTML}</div>
`;

    grid.appendChild(card);
  });
}

// --- Fetch and Display Articles ---
async function loadArticles() {
  try {
    const response = await fetch('assets/articles.json');
    const articles = await response.json();

    // Sort by newest first
    articles.sort((a, b) => new Date(b.date) - new Date(a.date));

    // Filter by tag (if applicable)
    const tag = getTagForPage();
    const filtered = tag
      ? articles.filter(a => a.tags?.includes(tag))
      : articles;

    renderArticles(filtered);
  } catch (error) {
    console.error('Error loading articles:', error);
    grid.innerHTML = '<p>Failed to load articles.</p>';
  }
}

// --- Initialize ---
loadArticles();
// --- END Article Grid Population ---