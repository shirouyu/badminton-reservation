const express = require("express");
const path = require("path");

const app = express();

app.use(express.json());

app.use(
    express.static(
        path.join(__dirname,"public")
    )
);

app.use(
    "/api/lapangan",
    require("./routes/lapangan")
);

app.use(
    "/api/cart",
    require("./routes/cart")
);

app.use(
    "/api/payment",
    require("./routes/payment")
);

app.use(
    "/api/booking",
    require("./routes/booking")
);

app.get("/",(req,res)=>{
    res.sendFile(
        path.join(
            __dirname,
            "views",
            "index.html"
        )
    );
});

app.get("/detail",(req,res)=>{
    res.sendFile(
        path.join(
            __dirname,
            "views",
            "detail.html"
        )
    );
});

app.get("/cart",(req,res)=>{
    res.sendFile(
        path.join(
            __dirname,
            "views",
            "cart.html"
        )
    );
});

app.get("/payment",(req,res)=>{
    res.sendFile(
        path.join(
            __dirname,
            "views",
            "payment.html"
        )
    );
});

app.get("/history",(req,res)=>{
    res.sendFile(
        path.join(
            __dirname,
            "views",
            "history.html"
        )
    );
});

app.use(
    "/api/admin",
    require("./routes/admin")
);

app.get("/admin/login", (req, res) => {
    res.sendFile(path.join(__dirname, "views", "admin-login.html"));
});

app.get("/admin", (req, res) => {
    res.sendFile(path.join(__dirname, "views", "admin.html"));
});

app.listen(3000,()=>{
    console.log(
        "http://localhost:3000"
    );
});