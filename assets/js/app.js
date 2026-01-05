// ============================================
// App State & Configuration
// ============================================

let appData = null;
let currentLang = 'cn'; // Default language

// ============================================
// Initialize App
// ============================================

document.addEventListener('DOMContentLoaded', async () => {
  try {
    // Load default language data
    await loadLanguage(currentLang);
    renderAll();
    hideLoading();
    initializeEventListeners();
    addScrollAnimations();
  } catch (error) {
    console.error('Failed to initialize app:', error);
    hideLoading();
  }
});

// ============================================
// Data Loading
// ============================================

async function loadLanguage(lang) {
  const dataFile = `_data/data-${lang}.json`;
  const response = await fetch(dataFile);

  if (!response.ok) {
    throw new Error(`Failed to load ${dataFile}`);
  }

  appData = await response.json();
  currentLang = lang;

  // Update HTML lang attribute
  document.documentElement.lang = lang === 'cn' ? 'zh-CN' : 'en';
}

function hideLoading() {
  const loading = document.getElementById('loading');
  setTimeout(() => {
    loading.classList.add('hidden');
  }, 300);
}

// ============================================
// Event Listeners
// ============================================

function initializeEventListeners() {
  // Language toggle
  const langToggle = document.getElementById('lang-toggle');
  langToggle.addEventListener('click', toggleLanguage);

  // Mobile nav toggle
  const navToggle = document.getElementById('nav-toggle');
  const navMenu = document.getElementById('nav-menu');

  navToggle.addEventListener('click', () => {
    navToggle.classList.toggle('active');
    navMenu.classList.toggle('active');
  });

  // Close mobile menu when clicking nav links
  document.querySelectorAll('.nav-link').forEach(link => {
    link.addEventListener('click', () => {
      navToggle.classList.remove('active');
      navMenu.classList.remove('active');
    });
  });

  // Scroll-based nav styling
  window.addEventListener('scroll', () => {
    const nav = document.getElementById('nav');
    if (window.scrollY > 50) {
      nav.classList.add('scrolled');
    } else {
      nav.classList.remove('scrolled');
    }

    // Update active nav link
    updateActiveNavLink();
  });

  // Smooth scroll for all anchor links
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
      e.preventDefault();
      const target = document.querySelector(this.getAttribute('href'));
      if (target) {
        target.scrollIntoView({
          behavior: 'smooth',
          block: 'start'
        });
      }
    });
  });
}

// Update active navigation link based on scroll position
function updateActiveNavLink() {
  const sections = document.querySelectorAll('.section, .hero');
  const navLinks = document.querySelectorAll('.nav-link');

  let current = '';

  sections.forEach(section => {
    const sectionTop = section.offsetTop;
    const sectionHeight = section.clientHeight;

    if (window.scrollY >= sectionTop - 100) {
      current = section.getAttribute('id');
    }
  });

  navLinks.forEach(link => {
    link.classList.remove('active');
    if (link.getAttribute('href') === `#${current}`) {
      link.classList.add('active');
    }
  });
}

// Toggle language
async function toggleLanguage() {
  const newLang = currentLang === 'cn' ? 'en' : 'cn';
  const langToggle = document.getElementById('lang-toggle');

  // Add loading state
  langToggle.disabled = true;
  langToggle.style.opacity = '0.5';

  try {
    await loadLanguage(newLang);
    renderAll();

    // Update button text
    langToggle.querySelector('.lang-text').textContent = newLang === 'cn' ? 'EN' : '中文';
  } catch (error) {
    console.error('Failed to switch language:', error);
    alert('切换语言失败 / Failed to switch language');
  } finally {
    langToggle.disabled = false;
    langToggle.style.opacity = '1';
  }
}

// ============================================
// Render Functions
// ============================================

function renderAll() {
  renderNav();
  renderHero();
  renderAbout();
  renderSkills();
  renderProjects();
  renderEducation();
  renderContact();
  renderFooter();
}

// Render Navigation
function renderNav() {
  const nav = appData.nav;
  const navLinks = document.querySelectorAll('.nav-link');

  navLinks.forEach(link => {
    const key = link.dataset.nav;
    if (nav[key]) {
      link.textContent = nav[key];
    }
  });
}

// Render Hero Section
function renderHero() {
  const { profile } = appData;

  document.getElementById('avatar').src = profile.avatar;
  document.getElementById('name').textContent = profile.name;
  document.getElementById('title').textContent = profile.title;
  document.getElementById('intro').textContent = profile.intro;

  // Update CTA buttons
  const btns = document.querySelectorAll('.hero-cta .btn');
  if (currentLang === 'cn') {
    btns[0].textContent = '查看项目';
    btns[1].textContent = '联系我';
  } else {
    btns[0].textContent = 'View Projects';
    btns[1].textContent = 'Contact Me';
  }
}

// Render About Section
function renderAbout() {
  const { profile } = appData;

  document.getElementById('bio').textContent = profile.bio;

  const tagsHTML = profile.tags.map(tag =>
    `<span class="tag">${tag}</span>`
  ).join('');

  document.getElementById('tags').innerHTML = tagsHTML;
}

