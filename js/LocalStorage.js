    var LocalStorage  = {
        
        userVerified:false,
        timeLogged:0,
        clockStarted:false,
        nrOfLoggsInLocalStorage:0,
        nrOfProjectsInLocalStorage:0,
        server:"",
        
        Init: function(){
            
            //initsiera alla variabler
            if (!localStorage.userVerified) {
               localStorage.userVerified = "false";
            }
            else{
                if (localStorage.userVerified == "true") {
                    this.userVerified = true;
                    Page.pageNr = 1;
                }
                else{
                    this.userVerified = false;
                }
            }
            //hämta sparad tid från localstorage
            if (localStorage.timeLogged) {
                this.timeLogged = parseInt(localStorage.timeLogged);
            }
            if (localStorage.timeSaved) { //hämta ev sparad tid!
                this.timeLogged += parseInt(localStorage.timeSaved);
                localStorage.timeSaved = "0";
            }
            if (localStorage.server) {
                this.server = localStorage.server;
            }
           
        },
        SaveCredentials:function(username, password){
            localStorage.userVerified = "true";
            this.userVerified = true;
            localStorage.username = username;
            localStorage.password = password;
        },
        GetCredentials:function(){
            //kontrollera att data är satt!
            if (localStorage.userVerified && localStorage.username && localStorage.password) {
                var text = '{"username":"'+localStorage.username+'","password":"'+localStorage.password+'"}';
                return JSON.parse(text);
            }
            else {
                return null;
            }
        },
        ClearCredentials:function(){
            //rensa i localStorage
            var server = localStorage.server; //spara undan servern
            localStorage.userVerified = "false";
            this.userVerified = false;
            localStorage.clear(); //rensa allt
            localStorage.server = server; //läs tillbaka servern
        },
        SaveServer:function(server){
            localStorage.server = server;
            LocalStorage.server = server;
            },
        GetProjects:function(){
            return JSON.parse(localStorage.projects);
            },
        SetProjects:function(json_projects){
            localStorage.projects = JSON.stringify(json_projects);
            },
        AddProjectToLocalStore:function(){
         // alert("APLS");
            },
        RemoveProjectFromLocalStore:function(){},
        AddLoggToLocalStore:function(){
              //räkna ihop antalet timmar som man registrerat
            //skall överensstemma med this.timeLogged
            var projects = LocalStorage.GetProjects();
            var loggedTime = 0;
            for (var i = 0; i < projects.length;i++) {
                var value = document.getElementById("_"+projects[i].ProjectID).innerHTML;
                loggedTime += parseInt(value);
            }
            if(loggedTime == this.timeLogged){
                if (LocalStorage.loggs) {
                   var loggs = JSON.parse(LocalStorage.loggs);
                }
                else{
                    var loggs = [];
                }
                    for (var i = 0; i < projects.length;i++) {
                        var dateTime = new Date();
                        var date = dateTime.toISOString().slice(0,10);
                        //Enbart loggar med mer tid än 0 skall adderas
                        if (parseInt(document.getElementById("_"+projects[i].ProjectID).innerHTML) > 0) {
                                                
                            loggs.push({
                                "projectID":projects[i].ProjectID,
                                "description":"",
                                "date":date,
                                "minutes":parseInt(document.getElementById("_"+projects[i].ProjectID).innerHTML)
                                });
                        }
                    }
                   //lagra i localstorage
                    LocalStorage.loggs = JSON.stringify(loggs);
                    //ta bort tid i localstore
                    this.timeLogged = 0; 
            }
            else{
                alert("Registrerad tid och loggad tid stämmer inte överens!");
            }
            },
        RemoveLoggFromLocalStore:function(id){},
        IncreaseTime:function(){
            this.timeLogged++;
            localStorage.timeLogged = this.timeLogged.toString();
            
            },
        DecreaseTime:function(min){
            this.timeLogged -= min;
             localStorage.timeLogged = this.timeLogged.toString();   
        },
        SaveTime:function(){
          
            //Spara tid som läggs till nästa gång appen körs!
            localStorage.timeSaved = (this.timeLogged%5).toString();
            
            //gör till jämna 5 minutare
            this.timeLogged -= this.timeLogged%5;
            //spara
            localStorage.timeLogged = this.timeLogged.toString();   
        }
        
    }