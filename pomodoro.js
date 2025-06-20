const setTimer = document.getElementById('initialsetTimeButton')
setTimer.onclick = setTime

function setTime() {

  const parentDiv = document.getElementById('timeToSet');


  if (!parentDiv.innerHTML) {

    const workTime = document.createElement('input');
    const breakTime = document.createElement('input');
    const workTimeParagraph = document.createElement('p');
    const breakTimeParagraph = document.createElement('p');
    const workTimeDiv = document.createElement('div');
    const breakTimeDiv = document.createElement('div');


    workTime.id = 'workTime';
    breakTime.id = 'breakTime';

    workTime.type = 'number';
    breakTime.type = 'number';


    workTimeParagraph.textContent = 'Enter the Focus Time:'
    breakTimeParagraph.textContent = 'Enter the Break Time:'
    console.log('reavhed')
    workTimeParagraph.classList.add('timeParagraph');
    breakTimeParagraph.classList.add('timeParagraph');


    workTimeDiv.append(workTimeParagraph, workTime);
    breakTimeDiv.append(breakTimeParagraph, breakTime);


    parentDiv.append(workTimeDiv, breakTimeDiv);


    const initialButton = document.getElementById('initialsetTimeButton');
    initialButton.textContent = 'Go Back';
    initialButton.onclick = goBack;
    initialButton.id = 'goBackButoon'



    const forButton = document.getElementById('forButton');
    const button = document.createElement('button');

    button.textContent = 'Set Time';
    button.id = 'finalSetTimeButton';


    button.onclick = recordTime;


    forButton.appendChild(button);

  }
}


function goBack() {
  console.log('go back')
  const initialButton = document.getElementById('goBackButoon');
  const parentDiv = document.getElementById('timeToSet');
  const forButton = document.getElementById('forButton');
  if (initialButton) {

    initialButton.textContent = 'Set Time';



    initialButton.onclick = setTime;
    initialButton.id = 'initialsetTimeButton'

  }

  parentDiv.innerHTML = '';
  forButton.innerHTML = '';


}


function recordTime() {
  const workTime = document.getElementById('workTime');
  const breakTime = document.getElementById('breakTime');
  const tickingAudio = document.getElementById('tickingAudio');




  if (!workTime.value && !breakTime.value) {
    alert('Enter work time and break time.')
    return;
  }
  if (workTime.value < 1 || breakTime.value < 1) {
    workTime.value = '';
    breakTime.value = '';
    return;
  }


  document.getElementById('total-minute').textContent = workTime.value;

  document.getElementById('button-div').classList.add('hide');
  document.getElementById('timeStamp').classList.add('active');
  document.getElementById('tomato').classList.toggle('tomato-hide');
  document.getElementById('time-bar-hide').classList.toggle('time-bar-hide');
  document.getElementById('ongoingTime').textContent = 'Work Time'
  document.getElementById('volume-paragraph').classList.toggle('hide');

  createButtons('Pause', 'Restart', 'left');
  createButtons('Resume', 'Reset', 'right');

  document.getElementById('Resume-button').classList.toggle('clicked-button')

  tickingAudio.currentTime = 0;
  tickingAudio.play();
  tickingAudio.loop = 'true';
  workTimeTick(workTime, breakTime);




}


function createButtons(firstTextContent, secondTextContent, side) {
  let parentDiv;
  if (side === 'left') {
    parentDiv = document.getElementById('container-left-div')
  }
  else {
    parentDiv = document.getElementById('container-right-div');

  }
  const firstButton = document.createElement('button');
  const secondButton = document.createElement('button');
  firstButton.textContent = firstTextContent;
  secondButton.textContent = secondTextContent;
  firstButton.id = `${firstTextContent}-button`;
  secondButton.id = `${secondTextContent}-button`;

  parentDiv.append(firstButton, secondButton);



}





