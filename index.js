const express =require("express");

const users=require("./MOCK_DATA.json");
const fs=require("fs");




const port=3000;
const app=express();
// app.use(express.json());
app.use(express.urlencoded({extended:true}));

app.get("/users",(req,res)=>{
    const html=
   ` <ul>
    ${users.map(user=>(`<li>${user.first_name}</li>`)).join("")}
    </ul>
    `
    ;
    res.send(html);
});

app.get("/api/users",(req,res)=>{
    return res.json(users);
});


app.get("/api/users/:id",(req,res)=>{
    const id=Number(req.params.id);
    const user=users.find(user=>user.id==id);
    if(!user){
        return res.status(404).send("User not found");
    }
    return res.json(user);
}
);


app.post("/api/users",(req,res)=>{
    const body=req.body;
    // console.log("Body",body);
    users.push({...body,id:users.length+1});
    
    fs.writeFile("./MOCK_DATA.json",JSON.stringify(users),(err)=>{
        if(err){    
            return res.status(500).send("Error saving data");
        }
        return res.json(user);
    });
   
});

app.patch("/api/users/:id", (req, res) => {
    const id = Number(req.params.id);
    const user = users.find(user => user.id == id);
    console.log("User",user);
    if (!user) {
        return res.status(404).send("User not found");
    }
    const body = req.body;
    console.log("Body",body);
    if (body.first_name) {
        user.first_name = body.first_name;
    }
    if (body.last_name) {
        user.last_name = body.last_name;
    }
    if (body.email) {
        user.email = body.email;
    }
  console.log("User",user);
    // Write the updated users array to the file
    fs.writeFile("./MOCK_DATA.json", JSON.stringify(users), (err) => {
        if (err) {
            return res.status(500).send("Error saving data");
        }
        return res.json(user);
    });
});
app.delete("/api/users/:id",(req,res)=>{
    const id=Number(req.params.id);
    console.log("ID",id);
    const userIndex=users.findIndex(user=>user.id==id);
    console.log("UserIndex",userIndex); 
    if(userIndex===-1){
        return res.status(404).send("User not found");
    }
    users.splice(userIndex,1);
    fs.writeFile("./MOCK_DATA.json", JSON.stringify(users), (err) => {
        if (err) {
            return res.status(500).send("Error saving data");
        }
        return res.send("User deleted");
    });
}
);
/*
Also can do this way
app.route("/api/users/:id").get((req,res)=>{   
    const id=Number(req.params.id);
    const user=users.find(user=>user.id==id);
    if(!user){
        return res.status(404).send("User not found");
    }
    return res.json(user);
}).patch((req,res)=>{       
    const id=Number(req.params.id);
    const user=users.find(user=>user.id==id);
    if(!user){
        return res.status(404).send("User not found");
    }
    const {first_name,last_name,email}=req.body;
    if(first_name){
        user.first_name=first_name;
    }
    if(last_name){
        user.last_name=last_name;
    }
    if(email){
        user.email=email;
    }
    return res.json(user);
}).delete((req,res)=>{       
    const id=Number(req.params.id);
    const userIndex=users.findIndex(user=>user.id==id);
    if(userIndex===-1){
        return res.status(404).send("User not found");
    }
    users.splice(userIndex,1);
    return res.send("User deleted");
}
);

*/


app.listen(port,()=>{
    console.log("Server listening\n");
});