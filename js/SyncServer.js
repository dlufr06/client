var Sync ={
    
    Init: function(){
        //alert("init");
    },
    Run: function(){
        //alert("run");
    },
    Login:function(){
        var username = document.getElementById("txtbx_username").value;
        var password = document.getElementById("txtbx_password").value;
        LocalStorage.SaveServer(document.getElementById("txtbx_server").value);
        this.VerifyUser(username,password);
        },
    VerifyUser: function(username,password){
        
           var auth = "Basic "+ btoa(username+":"+password);
           //alert(auth); //for testing
            $.ajax({
                url: LocalStorage.server+"/api.user.php",
                type: "GET",
                crossDomain: true,
                //dataType: "json",
                beforeSend: function (xhr) {
                 xhr.setRequestHeader ("Authorization", auth); 
                },
                statusCode:{
                    200:function(){
                        //kan användas men vi nyttjar success istället
                        }
                
                },
                success: function (response) {      
                   // alert("WORKING"); //for tests
                    LocalStorage.SaveCredentials(username,password);
                    //hämta projekt
                    Sync.GetProjects();
                    //Ladda nästa sida!
                    Page.pageNr = 1;
                    Page.Load();
                },
                error: function (xhr, status) {
                    alert("Error-code:"+xhr.status); //for tests
                }
            });


    },
    GetProjects: function(){
        var credentials = LocalStorage.GetCredentials();
         var auth = "Basic "+ btoa(credentials.username+":"+credentials.password);
            
            $.ajax({
                url: LocalStorage.server+"/api.project.php",
                type: "GET",
                crossDomain: true,
                dataType: "json",
                beforeSend: function (xhr) {
                 xhr.setRequestHeader ("Authorization", auth); 
                },
                success: function (response) {
                    LocalStorage.SetProjects(response);
                },
                error: function (xhr, status) {
                    alert(xhr.status);
                
                }
            });
        
    },//end GetProjects
    PostProject: function (username, password){},
    PostLogg: function (){
        var credentials = LocalStorage.GetCredentials();
        var auth = "Basic "+ btoa(credentials.username+":"+credentials.password);
          // $("body").prepend("<p>"+LocalStorage.loggs+"</p>");
            $.ajax({
                url: LocalStorage.server+"/api.logg.php",
                type: "POST",
                crossDomain: true,
                dataType: "json",
                data: LocalStorage.loggs,
                beforeSend: function (xhr) {
                 xhr.setRequestHeader ("Authorization", auth); 
                },
                success: function (response) {      
                    //Rensar localstorage
                    LocalStorage.loggs = "[]";
                   
                    },
                error: function (xhr, status) {
                    alert(xhr.status);
                }
            });
        
    },
    Online:function(){
    var xhr = new XMLHttpRequest();
    var file = LocalStorage.server+"/api.user.php";
    var randomNum = Math.round(Math.random() * 9000000);
     
    xhr.open('HEAD', file + "?rand=" + randomNum, false);
     
    try {
        xhr.send();
         
        if (xhr.status >= 200 && xhr.status < 304) {
            return true;
        } else {
            return false;
        }
    } catch (e) {
        return false;
    }
    }
}