const menuBtn=document.querySelector('.hamburger');const navLinks=document.querySelector('.nav-links');if(menuBtn){menuBtn.addEventListener('click',()=>navLinks.classList.toggle('open'))}
document.querySelectorAll('.nav-links a').forEach(a=>{if(a.href===location.href)a.classList.add('active')});
const revealEls=document.querySelectorAll('.reveal,.reveal-left,.reveal-right');const io=new IntersectionObserver(entries=>{entries.forEach(e=>{if(e.isIntersecting){e.target.classList.add('show');io.unobserve(e.target)}})},{threshold:.12});revealEls.forEach(el=>io.observe(el));
document.querySelectorAll('[data-count]').forEach(el=>{let done=false;const obs=new IntersectionObserver(es=>{if(es[0].isIntersecting&&!done){done=true;let end=+el.dataset.count,cur=0,step=Math.ceil(end/60);const t=setInterval(()=>{cur+=step;if(cur>=end){cur=end;clearInterval(t)}el.textContent=cur+'+'},25)}},{threshold:.7});obs.observe(el)});
let slideIndex=0;const slides=document.querySelector('.slides');const dots=document.querySelectorAll('.dot');function showSlide(i){if(!slides)return;slideIndex=i;slides.style.transform=`translateX(-${i*100}%)`;dots.forEach((d,idx)=>d.classList.toggle('active',idx===i))}dots.forEach((d,i)=>d.addEventListener('click',()=>showSlide(i)));if(slides){setInterval(()=>showSlide((slideIndex+1)%dots.length),3800)}

// ===== Final premium interaction layer =====
const header = document.querySelector('.header');
function updateHeader(){
  if(!header) return;
  header.classList.toggle('scrolled', window.scrollY > 35);
}
updateHeader();
window.addEventListener('scroll', updateHeader, {passive:true});

// close mobile menu after clicking a link
if(navLinks){
  document.querySelectorAll('.nav-links a').forEach(link=>{
    link.addEventListener('click',()=>navLinks.classList.remove('open'));
  });
}

// add automatic reveal classes to common elements if any page misses them
const autoRevealSelectors = '.card, .split-img, .section-title, .section-lead, .eyebrow, .form, .map';
document.querySelectorAll(autoRevealSelectors).forEach((el)=>{
  if(!el.classList.contains('reveal') && !el.classList.contains('reveal-left') && !el.classList.contains('reveal-right')){
    el.classList.add('reveal');
    io.observe(el);
  }
});

// 3D tilt effect for cards on desktop
const canTilt = window.matchMedia('(min-width: 992px)').matches;
if(canTilt){
  document.querySelectorAll('.card').forEach(card=>{
    card.addEventListener('mousemove',(e)=>{
      const r = card.getBoundingClientRect();
      const x = e.clientX - r.left;
      const y = e.clientY - r.top;
      const rotateY = ((x / r.width) - .5) * 6;
      const rotateX = ((y / r.height) - .5) * -6;
      card.style.transform = `translateY(-12px) scale(1.015) rotateX(${rotateX}deg) rotateY(${rotateY}deg)`;
    });
    card.addEventListener('mouseleave',()=>{
      card.style.transform = '';
    });
  });
}


