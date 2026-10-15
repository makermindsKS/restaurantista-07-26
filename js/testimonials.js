
/**
 * TESTIMONIALS SLIDER
 *
 * Loads customer reviews from a JSON file.
 * Displays three testimonials simultaneously.
 * Allows navigation using arrows and indicator dots.
 */

// Wait until the HTML document has been parsed.
document.addEventListener("DOMContentLoaded", () => {

    // Select the navigation arrows and indicator container.
    const leftArrow = document.querySelector(".left-arrow-testimonial");
    const rightArrow = document.querySelector(".right-arrow-testimonial");
    const dotsContainer = document.querySelector(".carousel-indicators");

    // Track the current position in the testimonials array.
    // Arrays start at index 0.
    let currentIndex = 0;

    // Initially empty. Filled after fetching the JSON data.
    let testimonialData = [];


    // ==================================================
    // 1. FETCH TESTIMONIAL DATA FROM JSON
    // ==================================================

    /**
     * fetch() retrieves data from a file or server.
     *
     * fetch() returns a Promise representing a future result.
     *
     * .then() executes after the previous Promise resolves.
     * response.json() parses the response body into JS data.
     *
     * First .then()  -> Convert the response into JSON data.
     * Second .then() -> Store the data and initialize the slider.
     *
     * The request is asynchronous, meaning JavaScript does
     * not block the entire page while waiting for the data.
     */

    fetch("js/testimonials.json")
        .then((response) => response.json())
        .then((data) => {

            // Store the loaded array for later navigation.
            testimonialData = data;

            // Generate one indicator dot per testimonial.
            createDots(testimonialData.length);

            // Display the initial three testimonials.
            updateTestimonials(testimonialData, currentIndex);
        });


    // ==================================================
    // 2. CREATE NAVIGATION DOTS DYNAMICALLY
    // ==================================================

    function createDots(numDots) {

        // Remove existing dots before generating new ones.
        dotsContainer.innerHTML = "";

        /**
         * FOR LOOP
         *
         * let index = 0      Start counting at zero.
         * index < numDots    Continue while index is below numDots.
         * index++            Increase index by one each iteration.
         *
         * Example:
         * numDots = 4
         * index values: 0, 1, 2, 3
         */

        for (let index = 0; index < numDots; index++) {

            // Create a new HTML <span> element in memory.
            const dot = document.createElement("span");

            // Add the CSS class used to style the dot.
            dot.classList.add("dot");

            // Highlight the first dot initially.
            if (index === 0) {
                dot.classList.add("active");
            }

            // Insert the new dot into the HTML document.
            dotsContainer.appendChild(dot);
        }


        // ==================================================
        // 3. REGISTER CLICK EVENTS FOR EACH DOT
        // ==================================================

        // querySelectorAll() returns all matching elements.
        const dots = document.querySelectorAll(".dot");

        /**
         * forEach() iterates over each element in a collection.
         *
         * dot   -> Current HTML element.
         * index -> Position of that element (starting at 0).
         *
         * Every dot receives its own click event listener.
         */

        dots.forEach((dot, index) => {
            dot.addEventListener("click", () => {

                // Set the slider position to the clicked dot.
                currentIndex = index;

                // Highlight the selected navigation dot.
                updateDots(currentIndex);

                // Refresh the three visible testimonial cards.
                updateTestimonials(testimonialData, currentIndex);
            });
        });
    }


    // ==================================================
    // 4. UPDATE THE ACTIVE NAVIGATION DOT
    // ==================================================

    function updateDots(position) {

        const dots = document.querySelectorAll(".dot");

        // Iterate over all navigation dots.
        dots.forEach((dot, index) => {

            // Only the dot matching the current position
            // receives the "active" CSS class.
            if (index === position) {
                dot.classList.add("active");
            } else {
                dot.classList.remove("active");
            }
        });
    }


    // ==================================================
    // 5. UPDATE THE THREE TESTIMONIAL CARDS
    // ==================================================

    function updateTestimonials(testimonials, index) {

        /**
         * MODULO OPERATOR (%)
         *
         * % returns the remainder of a division.
         *
         * Examples:
         * 0 % 4 = 0
         * 1 % 4 = 1
         * 3 % 4 = 3
         * 4 % 4 = 0
         * 5 % 4 = 1
         *
         * WHY USE MODULO HERE?
         *
         * We display three cards simultaneously.
         * Each card shows a consecutive array element.
         *
         * Modulo allows circular navigation, returning
         * to index 0 after reaching the end of the array.
         *
         * Example with four testimonials:
         *
         * Current index | First | Middle | Third
         *       0       |   0   |   1    |   2
         *       1       |   1   |   2    |   3
         *       2       |   2   |   3    |   0
         *       3       |   3   |   0    |   1
         */

        const cardElements = [
            {
                // First card: current testimonial.
                container: document.querySelector(".testimonial-card-first"),
                data: testimonials[index % testimonials.length],
            },
            {
                // Middle card: one position ahead.
                container: document.querySelector(".testimonial-card-middle"),
                data: testimonials[(index + 1) % testimonials.length],
            },
            {
                // Third card: two positions ahead.
                container: document.querySelector(".testimonial-card-third"),
                data: testimonials[(index + 2) % testimonials.length],
            }
        ];


        // ==================================================
        // 6. POPULATE EACH CARD WITH TESTIMONIAL DATA
        // ==================================================

        cardElements.forEach((card) => {

            /**
             * OBJECT DESTRUCTURING
             *
             * Extract properties from an object into variables.
             *
             * const { container, data } = card;
             *
             * This is equivalent to:
             *
             * const container = card.container;
             * const data = card.data;
             */

            const { container, data } = card;

            /**
             * SCOPED querySelector()
             *
             * container.querySelector() searches ONLY inside
             * the current testimonial card.
             *
             * document.querySelector() would search the
             * entire HTML document and return the first match.
             *
             * This is important because all three cards use
             * the same CSS classes for their inner elements.
             */

            // Update the customer image.
            container.querySelector(".testimonial-image img").src = data.image;

            // Update the customer's name.
            container.querySelector(".testimonial-name").textContent = data.name;

            // Update the customer's role.
            container.querySelector(".testimonial-role").textContent = data.customerType;

            // Update the testimonial text.
            container.querySelector(".testimonial-text").textContent = data.text;
        });
    }


    // ==================================================
    // 7. LEFT ARROW NAVIGATION
    // ==================================================

    leftArrow.addEventListener("click", () => {

        /**
         * TERNARY OPERATOR (? :)
         *
         * A shorter way of writing an if/else expression.
         *
         * Syntax:
         * condition ? valueIfTrue : valueIfFalse
         *
         * If currentIndex > 0:
         *     Move one position backward.
         *
         * Otherwise:
         *     Jump to the last testimonial.
         *
         * Example with four testimonials:
         * currentIndex = 0 -> 3
         * currentIndex = 3 -> 2
         */

        currentIndex = currentIndex > 0
            ? currentIndex - 1
            : testimonialData.length - 1;

        // Refresh cards and navigation indicators.
        updateTestimonials(testimonialData, currentIndex);
        updateDots(currentIndex);
    });


    // ==================================================
    // 8. RIGHT ARROW NAVIGATION
    // ==================================================

    rightArrow.addEventListener("click", () => {

        /**
         * Move forward if we haven't reached the last index.
         *
         * Otherwise, return to index 0.
         *
         * Example with four testimonials:
         * currentIndex = 2 -> 3
         * currentIndex = 3 -> 0
         */

        currentIndex = currentIndex < testimonialData.length - 1
            ? currentIndex + 1
            : 0;

        // Refresh cards and navigation indicators.
        updateTestimonials(testimonialData, currentIndex);
        updateDots(currentIndex);
    });
});
