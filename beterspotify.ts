import { Plugin } from "@vencord/plugin";

async function updateSpotifyUI() {
    // Fetch current song info from Spotify API
    const response = await fetch("https://api.spotify.com/v1/me/player/currently-playing", {
        headers: { Authorization: `Bearer YOUR_SPOTIFY_ACCESS_TOKEN` }
    });

    if (!response.ok) return;

    const data = await response.json();
    const progress = (data.progress_ms / data.item.duration_ms) * 100;

    // Find listen-along messages in Discord
    document.querySelectorAll(".spotify-listen-along").forEach(element => {
        // Apply custom styling
        element.classList.add("custom-listen-along");

        // Update song details
        const songInfo = element.querySelector(".song-info");
        if (songInfo) songInfo.innerText = `${data.item.name} - ${data.item.artists[0].name}`;

        // Update album cover
        const albumCover = element.querySelector(".album-cover");
        if (albumCover) albumCover.src = data.item.album.images[0].url;

        // Update progress bar
        const progressBar = element.querySelector(".progress-bar");
        if (progressBar) progressBar.style.width = `${progress}%`;

        // Update time display
        const songTime = element.querySelector(".song-time");
        if (songTime) songTime.innerHTML = `${formatTime(data.progress_ms)} / ${formatTime(data.item.duration_ms)}`;
    });
}

function formatTime(ms: number): string {
    const minutes = Math.floor(ms / 60000);
    const seconds = ((ms % 60000) / 1000).toFixed(0);
    return `${minutes}:${seconds.padStart(2, "0")}`;
}

export default new Plugin({
    name: "Spotify UI Mod",
    description: "Customizes Spotify Listen-Along UI.",
    start() {
        updateSpotifyUI(); // Initial update
        setInterval(updateSpotifyUI, 1000); // Update song info every second
    },
    stop() {
        document.querySelectorAll(".custom-listen-along").forEach(element => {
            element.classList.remove("custom-listen-along");
        });
    }
});
