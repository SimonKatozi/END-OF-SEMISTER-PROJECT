/**
 * Katozi Logistics - Core Interactive Application Script
 * Fast · Safe · Trusted Logistics & Customs Clearing
 */

document.addEventListener('DOMContentLoaded', () => {
    initMobileNav();
    initStickyHeader();
    initActiveNavLinks();
    initCounters();
    initShipmentTracker();
    initFreightCalculator();
    initFaqAccordion();
    initContactForm();
    initWhatsAppFloat();
    initBackToTop();
});

/* -------------------------------------------------------------
 * 1. Mobile Navigation & Drawer
 * ------------------------------------------------------------- */
function initMobileNav() {
    const toggleBtn = document.getElementById('mobileNavToggle');
    const navLinks = document.getElementById('primaryNavigation');
    const header = document.querySelector('.site-header');

    if (!toggleBtn || !navLinks) return;

    toggleBtn.addEventListener('click', () => {
        const isOpen = navLinks.classList.toggle('nav-open');
        toggleBtn.classList.toggle('is-active', isOpen);
        toggleBtn.setAttribute('aria-expanded', isOpen ? 'true' : 'false');
        document.body.classList.toggle('no-scroll', isOpen);
    });

    // Close on clicking outside
    document.addEventListener('click', (e) => {
        if (!header.contains(e.target) && navLinks.classList.contains('nav-open')) {
            navLinks.classList.remove('nav-open');
            toggleBtn.classList.remove('is-active');
            toggleBtn.setAttribute('aria-expanded', 'false');
            document.body.classList.remove('no-scroll');
        }
    });

    // Close on clicking any link inside mobile nav
    navLinks.querySelectorAll('a').forEach(link => {
        link.addEventListener('click', () => {
            navLinks.classList.remove('nav-open');
            toggleBtn.classList.remove('is-active');
            toggleBtn.setAttribute('aria-expanded', 'false');
            document.body.classList.remove('no-scroll');
        });
    });
}

/* -------------------------------------------------------------
 * 2. Sticky Header Elevation on Scroll
 * ------------------------------------------------------------- */
function initStickyHeader() {
    const header = document.querySelector('.site-header');
    if (!header) return;

    window.addEventListener('scroll', () => {
        if (window.scrollY > 20) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }
    }, { passive: true });
}

/* -------------------------------------------------------------
 * 3. Active Nav Link Highlighting
 * ------------------------------------------------------------- */
function initActiveNavLinks() {
    const currentPath = window.location.pathname.split('/').pop().toLowerCase() || 'index.html';
    const navLinks = document.querySelectorAll('.nav-links a');

    navLinks.forEach(link => {
        const href = link.getAttribute('href');
        if (!href) return;
        const page = href.split('#')[0].toLowerCase();
        
        if (page === currentPath || (currentPath === '' && page === 'index.html') || (currentPath === 'index.html' && page === 'index.html')) {
            link.classList.add('active');
        } else if (currentPath.includes('approach') && page.includes('approach')) {
            link.classList.add('active');
        } else {
            link.classList.remove('active');
        }
    });

    const navCta = document.querySelector('.nav-cta');
    if (navCta) {
        if (currentPath === 'contact.html') {
            navCta.classList.add('active');
        } else {
            navCta.classList.remove('active');
        }
    }
}

/* -------------------------------------------------------------
 * 4. Animated Metric Counters
 * ------------------------------------------------------------- */
function initCounters() {
    const counters = document.querySelectorAll('.stat-number[data-target]');
    if (!counters.length) return;

    const observer = new IntersectionObserver((entries, obs) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const counter = entry.target;
                const target = parseFloat(counter.getAttribute('data-target'));
                const prefix = counter.getAttribute('data-prefix') || '';
                const suffix = counter.getAttribute('data-suffix') || '';
                const decimals = counter.getAttribute('data-decimals') ? parseInt(counter.getAttribute('data-decimals')) : 0;
                const duration = 1800;
                const startTime = performance.now();

                function updateCount(currentTime) {
                    const elapsed = currentTime - startTime;
                    const progress = Math.min(elapsed / duration, 1);
                    // Ease out expo
                    const easeProgress = progress === 1 ? 1 : 1 - Math.pow(2, -10 * progress);
                    const currentVal = (target * easeProgress).toFixed(decimals);

                    counter.textContent = prefix + Number(currentVal).toLocaleString() + suffix;

                    if (progress < 1) {
                        requestAnimationFrame(updateCount);
                    } else {
                        counter.textContent = prefix + target.toLocaleString() + suffix;
                    }
                }

                requestAnimationFrame(updateCount);
                obs.unobserve(counter);
            }
        });
    }, { threshold: 0.25 });

    counters.forEach(c => observer.observe(c));
}

