var articles="";
var choiceArticles="";

// function for get last news
function getArticlesTitles(){
  $.ajax({
    url: "https://newsapi.org/v2/top-headlines?language=fr&apiKey=b47ecc0e40874473a0c659318cd106be",
    method: "GET",
    pageSize: 3,
    page:3,
    error: function() {
      console.log("fucked&");
    },
    success: function(data) {
      $('.afficherArticles').html('');
      // transformation de l'objet en string pour la synthèse vocale
      for (var i = 0; i < 10; i++) {
        articles =  articles+data.articles[i].title+" - "+data.articles[i].source.name+". . "
        afficherArticles(data.articles[i].title, data.articles[i].description, data.articles[i].source.name);

      }
      console.log(articles);
      speak(articles);

    }
  });  
}

// function for get the articles of the theme chooses
function  getArticlesChoice(choice){
  $.ajax({
    url: "https://newsapi.org/v2/everything?q="+choice+"&from=2018-09-01&sortBy=popularity&language=fr&apiKey=b47ecc0e40874473a0c659318cd106be",
    method: "GET",
    pageSize: 3,
    page:3,
    error: function() {
      console.log("fucked2");
    },
    success: function(data) {
      $('.afficherArticles').html('');

      // transformation de l'objet en string pour la synthèse vocale
      for (var i = 0; i < 5; i++) {
        choiceArticles =  choiceArticles+data.articles[i].title+" - "+data.articles[i].source.name+". . "
        afficherArticles(data.articles[i].title, data.articles[i].description, data.articles[i].source.name);
      }
      console.log(choiceArticles);
      speak(choiceArticles);
    }
  });  


}

// https://newsapi.org/v2/sources?language=fr&country=fr&apiKey=
function  getPresseChoice(choice){
  $.ajax({
    url: "https://newsapi.org/v2/top-headlines?sources="+choice+"&sortBy=popularity&language=fr&apiKey=b47ecc0e40874473a0c659318cd106be",
    method: "GET",
    pageSize: 3,
    page:3,
    error: function() {
      console.log("fucked3");
    },
    success: function(data) {
      $('.afficherArticles').html('');

      // transformation de l'objet en string pour la synthèse vocale
      for (var i = 0; i < 5; i++) {
        choiceArticles =  choiceArticles+data.articles[i].title+" - "+data.articles[i].source.name+". . "
        afficherArticles(data.articles[i].title, data.articles[i].description, data.articles[i].source.name);
      }
      console.log(choiceArticles);
      speak(choiceArticles);
    }
  });  
}


// function for the browser read the message in parameters
function speak (message) {
  msg.text = message;
  msg.onend = function () { console.log("on end!"); }
  msg.onerror = function () { console.log("on error!"); }
  msg.onpause = function () { console.log("on pause"); }
  msg.onresume = function () { console.log("on resume"); }
  msg.onstart = function () { console.log("on start"); }
  synth.cancel();
  synth.speak(msg);



// interval for verify the end of speak() function
  var r = setInterval(function () {
    console.log(synth.speaking);
    if (!synth.speaking) clearInterval(r);
    else synth.resume();
  }, 14000);

  msg.onend = function(e) {
    console.log('Finished in ' + event.elapsedTime + ' seconds.');
  };
}


// on loading page

var voice = "";
var voice2="";
var recognition;
// function for trigger the microphone
function startVoice(){
  recognition = new webkitSpeechRecognition();
  console.log("start");
  recognition.continuous = false;
  recognition.interimResults = true;
  recognition.lang = 'fr-FR';
  recognition.start();
}

// function for send articles in html
function afficherArticles(title, description, source){
  $('.afficherArticles').append('<div class="card border-dark mb-3">\
                                  <div class="card-header">'+ title +'</div>\
                                  <div class="card-body text-dark">\
                                    <p class="card-text">'+ description+'</p>\
                                    <cite title="Source Title">'+source+'</cite>\
                                  </div>\
                                </div>');
}


