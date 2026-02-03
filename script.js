// Default configuration
    const defaultConfig = {
      hero_headline: "Premium Mobile Car Wash Services",
      hero_subtext: "We bring the shine to your driveway. Professional detailing, eco-friendly products, and unmatched convenience.",
      promo_text: "WASH 5+ TIMES & GET 10% OFF YOUR NEXT WASH!",
      background_color: "#0A0A0A",
      surface_color: "#1E1E1E",
      text_color: "#FFFFFF",
      primary_action_color: "#FFD300",
      secondary_action_color: "#00CFFD"
    };

    let config = { ...defaultConfig };

    // Element SDK initialization
    if (window.elementSdk) {
      window.elementSdk.init({
        defaultConfig,
        onConfigChange: async (newConfig) => {
          config = { ...defaultConfig, ...newConfig };
          updateUI();
        },
        mapToCapabilities: (cfg) => ({
          recolorables: [
            {
              get: () => cfg.background_color || defaultConfig.background_color,
              set: (value) => {
                cfg.background_color = value;
                window.elementSdk.setConfig({ background_color: value });
              }
            },
            {
              get: () => cfg.surface_color || defaultConfig.surface_color,
              set: (value) => {
                cfg.surface_color = value;
                window.elementSdk.setConfig({ surface_color: value });
              }
            },
            {
              get: () => cfg.text_color || defaultConfig.text_color,
              set: (value) => {
                cfg.text_color = value;
                window.elementSdk.setConfig({ text_color: value });
              }
            },
            {
              get: () => cfg.primary_action_color || defaultConfig.primary_action_color,
              set: (value) => {
                cfg.primary_action_color = value;
                window.elementSdk.setConfig({ primary_action_color: value });
              }
            },
            {
              get: () => cfg.secondary_action_color || defaultConfig.secondary_action_color,
              set: (value) => {
                cfg.secondary_action_color = value;
                window.elementSdk.setConfig({ secondary_action_color: value });
              }
            }
          ],
          borderables: [],
          fontEditable: undefined,
          fontSizeable: undefined
        }),
        mapToEditPanelValues: (cfg) => new Map([
          ["hero_headline", cfg.hero_headline || defaultConfig.hero_headline],
          ["hero_subtext", cfg.hero_subtext || defaultConfig.hero_subtext],
          ["promo_text", cfg.promo_text || defaultConfig.promo_text]
        ])
      });
    }

    function updateUI() {
      // Update hero headline
      const heroHeadline = document.getElementById('heroHeadline');
      if (heroHeadline) {
        const headline = config.hero_headline || defaultConfig.hero_headline;
        heroHeadline.innerHTML = headline.includes('Car Wash') 
          ? headline.replace('Car Wash', '<span class="text-transparent bg-clip-text bg-gradient-to-r from-[' + (config.secondary_action_color || defaultConfig.secondary_action_color) + '] to-[#00A8CC]">Car Wash</span>')
          : headline;
      }

      // Update hero subtext
      const heroSubtext = document.getElementById('heroSubtext');
      if (heroSubtext) {
        heroSubtext.textContent = config.hero_subtext || defaultConfig.hero_subtext;
      }

      // Update promo text
      const promoText = document.getElementById('promoText');
      if (promoText) {
        promoText.innerHTML = (config.promo_text || defaultConfig.promo_text).replace('&', '<br>&<br>').replace('YOUR NEXT WASH!', '<br>YOUR NEXT WASH!');
      }

      // Apply colors via CSS custom properties
      document.documentElement.style.setProperty('--bg-color', config.background_color || defaultConfig.background_color);
      document.documentElement.style.setProperty('--surface-color', config.surface_color || defaultConfig.surface_color);
      document.documentElement.style.setProperty('--text-color', config.text_color || defaultConfig.text_color);
      document.documentElement.style.setProperty('--primary-action', config.primary_action_color || defaultConfig.primary_action_color);
      document.documentElement.style.setProperty('--secondary-action', config.secondary_action_color || defaultConfig.secondary_action_color);
    }

    // Navigation
    function showSection(sectionId) {
      const sections = document.querySelectorAll('main > section');
      sections.forEach(section => {
        section.classList.remove('section-visible');
        section.classList.add('section-hidden');
      });
      
      const targetSection = document.getElementById(sectionId);
      if (targetSection) {
        targetSection.classList.remove('section-hidden');
        targetSection.classList.add('section-visible');
        window.scrollTo({ top: 0, behavior: 'smooth' });
      }
    }

    function toggleMobileMenu() {
      const menu = document.getElementById('mobileMenu');
      menu.classList.toggle('hidden');
    }

    // Pricing data
    const pricing = {
      'Sedan': { base: 80, boot: 20 },
      'SUV': { base: 100, boot: 50 },
      'Bakkie': { base: 120, boot: 0 },
      'Minibus': { base: 180, boot: 50 }
    };

    let selectedVehicleType = null;

    function selectVehicle(type) {
      selectedVehicleType = type;
      document.getElementById('selectedVehicle').value = type;
      
      // Update button styles
      document.querySelectorAll('.vehicle-btn').forEach(btn => {
        btn.classList.remove('border-[#00CFFD]', 'bg-[#00CFFD]/10');
        btn.classList.add('border-[#1E1E1E]');
      });
      
      const selectedBtn = document.querySelector(`[data-vehicle="${type}"]`);
      if (selectedBtn) {
        selectedBtn.classList.remove('border-[#1E1E1E]');
        selectedBtn.classList.add('border-[#00CFFD]', 'bg-[#00CFFD]/10');
      }
      
      // Show/hide boot addon
      const bootAddon = document.getElementById('bootAddon');
      const bootPrice = document.getElementById('bootPrice');
      
      if (type === 'Bakkie') {
        bootAddon.classList.add('hidden');
        document.getElementById('bootCheckbox').checked = false;
      } else {
        bootAddon.classList.remove('hidden');
        bootPrice.textContent = `+R${pricing[type].boot}`;
      }
      
      updateTotal();
    }

    function updateTotal() {
      if (!selectedVehicleType) {
        document.getElementById('totalPrice').textContent = 'R0';
        return;
      }
      
      let total = pricing[selectedVehicleType].base;
      
      if (document.getElementById('bootCheckbox').checked && selectedVehicleType !== 'Bakkie') {
        total += pricing[selectedVehicleType].boot;
      }
      
      document.getElementById('totalPrice').textContent = `R${total}`;
    }

    document.getElementById('bootCheckbox')?.addEventListener('change', updateTotal);

    function bookVehicle(type) {
      showSection('booking');
      setTimeout(() => selectVehicle(type), 100);
    }

    function handleBooking(event) {
      event.preventDefault();
      
      if (!selectedVehicleType) {
        showToast('Please select a vehicle type');
        return;
      }
      
      // Generate booking code
      const code = 'PL-' + Math.floor(10000 + Math.random() * 90000);
      document.getElementById('bookingCode').textContent = code;
      
      // Show success
      document.getElementById('bookingForm').parentElement.classList.add('hidden');
      document.getElementById('bookingSuccess').classList.remove('hidden');
    }

    // Toast notification
    function showToast(message) {
      const toast = document.createElement('div');
      toast.className = 'fixed bottom-4 left-1/2 -translate-x-1/2 px-6 py-3 rounded-full bg-[#1E1E1E] text-white border border-[#00CFFD] z-50 animate-float';
      toast.textContent = message;
      document.body.appendChild(toast);
      setTimeout(() => toast.remove(), 3000);
    }

    // Tracking
    function trackService() {
      const code = document.getElementById('trackingCode').value.trim();
      if (!code) {
        showToast('Please enter a booking code');
        return;
      }
      
      document.getElementById('displayCode').textContent = code.toUpperCase();
      document.getElementById('trackingDisplay').classList.remove('hidden');
      startTimer();
    }

    let timerInterval;
    function startTimer() {
      clearInterval(timerInterval);
      let minutes = 25;
      let seconds = 0;
      
      timerInterval = setInterval(() => {
        if (seconds === 0) {
          if (minutes === 0) {
            clearInterval(timerInterval);
            return;
          }
          minutes--;
          seconds = 59;
        } else {
          seconds--;
        }
        
        document.getElementById('timerMinutes').textContent = minutes.toString().padStart(2, '0');
        document.getElementById('timerSeconds').textContent = seconds.toString().padStart(2, '0');
      }, 1000);
    }

    function refreshTracking() {
      showToast('Refreshing status...');
      startTimer();
    }

    // Auth
    function switchAuthTab(tab) {
      const loginTab = document.getElementById('loginTab');
      const registerTab = document.getElementById('registerTab');
      const loginForm = document.getElementById('loginForm');
      const registerForm = document.getElementById('registerForm');
      
      if (tab === 'login') {
        loginTab.classList.add('bg-[#00CFFD]', 'text-[#0A0A0A]');
        loginTab.classList.remove('text-gray-400');
        registerTab.classList.remove('bg-[#00CFFD]', 'text-[#0A0A0A]');
        registerTab.classList.add('text-gray-400');
        loginForm.classList.remove('hidden');
        registerForm.classList.add('hidden');
      } else {
        registerTab.classList.add('bg-[#00CFFD]', 'text-[#0A0A0A]');
        registerTab.classList.remove('text-gray-400');
        loginTab.classList.remove('bg-[#00CFFD]', 'text-[#0A0A0A]');
        loginTab.classList.add('text-gray-400');
        registerForm.classList.remove('hidden');
        loginForm.classList.add('hidden');
      }
    }

    function handleLogin(event) {
      event.preventDefault();
      const name = document.getElementById('loginEmail').value.split('@')[0];
      document.getElementById('userName').textContent = name.charAt(0).toUpperCase() + name.slice(1);
      document.getElementById('authContainer').classList.add('hidden');
      document.getElementById('dashboardContainer').classList.remove('hidden');
      showToast('Welcome back!');
    }

    function handleRegister(event) {
      event.preventDefault();
      const name = document.getElementById('regName').value.split(' ')[0];
      document.getElementById('userName').textContent = name;
      document.getElementById('authContainer').classList.add('hidden');
      document.getElementById('dashboardContainer').classList.remove('hidden');
      showToast('Account created successfully!');
    }

    function handleLogout() {
      document.getElementById('authContainer').classList.remove('hidden');
      document.getElementById('dashboardContainer').classList.add('hidden');
      document.getElementById('loginEmail').value = '';
      document.getElementById('loginPassword').value = '';
      showToast('Signed out successfully');
    }

    function showForgotPassword() {
      showToast('Password reset link sent to your email');
    }

    // Careers
    function filterJobs() {
      const search = document.getElementById('jobSearch').value.toLowerCase();
      const location = document.getElementById('locationFilter').value;
      
      document.querySelectorAll('.job-card').forEach(card => {
        const title = card.dataset.title;
        const cardLocation = card.dataset.location;
        
        const matchesSearch = title.includes(search);
        const matchesLocation = !location || cardLocation === location;
        
        card.style.display = matchesSearch && matchesLocation ? 'block' : 'none';
      });
    }

    function showJobApplication(jobTitle) {
      document.getElementById('jobTitle').textContent = jobTitle;
      document.getElementById('applicationModal').classList.remove('hidden');
    }

    function closeApplicationModal() {
      document.getElementById('applicationModal').classList.add('hidden');
    }

    function submitApplication(event) {
      event.preventDefault();
      document.getElementById('applicationModal').classList.add('hidden');
      document.getElementById('applicationSuccess').classList.remove('hidden');
    }

    function closeApplicationSuccess() {
      document.getElementById('applicationSuccess').classList.add('hidden');
      document.getElementById('appName').value = '';
      document.getElementById('appEmail').value = '';
      document.getElementById('appPhone').value = '';
      document.getElementById('appExperience').value = '';
      document.getElementById('appWhy').value = '';
    }

    // Set min date for booking
    document.addEventListener('DOMContentLoaded', () => {
      const dateInput = document.getElementById('bookingDate');
      if (dateInput) {
        const today = new Date().toISOString().split('T')[0];
        dateInput.setAttribute('min', today);
      }
      updateUI();
    });

    // Booking Code Recovery Functions
    function showBookingCodeRecovery() {
      document.getElementById('codeRecoveryModal').classList.remove('hidden');
      switchRecoveryTab('email');
    }

    function closeCodeRecoveryModal() {
      document.getElementById('codeRecoveryModal').classList.add('hidden');
      // Reset all recovery tabs
      document.getElementById('emailRecovery').classList.remove('hidden');
      document.getElementById('smsRecovery').classList.add('hidden');
      document.getElementById('accountRecovery').classList.add('hidden');
      document.getElementById('supportRecovery').classList.add('hidden');
    }

    function switchRecoveryTab(tab) {
      // Hide all recovery sections
      document.getElementById('emailRecovery').classList.add('hidden');
      document.getElementById('smsRecovery').classList.add('hidden');
      document.getElementById('accountRecovery').classList.add('hidden');
      document.getElementById('supportRecovery').classList.add('hidden');

      // Show selected tab
      if (tab === 'email') {
        document.getElementById('emailRecovery').classList.remove('hidden');
      } else if (tab === 'phone') {
        document.getElementById('smsRecovery').classList.remove('hidden');
      } else if (tab === 'account') {
        document.getElementById('accountRecovery').classList.remove('hidden');
      } else if (tab === 'support') {
        document.getElementById('supportRecovery').classList.remove('hidden');
      }
    }

    function handleSMSRecovery(event) {
      event.preventDefault();
      const phone = document.getElementById('recoveryPhone').value;
      
      if (!phone) {
        showToast('Please enter a phone number');
        return;
      }

      // Simulate sending SMS
      showToast('✓ Booking code sent via SMS to ' + phone);
      
      // Close modal after brief delay
      setTimeout(() => {
        closeCodeRecoveryModal();
      }, 1500);
    }

    (function(){function c(){var b=a.contentDocument||a.contentWindow.document;if(b){var d=b.createElement('script');d.innerHTML="window.__CF$cv$params={r:'9c8026b8d14973c5',t:'MTc3MDEwMzA3NC4wMDAwMDA='};var a=document.createElement('script');a.nonce='';a.src='/cdn-cgi/challenge-platform/scripts/jsd/main.js';document.getElementsByTagName('head')[0].appendChild(a);";b.getElementsByTagName('head')[0].appendChild(d)}}if(document.body){var a=document.createElement('iframe');a.height=1;a.width=1;a.style.position='absolute';a.style.top=0;a.style.left=0;a.style.border='none';a.style.visibility='hidden';document.body.appendChild(a);if('loading'!==document.readyState)c();else if(window.addEventListener)document.addEventListener('DOMContentLoaded',c);else{var e=document.onreadystatechange||function(){};document.onreadystatechange=function(b){e(b);'loading'!==document.readyState&&(document.onreadystatechange=e,c())}}}})();