/* -------------------------------------------------------------
 * 5. Interactive Live Shipment Tracking Simulator
 * ------------------------------------------------------------- */
const SAMPLE_SHIPMENTS = {
    'KTZ-8924-EBB': {
        trackingNumber: 'KTZ-8924-EBB',
        status: 'In Transit - Customs Cleared',
        statusType: 'success',
        origin: 'Dubai Cargo Mega Terminal (DXB)',
        destination: 'Entebbe International Airport (EBB) / Kampala ICD',
        service: 'Express Air Freight & Customs Brokerage',
        carrier: 'Emirates SkyCargo / Katozi Ground Logistics',
        pieces: '14 Pallets (2,450 kg)',
        lastUpdate: 'Today at 08:30 AM EAT',
        estimatedDelivery: 'Tomorrow, 02:00 PM',
        steps: [
            { title: 'Cargo Picked Up & Export Manifest Created', location: 'Dubai Logistics City, UAE', date: '15 Nov 2026', time: '10:15 AM', done: true },
            { title: 'Departed DXB Terminal (Flight EK-729)', location: 'Dubai International Airport', date: '16 Nov 2026', time: '02:40 AM', done: true },
            { title: 'Arrived at Entebbe Cargo Terminal', location: 'Entebbe International Airport (EBB)', date: '16 Nov 2026', time: '07:15 AM', done: true },
            { title: 'URA Customs Cleared & Bond Release Issued', location: 'Katozi Entebbe Clearing Center', date: '18 Nov 2026', time: '08:30 AM', done: true },
            { title: 'Out for Final Delivery to Kampala Bonded ICD', location: 'Kampala Logistics Corridor', date: 'Pending', time: 'Est. Tomorrow', done: false }
        ]
    },
    'KTZ-4102-MBS': {
        trackingNumber: 'KTZ-4102-MBS',
        status: 'Port Cleared - Northern Corridor Transit',
        statusType: 'warning',
        origin: 'Ningbo-Zhoushan Port, China',
        destination: 'Kampala Inland Container Depot (ICD)',
        service: 'Ocean Freight 40ft High Cube Container (FCL)',
        carrier: 'Maersk Line / Katozi Heavy Haulage Fleet',
        pieces: '1 x 40ft HC (26,800 kg machinery)',
        lastUpdate: 'Today at 11:45 AM EAT',
        estimatedDelivery: '21 Nov 2026',
        steps: [
            { title: 'Container Loaded & Vessel Departure', location: 'Ningbo Port, China', date: '22 Oct 2026', time: '14:00', done: true },
            { title: 'Vessel Berthed at Kilindini Harbour', location: 'Mombasa Port, Kenya', date: '12 Nov 2026', time: '06:30', done: true },
            { title: 'Customs & Port Health Clearance Complete', location: 'Katozi Port Clearing Desk, Mombasa', date: '16 Nov 2026', time: '16:45', done: true },
            { title: 'Dispatched via Malaba Border Highway', location: 'Eldoret-Malaba Transit Road', date: '18 Nov 2026', time: '11:45', done: true },
            { title: 'Arrival & Offloading at Kampala Client Warehouse', location: 'Kampala Industrial Area', date: 'Pending', time: 'Est. 21 Nov', done: false }
        ]
    }
};

