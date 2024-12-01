let Model = { 
    timerBegin : new Date() ,
    numOfLearning : 30,
    learning : [] ,
    learned : []
} ;
    
    Model.CET6 = [] ;
{
let createCET6 = function(s){
    let cetArr = s.split('\r\n') ;
 for(let i=0;i<cetArr.length;i++){
    let wordArr = cetArr[i].split('\t');
    let obj = {} ;
      obj.en = wordArr[0] ;
      obj.pn = wordArr[1] ;
      obj.cn = wordArr[2] ;
      let enlength = obj.en.length ;
      if(enlength > 1 && enlength < 5){
        obj.level = 1 ;
      }else{
        if(enlength < 8 ){
            obj.level = 2 ;
        }else{
            obj.level = 3 ;
        }
      }
      Model.CET6.push(obj) ;
  }
}
let cet6String = "a	/ei/	art.一(个);每一(个);(同类事物中)任一个\r\nabandon	/ə'bændən/	vt.离弃,丢弃;遗弃,抛弃;放弃\r\nabdomen	/æb'dəumen/	n.腹,下腹(胸部到腿部的部分)" ;
createCET6(cet6String) ;
fetch('cet/cet1.txt') 
.then(resp => resp.text())
.then(txt => {
    Model.CET6 = [] ;
    createCET6(txt) ;
    UI.footerLog('系统成功读取了'+ Model.CET6.length +'个单词！') ;
}) ;
setTimeout(function(){ 
    fetch('cet/cet2.txt') 
    .then(resp => resp.text())
    .then(txt => {
     createCET6(txt) ;
    UI.footerLog('系统成功读取了'+ Model.CET6.length +'个单词！') ;
}) ;
} , 2 * 1000); 
setTimeout(function(){
    fetch('cet/cet3.txt')
    .then(res => res.text())
    .then(txt => {
        createCET6(txt) ;
        UI.footerLog('系统最后成功读取了'+ Model.CET6.length +'个单词！') ;
    } );
} , 5 * 1000) ;

}
Model.pos = 0 ; 
Model.users = [] ;
    { 
        let str = localStorage.getItem('users') ;
        if(str){
         let users = JSON.parse(str) ;
          Model.users = users ;
        }
      
       
    }

       let UI = {} ; 
        UI.printWord = function(){
        let CET6 = Model.CET6 ;
        let learning = Model.learning ;
        let pos = Model.pos ;
        let currentSn = parseInt(learning[pos].sn) ;

        select('p#en').textContent = CET6[currentSn].en ;
        select('p#pn').textContent = CET6[currentSn].pn ;
        let correctCn = CET6[currentSn].cn ;
        
        select('span#level').textContent = '难度: ' + learning[pos].level;
        let cnArr = [] ;
        
        let ok = false ; 
        for(let i=0 ; i < 5 ; i++){
            let lv = Math.random() * (5 - i) ;
            if(lv < 1 && !ok ){
                ok = true ;
                cnArr.push(CET6[pos].cn) ;
            }else{
                let rand = Math.floor(Math.random() * Model.CET6.length ) ;
                cnArr.push(Model.CET6[rand].cn) ;
                }
         }
         if(!ok){
                ok = true ;
                cnArr[4] = CET6[pos].cn ;
            }
           
        for(let i=1; i<6 ;i++){
           select('p#cn'+ i).textContent =  cnArr[i-1] ;
           select('p#cn'+ i).className = 'cn' ; 
        }
    let s = "" ;
    if (CET6[pos].timer){
      let d = CET6[pos].timer ;
      s = '哟，您在'+ d.getFullYear() +'年' + ( d.getMonth() + 1 ) + '月' + (d.getDate())+ '日'+' 学过'  ; 
    }else{
        s = "哟，您这个单词没学过。"
    }
    
    UI.log(s + '--本组进度@'+ (pos+1)+'/' + Model.numOfLearning  +'.');

  } ;


UI.log = function(s){
select('p#log').textContent = s ;
};
UI.footerLog = function(s){
select('footer').textContent = s ;
setTimeout(() => {
    select('footer').textContent = "江西科技师范大学 刘润林 2024--2025" ;
}, 3*1000);
};
UI.response = function(s){
    select('span#response').textContent = s ;
  }
  UI.userStatus = function(){
    let easy = 0, normal = 0, hard=0 ;
    for(let word of Model.learned){
        if(word.level == 0){
            easy ++ ;
        }else if(word.level < 3){
            normal ++ ;
         }else{
            hard ++ ;
         }
    }
    let s = Model.user + '状态: ' +easy +'熟悉/'+ normal +'一般/'+ hard+ '陌生'    ;
    select('p#title').textContent = s ;
    setTimeout(()=>{
        select('p#title').textContent = 'CET6-轻轻松松背单词';
    },1000*10)
  } ;
  
