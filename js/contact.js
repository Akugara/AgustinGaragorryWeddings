/* Contact form: phone field (intl-tel-input), light validation, AJAX submit to Formspree. */
(function () {
    'use strict';

    var form = document.getElementById('contactForm');
    if (!form) return;

    var phoneInput = document.getElementById('phone');
    var emailInput = document.getElementById('email');
    var emailHint = document.getElementById('email-hint');
    var fullPhone = document.getElementById('fullPhone');
    var statusEl = document.getElementById('form-status');
    var submitBtn = document.getElementById('submit-btn');
    var defaultStatus = statusEl.textContent;
    var defaultEmailHint = emailHint.textContent;
    var iti = null;

    function setStatus(msg, kind) {
        statusEl.textContent = msg;
        statusEl.className = 'form__status' + (kind ? ' is-' + kind : '');
    }

    // International phone input, Finland by default
    window.addEventListener('load', function () {
        if (!window.intlTelInput) return;
        iti = window.intlTelInput(phoneInput, {
            initialCountry: 'fi',
            preferredCountries: ['fi', 'se', 'no', 'dk'],
            separateDialCode: true,
            utilsScript: 'https://cdn.jsdelivr.net/npm/intl-tel-input@19.5.6/build/js/utils.js'
        });
    });

    var typoMap = {
        'gmial.com': 'gmail.com', 'gmai.com': 'gmail.com', 'gmil.com': 'gmail.com',
        'yahooo.com': 'yahoo.com', 'yaho.com': 'yahoo.com',
        'hotmial.com': 'hotmail.com', 'outlok.com': 'outlook.com'
    };

    function validateEmail(email) {
        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
            return { valid: false, message: 'Please enter a valid email address.' };
        }
        var parts = email.split('@');
        var fixed = typoMap[parts[1].toLowerCase()];
        if (fixed) return { valid: false, message: 'Did you mean ' + parts[0] + '@' + fixed + '?' };
        return { valid: true, message: '' };
    }

    emailInput.addEventListener('blur', function () {
        var v = validateEmail(this.value);
        if (this.value && !v.valid) {
            emailHint.textContent = v.message;
            emailHint.style.color = '#a3271b';
        } else {
            emailHint.textContent = defaultEmailHint;
            emailHint.style.color = '';
        }
    });

    form.addEventListener('submit', function (e) {
        e.preventDefault();

        if (!form.elements.name.value.trim()) {
            setStatus('Please tell me your name.', 'error');
            form.elements.name.focus();
            return;
        }
        var ev = validateEmail(emailInput.value.trim());
        if (!ev.valid) {
            setStatus(ev.message, 'error');
            emailInput.focus();
            return;
        }
        if (iti && phoneInput.value.trim() !== '') {
            if (!iti.isValidNumber()) {
                setStatus('Please enter a valid phone number, or leave it empty.', 'error');
                phoneInput.focus();
                return;
            }
            fullPhone.value = iti.getNumber();
        }

        submitBtn.disabled = true;
        submitBtn.textContent = 'Sending...';
        setStatus('', '');

        fetch(form.action, {
            method: 'POST',
            body: new FormData(form),
            headers: { 'Accept': 'application/json' }
        }).then(function (res) {
            if (!res.ok) throw new Error('Form submission failed');
            setStatus('Thank you! Your message has been sent. I will get back to you soon :)', 'ok');
            form.reset();
            if (iti) iti.setCountry('fi');
            submitBtn.textContent = 'Sent';
            setTimeout(function () {
                submitBtn.textContent = 'Send message';
                submitBtn.disabled = false;
                setStatus(defaultStatus, '');
            }, 8000);
        }).catch(function () {
            setStatus('Something went wrong. Please try again, or email me directly at agustingaragorry@gmail.com', 'error');
            submitBtn.textContent = 'Send message';
            submitBtn.disabled = false;
        });
    });
})();