// ===== Stackly role-based login/signup and dashboards =====
function stacklyNameFromEmail(email){
  const prefix=(email||'User').split('@')[0].replace(/[._-]+/g,' ');
  return prefix.replace(/\b\w/g, c=>c.toUpperCase());
}
const loginForm=document.getElementById('loginForm');
if(loginForm){
  loginForm.addEventListener('submit',(e)=>{
    e.preventDefault();
    const role=document.getElementById('loginRole').value;
    const email=document.getElementById('loginEmail').value.trim();
    localStorage.setItem('stacklyUserEmail', email || (role==='admin'?'admin@stackly.com':'user@stackly.com'));
    localStorage.setItem('stacklyUserName', stacklyNameFromEmail(email));
    localStorage.setItem('stacklyRole', role);
    window.location.href = role==='admin' ? 'admin-dashboard.html' : 'user-dashboard.html';
  });
}
const signupForm=document.getElementById('signupForm');
if(signupForm){
  signupForm.addEventListener('submit',(e)=>{
    e.preventDefault();
    const pass=document.getElementById('signupPassword').value;
    const confirm=document.getElementById('confirmPassword').value;
    if(pass!==confirm){alert('Password and confirm password must match.');return;}
    const role=document.getElementById('signupRole').value;
    const email=document.getElementById('signupEmail').value.trim();
    const name=stacklyNameFromEmail(email);
    localStorage.setItem('stacklyUserEmail', email || 'user@stackly.com');
    localStorage.setItem('stacklyUserName', name);
    localStorage.setItem('stacklyRole', role);
    window.location.href = 'login.html';
  });
}
document.querySelectorAll('.toggle-password').forEach(btn=>{
  btn.addEventListener('click',()=>{
    const input=btn.parentElement.querySelector('input');
    input.type=input.type==='password'?'text':'password';
  });
});
if(document.body.classList.contains('dashboard-page')){
  const name=localStorage.getItem('stacklyUserName') || 'Dhamu';
  const email=localStorage.getItem('stacklyUserEmail') || 'dhamu@gmail.com';
  const n=document.getElementById('dashName'); const em=document.getElementById('dashEmail'); const topEm=document.getElementById('topEmail');
  if(n)n.textContent=name; if(em)em.textContent=email; if(topEm)topEm.textContent=email;
  document.querySelectorAll('.dash-menu a').forEach(link=>{
    link.addEventListener('click',()=>{
      document.querySelectorAll('.dash-menu a').forEach(a=>a.classList.remove('active'));
      document.querySelectorAll('.dash-panel').forEach(p=>p.classList.remove('active'));
      link.classList.add('active');
      const panel=document.getElementById(link.dataset.panel);
      if(panel) panel.classList.add('active');
    });
  });
  document.querySelectorAll('.logout-btn').forEach(btn=>btn.addEventListener('click',()=>{ window.location.href='index.html'; }));
  // Dashboard mobile hamburger is handled by the reliable handler below.
}



// ===== Stackly launch + logo-only premium loader =====
(function(){
  const LOGO_PATH = 'assets/logo/stackly-logo.webp';

  const loader = document.createElement('div');
  loader.className = 'stackly-loader hide';
  loader.innerHTML = `
    <div class="loader-orbit-card" role="status" aria-live="polite">
      <div class="loader-orbit">
        <span class="orbit-dot dot-one"></span>
        <span class="orbit-dot dot-two"></span>
        <span class="orbit-dot dot-three"></span>
        <div class="loader-brand-core">
          <img src="${LOGO_PATH}" alt="Stackly">
        </div>
      </div>
      <h3>Stackly</h3>
      <p>Preparing your SaaS workspace...</p>
    </div>`;
  document.body.prepend(loader);

  function showLoader(){
    loader.classList.remove('hide');
    document.body.classList.add('loader-active');
  }

  function hideLoader(){
    loader.classList.add('hide');
    document.body.classList.remove('loader-active');
  }

  window.stacklyShowLoader = showLoader;

  // Show loading only on first website launch in this browser tab/session
  const launchKey = 'stacklyLaunchLoaderShown';
  if(!sessionStorage.getItem(launchKey)){
    showLoader();
    sessionStorage.setItem(launchKey, 'true');
    window.addEventListener('load',()=>setTimeout(hideLoader,3000));
  }else{
    hideLoader();
  }

  // Logo click only: show loader for 3 sec, then refresh the CURRENT page.
  // Example: About logo -> reload About, Admin dashboard logo -> reload Admin dashboard.
  document.querySelectorAll('a.logo, a.dash-logo, .footer-brand').forEach(link=>{
    link.addEventListener('click',(e)=>{
      e.preventDefault();
      showLoader();
      setTimeout(()=>location.reload(),3000);
    });
  });
})();

