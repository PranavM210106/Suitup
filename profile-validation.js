// profile-validation.js

const nameInput  = document.getElementById('name');
const emailInput = document.getElementById('email');
const phoneInput = document.getElementById('phone');

const saveBtn    = document.getElementById('saveBtn');
const editBtn    = document.getElementById('editBtn'); // may be absent if using "always editable"
const successBanner = document.getElementById('successBanner');

const nameErr  = document.getElementById('nameErr');
const emailErr = document.getElementById('emailErr');
const phoneErr = document.getElementById('phoneErr');

const namePattern  = /^[A-Za-zÀ-ÖØ-öø-ÿ .'\-]{2,60}$/;
const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
const phonePattern = /^(?:\+91[-\s]?\d{10}|0\d{10}|\d{10})$/;

function setError(input, errEl, show){
  if(!input || !errEl) return;
  if(show){
    input.classList.add('invalid');
    errEl.style.display = 'block';
    input.setAttribute('aria-invalid','true');
  }else{
    input.classList.remove('invalid');
    errEl.style.display = 'none';
    input.removeAttribute('aria-invalid');
  }
}
const validateName  = () => (setError(nameInput,  nameErr,  !namePattern.test((nameInput?.value||'').trim())),  namePattern.test((nameInput?.value||'').trim()));
const validateEmail = () => (setError(emailInput, emailErr, !emailPattern.test((emailInput?.value||'').trim())), emailPattern.test((emailInput?.value||'').trim()));
function normalizePhone(v){ return (v||'').replace(/\s+/g,'').replace(/-/g,''); }
const validatePhone = () => (setError(phoneInput, phoneErr, !phonePattern.test(normalizePhone(phoneInput?.value||''))), phonePattern.test(normalizePhone(phoneInput?.value||'')));

function enableEditing(enable){
  [nameInput, emailInput, phoneInput].forEach(i => { if(i) i.disabled = !enable; });
  if(editBtn){
    editBtn.setAttribute('aria-pressed', enable ? 'true' : 'false');
    editBtn.textContent = enable ? 'Cancel' : 'Edit';
  }
  if(!enable){
    [[nameInput,nameErr],[emailInput,emailErr],[phoneInput,phoneErr]].forEach(([i,e])=> i&&e && setError(i,e,false));
    if(successBanner) successBanner.style.display = 'none';
  }else{
    nameInput?.focus();
  }
}

// If there's an Edit button, wire it; otherwise page is always editable.
editBtn?.addEventListener('click', (e)=>{
  e.preventDefault();
  const editing = nameInput?.disabled === false;
  enableEditing(!editing);
});

// Live validation
nameInput?.addEventListener('input', validateName);
emailInput?.addEventListener('input', validateEmail);
phoneInput?.addEventListener('input', validatePhone);

// Save handler
saveBtn?.addEventListener('click', (e)=>{
  e.preventDefault();
  // if fields disabled (toggle mode), enable editing instead of saving
  if(nameInput && nameInput.disabled){ enableEditing(true); return; }

  const ok = [validateName(), validateEmail(), validatePhone()].every(Boolean);
  if(!ok){
    if(!validateName())      nameInput?.focus();
    else if(!validateEmail()) emailInput?.focus();
    else                      phoneInput?.focus();
    if(successBanner) successBanner.style.display = 'none';
    return;
  }
  if(successBanner) successBanner.style.display = 'block';

  // Lock fields again in toggle mode
  if(editBtn) enableEditing(false);
});

// --- IMPORTANT: auto-enable edit mode on page load ---
document.addEventListener('DOMContentLoaded', ()=>{
  enableEditing(true); // comment this out if you want fields locked until "Edit"
});
