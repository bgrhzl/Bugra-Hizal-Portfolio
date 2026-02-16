const $ = (selector) => document.querySelector(selector);

function createBulletList(items = []) {
  if (!items.length) {
    return '';
  }

  const listItems = items.map((item) => `<li>${item}</li>`).join('');
  return `<ul class="detail-list">${listItems}</ul>`;
}

function createTimelineItem(item) {
  const element = document.createElement('article');
  element.className = 'timeline-item interactive-card';
  element.innerHTML = `
    <h3>${item.role}</h3>
    <p class="timeline-meta">${item.company} • ${item.period}</p>
    <p>${item.description}</p>
    ${createBulletList(item.achievements)}
  `;
  return element;
}

function createProjectCard(project) {
  const card = document.createElement('article');
  card.className = 'project-card interactive-card';

  const badges = project.tags
    .map((tag) => `<span class="badge ${tag === 'MCP' ? 'mcp' : ''}">${tag}</span>`)
    .join('');

  card.innerHTML = `
    <h3>${project.name}</h3>
    <p>${project.description}</p>
    ${createBulletList(project.whatIDid)}
    <div class="badges">
      ${badges}
      ${project.mcp ? '<span class="badge mcp">MCP Compatible</span>' : ''}
    </div>
    <p><a href="${project.link}" class="btn ghost">View Details</a></p>
  `;

  return card;
}

function createTagItem(value) {
  const li = document.createElement('li');
  li.textContent = value;
  return li;
}

function mountPortfolio(data) {
  $('#fullName').textContent = data.profile.fullName;
  $('#title').textContent = data.profile.title;
  $('#summary').textContent = data.profile.summary;
  $('#aboutText').textContent = data.profile.about;
  $('#footerName').textContent = data.profile.fullName;

  data.profile.stats.forEach((item) => {
    const li = document.createElement('li');
    li.textContent = item;
    $('#quickStats').appendChild(li);
  });

  data.profile.highlights.forEach((item) => {
    const badge = document.createElement('span');
    badge.className = 'pill';
    badge.textContent = item;
    $('#highlights').appendChild(badge);
  });

  data.experience.forEach((item) => $('#experienceList').appendChild(createTimelineItem(item)));
  data.education.forEach((item) => $('#educationList').appendChild(createTimelineItem(item)));
  data.projects.forEach((item) => $('#projectGrid').appendChild(createProjectCard(item)));

  data.skills.technical.forEach((item) => $('#techSkills').appendChild(createTagItem(item)));
  data.skills.professional.forEach((item) => $('#softSkills').appendChild(createTagItem(item)));

  data.contact.forEach((item) => {
    const anchor = document.createElement('a');
    anchor.href = item.href;
    anchor.target = '_blank';
    anchor.rel = 'noreferrer';
    anchor.textContent = `${item.label}: ${item.value}`;
    $('#contactMethods').appendChild(anchor);
  });

  $('#year').textContent = new Date().getFullYear();
}

function setupThemeToggle() {
  const button = $('#themeToggle');
  const key = 'portfolio-theme';

  const saved = localStorage.getItem(key);
  if (saved === 'light') {
    document.documentElement.classList.add('light');
  }

  button.addEventListener('click', () => {
    document.documentElement.classList.toggle('light');
    localStorage.setItem(key, document.documentElement.classList.contains('light') ? 'light' : 'dark');
  });
}

function setupRevealAnimations() {
  const revealItems = [...document.querySelectorAll('.reveal')];
  revealItems.forEach((item, index) => {
    item.style.transitionDelay = `${Math.min(index * 60, 260)}ms`;
  });

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.18 }
  );

  revealItems.forEach((item) => observer.observe(item));
}

function setupScrollProgress() {
  const progress = $('#scrollProgress');
  if (!progress) {
    return;
  }

  const update = () => {
    const maxScroll = document.documentElement.scrollHeight - window.innerHeight;
    const ratio = maxScroll > 0 ? (window.scrollY / maxScroll) * 100 : 0;
    progress.style.width = `${ratio}%`;
  };

  window.addEventListener('scroll', update, { passive: true });
  update();
}

function setupInteractiveCards() {
  const cards = document.querySelectorAll('.interactive-card');

  cards.forEach((card) => {
    card.addEventListener('pointermove', (event) => {
      const rect = card.getBoundingClientRect();
      const x = (event.clientX - rect.left) / rect.width;
      const y = (event.clientY - rect.top) / rect.height;

      const rotateY = (x - 0.5) * 6;
      const rotateX = (0.5 - y) * 6;

      card.style.setProperty('--rx', `${rotateY.toFixed(2)}deg`);
      card.style.setProperty('--ry', `${rotateX.toFixed(2)}deg`);
    });

    card.addEventListener('pointerleave', () => {
      card.style.setProperty('--rx', '0deg');
      card.style.setProperty('--ry', '0deg');
    });
  });
}


mountPortfolio(portfolioData);
setupThemeToggle();
setupRevealAnimations();
setupScrollProgress();
setupInteractiveCards();
