document.addEventListener('DOMContentLoaded', () => {
    const hamburgerBtn = document.getElementById('hamburger-btn');
    const dropdownMenu = document.getElementById('dropdown-menu');

    // Toggle the dropdown and hamburger animation
    hamburgerBtn.addEventListener('click', (event) => {
        event.stopPropagation(); // Prevents the document click event from firing immediately
        hamburgerBtn.classList.toggle('active');
        dropdownMenu.classList.toggle('active');
    });

    // Close the menu if the user clicks anywhere outside of it
    document.addEventListener('click', (event) => {
        const isClickInsideMenu = dropdownMenu.contains(event.target);
        const isClickOnButton = hamburgerBtn.contains(event.target);

        if (!isClickInsideMenu && !isClickOnButton && dropdownMenu.classList.contains('active')) {
            hamburgerBtn.classList.remove('active');
            dropdownMenu.classList.remove('active');
        }
    });
    
    // Optional: Close menu when pressing the Escape key
    document.addEventListener('keydown', (event) => {
        if (event.key === 'Escape' && dropdownMenu.classList.contains('active')) {
            hamburgerBtn.classList.remove('active');
            dropdownMenu.classList.remove('active');
        }
    });
});