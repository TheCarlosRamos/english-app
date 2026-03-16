
(function(){
  function shuffle(a){return a.sort(()=>Math.random()-0.5)}
  function createGame(DATA){
    const TOTAL=10; let score=0,idx=0,rounds=[];
    const start=document.getElementById('start');
    const quiz=document.getElementById('quiz');
    const end=document.getElementById('end');
    const term=document.getElementById('term');
    const choices=document.getElementById('choices');
    const scoreEl=document.getElementById('score');
    const btn=document.getElementById('next');
    const progressBar=document.getElementById('progress-bar');
    const currentQuestionEl=document.getElementById('current-question');

    document.getElementById('begin').onclick=()=>{
      rounds=shuffle(DATA).slice(0,TOTAL);
      start.style.display='none'; quiz.style.display='block'; render();
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
        div.className = 'choice-card bg-white border-2 border-gray-200 rounded-lg p-4 cursor-pointer hover:border-purple-400 transition-all duration-300';
        div.textContent=o;
        div.onclick=()=>select(div,o);
        choices.appendChild(div);
      })
    }

    function select(div,val){
      [...choices.children].forEach(c=>{
        c.onclick=null;
        c.classList.add('selected');
      });
      
      if(val===rounds[idx].pt){
        div.classList.remove('border-gray-200');
        div.classList.add('correct', 'border-green-500');
        score++;
      } else {
        div.classList.remove('border-gray-200');
        div.classList.add('incorrect', 'border-red-500');
        // Show correct answer
        [...choices.children].forEach(c=>{
          if(c.textContent===rounds[idx].pt){
            c.classList.remove('border-gray-200');
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
        quiz.style.display='none'; 
        end.style.display='block'; 
        document.getElementById('final').textContent=score+'/'+TOTAL;
      } else {
        render();
      }
    }
  }
  window.QuizCore={createGame}
})();