function workTimeTick(workTime, breakTime) {
  let isPaused = false;

  const pauseButton = document.getElementById('Pause-button');
  pauseButton.onclick = () => {
    if (!isPaused) {
      clearInterval(workTimeInterval);
      tickingAudio.pause();
      isPaused = true;
      pauseButton.classList.add('clicked-button');
      document.getElementById('Resume-button').classList.toggle('clicked-button');
    }
  }




  const resumeButton = document.getElementById('Resume-button');

  resumeButton.onclick = () => {
    if (isPaused) {
      workTimeTick(workTime, breakTime);
      tickingAudio.currentTime = 0;
      tickingAudio.play();
      isPaused = false;
      resumeButton.classList.add('clicked-button');
      document.getElementById('Pause-button').classList.toggle('clicked-button');
    }
  }

  const resetButton = document.getElementById('Reset-button');
  resetButton.onclick = () => {
    goBack();

    document.getElementById('button-div').classList.toggle('hide');
    document.getElementById('timeStamp').classList.toggle('active');
    document.getElementById('tomato').classList.toggle('tomato-hide');
    document.getElementById('time-bar-hide').classList.toggle('time-bar-hide');
    document.getElementById('volume-paragraph').classList.toggle('hide');
    document.getElementById('ongoingTime').textContent = '';
    document.querySelectorAll('#container-left-div button').forEach((button) => { button.remove() });
    document.querySelectorAll('#container-right-div button').forEach((button) => { button.remove() });
    document.getElementById('time-bar-progress').style.width = '0%'
    document.getElementById('minutes').textContent = '00';

    document.getElementById('seconds').textContent = '00';

    clearInterval(workTimeInterval);
    tickingAudio.pause();

  }



  const restartButton = document.getElementById('Restart-button');
  restartButton.onclick = () => {
    document.getElementById('minutes').textContent = '00';

    document.getElementById('seconds').textContent = '00';
    document.getElementById('completed-minute').textContent = '0';
    document.getElementById('time-bar-progress').style.width = '0%';
    tickingAudio.currentTime = 0;
    tickingAudio.play();
    if (isPaused) {
      document.getElementById('Pause-button').classList.toggle('clicked-button');
      document.getElementById('Resume-button').classList.toggle('clicked-button');
      workTimeTick(workTime, breakTime);
      isPaused = false;
    }



  }


  const workTimeInterval = setInterval(() => {


    const image = document.getElementById('tomato');
    if (image.src.includes('images/tomato.png')) {
      image.src = 'images/tomato-flipped.png';
    }
    else {
      image.src = 'images/tomato.png';
    }




    const workMinutes = document.getElementById('minutes');
    const workSeconds = document.getElementById('seconds');
    let second = Number(workSeconds.textContent) + 1;
    timeProgress(workTime.value);
    if (second === 60) {
      second = 0;
      const minute = Number(workMinutes.textContent) + 1;
      workMinutes.textContent = minute < 10 ? '0' + minute : minute;

      document.getElementById('completed-minute').textContent = minute;


      tickingAudio.currentTime = 0;
      tickingAudio.play();

      if (Number(workTime.value) === minute) {
        tickingAudio.pause();

        document.getElementById('takeBreak').play();
        clearInterval(workTimeInterval);
        document.querySelectorAll('#container-left-div button').forEach((button) => { button.remove() });
        document.querySelectorAll('#container-right-div button').forEach((button) => { button.remove() });
        breakTimeTick(breakTime);


      }




    }
    workSeconds.textContent = second < 10 ? '0' + second : second;

  }, 1000)

}



function breakTimeTick(breakTime) {




  setTimeout(() => {
    document.getElementById('ongoingTime').textContent = 'Break Time'
    document.getElementById('completed-minute').textContent = '0';
    document.getElementById('total-minute').textContent = breakTime.value;
    document.getElementById('time-bar-progress').style.width = '0%'



    const breakTick = document.getElementById('breakRunning');

    breakTick.play();
    breakTick.loop = true;




    const breakTimeInterval = setInterval(() => {


      const image = document.getElementById('tomato');
      if (image.src.includes('images/tomato.png')) {
        image.src = 'images/tomato-flipped.png';
      }
      else {
        image.src = 'images/tomato.png';
      }




      const workMinutes = document.getElementById('minutes');
      const workSeconds = document.getElementById('seconds');



      workMinutes.textContent = '00';
      let second = Number(workSeconds.textContent) + 1;
      timeProgress(breakTime.value);
      if (second === 60) {
        second = 0;
        const minute = Number(workMinutes.textContent) + 1;
        workMinutes.textContent = minute < 10 ? '0' + minute : minute;

        document.getElementById('completed-minute').textContent = minute;


        if (Number(breakTime.value) === minute) {
          breakTick.pause();
          document.getElementById('breakEnded').play();
          clearInterval(breakTimeInterval);

        }


      }
      workSeconds.textContent = second < 10 ? '0' + second : second;

    }, 1000)

  }, 30 * 1000);



}

function timeProgress(workTime) {

  const progressBar = document.getElementById('time-bar-progress');
  let percentToIncrease = (1 / (60 * workTime)) * 100;
  if (!progressBar.style.width) {
    progressBar.style.width = `${percentToIncrease}%`
  }
  else {
    const width = progressBar.style.width.slice(0, -1);
    percentToIncrease += Number(width);
    progressBar.style.width = `${percentToIncrease}%`

  }
}

const volumeInput = document.getElementById('volume-input');
volumeInput.addEventListener('input', () => {
  const volume = volumeInput.value / 100;
  document.getElementById('tickingAudio').volume = volume;
  document.getElementById('takeBreak').volume = volume;
  document.getElementById('breakEnded').volume = volume;
  document.getElementById('breakRunning').volume = volume;


})




const title = document.getElementById('title');
title.addEventListener('click', () => {
  goBack();

  if (!document.getElementById('tomato').classList.contains('tomato-hide')) {

    location.reload();

  }



})