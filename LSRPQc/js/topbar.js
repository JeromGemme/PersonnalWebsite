// --- TOP BAR & DROPDOWN LOGIC ---

document.addEventListener("DOMContentLoaded", () => {
    const topBar = document.getElementById("top-bar");
    const dropdownBtn = document.getElementById("dropdown-btn");
    const dropdownMenu = document.getElementById("dropdown-menu");
    
    let lastScrollTop = 0;

    // 1. Scroll Up / Scroll Down behavior
    window.addEventListener("scroll", () => {
        let scrollTop = window.pageYOffset || document.documentElement.scrollTop;
        
        // If scrolling down and passed the height of the top bar
        if (scrollTop > lastScrollTop && scrollTop > 70) {
            topBar.style.top = "-80px"; // Hide top bar
            dropdownMenu.classList.remove("show"); // Auto-close menu on scroll down
        } else {
            // Scrolling up
            topBar.style.top = "0"; // Show top bar
        }
        
        lastScrollTop = scrollTop <= 0 ? 0 : scrollTop; // For Mobile or negative scrolling
    });

    // 1.5 Click Dropdown Behavior
    dropdownBtn.addEventListener("click", (e) => {
        e.stopPropagation(); // Prevent click from instantly triggering the document close
        dropdownMenu.classList.toggle("show");
    });

    // Close the dropdown if the user clicks anywhere else on the page
    document.addEventListener("click", (e) => {
        if (!topBar.contains(e.target)) {
            dropdownMenu.classList.remove("show");
        }
    });
});