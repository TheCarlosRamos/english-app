(function(){
  function shuffle(a){return a.sort(()=>Math.random()-0.5)}
  function createGame(DATA){
    const TOTAL=10; let score=0,idx=0,rounds=[],startTime, streak=0, wrongAnswers=[];
    const start=document.getElementById('start');
    const quiz=document.getElementById('quiz');
    const end=document.getElementById('end');
    const term=document.getElementById('term');
    const choices=document.getElementById('choices');
    const scoreEl=document.getElementById('score');
    const btn=document.getElementById('next');
    const progressBar=document.getElementById('progress-bar');
    const currentQuestionEl=document.getElementById('current-question');
    const streakEl=document.getElementById('streak');
    const streakCountEl=document.getElementById('streak-count');
    const reviewEl=document.getElementById('review');

    document.getElementById('begin').onclick=()=>{
      rounds=shuffle(DATA).slice(0,TOTAL);
      startTime = Date.now();
      streak=0; updateStreak();
      wrongAnswers=[];
      start.style.display='none'; quiz.style.display='block'; render();
    }

    function updateStreak(){
      if(streak>=2){
        streakCountEl.textContent=streak;
        streakEl.classList.remove('hidden');
        streakEl.classList.remove('pop');
        void streakEl.offsetWidth; // reinicia a animação
        streakEl.classList.add('pop');
      } else {
        streakEl.classList.add('hidden');
      }
    }

    function render(){
      btn.disabled=true; choices.innerHTML='';
      term.textContent=rounds[idx].en;
      
      // Update progress
      if(currentQuestionEl) currentQuestionEl.textContent = idx + 1;
      if(progressBar) progressBar.style.width = ((idx + 1) / TOTAL * 100) + '%';
      
      const opts=shuffle([rounds[idx].pt,...shuffle(DATA.filter(d=>d.pt!==rounds[idx].pt)).slice(0,2).map(d=>d.pt)]);
      opts.forEach(o=>{
        const div=document.createElement('div');
        div.className = 'choice-card bg-gray-800 border-2 border-gray-600 rounded-lg p-4 cursor-pointer hover:border-gray-500 transition-all duration-300';
        div.textContent=o;
        div.onclick=()=>select(div,o);
        choices.appendChild(div);
      })

      const speakBtn=document.createElement('button');
      speakBtn.innerHTML='🔊';
      speakBtn.style.cssText='margin-left:10px;font-size:1.2em;cursor:pointer;background:none;border:none;';
      speakBtn.onclick=()=>speak(rounds[idx].en);
      term.appendChild(speakBtn);
      speak(rounds[idx].en);
    }

    function speak(text){
      if(!('speechSynthesis' in window)) return;
      speechSynthesis.cancel();
      const utter = new SpeechSynthesisUtterance(text);
      utter.lang = 'en-US';
      speechSynthesis.speak(utter);
    }

    function select(div,val){
      [...choices.children].forEach(c=>{
        c.onclick=null;
        c.classList.add('selected');
      });
      
      if(val===rounds[idx].pt){
        div.classList.remove('border-gray-600');
        div.classList.add('correct', 'border-green-500');
        score++;
        streak++;
        updateStreak();
      } else {
        streak=0;
        updateStreak();
        wrongAnswers.push({en: rounds[idx].en, correct: rounds[idx].pt});
        div.classList.remove('border-gray-600');
        div.classList.add('incorrect', 'border-red-500');
        // Show correct answer
        [...choices.children].forEach(c=>{
          if(c.textContent===rounds[idx].pt){
            c.classList.remove('border-gray-600');
            c.classList.add('correct', 'border-green-500');
          }
        });
      }
      scoreEl.textContent=score; 
      btn.disabled=false;
    }

    btn.onclick=()=>{
      idx++; 
      if(idx>=rounds.length){
        const endTime=Date.now();
        const elapsedSeconds=Math.floor((endTime-startTime)/1000);
        const minutes=Math.floor(elapsedSeconds/60);
        const seconds=elapsedSeconds%60;
        const formattedTime=`${minutes}:${seconds.toString().padStart(2,'0')}`;
        let message;
        if (score===10) {
          message="Perfect!";
        } else if (score>=8) {
          message="Excellent!";
        } else if (score>=6) {
          message = "Good job!";
        } else {
          message="Keep practicing!";
        }
        quiz.style.display='none';
        end.style.display='block';
        document.getElementById('final').textContent=score+'/'+TOTAL;
        document.getElementById('time').textContent=formattedTime;
        document.getElementById('message').textContent=message;
        if(reviewEl){
          if(wrongAnswers.length>0){
            reviewEl.innerHTML='<h3 class="text-lg font-bold text-white mb-3">Review this:</h3>'+
              wrongAnswers.map(w=>'<div class="bg-gray-800 rounded-lg p-3 mb-2 flex justify-between"><span class="text-gray-300">'+w.en+'</span><span class="text-green-400 font-semibold">'+w.correct+'</span></div>').join('');
          } else {
            reviewEl.innerHTML='';
          }
        }
      } else {
        render();
      }
    }
  }
  window.QuizCore={createGame}
})();