// Render Skills Section
function renderSkills() {
  const { skills } = appData;

  const skillsHTML = skills.map(skill => `
    <div class="skill-card">
      <div class="skill-header">
        <div class="skill-icon">
          <ion-icon name="${skill.icon}"></ion-icon>
        </div>
        <div class="skill-title">
          <div class="skill-name">${skill.category}</div>
          <div class="skill-level">${skill.level}</div>
        </div>
      </div>
      <div class="skill-progress">
        <div class="skill-progress-bar" data-progress="${skill.proficiency}" style="width: 0%"></div>
      </div>
      <div class="skill-description">${skill.description}</div>
      <div class="skill-technologies">
        ${skill.technologies.map(tech => `<span class="tech-tag">${tech}</span>`).join('')}
      </div>
    </div>
  `).join('');

  document.getElementById('skills-grid').innerHTML = skillsHTML;

  // Animate progress bars
  setTimeout(() => {
    document.querySelectorAll('.skill-progress-bar').forEach(bar => {
      const progress = bar.dataset.progress;
      bar.style.width = `${progress}%`;
    });
  }, 100);
}

// Render Projects Section
function renderProjects() {
  const { projects } = appData;

  const projectsHTML = projects.map(project => `
    <div class="project-card">
      <div class="project-header">
        <div>
          <a href="${project.link}" target="_blank" class="project-name">
            ${project.name}
          </a>
          <div class="project-meta">
            <span>
              <ion-icon name="business-outline"></ion-icon>
              ${project.company}
            </span>
            <span>
              <ion-icon name="person-outline"></ion-icon>
              ${project.role}
            </span>
          </div>
        </div>
        <div class="project-period">${project.period}</div>
      </div>

      <div class="project-description">${project.description}</div>

      ${project.responsibilities ? `
        <div class="project-responsibilities">
          <h4>${currentLang === 'cn' ? '职责：' : 'Responsibilities:'}</h4>
          <ul>
            ${project.responsibilities.map(resp => `<li>${resp}</li>`).join('')}
          </ul>
        </div>
      ` : ''}

      ${project.achievements ? `
        <div class="project-achievements">
          <h4>${currentLang === 'cn' ? '成果：' : 'Achievements:'}</h4>
          <p>${project.achievements}</p>
        </div>
      ` : ''}

      <div class="project-technologies">
        ${project.technologies.map(tech => `<span class="tech-tag">${tech}</span>`).join('')}
      </div>
    </div>
  `).join('');

  document.getElementById('projects-timeline').innerHTML = projectsHTML;
}

// Render Education Section
function renderEducation() {
  const { education } = appData;

  const educationHTML = education.education.map(edu => `
    <div class="education-item">
      <div class="education-header">
        <div>
          <div class="education-degree">${edu.degree} | ${edu.university}</div>
          <div class="education-university">${edu.college}</div>
          <div class="education-major">${edu.major}</div>
        </div>
        <div class="education-period">${edu.period}</div>
      </div>
    </div>
  `).join('');

  document.getElementById('education-list').innerHTML = educationHTML;

  const campusHTML = education.campus.map(camp => `
    <div class="campus-item">
      <div class="campus-header">
        <div>
          <div class="campus-org">${camp.organization}${camp.department ? ` · ${camp.department}` : ''}</div>
          <div class="campus-position">${camp.position}</div>
        </div>
        <div class="campus-period">${camp.period}</div>
      </div>
      <div class="campus-description">${camp.description}</div>
    </div>
  `).join('');

  document.getElementById('campus-list').innerHTML = campusHTML;

  // Update subsection title
  const subsectionTitle = document.querySelector('#education .subsection-title');
  if (subsectionTitle) {
    subsectionTitle.textContent = currentLang === 'cn' ? '校园经历' : 'Campus Experience';
  }
}

// Render Contact Section
function renderContact() {
  const { profile } = appData;

  document.getElementById('contact-email').textContent = profile.contact.email;
  document.getElementById('contact-phone').textContent = profile.contact.phone;

  const githubLink = document.getElementById('contact-github');
  githubLink.href = profile.contact.github;
  githubLink.textContent = 'GGyongfeng';

  const websiteLink = document.getElementById('contact-website');
  websiteLink.href = profile.contact.website;
  websiteLink.textContent = profile.contact.website.replace('https://', '');

  // Update contact item titles
  const titles = document.querySelectorAll('.contact-item h3');
  if (currentLang === 'cn') {
    titles[0].textContent = '邮箱';
    titles[1].textContent = '电话';
    titles[2].textContent = 'GitHub';
    titles[3].textContent = '网站';
  } else {
    titles[0].textContent = 'Email';
    titles[1].textContent = 'Phone';
    titles[2].textContent = 'GitHub';
    titles[3].textContent = 'Website';
  }

  // Render other info
  const other = profile.other;
  const otherLabels = currentLang === 'cn'
    ? ['政治身份', '个人优势', '奖项荣誉', '语言能力']
    : ['Political Status', 'Strengths', 'Awards', 'Language'];

  const otherValues = [
    other.political,
    other.advantages,
    other.awards,
    other.language
  ];

  const otherHTML = otherLabels.map((label, index) => `
    <div class="other-item">
      <strong>${label}</strong>
      <p>${otherValues[index]}</p>
    </div>
  `).join('');

  document.getElementById('other-info').innerHTML = otherHTML;
}

// Render Footer
function renderFooter() {
  const { profile } = appData;

  document.getElementById('footer-github').href = profile.contact.github;
  document.getElementById('footer-website').href = profile.contact.website;
}

// ============================================
// Scroll Animations
// ============================================

function addScrollAnimations() {
  const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -100px 0px'
  };

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.style.opacity = '1';
        entry.target.style.transform = 'translateY(0)';
      }
    });
  }, observerOptions);

  // Observe all sections except hero
  document.querySelectorAll('.section').forEach(section => {
    section.style.opacity = '0';
    section.style.transform = 'translateY(30px)';
    section.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
    observer.observe(section);
  });
}
