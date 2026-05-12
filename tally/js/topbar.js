document.addEventListener("DOMContentLoaded", () => {
    // Select the topbar using the class since we didn't give it an ID in the last tally.html
    const topBar = document.querySelector(".futuristic-topbar");
    const hamburgerBtn = document.getElementById("hamburger-btn");
    const dropdownMenu = document.getElementById("dropdown-menu");
    
    let lastScrollTop = 0;

    window.addEventListener("scroll", () => {
        let scrollTop = window.pageYOffset || document.documentElement.scrollTop;
        
        // 1. Hide/Show logic
        if (scrollTop > lastScrollTop && scrollTop > 80) {
            // User is scrolling DOWN - Hide the bar
            topBar.style.top = "-80px"; 
            
            // Also close the menu if it was open while scrolling down
            if (hamburgerBtn.classList.contains("active")) {
                hamburgerBtn.classList.remove("active");
                dropdownMenu.classList.remove("active");
            }
        } else {
            // User is scrolling UP - Show the bar
            topBar.style.top = "0";
        }
        
        // Update position for next scroll event
        lastScrollTop = scrollTop <= 0 ? 0 : scrollTop; 
    }, { passive: true });

    // 2. Keep the hamburger menu logic working
    hamburgerBtn.addEventListener("click", (e) => {
        e.stopPropagation();
        hamburgerBtn.classList.toggle("active");
        dropdownMenu.classList.toggle("active");
    });

    // 3. Close menu if user clicks elsewhere
    document.addEventListener("click", (e) => {
        if (!topBar.contains(e.target)) {
            hamburgerBtn.classList.remove("active");
            dropdownMenu.classList.remove("active");
        }
    });
});