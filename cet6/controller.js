UI.form = select('form');
 select('button#signIn').onclick = function(ev){
     ev.preventDefault() ;
     let users = Model.users ;
     let userName = UI.form.user.value.trim() ;
     let passWord = UI.form.pass.value.trim() ;
  if(userName.length > 0 && passWord.length > 0){
          let user = {
           'userName': userName ,
           'passWord': passWord
         } 
         let exist = false ;
         for(let u of users){
             if(u.userName == userName){
                 exist = true ;
                 break ;
             }
         }
         if(exist){
             UI.footerLog(userName + '已经存在， 注册不成功！') ;
         }else{
             UI.footerLog(userName + '注册成功！') ;
             users.push(user) ;
         }
         let s = JSON.stringify(users) ;
         localStorage.setItem('users', s) ;
}else{
  UI.footerLog("无效注册，用户名和密码不能为空");
 
}
} ;

 select('button#loginIn').onclick = function(ev){
     ev.preventDefault() ;
     let users = Model.users ;
     let userName = UI.form.user.value ;
     let passWord = UI.form.pass.value ;
     
    let success = false ;
    for(let u of users){
      if(u.userName === userName && u.passWord === passWord){
         success = true ;
         break ;
      }
    }
    if(success &&  Model.CET6.length > 5000 ){
      UI.log(userName + '成功登录！') ;
      Model.user = userName ;
      UI.form.style.display = 'none' ;
      let learned = localStorage.getItem( Model.user + '-learned') ;
      if(learned){
         Model.learned = JSON.parse(learned) ;
      }else{
        Model.learned = [] ;
        learned = [] ;
      }

      let learning = [] ;
      
           for(let i=0;i < Model.numOfLearning ; i++){
             let rand = Math.floor(Math.random() * Model.CET6.length ) ;
             let word = {} ;
                 word.sn = rand ;
                 word.level = Model.CET6[rand].level ;
                 if(learned.length > Model.numOfLearning ){
                    for(let ld of learned){
                       if(ld.sn == rand){
                          word.level = ld.level;
                          word.timer = ld.timer ? ld.timer : null ;
                          break;
                       }
                    }
                 }
             learning.push(word) ;
            }
         Model.learning =  learning ;
       UI.printWord() ;
       UI.userStatus() ;  
    }else{ 
      if(!success){
         UI.footerLog(userName + '登录不成功，请查看用户名和密码！') ;
         }
      if(Model.CET6.length < 5000){
         UI.footerLog('单词库还未加载完毕，请等会儿再登录！') ;
      }
   }
 } ; 
 select('button#firstWord').onclick = function(){
    Model.pos = 0 ;
    UI.printWord() ;
    
 } 


 select('button#nextWord').onclick = function(){
    if( Model.pos < Model.learning.length -1){
         Model.pos ++ ;
     }else{
         Model.pos = 0 ;
     }
        UI.printWord() ;
                    
 } 

 select('button#lastWord').onclick = function(){
     Model.pos = Model.learning.length - 1  ;
     UI.printWord() ;
    
 }
UI.cnDoms = document.querySelectorAll('p.cn') ;
for(let cn of UI.cnDoms){
 cn.onclick = function(){
     let smile = ['😀','😁','😄','😉','😊','😋'] ;
     let cry = ['😒','😓','😧','😩','😭','😖'] ;
     let txt = cn.textContent ;
     let pos = Model.pos ;
     let currentSn = Model.learning[pos].sn ;
     if(txt === Model.CET6[currentSn].cn){
        let s = smile[Math.floor(Math.random()*smile.length)] ;
        UI.response( s+ "对" + s);
        Model.learning[pos].level -- ;
        this.className += ' right' ;
     }else{
        let s = cry[Math.floor(Math.random()*smile.length)] ;
        UI.response( s+ "错" + s);
        Model.learning[pos].level ++ ;
        this.className += ' wrong' ;
     }
     let timer = new Date() ;
     let year = timer.getFullYear() % 100 + '' ;
     let month = timer.getMonth() + 1 ;
         month > 9 ? month = month :  month = '0' + month  ;
     let date = timer.getDate() ;
     Model.learning[pos].timer = year + month + date;
 }
}

select('button#saveWord').onclick = function(){
 if(Model.pos === Model.numOfLearning -1){
  let learned = Model.learned ;
  if(learned.length >= Model.numOfLearning){
       for(let word of Model.learning){
             let found = false ;
             for(let l of learned){
                 if (l.sn == word.sn){
                     if(word.timer) l.timer = word.timer ;
                     if(l.level > word.level )  l.level = word.level ;
                     found = true ;
                     break ;
                 }
             }
           if(!found){
             let w = {} ;
             w.sn = word.sn ; 
             w.level = word.level ; 
             if(word.timer) {
              w.timer = word.timer;
             }
             learned.push(w) ;
           }
         }
   }else{
      learned = [] ;
      for(let w of Model.learning){
         let l = {} ;
         l.sn = w.sn ;
         l.level = w.level ;
         learned.push(l) ;
      }
     }
   let str = JSON.stringify(learned) ;
   localStorage.setItem(Model.user+'-learned', str) ;
   UI.log("您曾学过单词总计： " + learned.length + " 个！" ) ;
   UI.userStatus() ;
 }else{
   UI.log('本组单词还未背完，不能存储学习进度！') ;
 }
};

select('button#reviewWord').onclick = function(){

let learned = Model.learned ;
if(learned.length >= 2 * Model.numOfLearning){
Model.learning = [] ;
let randLearned = function(){
   let rand = Math.floor(Math.random() * learned.length) ;
   let word = learned[rand] ;
   if(word.level < 1 ){
     randLearned() ;
   }else{
     return word ; 
    }
 } ;
for(let i=0;i < Model.numOfLearning  ;i++){
   let word = randLearned() ;
   if(word){
      let en = Model.CET6[word.sn].en ;
      let pn = Model.CET6[word.sn].pn ;
      let cn = Model.CET6[word.sn].cn ;
      word.cn = cn ; word.en = en ; word.pn = pn ;
      Model.learning.push(word) ;
   }
}
Model.pos = 0 ;
Model.numOfLearning = Model.learning.length ;
UI.printWord() ;
UI.response('复习'+ Model.learning.length +'个单词！');
}else{
UI.log('您没背完2组单词，不能进入复习环节！') ;
}
} ; 

function select(s){
  let dom = document.querySelector(s) ;
  return dom ;
  
}