var msg = new SpeechSynthesisUtterance();
msg.lang = 'fr-FR';
var synth = window.speechSynthesis;
var voices = synth.getVoices();


speak("Bonjour !. Je m'appelle Janet, comment puis-je vous aider ?")

$('#voiceActivation').on('click', function(){
  startVoice();
  recognition.onresult = function(event){
    voice = event.results[0][0].transcript;
    console.log(voice);
  }
  recognition.onend = function(){
    if (voice == "Bonjour" || voice == "Hello" || voice == "Salut" || voice == "Hey"){
      voice= voice+" Comment puis-je vous aider ?";
      speak(voice);
    }else if (voice == "actualités"){
      getArticlesTitles();
    }else if (voice == "choix article" || voice == "choix thème" || voice == "choisir" || voice=="chercher" || voice=="trouve moi un article" || voice=="choisir un article"){
      console.log("choisir");
      speak("Dites moi un mot, je chercherais un article qui correspond");
      startVoice();
      recognition.onresult = function(event){
        voice2 = event.results[0][0].transcript;
        console.log(voice2);
      }
      recognition.onend = function(){
          getArticlesChoice(voice2);
          console.log(voice2);
          $('input[name=vocalValue]').val(voice2);
      }
    }else if(voice=="journal" || voice=="choisir un journal" || voice=="presse" || voice=="choisir presse" || voice=="choisir une presse" ){
      console.log("le monde");
      // console.log("choisir");
      speak("Donnez moi le nom d'un journal, je vous donnerais les gros titres.");
      startVoice();
      recognition.onresult = function(event){
        voice2 = event.results[0][0].transcript;
        console.log(voice2);
      }
      recognition.onend = function(){
          getPresseChoice(voice2);
          console.log(voice2);
          $('input[name=vocalValue]').val(voice2);
      }

    }else{
      speak(voice);
    }
  }
    console.log(voice);
    $('input[name=vocalValue]').val(voice);


});


// $('#voiceActivation').on('click', function(){
//   startVoice();
//   recognition.onresult = function(event){
//     voice = event.results[0][0].transcript;
//     console.log(voice);
//     if (voice == "Bonjour" || voice == "Hello" || voice == "Salut" || voice == "Hey"){
//       voice= voice+" Comment puis-je vous aider ?";
//       recognition.onend = function(){
//         speak(voice);
//       }
//     }else if (voice == "actualités"){
//       recognition.onend = function(){
//         getArticlesTitles();
//       }
//     }else if (voice == "choix article" || voice == "choix thème" || voice == "choisir" || voice=="chercher" || voice=="trouve moi un article" || voice=="choisir un article"){
//       console.log("choisir");
//       speak("Dites moi un mot, je chercherais un article qui correspond");
//       startVoice();
//       recognition.onresult = function(event){
//         voice = event.results[0][0].transcript;
//         console.log(voice);
//         getArticlesChoice(voice);
//       }
//       recognition.onend = function(){
//           console.log(voice);
//           $('input[name=vocalValue]').val(voice);
//       }

//     }else if(voice=="journal" || voice=="choisir un journal" || voice=="presse" || voice=="choisir presse" || voice=="choisir une presse" ){
//       console.log("le monde");
//       // console.log("choisir");
//       speak("Dites moi un mot, je chercherais un article qui correspond");
//       startVoice();
//       recognition.onresult = function(event){
//         voice = event.results[0][0].transcript;
//         console.log(voice);
//         getPresseChoice(voice);
//       }
//       recognition.onend = function(){
//           console.log(voice);
//           $('input[name=vocalValue]').val(voice);
//       }

//     }
//   }
//   recognition.onend = function(){
//     console.log(voice);
//     $('input[name=vocalValue]').val(voice);
//   }

  
// });

// button for stop browser speaking

$('#stopTalk').on('click', function(){
  console.log("stop");
  synth.cancel();
});

//
//
// var msg = new SpeechSynthesisUtterance("Voulez vous connaître les derniers articles, Oui ou Non ? ");
// window.speechSynthesis.speak(msg);