function initShipmentTracker() {
    const trackingForms = document.querySelectorAll('.tracking-form');
    const modal = document.getElementById('trackingModal');
    const modalCloseBtn = document.getElementById('closeTrackingModal');
    const modalContent = document.getElementById('trackingModalBody');

    if (!modal) return;

    function openTrackingModal(trackingId) {
        const cleanId = (trackingId || '').trim().toUpperCase();
        let shipment = SAMPLE_SHIPMENTS[cleanId];

        if (!shipment) {
            // Generate a smart dynamic shipment for custom numbers entered
            shipment = {
                trackingNumber: cleanId || 'KTZ-GEN-' + Math.floor(1000 + Math.random() * 9000),
                status: 'In Transit - Customs Processing',
                statusType: 'success',
                origin: 'International Port / Gateway',
                destination: 'Kampala Commercial Hub, Uganda',
                service: 'Integrated Multimodal Freight & Clearing',
                carrier: 'Katozi Global Logistics Network',
                pieces: 'Consolidated Commercial Cargo',
                lastUpdate: 'Updated 20 mins ago',
                estimatedDelivery: 'In 2 Business Days',
                steps: [
                    { title: 'Shipment Booked & Document Verification', location: 'Origin Gateway Facility', date: 'Completed', time: '10:00 AM', done: true },
                    { title: 'Export Customs Released & International Uplift', location: 'Air/Sea Hub', date: 'Completed', time: '04:30 PM', done: true },
                    { title: 'Arrival at Regional Customs Point', location: 'East Africa Corridors', date: 'Today', time: '09:15 AM', done: true },
                    { title: 'Uganda Revenue Authority (URA) Duty Assessment', location: 'Katozi Customs Clearance Office', date: 'Processing', time: 'In Progress', done: true },
                    { title: 'Final Dispatch to Client Warehouse', location: 'Destination Address', date: 'Scheduled', time: 'Pending Delivery', done: false }
                ]
            };
        }

        renderTrackingDetails(shipment, modalContent);
        modal.classList.add('is-open');
        document.body.classList.add('no-scroll');
    }

    trackingForms.forEach(form => {
        form.addEventListener('submit', (e) => {
            e.preventDefault();
            const input = form.querySelector('input[type="text"]');
            const id = input ? input.value : '';
            openTrackingModal(id);
        });
    });

    // Preset quick badges
    document.querySelectorAll('.preset-tracking-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            const id = btn.getAttribute('data-tracking');
            openTrackingModal(id);
        });
    });

    if (modalCloseBtn) {
        modalCloseBtn.addEventListener('click', () => {
            modal.classList.remove('is-open');
            document.body.classList.remove('no-scroll');
        });
    }

    modal.addEventListener('click', (e) => {
        if (e.target === modal) {
            modal.classList.remove('is-open');
            document.body.classList.remove('no-scroll');
        }
    });

    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && modal.classList.contains('is-open')) {
            modal.classList.remove('is-open');
            document.body.classList.remove('no-scroll');
        }
    });
}

