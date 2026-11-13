const form = document.getElementById('user-form');
const nameEntry = document.getElementById('user_name');
const mailEntry = document.getElementById('user_email');
const commentEntry = document.getElementById('user_comment');
const charCount = document.getElementById('comment-count');
const charWarning = document.getElementById('comment-warning');

const fields = [nameEntry, mailEntry, commentEntry];
const editedFields = new Set();
const REMAINING_CHARS = 99;
const errHistory = document.getElementById('form-errors');
const errorArea = document.getElementById('error-area');
const infoArea = document.getElementById('info-area');

const form_errors = [];
let attemptCount = 0;
const recordAttempt = new Set();

// JS handles validation from here, so turn off the native bubbles; without JS the HTML validation still works
form.noValidate = true;

function errorMsg(field) {
    const valid = field.validity;

    if (field === nameEntry) {
        if (valid.valueMissing) return 'Name: Hey buddy, you left this part empty, go ahead and type in your full name.';
    } else if (field === mailEntry) {
        if (valid.valueMissing) return 'Email: Hey buddy, you left this part empty, go ahead and type in your email address.';
        if (valid.typeMismatch) return 'Email: Woah settle down there guy, this is not a valid email format. Rewrite it using the format name@email.com';
    } else if (field === commentEntry) {
        if (valid.valueMissing) return 'Comment: Hey buddy, you left this part empty, go ahead and leave us a comment and make sure it is at least 10 characters long.';
        if (valid.tooShort) return 'Comment: Come on pal, your comment is far too short. At least give us 10 characters and you can go ahead and submit.';
    }
    return '';
}

function validateField(field) {
    const msg = errorMsg(field);
    field.setCustomValidity(msg);
    return msg;
}

function showError(field) {
    const msg = validateField(field);
    const err = document.getElementById(`${field.id}-error`);

    if (err.textContent !== msg) {
        err.textContent = msg;
    }

    if (msg) {
        field.setAttribute('aria-invalid', true);
    } else {
        field.removeAttribute('aria-invalid');
    }
}

function updateCharCount() {
    const maxLen = commentEntry.maxLength;
    const remainder = maxLen - commentEntry.value.length;
    charCount.textContent = `${remainder} of ${maxLen} characters left.`;

    let warning = '';
    if (remainder === 0) {
        warning = `Warning: Take it easy champ, you reached the ${maxLen}-character limit. Keep it short and sweet, or anything extra you throw in won't be included.`;
    } else if (remainder <= REMAINING_CHARS) {
        warning = `Warning: You still got some room bucko, but be careful, you have less than 100 characters left.`
    }
    if (charWarning.textContent !== warning) {
        charWarning.textContent = warning;
    }
    infoArea.classList.toggle('near-limit', remainder <= REMAINING_CHARS);
}

form.addEventListener('input', (event) => {
    const field = event.target;
    if (!fields.includes(field)) return;

    editedFields.add(field);
    if (field === commentEntry) updateCharCount();

    if (field.getAttribute('aria-invalid') === 'true') {
        showError(field);
    } else {
        validateField(field);
    }
});

form.addEventListener('focusout', (event) => {
    const field = event.target;
    if (fields.includes(field) && editedFields.has(field)) {
        showError(field);
    }
});

form.addEventListener('submit', (event) => {
    fields.forEach(showError);

    if (!form.checkValidity()) {
        event.preventDefault();
        form.querySelector('[aria-invalid="true"]').focus();
        return;
    }

    errHistory.value = JSON.stringify(form_errors);
});

form.addEventListener('invalid', (event) => {
    const field = event.target;

    if (recordAttempt.size === 0) {
        attemptCount++;
        setTimeout(() => recordAttempt.clear());
    }

    if (recordAttempt.has(field)) return;
    recordAttempt.add(field);
    showError(field);

    form_errors.push({
        attempt: attemptCount,
        field: field.name,
        error: errType(field.validity),
        message: errorMsg(field),
        time: new Date().toISOString(),
    });
}, true);

function errType(validity) {
    for (const key of ['valueMissing', 'typeMismatch', 'tooShort', 'tooLong']) {
        if (validity[key]) return key;
    }
    return 'customError'
}

updateCharCount();

errorArea.hidden = false;
infoArea.hidden = false;
