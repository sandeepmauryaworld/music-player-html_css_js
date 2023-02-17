const wrapper = document.querySelector(".wrapper")
const musicImg = wrapper.querySelector('.img-area img')
const musicName = wrapper.querySelector('.song-details .name')
const musicArtist= wrapper.querySelector('.song-details .artist')
const mainAudio= wrapper.querySelector('#main-audio')
const playPauseBtn= wrapper.querySelector('.play-pause')
const prevBtn= wrapper.querySelector('#prev')
const nextBtn= wrapper.querySelector('#next')
const progressArea= wrapper.querySelector('.progress-area')
const progressBar= wrapper.querySelector('.progress-bar')
const musicList= wrapper.querySelector('.music-list')
const showMoreBtn= wrapper.querySelector('#more-music')
const hideMusicBtn= musicList.querySelector('#close')

let musicIndex = Math.floor((Math.random() * allMusic.length) + 1);

window.addEventListener('load', () => {
  loadMusic(musicIndex)
  playingNow()
})

// LOAD MUSIC FUNCTION
function loadMusic(indexNumb) {
  musicName.innerText = allMusic[indexNumb - 1].songTitle
  musicArtist.innerText = allMusic[indexNumb -1 ].artist
  musicImg.src = `images/${allMusic[indexNumb - 1].img}.jfif`
  mainAudio.src = `music/${allMusic[indexNumb - 1].src}.mp3`
}

function playMusic() {
  wrapper.classList.add('paused')
  playPauseBtn.querySelector('i').innerText = 'pause'
  mainAudio.play()
}

function pauseMusic() {
  wrapper.classList.remove('paused')
  playPauseBtn.querySelector('i').innerText = 'play_arrow'
  mainAudio.pause()
}

function nextMusic() {
  musicIndex ++
  musicIndex > allMusic.length ? musicIndex = 1 : musicIndex = musicIndex
  loadMusic(musicIndex)
  playMusic()
  playingNow()
}

function prevMusic() {
  musicIndex --
  musicIndex < 0 ? musicIndex = allMusic.length : musicIndex = musicIndex
  loadMusic(musicIndex)
  playMusic()
  playingNow()
}

playPauseBtn.addEventListener('click', () => {
  const isMusicPaused = wrapper.classList.contains('paused')
  isMusicPaused ? pauseMusic() : playMusic()
  playingNow()
})

nextBtn.addEventListener('click', () => {
  nextMusic()
})

prevBtn.addEventListener('click', () => {
  prevMusic()
})

mainAudio.addEventListener('timeupdate', (e) => {
  console.log(e)
  const currentTime = e.target.currentTime
  const duration = e.target.duration
  let progressWidth = (currentTime / duration) * 100
  progressBar.style.width = `${progressWidth}%`

  let musicCurrentTime = wrapper.querySelector('.current')
  let musicDuration = wrapper.querySelector('.duration')

  mainAudio.addEventListener('loadeddata', (e) => {
    console.log(e)
    let audioDuration = mainAudio.duration
    let totalMin = Math.floor(audioDuration / 60)
    let totalSec = Math.floor(audioDuration % 60)
    totalSec < 10 ? totalSec = `0${totalSec}` : totalSec = totalSec
    musicDuration.innerText = `${totalMin}:${totalSec}`
  })

  let currentMin = Math.floor(currentTime / 60)
  let currentSec = Math.floor(currentTime % 60)
  currentSec < 10 ? currentSec = `0${currentSec}` : currentSec = currentSec
  musicCurrentTime.innerText = `${currentMin}:${currentSec}`
})


progressArea.addEventListener('click', (e) => {
  let progressWidthval = progressArea.clientWidth 
  let clickedOffSetX = e.offsetX
  let songDuration = mainAudio.duration

  mainAudio.currentTime = (clickedOffSetX / progressWidthval) * songDuration
  playMusic()
})


const repeatBtn = wrapper.querySelector('#repeat-plist')
repeatBtn.addEventListener('click', () => {
  let getText = repeatBtn.innerText
  switch(getText) {
    case "repeat":
      repeatBtn.innerText = 'repeat_one'
      repeatBtn.setAttribute('title', "Song looped")
      break
    case "repeat_one":
      repeatBtn.innerText = 'shuffle'
      repeatBtn.setAttribute('title', "Playback shuffle")
      break
    case "shuffle":
      repeatBtn.innerText = 'repeat'
      repeatBtn.setAttribute('title', "Playlist looped")
      break
  }
})

mainAudio.addEventListener('ended', () => {
  let getText = repeatBtn.innerText
  switch(getText) {
    case "repeat":
      nextMusic()
      break
    case "repeat_one":
      mainAudio.currentTime = 0
      loadMusic(musicIndex)
      playMusic()
      break
    case "shuffle":
      let randIndex = Math.floor((Math.random() * allMusic.length) + 1)
      do{
        randIndex = Math.floor((Math.random() * allMusic.length) + 1) 
      }while(musicIndex == randIndex)
      musicIndex = randIndex
      loadMusic(musicIndex)
      playMusic()
      playingNow()
      break
  }
})

showMoreBtn.addEventListener('click', () => {
  musicList.classList.toggle('show')
})

hideMusicBtn.addEventListener('click', () => {
  showMoreBtn.click()
})

const ulTag = wrapper.querySelector('ul')

for (let i = 0; i < allMusic.length; i++) {
  let liTag = `<li li-index='${i + 1}'>
                  <div class="row">
                    <span>${allMusic[i].songTitle}</span>
                    <p>${allMusic[i].artist}</p>
                  </div>
                  <audio class="${allMusic[i].src}" src="music/${allMusic[i].src}.mp3"></audio>
                  <span id="${allMusic[i].src}" class="audio-duration">2:57</span>
                </li>`
  
  ulTag.insertAdjacentHTML('beforeend', liTag)

  let liAudioTag = ulTag.querySelector(`.${allMusic[i].src}`)
  let liAudioDuration = ulTag.querySelector(`#${allMusic[i].src}`)

    liAudioTag.addEventListener('loadeddata', (e) => {
    console.log(e)
    let audioDuration = liAudioTag.duration
    let totalMin = Math.floor(audioDuration / 60)
    let totalSec = Math.floor(audioDuration % 60)
    totalSec < 10 ? totalSec = `0${totalSec}` : totalSec = totalSec
    liAudioDuration.innerText = `${totalMin}:${totalSec}`
      liAudioDuration.setAttribute('t-duration', `${totalMin}:${totalSec}`)
  })
}

const allLiTags = ulTag.querySelectorAll('li')
function playingNow() {
  for (let j = 0; j < allLiTags.length; j++) {
    let audioTag = allLiTags[j].querySelector('.audio-duration')
    if(allLiTags[j].classList.contains('playing')) {
      allLiTags[j].classList.remove('playing')
      let adDuration = audioTag.getAttribute('t-duration')
      audioTag.innerText = adDuration
    }
    if(allLiTags[j].getAttribute('li-index') == musicIndex) {
      allLiTags[j].classList.add('playing')
      audioTag.innerText = 'Playing'
    }
    allLiTags[j].setAttribute('onclick', 'clicked(this)')
  }
}

function clicked(element) {
  let getLiIndex = element.getAttribute('li-index')
  musicIndex = getLiIndex
  loadMusic(musicIndex)
  playMusic()
  playingNow()
}