function renderTrackingDetails(shipment, container) {
    if (!container) return;

    const stepsHtml = shipment.steps.map((s, idx) => `
        <div class="tracking-step ${s.done ? 'step-done' : 'step-pending'}">
            <div class="tracking-step-marker">
                <span class="step-dot">${s.done ? '✓' : idx + 1}</span>
            </div>
            <div class="tracking-step-body">
                <div class="tracking-step-header">
                    <h4>${escapeHtml(s.title)}</h4>
                    <span class="step-date">${escapeHtml(s.date)} · ${escapeHtml(s.time)}</span>
                </div>
                <p class="tracking-step-loc">${escapeHtml(s.location)}</p>
            </div>
        </div>
    `).join('');

    container.innerHTML = `
        <div class="tracking-result-box">
            <div class="tracking-top-badge-row">
                <span class="tracking-chip chip-${shipment.statusType}">
                    <span class="chip-pulse"></span>
                    ${escapeHtml(shipment.status)}
                </span>
                <span class="tracking-waybill">AWB / BL: <strong>${escapeHtml(shipment.trackingNumber)}</strong></span>
            </div>

            <div class="tracking-route-banner">
                <div class="route-point">
                    <span class="route-label">Origin</span>
                    <strong>${escapeHtml(shipment.origin)}</strong>
                </div>
                <div class="route-vector">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                        <path d="M5 12h14M13 5l7 7-7 7"/>
                    </svg>
                </div>
                <div class="route-point">
                    <span class="route-label">Destination</span>
                    <strong>${escapeHtml(shipment.destination)}</strong>
                </div>
            </div>

            <div class="tracking-meta-grid">
                <div class="meta-item">
                    <span class="meta-label">Service Type</span>
                    <span class="meta-val">${escapeHtml(shipment.service)}</span>
                </div>
                <div class="meta-item">
                    <span class="meta-label">Carrier & Unit</span>
                    <span class="meta-val">${escapeHtml(shipment.carrier)}</span>
                </div>
                <div class="meta-item">
                    <span class="meta-label">Cargo Weight / Vol</span>
                    <span class="meta-val">${escapeHtml(shipment.pieces)}</span>
                </div>
                <div class="meta-item">
                    <span class="meta-label">Est. Delivery</span>
                    <span class="meta-val highlight-val">${escapeHtml(shipment.estimatedDelivery)}</span>
                </div>
            </div>

            <h3 class="timeline-title">Shipment Progress Milestones</h3>
            <div class="tracking-timeline">
                ${stepsHtml}
            </div>

            <div class="tracking-cta-box">
                <div>
                    <strong>Need customs help or urgent clearance update?</strong>
                    <p>Speak directly with Katozi's Clearing Officers in Entebbe or Mombasa.</p>
                </div>
                <a href="https://wa.me/256744911327?text=Hello%20Katozi%20Logistics,%20I%20am%20enquiring%20about%20Shipment%20${encodeURIComponent(shipment.trackingNumber)}" 
                   target="_blank" rel="noopener noreferrer" class="button btn-whatsapp">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="18" height="18">
                        <path d="M20.2 11.7a8.2 8.2 0 0 1-12.1 7.2L3 20l1.2-4.9a8.2 8.2 0 1 1 16-3.4Z"/>
                    </svg>
                    WhatsApp Officer
                </a>
            </div>
        </div>
    `;
}

/* -------------------------------------------------------------
 * 6. Interactive Freight Cost & Transit Estimator
 * ------------------------------------------------------------- */
