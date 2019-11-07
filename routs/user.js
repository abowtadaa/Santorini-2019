function (userName,ID){
    this.userName = userName;
    this.UserID = ID
    this.password

    this.returnUser = function (){
        return this.userID;
    }
}

app.post("/user/:userName"), function (req,res){
    let user {
        userName = req.params.userName;
        userID = ID;
        userVerification = true;
    }
}