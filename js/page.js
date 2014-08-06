/*
 * Author: Daniel Lundberg
 *Filer som behöver laddas för att fungera
 * 1. Jquery
 * 2. SyncServer.js
 * 3. LocalStorage.js
 */

var Page = {
    headerTitle:["Logga in!","Tidsloggning!","Tid att fördela: "],
    footerTitle:["TimeLogger by Daniel","TimeLogger by Daniel","Tid att fördela: "],
    pageNr:0, //0 = Login Page, 1 = timer page, 2 = send page
    showStats:false,
    
    Init:function(){
       // alert(this.pageNr);
       this.Load(); // ladda första sidan!
       $("#txtbx_server").attr("value",LocalStorage.server);
    },
    SetPage:function(page){
        
    },
    Reload:function(){
        alert("DENNA FUNKTION SKALL TAS BORT!");
       
    },
    Load:function(){
        
        if (!this.showStats) {
        //sätt värde på Header och footer
            $("header").html('<h1>'+this.headerTitle[this.pageNr]+'</h1>');
            $("footer").html('<p>'+this.footerTitle[this.pageNr]+'</p>');
            
            //sätt minimum höjd på context vilket skall vara viewport - (header + footer+nav)
            var contentHeight = $( document ).height() - $("header").height() - $("footer").height()- $("nav").height() -100;
            $("#content").css("min-height",contentHeight+"px");
            
            if (this.pageNr == 0) {
               // $("#content").html(""); //rensa innehåll
               document.getElementById('loginmodal').style.display = "block";
                document.getElementById('page2').style.display = "none";
                document.getElementById('page1').style.display = "none";
                document.getElementById('stats').style.display = "none";
               
            }
            else if (this.pageNr==1) { //när sedan pageNr är = 1
                 //göm formulär
                document.getElementById('loginmodal').style.display = "none";
                document.getElementById('page2').style.display = "none";
                document.getElementById('page1').style.display = "block";
                document.getElementById('stats').style.display = "none";
                $("footer").css("display","none");
                
                //sätt clockan = 0;
               if (!LocalStorage.clockStarted) {
                  if (localStorage.timeSaved) { //hämta ev sparad tid!
                    LocalStorage.timeLogged += parseInt(localStorage.timeSaved);
                    localStorage.timeSaved = "0";
                }
                clock.setTime(LocalStorage.timeLogged*60);
                antalSekunder = 0; 
               }
              
            }
            else if (this.pageNr == 2) {
                
                document.getElementById('loginmodal').style.display = "none";
                document.getElementById('page2').style.display = "block";
                document.getElementById('page1').style.display = "none";
                document.getElementById('stats').style.display = "none";
                $("footer").css("display","none");
                $("#page2").html(""); //rensa innehåll
                //göm formulär
                $("header h1, footer p").append(LocalStorage.timeLogged+" min");
                document.getElementById('loginmodal').style.display = "none";
                var projects = LocalStorage.GetProjects();
                for (var i = 0; i < projects.length;i++) {
                    var text = "<fieldset><legend>"+projects[i].Name+"</legend>";
                    text +=  "<p class='desc'>"+projects[i].Description+"</p>";
                    text += "<input type='range' min='0' max='"+LocalStorage.timeLogged+"' value='0' step='5' onchange='_"+projects[i].ProjectID+".value=value' />";
                    text += "<output id='_"+projects[i].ProjectID+"'>0</output><br/>";
                    //text += "<label for='desc_"+projects[i].ProjectID+"'>Beskrivning </label><input style='width:75%;' type='text' id='desc_"+projects[i].ProjectID+"' />";
                    text += "</fieldset>";
                    $("#page2").append(text);
                }
                //skapa knapp
                 $("#page2  ").append("<button onclick='LocalStorage.AddLoggToLocalStore(); Sync.PostLogg(); Page.pageNr = 1; Page.Load();'>Skicka loggar</button>");
                //lägg till event för att ändra text i footer
                $("[type=range]").change(function(){
                    var projects = LocalStorage.GetProjects();
                    var loggedTime = 0;
                          for (var i = 0; i < projects.length;i++) {
                            var value = document.getElementById("_"+projects[i].ProjectID).innerHTML;
                           loggedTime += parseInt(value);
                          }
                        $("header h1, footer p").html("Tid att fördela: "+(LocalStorage.timeLogged-loggedTime)+"h");
                    });
            }
        }
        else{
            document.getElementById('loginmodal').style.display = "none";
            document.getElementById('page2').style.display = "none";
            document.getElementById('page1').style.display = "none";
            document.getElementById('stats').style.display = "block";
            $("footer").css("display","none");
            var cred = LocalStorage.GetCredentials();
               $.ajax({
                url: LocalStorage.server+"/stats.php?id="+cred.username,
                type: "GET",
                crossDomain: true,
                success: function (response) {      
                   $("#stats").html(response); //lägg in statestik på sidan
                },
                error: function (xhr, status) {
                    alert("Error-code:"+xhr.status); //for tests
                }
            });
        }
    },
    Logout:function(){
        LocalStorage.ClearCredentials();
        this.pageNr = 0;
        this.Load();
        
    }
}