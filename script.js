/* =========================================================
   QUIET POWER — Executive Coaching Homepage
   Main JavaScript
   ========================================================= */

(function () {
  "use strict";

  /* =========================================================
     DOM READY
     ========================================================= */

  document.addEventListener("DOMContentLoaded", function () {
    initThemeToggle();
    initMobileDrawer();
    initHeaderScroll();
    initBackToTop();
    initSmoothNavigation();
    initAOS();
    initProgramSlider();
    initTestimonialSlider();
    initCalendar();
    initBookingForm();
    initFAQAccordion();
    initNewsletterForm();
  });


  /* =========================================================
     1. THEME TOGGLE
     ---------------------------------------------------------
     Handles:
     - Light theme
     - Dark theme
     - LocalStorage persistence
     - Sun / moon icon state
     ========================================================= */

  function initThemeToggle() {
    const themeToggle = document.getElementById("themeToggle");

    if (!themeToggle) {
      return;
    }

    const root = document.documentElement;
    const savedTheme = localStorage.getItem("qp-theme");

    /*
      If a theme was previously selected,
      restore it.
    */
    if (savedTheme === "dark" || savedTheme === "light") {
      root.setAttribute("data-theme", savedTheme);
    }

    /*
      If there is no saved preference,
      use the browser's preferred color scheme.
    */
    if (!savedTheme) {
      const prefersDark = window.matchMedia &&
        window.matchMedia("(prefers-color-scheme: dark)").matches;

      if (prefersDark) {
        root.setAttribute("data-theme", "dark");
      } else {
        root.setAttribute("data-theme", "light");
      }
    }

    updateThemeButton();

    themeToggle.addEventListener("click", function () {
      const currentTheme = root.getAttribute("data-theme");
      const nextTheme = currentTheme === "dark" ? "light" : "dark";

      root.setAttribute("data-theme", nextTheme);

      localStorage.setItem("qp-theme", nextTheme);

      updateThemeButton();
    });


    function updateThemeButton() {
      const currentTheme = root.getAttribute("data-theme");

      if (currentTheme === "dark") {
        themeToggle.setAttribute(
          "aria-label",
          "Switch to light theme"
        );
        themeToggle.setAttribute(
          "title",
          "Switch to light theme"
        );
      } else {
        themeToggle.setAttribute(
          "aria-label",
          "Switch to dark theme"
        );
        themeToggle.setAttribute(
          "title",
          "Switch to dark theme"
        );
      }
    }
  }


  /* =========================================================
     2. MOBILE DRAWER
     ---------------------------------------------------------
     Handles:
     - Hamburger button
     - Open drawer
     - Close button
     - Backdrop
     - ESC key
     - Navigation link close
     - Body scroll lock
     ========================================================= */

  function initMobileDrawer() {
    const hamburgerBtn = document.getElementById("hamburgerBtn");
    const drawer = document.getElementById("qpDrawer");
    const drawerBackdrop = document.getElementById("drawerBackdrop");
    const drawerClose = document.getElementById("drawerClose");

    if (
      !hamburgerBtn ||
      !drawer ||
      !drawerBackdrop ||
      !drawerClose
    ) {
      return;
    }


    function openDrawer() {
      drawer.classList.add("is-open");
      drawerBackdrop.classList.add("is-open");

      drawer.setAttribute("aria-hidden", "false");
      hamburgerBtn.setAttribute("aria-expanded", "true");
      hamburgerBtn.setAttribute("aria-label", "Close menu");

      document.body.classList.add("qp-no-scroll");
    }


    function closeDrawer() {
      drawer.classList.remove("is-open");
      drawerBackdrop.classList.remove("is-open");

      drawer.setAttribute("aria-hidden", "true");
      hamburgerBtn.setAttribute("aria-expanded", "false");
      hamburgerBtn.setAttribute("aria-label", "Open menu");

      document.body.classList.remove("qp-no-scroll");
    }


    hamburgerBtn.addEventListener("click", function () {
      const isOpen = drawer.classList.contains("is-open");

      if (isOpen) {
        closeDrawer();
      } else {
        openDrawer();
      }
    });


    drawerClose.addEventListener("click", function () {
      closeDrawer();
    });


    drawerBackdrop.addEventListener("click", function () {
      closeDrawer();
    });


    /*
      Close drawer when user presses ESC.
    */
    document.addEventListener("keydown", function (event) {
      if (event.key === "Escape") {
        closeDrawer();
      }
    });


    /*
      Close drawer when any mobile navigation
      link is clicked.
    */
    const drawerLinks = drawer.querySelectorAll("a");

    drawerLinks.forEach(function (link) {
      link.addEventListener("click", function () {
        closeDrawer();
      });
    });


    /*
      If user resizes from mobile to desktop,
      automatically close the drawer.
    */
    window.addEventListener("resize", function () {
      if (window.innerWidth >= 992) {
        closeDrawer();
      }
    });
  }


  /* =========================================================
     3. HEADER SCROLL EFFECT
     ---------------------------------------------------------
     Adds:
       .is-scrolled

     CSS already defines the shadow for this state.
     ========================================================= */

  function initHeaderScroll() {
    const header = document.getElementById("qpHeader");

    if (!header) {
      return;
    }


    function handleHeaderScroll() {
      if (window.scrollY > 30) {
        header.classList.add("is-scrolled");
      } else {
        header.classList.remove("is-scrolled");
      }
    }


    handleHeaderScroll();

    window.addEventListener(
      "scroll",
      handleHeaderScroll,
      { passive: true }
    );
  }


  /* =========================================================
     4. BACK TO TOP BUTTON
     ---------------------------------------------------------
     Handles:
     - Button visibility
     - Smooth scroll to top
     ========================================================= */

  function initBackToTop() {
    const backToTop = document.getElementById("backToTop");

    if (!backToTop) {
      return;
    }


    function updateBackToTop() {
      if (window.scrollY > 500) {
        backToTop.classList.add("is-visible");
      } else {
        backToTop.classList.remove("is-visible");
      }
    }


    updateBackToTop();


    window.addEventListener(
      "scroll",
      updateBackToTop,
      { passive: true }
    );


    backToTop.addEventListener("click", function () {
      window.scrollTo({
        top: 0,
        behavior: "smooth"
      });
    });
  }


  /* =========================================================
     5. SMOOTH NAVIGATION
     ---------------------------------------------------------
     Handles anchor links such as:

       #philosophy
       #pillars
       #programs
       #booking
       #testimonials
       #faq

     CSS already has smooth scrolling, but this gives us
     more controlled behavior and accounts for sticky header.
     ========================================================= */

  function initSmoothNavigation() {
    const anchorLinks = document.querySelectorAll(
      'a[href^="#"]'
    );

    anchorLinks.forEach(function (link) {
      link.addEventListener("click", function (event) {
        const targetId = link.getAttribute("href");

        if (
          !targetId ||
          targetId === "#" ||
          targetId.length <= 1
        ) {
          return;
        }

        const targetElement =
          document.querySelector(targetId);

        if (!targetElement) {
          return;
        }

        event.preventDefault();

        const header = document.getElementById("qpHeader");

        const headerHeight = header
          ? header.offsetHeight
          : 0;

        const targetPosition =
          targetElement.getBoundingClientRect().top +
          window.pageYOffset -
          headerHeight -
          15;

        window.scrollTo({
          top: targetPosition,
          behavior: "smooth"
        });

        /*
          Update URL hash without causing
          another browser jump.
        */
        if (history.pushState) {
          history.pushState(
            null,
            "",
            targetId
          );
        }
      });
    });
  }


  /* =========================================================
     6. AOS ANIMATION
     ---------------------------------------------------------
     HTML already contains data-aos attributes.
     ========================================================= */

  function initAOS() {
    if (typeof AOS === "undefined") {
      console.warn(
        "AOS library was not found."
      );

      return;
    }


    AOS.init({
      duration: 800,
      easing: "ease-out-cubic",
      once: true,
      offset: 80,
      disable: function () {
        return window.matchMedia(
          "(prefers-reduced-motion: reduce)"
        ).matches;
      }
    });
  }


  /* =========================================================
     7. PROGRAMS SLICK SLIDER
     ---------------------------------------------------------
     HTML:
       .qp-programs__slider

     Desktop:
       3 cards

     Tablet:
       2 cards

     Mobile:
       1 card
     ========================================================= */

  function initProgramSlider() {
    if (
      typeof window.jQuery === "undefined" ||
      typeof window.jQuery.fn.slick !== "function"
    ) {
      console.warn(
        "jQuery or Slick Carousel was not found."
      );

      return;
    }


    const $ = window.jQuery;

    const $programSlider =
      $(".qp-programs__slider");


    if (!$programSlider.length) {
      return;
    }


    $programSlider.slick({
      slidesToShow: 3,
      slidesToScroll: 1,
      infinite: true,
      arrows: true,
      dots: true,
      autoplay: false,
      speed: 600,
      adaptiveHeight: false,

      responsive: [
        {
          breakpoint: 1200,
          settings: {
            slidesToShow: 2
          }
        },

        {
          breakpoint: 768,
          settings: {
            slidesToShow: 1,
            arrows: true,
            dots: true
          }
        }
      ]
    });
  }


  /* =========================================================
     8. TESTIMONIAL SLICK SLIDER
     ---------------------------------------------------------
     HTML:
       .qp-testimonials__slider
     ========================================================= */

  function initTestimonialSlider() {
    if (
      typeof window.jQuery === "undefined" ||
      typeof window.jQuery.fn.slick !== "function"
    ) {
      return;
    }

    const $ = window.jQuery;
    const $testimonialSlider = $(".qp-testimonials__slider");

    if (!$testimonialSlider.length) {
      return;
    }

    // Equal height recalculation on init
    $testimonialSlider.on('init setPosition', function () {
      $(this).find('.slick-slide').css('height', 'auto');
      var maxHeight = 0;
      $(this).find('.qp-testimonial-card').each(function () {
        if ($(this).height() > maxHeight) {
          maxHeight = $(this).height();
        }
      });
      $(this).find('.qp-testimonial-card').css('height', maxHeight + 'px');
    });

    $testimonialSlider.slick({
      slidesToShow: 2,
      slidesToScroll: 1,
      infinite: true,
      arrows: true,
      dots: true,
      autoplay: true,
      autoplaySpeed: 5500,
      pauseOnHover: true,
      pauseOnFocus: true,
      speed: 650,
      adaptiveHeight: false,

      responsive: [
        {
          breakpoint: 992,
          settings: {
            slidesToShow: 1
          }
        },
        {
          breakpoint: 768,
          settings: {
            slidesToShow: 1,
            arrows: true,
            dots: true
          }
        }
      ]
    });
  }
  /* =========================================================
     9. CALENDAR
     ---------------------------------------------------------
     Handles:
     - Current month
     - Previous month
     - Next month
     - Available dates
     - Fully booked dates
     - Empty calendar cells
     - Selected date
     - Form date field

     IMPORTANT:
     This is currently FRONTEND DEMO availability.
     It is NOT connected to a real calendar API.
     ========================================================= */

  function initCalendar() {
    const calendarGrid =
      document.getElementById("calGrid");

    const calendarMonth =
      document.getElementById("calMonth");

    const previousButton =
      document.getElementById("calPrev");

    const nextButton =
      document.getElementById("calNext");

    const dateInput =
      document.getElementById("fDate");


    if (
      !calendarGrid ||
      !calendarMonth ||
      !previousButton ||
      !nextButton
    ) {
      return;
    }


    /*
      Calendar state.
    */

    const today = new Date();

    let currentMonth =
      today.getMonth();

    let currentYear =
      today.getFullYear();

    let selectedDate = null;


    /*
      Demo fully booked dates.

      Format:

      "YYYY-MM-DD"

      You can replace these later with real
      Google Calendar / Calendly / backend data.
    */

    const fullyBookedDates = new Set([
      "2026-08-06",
      "2026-08-12",
      "2026-08-19",
      "2026-08-27",

      "2026-09-03",
      "2026-09-11",
      "2026-09-22",

      "2026-10-07",
      "2026-10-16",
      "2026-10-28"
    ]);


    /*
      Month names.
    */

    const monthNames = [
      "January",
      "February",
      "March",
      "April",
      "May",
      "June",
      "July",
      "August",
      "September",
      "October",
      "November",
      "December"
    ];


    /*
      Helper:
      Convert number into YYYY-MM-DD.
    */

    function formatDate(year, month, day) {
      const formattedMonth =
        String(month + 1).padStart(2, "0");

      const formattedDay =
        String(day).padStart(2, "0");

      return (
        year +
        "-" +
        formattedMonth +
        "-" +
        formattedDay
      );
    }


    /*
      Helper:
      Format selected date for human display.
    */

    function formatReadableDate(
      year,
      month,
      day
    ) {
      return (
        monthNames[month] +
        " " +
        day +
        ", " +
        year
      );
    }


    /*
      Determine whether a day is in the past.
    */

    function isPastDate(
      year,
      month,
      day
    ) {
      const date =
        new Date(
          year,
          month,
          day
        );

      /*
        Compare only date portions.
      */

      const todayOnly =
        new Date(
          today.getFullYear(),
          today.getMonth(),
          today.getDate()
        );

      return date < todayOnly;
    }


    /*
      Determine availability.

      Current demo logic:

      - Past dates = unavailable
      - Saturday/Sunday = unavailable
      - Explicitly booked dates = fully booked
      - Monday-Friday = available
    */

    function getDateStatus(
      year,
      month,
      day
    ) {
      const date =
        new Date(
          year,
          month,
          day
        );

      const dayOfWeek =
        date.getDay();

      const dateKey =
        formatDate(
          year,
          month,
          day
        );


      if (isPastDate(year, month, day)) {
        return "past";
      }


      if (
        dayOfWeek === 0 ||
        dayOfWeek === 6
      ) {
        return "full";
      }


      if (
        fullyBookedDates.has(dateKey)
      ) {
        return "full";
      }


      return "available";
    }


    /*
      Render calendar.
    */

    function renderCalendar() {
      calendarGrid.innerHTML = "";


      /*
        Update month title.
      */

      calendarMonth.textContent =
        monthNames[currentMonth] +
        " " +
        currentYear;


      /*
        First day of month.

        getDay():
        0 = Sunday
        1 = Monday
        ...
        6 = Saturday
      */

      const firstDay =
        new Date(
          currentYear,
          currentMonth,
          1
        ).getDay();


      /*
        Number of days in current month.

        Setting day to 0 gives us
        the last day of previous month.
      */

      const daysInMonth =
        new Date(
          currentYear,
          currentMonth + 1,
          0
        ).getDate();


      /*
        Empty cells before first day.
      */

      for (
        let i = 0;
        i < firstDay;
        i++
      ) {
        const emptyCell =
          document.createElement("span");

        emptyCell.className =
          "qp-cal-day is-empty";

        calendarGrid.appendChild(
          emptyCell
        );
      }


      /*
        Actual calendar days.
      */

      for (
        let day = 1;
        day <= daysInMonth;
        day++
      ) {
        const dayElement =
          document.createElement("button");

        dayElement.type = "button";

        dayElement.className =
          "qp-cal-day";


        /*
          Determine status.
        */

        const status =
          getDateStatus(
            currentYear,
            currentMonth,
            day
          );


        /*
          Common attributes.
        */

        dayElement.textContent = day;

        dayElement.setAttribute(
          "aria-label",
          formatReadableDate(
            currentYear,
            currentMonth,
            day
          )
        );


        /*
          Available date.
        */

        if (status === "available") {
          dayElement.classList.add(
            "is-available"
          );


          dayElement.setAttribute(
            "aria-label",
            formatReadableDate(
              currentYear,
              currentMonth,
              day
            ) + " - Available"
          );


          dayElement.addEventListener(
            "click",
            function () {
              selectDate(
                currentYear,
                currentMonth,
                day
              );
            }
          );
        }


        /*
          Fully booked / unavailable date.
        */

      /* Fully booked / unavailable date */
if (status === "full" || status === "past") {
  dayElement.classList.add("is-full");
  dayElement.disabled = true; // Added standard HTML disabled property
  dayElement.setAttribute("aria-disabled", "true");
}

        /*
          Check whether this is
          currently selected date.
        */

        if (
          selectedDate &&
          selectedDate.year === currentYear &&
          selectedDate.month === currentMonth &&
          selectedDate.day === day
        ) {
          dayElement.classList.add(
            "is-selected"
          );
        }


        calendarGrid.appendChild(
          dayElement
        );
      }
    }


    /*
      Select calendar date.
    */

    function selectDate(
      year,
      month,
      day
    ) {
      selectedDate = {
        year: year,
        month: month,
        day: day
      };


      /*
        Update form field.
      */

      if (dateInput) {
        dateInput.value =
          formatReadableDate(
            year,
            month,
            day
          );
      }


      /*
        Re-render calendar so
        selected state appears.
      */

      renderCalendar();


      /*
        Optional subtle focus.
      */

      if (dateInput) {
        dateInput.focus();
      }
    }


    /*
      Previous month.
    */

    previousButton.addEventListener(
      "click",
      function () {
        currentMonth--;

        if (currentMonth < 0) {
          currentMonth = 11;
          currentYear--;
        }

        renderCalendar();
      }
    );


    /*
      Next month.
    */

    nextButton.addEventListener(
      "click",
      function () {
        currentMonth++;

        if (currentMonth > 11) {
          currentMonth = 0;
          currentYear++;
        }

        renderCalendar();
      }
    );


    /*
      Initial calendar render.
    */

    renderCalendar();
  }


  /* =========================================================
     10. BOOKING FORM
     ---------------------------------------------------------
     Handles:
     - Browser validation
     - Selected date requirement
     - Loading state
     - Success message
     - Form reset

     IMPORTANT:
     No backend is connected here.
     This is a frontend demonstration only.
     ========================================================= */

  function initBookingForm() {
    const bookingForm =
      document.getElementById("bookingForm");

    const formNote =
      document.getElementById("formNote");


    if (!bookingForm) {
      return;
    }


    bookingForm.addEventListener(
      "submit",
      function (event) {
        event.preventDefault();


        /*
          Run browser validation.
        */

        if (!bookingForm.checkValidity()) {
          bookingForm.reportValidity();

          return;
        }


        /*
          Get form fields.
        */

        const nameField =
          document.getElementById("fName");

        const emailField =
          document.getElementById("fEmail");

        const levelField =
          document.getElementById("fLevel");

        const dateField =
          document.getElementById("fDate");


        const name =
          nameField
            ? nameField.value.trim()
            : "";

        const email =
          emailField
            ? emailField.value.trim()
            : "";

        const level =
          levelField
            ? levelField.value
            : "";

        const selectedDate =
          dateField
            ? dateField.value.trim()
            : "";


        /*
          Additional validation.
        */

        if (!name) {
          showFormMessage(
            "Please enter your full name.",
            "error"
          );

          if (nameField) {
            nameField.focus();
          }

          return;
        }


        if (!isValidEmail(email)) {
          showFormMessage(
            "Please enter a valid email address.",
            "error"
          );

          if (emailField) {
            emailField.focus();
          }

          return;
        }


        if (!level) {
          showFormMessage(
            "Please select your executive level.",
            "error"
          );

          if (levelField) {
            levelField.focus();
          }

          return;
        }


        if (!selectedDate) {
          showFormMessage(
            "Please choose an available date from the calendar.",
            "error"
          );

          if (dateField) {
            dateField.focus();
          }

          return;
        }


        /*
          Find submit button.
        */

        const submitButton =
          bookingForm.querySelector(
            'button[type="submit"]'
          );


        const originalButtonText =
          submitButton
            ? submitButton.innerHTML
            : "";


        /*
          Loading state.
        */

        if (submitButton) {
          submitButton.disabled = true;

          submitButton.innerHTML =
            '<i class="fa-solid fa-spinner fa-spin"></i> Processing...';
        }


        showFormMessage(
          "Submitting your discovery call request...",
          "loading"
        );


        /*
          Simulate request.

          Replace this section later with:
          - fetch()
          - API request
          - Form backend
          - n8n webhook
          - Laravel endpoint
          - Google Calendar integration
        */

        setTimeout(function () {

          /*
            Frontend success state.
          */

          showFormMessage(
            "Thank you, " +
            escapeHtml(name) +
            ". Your discovery call request for " +
            escapeHtml(selectedDate) +
            " has been received. Veronica will confirm your session personally within one business day.",
            "success"
          );


          /*
            Reset form fields.
          */

          bookingForm.reset();


          /*
            Restore button.
          */

          if (submitButton) {
            submitButton.disabled = false;
            submitButton.innerHTML =
              originalButtonText;
          }

        }, 1200);
      }
    );


    /*
      Display form message.
    */

    function showFormMessage(
      message,
      type
    ) {
      if (!formNote) {
        return;
      }


      formNote.textContent =
        message;


      /*
        Remove previous state classes.
      */

      formNote.classList.remove(
        "is-success",
        "is-error",
        "is-loading"
      );


      if (type === "success") {
        formNote.classList.add(
          "is-success"
        );
      }


      if (type === "error") {
        formNote.classList.add(
          "is-error"
        );
      }


      if (type === "loading") {
        formNote.classList.add(
          "is-loading"
        );
      }
    }
  }


  /* =========================================================
     11. EMAIL VALIDATION
     ========================================================= */

  function isValidEmail(email) {
    const emailPattern =
      /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    return emailPattern.test(email);
  }


  /* =========================================================
     12. HTML ESCAPE HELPER
     ---------------------------------------------------------
     Prevents user-entered values from being injected
     into HTML when used in messages.
     ========================================================= */

  function escapeHtml(value) {
    return String(value)
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;")
      .replace(/'/g, "&#039;");
  }


  /* =========================================================
     13. FAQ ACCORDION
     ---------------------------------------------------------
     Handles:
     - Open / close
     - aria-expanded
     - Icon rotation through CSS
     - Single-open accordion behavior
     ========================================================= */

  function initFAQAccordion() {
    const accordion =
      document.getElementById("qpAccordion");

    if (!accordion) {
      return;
    }


    const triggers =
      accordion.querySelectorAll(
        ".qp-accordion__trigger"
      );


    triggers.forEach(function (trigger) {

      trigger.addEventListener(
        "click",
        function () {

          const currentItem =
            trigger.closest(
              ".qp-accordion__item"
            );


          if (!currentItem) {
            return;
          }


          const isCurrentlyOpen =
            currentItem.classList.contains(
              "is-open"
            );


          /*
            Close every other FAQ item.
          */

          const allItems =
            accordion.querySelectorAll(
              ".qp-accordion__item"
            );


          allItems.forEach(function (item) {

            item.classList.remove(
              "is-open"
            );


            const itemTrigger =
              item.querySelector(
                ".qp-accordion__trigger"
              );


            if (itemTrigger) {
              itemTrigger.setAttribute(
                "aria-expanded",
                "false"
              );
            }
          });


          /*
            If it was closed,
            open the clicked item.

            If it was already open,
            leave everything closed.
          */

          if (!isCurrentlyOpen) {
            currentItem.classList.add(
              "is-open"
            );

            trigger.setAttribute(
              "aria-expanded",
              "true"
            );
          }
        }
      );
    });


    /*
      The first FAQ in the HTML has
      aria-expanded="true".

      Make sure the visual .is-open class
      also exists on page load.
    */

    const initiallyExpanded =
      accordion.querySelector(
        '.qp-accordion__trigger[aria-expanded="true"]'
      );


    if (initiallyExpanded) {
      const initialItem =
        initiallyExpanded.closest(
          ".qp-accordion__item"
        );

      if (initialItem) {
        initialItem.classList.add(
          "is-open"
        );
      }
    }
  }


  /* =========================================================
     14. NEWSLETTER FORM
     ---------------------------------------------------------
     Handles:
     - Email validation
     - Loading state
     - Success message

     IMPORTANT:
     No real email service is connected.
     ========================================================= */

  function initNewsletterForm() {
    const newsletterForm =
      document.getElementById(
        "newsletterForm"
      );


    if (!newsletterForm) {
      return;
    }


    newsletterForm.addEventListener(
      "submit",
      function (event) {
        event.preventDefault();


        const input =
          newsletterForm.querySelector(
            'input[type="email"]'
          );

        const button =
          newsletterForm.querySelector(
            'button[type="submit"]'
          );


        if (!input) {
          return;
        }


        const email =
          input.value.trim();


        /*
          Validate email.
        */

        if (!isValidEmail(email)) {
          input.focus();

          showNewsletterMessage(
            "Please enter a valid email address."
          );

          return;
        }


        /*
          Save original button HTML.
        */

        const originalButtonHTML =
          button
            ? button.innerHTML
            : "";


        /*
          Loading state.
        */

        if (button) {
          button.disabled = true;

          button.innerHTML =
            '<i class="fa-solid fa-spinner fa-spin"></i>';
        }


        /*
          Simulate subscription request.
        */

        setTimeout(function () {

          showNewsletterMessage(
            "You're on the list. Thank you."
          );


          input.value = "";


          if (button) {
            button.disabled = false;
            button.innerHTML =
              originalButtonHTML;
          }

        }, 900);
      }
    );


    /*
      Create temporary newsletter message.
    */

    function showNewsletterMessage(
      message
    ) {
      let messageElement =
        newsletterForm.parentElement.querySelector(
          ".qp-newsletter-message"
        );


      /*
        Create message if it doesn't exist.
      */

      if (!messageElement) {
        messageElement =
          document.createElement("p");

        messageElement.className =
          "qp-newsletter-message";

        messageElement.style.marginTop =
          "10px";

        messageElement.style.fontSize =
          "12px";

        messageElement.style.color =
          "var(--qp-gold-soft)";

        newsletterForm.parentElement.appendChild(
          messageElement
        );
      }


      messageElement.textContent =
        message;


      /*
        Remove message automatically.
      */

      setTimeout(function () {
        if (messageElement) {
          messageElement.textContent = "";
        }
      }, 5000);
    }
  }


  /* =========================================================
     15. HANDLE INTERNAL CTA LINKS
     ---------------------------------------------------------
     Makes buttons such as:

       Reserve Your Session
       Check Available Dates
       Enquire
       Book Now
       Book Discovery Call

     scroll naturally to #booking.
     ========================================================= */

  document.addEventListener(
    "click",
    function (event) {

      const target =
        event.target.closest(
          'a[href="#booking"]'
        );


      if (!target) {
        return;
      }


      /*
        The smooth navigation handler above
        handles the actual scrolling.

        This section exists as a safe delegated
        handler for dynamically created elements.
      */
    }
  );


  /* =========================================================
     16. VISIBILITY / RESIZE SAFETY
     ---------------------------------------------------------
     Refresh AOS and Slick layout after
     browser resize where necessary.
     ========================================================= */

  let resizeTimer;

  window.addEventListener(
    "resize",
    function () {

      clearTimeout(resizeTimer);


      resizeTimer = setTimeout(
        function () {

          /*
            Refresh AOS if available.
          */

          if (
            typeof AOS !== "undefined" &&
            typeof AOS.refresh === "function"
          ) {
            AOS.refresh();
          }


          /*
            Refresh Slick sliders.
          */

          if (
            typeof window.jQuery !== "undefined"
          ) {
            const $ =
              window.jQuery;


            const programSlider =
              $(".qp-programs__slider");

            const testimonialSlider =
              $(".qp-testimonials__slider");


            if (
              programSlider.length &&
              programSlider.hasClass(
                "slick-initialized"
              )
            ) {
              programSlider.slick(
                "setPosition"
              );
            }


            if (
              testimonialSlider.length &&
              testimonialSlider.hasClass(
                "slick-initialized"
              )
            ) {
              testimonialSlider.slick(
                "setPosition"
              );
            }
          }

        },
        250
      );
    }
  );


  /* =========================================================
     17. CONSOLE BRAND MESSAGE
     ---------------------------------------------------------
     Small developer-facing message.
     ========================================================= */

  console.log(
    "%cQuiet Power",
    "font-size:20px;font-weight:bold;"
  );

  console.log(
    "Executive Coaching Homepage initialized successfully."
  );

})();