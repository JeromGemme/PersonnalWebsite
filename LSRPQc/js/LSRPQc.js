// --- MAIN PAGE LOGIC ---

document.addEventListener("DOMContentLoaded", () => {
    // Console greeting to ensure JS is hooked up
    console.log("Bienvenue sur LSRPQc!");

    // Example interaction: Discord button interaction
    const discordBtn = document.getElementById("discord-link");
    
    if(discordBtn) {
        discordBtn.addEventListener("click", (e) => {
            // Prevent default just in case you haven't set the href link yet
            // Remove the e.preventDefault() once you add your actual Discord invite URL in HTML
            e.preventDefault(); 
            
            // Add a small click effect logic if desired
            discordBtn.style.transform = "scale(0.95)";
            setTimeout(() => {
                discordBtn.style.transform = "translateY(-3px)"; // Return to hover state
                // window.open('https://discord.gg/YOUR_INVITE_LINK', '_blank'); // Uncomment when ready
                alert("Redirection vers Discord en cours... (Ajoutez le lien dans index.html)");
            }, 150);
        });
    }
});