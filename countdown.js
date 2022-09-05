const hoursElement = document.querySelector("#hours");
const minutesElement = document.querySelector("#minutes");
const secondsElement = document.querySelector("#seconds");
const listItemHours = document.querySelector("#list-item-hours");
const timeToShowBonusInput = document.querySelector("#timeInput");
const bonusElement = document.querySelector("#bonus");
const countdown = document.querySelector("#countdown");

let warningDone = false;
let videoPlayerInterval = "";

$(document).ready(function () {
  if (videoPlayerInterval) {
    clearInterval(videoPlayerInterval);
  }
  const iframe = document.querySelector("iframe");
  const player = new Vimeo.Player(iframe);

  player.getDuration().then(function (duration) {
    // To minutes
    if (duration / 60 < 60) {
      listItemHours.style.display = "none";
    }
  });

  videoPlayerInterval = setInterval(function () {
    trackVimeoPlayer(player);
  }, 1000);
});

function trackVimeoPlayer(vimeoPlayer) {
  vimeoPlayer.on("timeupdate", function (getAll) {
    const currentPos = getAll.seconds; //get current time
    const videoEndTime = getAll.duration; //get video duration
    const timeToShowBonusInSeconds = timeToShowBonusInput.value * 60;
    const timeLeft = timeToShowBonusInSeconds - currentPos;

    if (!warningDone && currentPos < timeToShowBonusInSeconds) {
      if (timeToShowBonusInSeconds > videoEndTime) {
        alert(
          "Invalid input value! It should be lower than the video max length."
        );
        stopVimeoPlayer(vimeoPlayer);
        warningDone = true;
      } else if (timeLeft < 1) {
        bonusElement.style.display = "block";
        updateTimer(timeLeft);
        stopVimeoPlayer(vimeoPlayer);
      } else {
        bonusElement.style.display = "none";
        updateTimer(timeLeft);
      }
    } else {
      updateTimer(0);
    }
  });

  vimeoPlayer.on("ended", function () {
    clearInterval(videoPlayerInterval);
  });
}

function updateTimer(timeLeft) {
  secondsElement.innerText = Math.floor(timeLeft % 60)
    .toString()
    .padStart(2, "0");
  minutesElement.innerText = Math.floor((timeLeft % 3600) / 60)
    .toString()
    .padStart(2, "0");
  hoursElement.innerText = Math.floor(timeLeft / 3600)
    .toString()
    .padStart(2, "0");
}

function stopVimeoPlayer(vimeoPlayer) {
  vimeoPlayer.off("timeupdate");
  vimeoPlayer.off("ended");
  clearInterval(videoPlayerInterval);
}