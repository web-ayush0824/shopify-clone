let currentSong = new Audio();
let songs;
let currFolder;

function convertToMinutesSeconds(seconds) {
    // Ensure seconds is an integer by rounding
    seconds = Math.round(seconds);

    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;

    // Format minutes and seconds with leading zeros if needed
    const formattedMinutes = minutes.toString().padStart(2, '0');
    const formattedSeconds = remainingSeconds.toString().padStart(2, '0');

    // Return formatted time in MM:SS format
    return `${formattedMinutes}:${formattedSeconds}`;
}


async function getSongs(folder) {
    currFolder = folder;
    let a = await fetch(`http://127.0.0.1:3000/${folder}/`);
    let response = await a.text();
    let div = document.createElement("div");
    div.innerHTML = response;
    let as = div.getElementsByTagName("a");
    songs = []
    for (let index = 0; index < as.length; index++) {
        const element = as[index];
        if (element.href.endsWith(".mp3")) {
            songs.push(element.href.split(`${folder}`)[1])
        }

    }
    // Show all songs in playlist 
    let songUL = document.querySelector(".songList").getElementsByTagName("ul")[0]
    songUL.innerHTML = ""
    for (const song of songs) {
        songUL.innerHTML = songUL.innerHTML + `<li>
                            <img src="./music.svg" alt="Music Icon" class="invert">
                            <div class="info">
                                <div>${song.replaceAll("%20", " ")}</div>
                                <div>Ayush</div>
                            </div>
                            <div class="playnow">
                                <span>Play Now</span>
                                <img class="invert" src="./play.svg" alt="Play Icon" height="24px" width="24px">
                            </div>
                        </li>`
    }

    // Attach event listner to each listner 
    Array.from(document.querySelector(".songList").getElementsByTagName("li")).forEach((e) => {
        e.addEventListener("click", element => {
            playMusic(e.querySelector(".info").firstElementChild.innerHTML);
        })
    });
}

const playMusic = (track, pause = false) => {
    currentSong.src = `/${currFolder}/` + track
    currentSong.play();
    if (!pause) {
        currentSong.play();
        play.src = "pause.svg"
    }
    document.querySelector(".songinfo").innerHTML = decodeURI(track);
    document.querySelector(".songtime").innerHTML = "00:00 / 00:00"
}

async function displayAlbums() {
    let a = await fetch(`http://127.0.0.1:3000/songs/`);
    let response = await a.text();
    let div = document.createElement("div");
    div.innerHTML=response;
    let anchors = div.getElementsByTagName("a")
    let cardContainer = document.querySelector(".cardContainer")
    let array = Array.from(anchors)
        for (let index = 0; index < array.length; index++) {
            const e = array[index];

        if (e.href.includes("/songs")) {
            let folder = e.href.split("/").slice(-2)[0]
            let a = await fetch(`http://127.0.0.1:3000/songs/${folder}/info.json`);
            let response = await a.json();
            cardContainer.innerHTML=cardContainer.innerHTML + `<div data-folder="${folder}" class="card">
                        <div class="play">
                            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 384 512" width="20" height="20">
                                <path
                                    d="M73 39c-14.8-9.1-33.4-9.4-48.5-.9S0 62.6 0 80L0 432c0 17.4 9.4 33.4 24.5 41.9s33.7 8.1 48.5-.9L361 297c14.3-8.7 23-24.2 23-41s-8.7-32.2-23-41L73 39z"
                                    fill="black" />
                            </svg>
                        </div>
                        <img src="https://i.scdn.co/image/ab67616d00001e02aad3f4b601ae8763b3fc4e88"
                            alt="Honey Singh Song Image">
                        <h2>${response.title}</h2>
                        <p>${response.description}</p>
                    </div>`
        }
    }
    

     // Load Play list 
     Array.from(document.getElementsByClassName("card")).forEach(e => {
        e.addEventListener("click", async item => {
            songs = await getSongs(`songs/${item.currentTarget.dataset.folder}`)
        })
    })
}

async function main() {

    // Display Album
    displayAlbums()

    // Getting list of songs 
    await getSongs("songs/cs");
    playMusic(songs[0], true)

    // Attach event listner to play, next and previous 
    play.addEventListener("click", () => {
        if (currentSong.paused) {
            currentSong.play();
            play.src = "pause.svg";
        }
        else {
            currentSong.pause();
            play.src = "play.svg";
        }
    })


    // Play The first song
    var audio = new Audio(songs[0]);
    audio.play();
    audio.addEventListener("loadeddata", () => {
        let duration = audio.duration;
    })

    // Listen for time update event 
    currentSong.addEventListener("timeupdate", () => {
        document.querySelector(".songtime").innerHTML = `${convertToMinutesSeconds(currentSong.currentTime)}:${convertToMinutesSeconds(currentSong.duration)}`;

        document.querySelector(".circle").style.left = currentSong.currentTime / currentSong.duration * 100 + "%";
    })

    // Add an event listner to seekbar 
    document.querySelector(".seekbar").addEventListener("click", (e) => {
        let percent = (e.offsetX / e.target.getBoundingClientRect().width) * 100;
        document.querySelector(".circle").style.left = percent + "%";
        currentSong.currentTime = (currentSong.duration * percent) / 100;
    })

    // For hamberger menu 
    document.querySelector(".hambergerContainer").addEventListener("click", () => {
        document.querySelector(".left").style.left = 0;
    })
    document.querySelector(".close").addEventListener("click", () => {
        document.querySelector(".left").style.left = "-120%";
    })

    // Event listner for previous and next 
    previous.addEventListener("click", () => {
        if ((index - 1) >= 0) {
            playMusic(songs[index - 1])
        }
    })
    next.addEventListener("click", () => {
        currentSong.pause();

        let index = songs.indexOf(currentSong.src.split("/").slice(-1)[0])
        if ((index + 1) < songs.length8) {
            playMusic(songs[index + 1])
        }
    })


    // Add an event to volume 
    document.querySelector(".range").getElementsByTagName("input")[0].addEventListener("change", (e) => {
        currentSong.volume = parseInt(e.target.value) / 100;
    })

    // To mute when someone click on Speaker 
    document.querySelector(".volume>img").addEventListener("click",e=>{
        if(e.target.src.includes("volume.svg")){
            e.target.src= e.target.src.replace("volume.svg", "mute.svg")
            currentSong.volume=0;
            document.querySelector(".range").getElementsByTagName("input")[0].value=0;
        }
        else{
            e.target.src= e.target.src.replace("mute.svg", "volume.svg")
            currentSong.volume=0.1;
            document.querySelector(".range").getElementsByTagName("input")[0].value=10;
        }
    })

}

main();
