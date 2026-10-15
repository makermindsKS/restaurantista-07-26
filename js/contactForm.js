
/**
 * CONTACT FORM VALIDATION
 *
 * Validates the user's name, email, and subject.
 * Displays errors using Toastify.
 * Saves valid form data in the browser's localStorage.
 */

// Select the contact form using its CSS class.
const contactUs = document.querySelector(".email-form");

// Listen for the form's submit event.
contactUs.addEventListener("submit", (event) => {

    // Prevent the browser from reloading the page.
    event.preventDefault();

    // Count validation errors found during submission.
    let errors = 0;

    // Read the current values from the HTML form fields.
    const name = document.getElementById("name").value;
    const email = document.getElementById("email").value;
    const subject = document.getElementById("subject").value;
    const message = document.getElementById("message").value;


    // ==================================================
    // 1. NAME VALIDATION USING REGEX
    // ==================================================

    /**
     * REGEX (Regular Expression) defines a text pattern.
     *
     * / ... /    Delimiters marking the start and end of a regex
     * ^          Start of the string
     * [ ]        Allowed character group
     * A-Z        Uppercase English letters
     * a-z        Lowercase English letters
     * À-ÿ        Extended Latin characters (ä, ö, ü, é, etc.)
     * \s         Whitespace (spaces, tabs, etc.)
     * '          Apostrophes (e.g. O'Brien)
     * -          Hyphens (e.g. Jean-Paul)
     * +          One or more allowed characters
     * $          End of the string
     *
     * Valid:   "John Smith", "Müller", "Jean-Paul"
     * Invalid: "John123", "John@", ""
     */

    const nameRegex = /^[A-Za-zÀ-ÿ\s'-]+$/;

    // .trim() removes surrounding whitespace.
    // .test() returns true if the text matches the regex.
    // ! reverses the result, so we enter the if-block when invalid.
    if (!nameRegex.test(name.trim())) {

        Toastify({
            text: "Please enter a valid name without any symbols or numbers.",
            duration: 3000,
            close: true,
            gravity: "top",
            position: "center",
            backgroundColor: "red",
            stopOnFocus: true,

        }).showToast();

        errors++;
    }


    // ==================================================
    // 2. EMAIL VALIDATION USING REGEX
    // ==================================================

    /**
     * Expected email structure: name@domain.extension
     *
     * ^           Start of the string
     * [^\s@]+     One or more characters except whitespace or @
     * @           Required @ symbol
     * [^\s@]+     Domain name (e.g. gmail)
     * \.          Literal dot (.)
     * [^\s@]+     Domain extension (e.g. com)
     * $           End of the string
     *
     * IMPORTANT:
     * ^ outside [ ] means "start of string".
     * ^ inside [ ] means "NOT these characters".
     *
     * Valid:   "john@gmail.com"
     * Invalid: "john@gmail", "john.com", "john @gmail.com"
     *
     * This checks the email FORMAT, not whether it exists.
     */

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!emailRegex.test(email.trim())) {

        Toastify({
            text: "Please enter a valid e-mail without any symbols or numbers.",
            duration: 3000,
            close: true,
            gravity: "top",
            position: "center",
            backgroundColor: "red",
            stopOnFocus: true,

        }).showToast();

        errors++;
    }


    // ==================================================
    // 3. SUBJECT VALIDATION
    // ==================================================

    // No regex needed: simply check whether the subject is empty.
    // trim() also catches inputs containing only spaces.
    if (subject.trim() === "") {

        Toastify({
            text: "Please enter a subject.",
            duration: 3000,
            close: true,
            gravity: "top",
            position: "center",
            backgroundColor: "red",
            stopOnFocus: true,

        }).showToast();

        errors++;
    }


    // ==================================================
    // 4. STOP SUBMISSION IF VALIDATION FAILED
    // ==================================================

    // All three fields are checked before reaching this line.
    // If at least one error exists, stop the submit handler.
    if (errors > 0) return;


    // ==================================================
    // 5. SAVE CONTACT DATA TO LOCAL STORAGE
    // ==================================================

    // Group all submitted values into one JavaScript object.
    const contact = {
        name: name,
        email: email,
        subject: subject,
        message: message,
    };

    // localStorage only stores strings.
    // JSON.stringify() converts the object into a JSON string.
    // This does NOT send an actual email or save data on a server.
    localStorage.setItem("contact", JSON.stringify(contact));


    // ==================================================
    // 6. SUCCESS NOTIFICATION AND FORM RESET
    // ==================================================

    // Show a green notification after successful validation.
    Toastify({
        text: "Thanks for reaching out. We'll reply to your message as soon as possible.",
        duration: 5000,
        close: true,
        gravity: "top",
        position: "center",
        backgroundColor: "#28a745",
        stopOnFocus: true,

    }).showToast();

    // Clear the form fields after successful submission.
    contactUs.reset();
});