// ===== Mobile menu action buttons fix (Login + Get Started inside hamburger menu only) =====
(function(){
  const navLinks = document.querySelector('.nav-links');
  const hamburger = document.querySelector('.hamburger');
  if(!navLinks || !hamburger) return;

  if(!navLinks.querySelector('.mobile-menu-actions')){
    const actions = document.createElement('div');
    actions.className = 'mobile-menu-actions';
    actions.innerHTML = `
      <a class="btn btn-light" href="login.html">Login</a>
      <a class="btn btn-primary" href="signup.html">Get Started</a>
    `;
    navLinks.appendChild(actions);
  }

  hamburger.addEventListener('click',()=>{
    document.body.classList.toggle('mobile-menu-open', navLinks.classList.contains('open'));
    const icon = hamburger.querySelector('i');
    if(icon){
      icon.className = navLinks.classList.contains('open') ? 'fa-solid fa-xmark' : 'fa-solid fa-bars';
    }
  });

  navLinks.querySelectorAll('a').forEach(link=>{
    link.addEventListener('click',()=>{
      document.body.classList.remove('mobile-menu-open');
      const icon = hamburger.querySelector('i');
      if(icon) icon.className = 'fa-solid fa-bars';
    });
  });
})();

// ===== Requested final fixes: required contact forms + dashboard mobile menu behavior =====
document.querySelectorAll('.redirect-404-form').forEach(form => {
  form.addEventListener('submit', (e) => {
    e.preventDefault();
    if (form.checkValidity()) {
      window.location.href = '404.html';
    } else {
      form.reportValidity();
    }
  });
});

// Dashboard mobile: after selecting one sidebar menu, close sidebar and show only selected panel.
if (document.body.classList.contains('dashboard-page')) {
  document.querySelectorAll('.dash-menu a').forEach(link => {
    link.addEventListener('click', () => {
      if (window.matchMedia('(max-width: 991px)').matches) {
        document.body.classList.remove('sidebar-open');
      }
    });
  });
}

// ===== FINAL FIX ONLY: reliable mobile hamburger for admin/user dashboards =====
(function(){
  if(!document.body.classList.contains('dashboard-page')) return;

  const sidebar = document.querySelector('.dash-sidebar');
  const toggle = document.querySelector('.dash-toggle');
  const menuLinks = document.querySelectorAll('.dash-menu a[data-panel]');
  if(!sidebar || !toggle) return;

  let backdrop = document.querySelector('.dash-backdrop');
  if(!backdrop){
    backdrop = document.createElement('div');
    backdrop.className = 'dash-backdrop';
    document.body.appendChild(backdrop);
  }

  if(!sidebar.querySelector('.dash-sidebar-mobile-close')){
    const closeBtn = document.createElement('button');
    closeBtn.type = 'button';
    closeBtn.className = 'dash-sidebar-mobile-close';
    closeBtn.setAttribute('aria-label','Close dashboard menu');
    closeBtn.innerHTML = '<i class="fa-solid fa-xmark"></i>';
    sidebar.prepend(closeBtn);
  }

  const closeSidebar = () => {
    document.body.classList.remove('sidebar-open');
    const icon = toggle.querySelector('i');
    if(icon) icon.className = 'fa-solid fa-bars';
  };

  const openSidebar = () => {
    document.body.classList.add('sidebar-open');
    const icon = toggle.querySelector('i');
    if(icon) icon.className = 'fa-solid fa-xmark';
  };

  toggle.addEventListener('click', (e) => {
    e.preventDefault();
    e.stopPropagation();
    document.body.classList.contains('sidebar-open') ? closeSidebar() : openSidebar();
  });

  backdrop.addEventListener('click', closeSidebar);
  sidebar.querySelector('.dash-sidebar-mobile-close').addEventListener('click', closeSidebar);

  menuLinks.forEach(link => {
    link.addEventListener('click', (e) => {
      e.preventDefault();

      const targetId = link.getAttribute('data-panel');
      document.querySelectorAll('.dash-menu a').forEach(item => item.classList.remove('active'));
      document.querySelectorAll('.dash-panel').forEach(panel => panel.classList.remove('active'));

      link.classList.add('active');
      const targetPanel = document.getElementById(targetId);
      if(targetPanel) targetPanel.classList.add('active');

      if(window.matchMedia('(max-width: 991px)').matches){
        closeSidebar();
        window.scrollTo({top:0, behavior:'smooth'});
      }
    });
  });
})();