function initFreightCalculator() {
    const calcForm = document.getElementById('freightCalculatorForm');
    if (!calcForm) return;

    const modeSelect = document.getElementById('calcMode');
    const originSelect = document.getElementById('calcOrigin');
    const weightInput = document.getElementById('calcWeight');
    const weightValDisplay = document.getElementById('calcWeightDisplay');
    const resultBox = document.getElementById('calcResultBox');

    if (weightInput && weightValDisplay) {
        weightInput.addEventListener('input', () => {
            weightValDisplay.textContent = weightInput.value + ' kg';
            updateEstimate();
        });
    }

    [modeSelect, originSelect].forEach(el => {
        if (el) el.addEventListener('change', updateEstimate);
    });

    function updateEstimate() {
        if (!resultBox) return;

        const mode = modeSelect ? modeSelect.value : 'air';
        const origin = originSelect ? originSelect.value : 'dxb';
        const weight = weightInput ? parseInt(weightInput.value) || 100 : 100;

        let transitDays = '3 - 5 Days';
        let baseRatePerKg = 4.8;
        let iconSvg = '';
        let clearingEstimate = 'Included (Standard Declarations)';

        if (mode === 'air') {
            transitDays = (origin === 'dxb' || origin === 'nbo') ? '2 - 4 Business Days' : '3 - 6 Business Days';
            baseRatePerKg = 5.2;
            iconSvg = '✈️ Air Freight';
        } else if (mode === 'sea-fcl') {
            transitDays = '22 - 32 Days (via Mombasa Port)';
            baseRatePerKg = 1.6;
            iconSvg = '🚢 Ocean FCL (Full Container)';
        } else if (mode === 'sea-lcl') {
            transitDays = '28 - 38 Days (Consolidated CBM)';
            baseRatePerKg = 2.1;
            iconSvg = '📦 Ocean LCL (Shared Container)';
        } else if (mode === 'road') {
            transitDays = '2 - 5 Days (Cross-Border Haulage)';
            baseRatePerKg = 0.95;
            iconSvg = '🚛 Regional Road Transport';
        }

        const USD_TO_UGX = 3750;
        const estFreightTotalUgx = Math.round(weight * baseRatePerKg * USD_TO_UGX);

        resultBox.innerHTML = `
            <div class="calc-output-card">
                <div class="calc-output-header">
                    <span class="calc-badge">${iconSvg}</span>
                    <span class="calc-transit">⏱️ Estimated Transit: <strong>${transitDays}</strong></span>
                </div>
                <div class="calc-figures">
                    <div class="calc-fig-item">
                        <span class="fig-label">Estimated Freight Guide:</span>
                        <span class="fig-value"><small style="font-size: 0.95rem; font-weight: 700; color: #ffaa6e; margin-right: 4px;">UGX</small>${estFreightTotalUgx.toLocaleString()}</span>
                        <span class="fig-note">Based on ${weight} kg shipment guide rate in Uganda Shillings (UGX)</span>
                    </div>
                    <div class="calc-fig-item">
                        <span class="fig-label">Customs & Clearing:</span>
                        <span class="fig-value-alt">${clearingEstimate}</span>
                        <span class="fig-note">Entebbe / Mombasa / Malaba desks</span>
                    </div>
                </div>
                <div class="calc-actions">
                    <a href="contact.html?mode=${encodeURIComponent(mode)}&weight=${weight}#contact" class="button button-orange">
                        Lock In This Quote
                    </a>
                    <a href="https://wa.me/256744911327?text=Hello%20Katozi%20Logistics,%20I%20used%20your%20website%20calculator:%20${encodeURIComponent(mode)}%20freight,%20weight%20approx%20${weight}kg%20from%20${origin}%20(Est.%20UGX%20${estFreightTotalUgx.toLocaleString()}).%20Please%20provide%20a%20formal%20quote." 
                       target="_blank" rel="noopener noreferrer" class="button button-outline-dark">
                        Instant WhatsApp Consultation ↗
                    </a>
                </div>
            </div>
        `;
    }

    updateEstimate();
}

/* -------------------------------------------------------------
 * 7. FAQ Accordion
 * ------------------------------------------------------------- */
function initFaqAccordion() {
    const faqItems = document.querySelectorAll('.faq-item');
    if (!faqItems.length) return;

    faqItems.forEach(item => {
        const header = item.querySelector('.faq-question');
        if (!header) return;

        header.addEventListener('click', () => {
            const isOpen = item.classList.contains('active');
            // Close others if single-expand preferred
            faqItems.forEach(other => {
                if (other !== item) {
                    other.classList.remove('active');
                    const btn = other.querySelector('.faq-question');
                    if (btn) btn.setAttribute('aria-expanded', 'false');
                }
            });

            item.classList.toggle('active', !isOpen);
            header.setAttribute('aria-expanded', !isOpen ? 'true' : 'false');
        });
    });
}

/* -------------------------------------------------------------
 * 8. Interactive Contact Form with Validation & Feedback Modal
 * ------------------------------------------------------------- */
function initContactForm() {
    const form = document.getElementById('contact-form');
    if (!form) return;

    // Check URL parameters for pre-filling
    const urlParams = new URLSearchParams(window.location.search);
    const serviceParam = urlParams.get('mode') || urlParams.get('service');
    const weightParam = urlParams.get('weight');
    const serviceSelect = document.getElementById('contact-service');
    const messageInput = document.getElementById('contact-message');

    if (serviceSelect && serviceParam) {
        if (serviceParam.includes('air')) serviceSelect.value = 'Air freight';
        else if (serviceParam.includes('sea')) serviceSelect.value = 'Sea freight';
        else if (serviceParam.includes('road')) serviceSelect.value = 'Road transport';
    }

    if (messageInput && weightParam) {
        messageInput.value = `Estimated Cargo Weight: approx ${weightParam} kg. `;
    }

    form.addEventListener('submit', (e) => {
        e.preventDefault();

        // Basic check
        if (!form.checkValidity()) {
            form.reportValidity();
            return;
        }

        const submitBtn = form.querySelector('button[type="submit"]');
        const originalText = submitBtn ? submitBtn.innerHTML : 'Send shipment enquiry';

        if (submitBtn) {
            submitBtn.disabled = true;
            submitBtn.innerHTML = `
                <span class="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>
                Processing Shipment Request...
            `;
        }

        const name = (document.getElementById('contact-name')?.value || 'Client').trim();
        const service = document.getElementById('contact-service')?.value || 'Logistics Service';
        const origin = document.getElementById('contact-origin')?.value || 'Origin';
        const dest = document.getElementById('contact-destination')?.value || 'Kampala';
        const phone = document.getElementById('contact-phone')?.value || '';
        const email = document.getElementById('contact-email')?.value || '';
        const message = document.getElementById('contact-message')?.value || '';

        const ticketRef = 'KTZ-' + Math.floor(100000 + Math.random() * 900000);

        setTimeout(() => {
            if (submitBtn) {
                submitBtn.disabled = false;
                submitBtn.innerHTML = originalText;
            }

            // Show custom feedback modal
            showSuccessModal({
                name,
                ticketRef,
                service,
                origin,
                dest,
                phone,
                email,
                message
            });

            form.reset();
        }, 800);
    });
}

function showSuccessModal(data) {
    let modal = document.getElementById('formSuccessModal');
    if (!modal) {
        modal = document.createElement('div');
        modal.id = 'formSuccessModal';
        modal.className = 'custom-modal';
        document.body.appendChild(modal);
    }

    const waText = encodeURIComponent(
        `Hello Katozi Logistics! I just submitted an enquiry on your website.\n` +
        `Ref: ${data.ticketRef}\n` +
        `Name: ${data.name}\n` +
        `Service: ${data.service}\n` +
        `Route: ${data.origin} -> ${data.dest}\n` +
        `Phone: ${data.phone}`
    );

    modal.innerHTML = `
        <div class="custom-modal-dialog">
            <div class="modal-card">
                <button class="modal-close-icon" id="closeSuccessModal" aria-label="Close dialog">&times;</button>
                <div class="modal-icon-wrap">
                    <span class="success-checkmark">✓</span>
                </div>
                <h2>Enquiry Received Successfully!</h2>
                <p class="modal-sub">Thank you, <strong>${escapeHtml(data.name)}</strong>. Your request has been assigned to a Katozi Logistics Clearing Officer.</p>
                
                <div class="ticket-box">
                    <span class="ticket-label">Your Quotation Reference Number</span>
                    <strong class="ticket-code">${data.ticketRef}</strong>
                    <span class="ticket-time">⏱️ Estimated response time: <strong>Within 1 to 2 business hours</strong></span>
                </div>

                <div class="modal-summary">
                    <div><span>Service:</span> <strong>${escapeHtml(data.service)}</strong></div>
                    <div><span>Route:</span> <strong>${escapeHtml(data.origin)} &rarr; ${escapeHtml(data.dest)}</strong></div>
                </div>

                <p class="modal-help-text">Need priority customs assistance or immediate port release status?</p>

                <div class="modal-actions">
                    <a href="https://wa.me/256744911327?text=${waText}" target="_blank" rel="noopener noreferrer" class="button btn-whatsapp-full">
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="18" height="18">
                            <path d="M20.2 11.7a8.2 8.2 0 0 1-12.1 7.2L3 20l1.2-4.9a8.2 8.2 0 1 1 16-3.4Z"/>
                        </svg>
                        Forward Directly to WhatsApp Desk
                    </a>
                    <button type="button" class="button button-outline-dark" id="btnDismissSuccess">
                        Done / Return to Page
                    </button>
                </div>
            </div>
        </div>
    `;

    modal.classList.add('is-open');
    document.body.classList.add('no-scroll');

    const close = () => {
        modal.classList.remove('is-open');
        document.body.classList.remove('no-scroll');
    };

    document.getElementById('closeSuccessModal')?.addEventListener('click', close);
    document.getElementById('btnDismissSuccess')?.addEventListener('click', close);
    modal.addEventListener('click', (e) => {
        if (e.target === modal) close();
    });
}

/* -------------------------------------------------------------
 * 9. Floating WhatsApp Quick Chat Widget
 * ------------------------------------------------------------- */
function initWhatsAppFloat() {
    let widget = document.querySelector('.whatsapp-float-widget');
    if (!widget) {
        widget = document.createElement('div');
        widget.className = 'whatsapp-float-widget';
        widget.innerHTML = `
            <div class="wa-popup-bubble" id="waPopupBubble">
                <button class="wa-popup-close" id="closeWaPopup" aria-label="Close notification">&times;</button>
                <div class="wa-popup-header">
                    <div class="wa-officer-avatar">
                        <svg viewBox="0 0 24 24" fill="currentColor" width="22" height="22">
                            <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"/>
                        </svg>
                        <span class="online-indicator"></span>
                    </div>
                    <div class="wa-popup-info">
                        <strong>Katozi Logistics Officer</strong>
                        <span>Online | Fast Response</span>
                    </div>
                </div>
                <p>Hello! 👋 Looking to import cargo, clear customs at Entebbe/Mombasa, or get a fast freight quote?</p>
                <a href="https://wa.me/256744911327?text=Hello%20Katozi%20Logistics,%20I%20would%20like%20to%20enquire%20about%20cargo%20freight%20and%20customs%20clearance." 
                   target="_blank" rel="noopener noreferrer" class="wa-start-btn">
                    Start Chat on WhatsApp
                </a>
            </div>
            <a href="https://wa.me/256744911327?text=Hello%20Katozi%20Logistics,%20I%20would%20like%20to%20enquire%20about%20freight%20services." 
               target="_blank" rel="noopener noreferrer" class="wa-float-btn" aria-label="Chat with Katozi Logistics on WhatsApp">
                <span class="wa-pulse"></span>
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="28" height="28">
                    <path d="M20.2 11.7a8.2 8.2 0 0 1-12.1 7.2L3 20l1.2-4.9a8.2 8.2 0 1 1 16-3.4Z"/>
                    <path d="M8.2 8.1c.2-.5.5-.5.8-.5h.5c.2 0 .4.1.5.4l.7 1.6c.1.2.1.4 0 .6l-.5.6c-.2.2-.2.4 0 .6.4.7 1 1.4 1.7 1.8.2.1.4.1.6-.1l.7-.8c.2-.2.4-.2.6-.1l1.5.7c.2.1.3.3.3.5 0 .5-.3 1.1-.7 1.4-.4.4-1 .6-1.5.5-1.2-.2-2.5-.9-3.6-1.9-1.1-1-2-2.4-2.3-3.7-.2-.6.1-1.2.4-1.6l.3-.1Z"/>
                </svg>
            </a>
        `;
        document.body.appendChild(widget);
    }

    const popup = document.getElementById('waPopupBubble');
    const closeBtn = document.getElementById('closeWaPopup');

    if (popup && closeBtn) {
        // Show bubble after 4.5s
        setTimeout(() => {
            if (!sessionStorage.getItem('wa_bubble_dismissed')) {
                popup.classList.add('visible');
            }
        }, 4500);

        closeBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            popup.classList.remove('visible');
            sessionStorage.setItem('wa_bubble_dismissed', 'true');
        });
    }
}

/* -------------------------------------------------------------
 * 10. Back to Top Button
 * ------------------------------------------------------------- */
function initBackToTop() {
    let btn = document.getElementById('backToTopBtn');
    if (!btn) {
        btn = document.createElement('button');
        btn.id = 'backToTopBtn';
        btn.className = 'back-to-top-btn';
        btn.setAttribute('aria-label', 'Scroll to top');
        btn.innerHTML = `
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" width="20" height="20">
                <path d="M18 15l-6-6-6 6"/>
            </svg>
        `;
        document.body.appendChild(btn);
    }

    window.addEventListener('scroll', () => {
        if (window.scrollY > 400) {
            btn.classList.add('show');
        } else {
            btn.classList.remove('show');
        }
    }, { passive: true });

    btn.addEventListener('click', () => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    });
}

function escapeHtml(str) {
    if (!str) return '';
    return String(str)
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&#039;');
}
