var lastShownCategories = 0;
function navFunction(a) {
    let inmain = document.getElementsByName("inMain");
    for(let i=0; i<inmain.length; i++)
        inmain[i].style.display = "none";
    document.getElementById(a).style.display = "block";
}
(navFunction("aboutShop"));
var category;
$(document).ready(function () {
    $.ajax({
        url: 'http://nit.tron.net.ua/api/category/list'
    }).then(function (result) {
        category = result;
    });
});
var goodsList;
function makeGreenGoodsFromBacket() {
    var cok = document.cookie;

    var arCok = cok.split("!");
    for(var i=0; i<arCok.length; i++){
        var elem = document.getElementById("addBacketShort" + arCok[i].charAt(0));
        if(arCok[i].charAt(0)!="" && elem) {
            document.getElementById("addBacketShort" + arCok[i].charAt(0)).style.backgroundColor = "#fcd800";
            document.getElementById("addBacketShort" + arCok[i].charAt(0)).style.borderColor = "#6b4327";
        }
    }
}
function dowloadGoods(a) {
    a = a + +"1";
    var u = 'http://nit.tron.net.ua/api/product/list/category/'+a;
    $.ajax({
        url: u
    }).then(function (result) {
        goodsList = result;

        document.getElementById("goodsList").innerHTML = printCategoriesGoods();
        makeGreenGoodsFromBacket();
    })
}
function printProductDetails(inf) {
    var res = "<img class='detailImg' src='"+inf.image_url+"'><p>Назва товару("+inf.id+"): </p><h4>"+inf.name+"</h4><p>Ціна: </p>";
    if(goodsList[i].special_price!=null){
        res+= "<p class='price'>"+goodsList[i].special_price+"</p><p>Колишня ціна: <span>"+goodsList[i].price+"</span></p>";
    } else{
        res+= "<p class='price'>"+goodsList[i].price+"</p>";
    }
    if(inf.description != "")
        res+="<div><p>Опис товару: </p><p class='desc'>"+inf.description+"</p></div>";
    else
        res+="<div><p>На жаль, опис даного товару зараз відсутній</p></div>";
    return res;
}
function showDetails(a) {
    var gif = "<div  class='loadingImg'><img src='https://pa1.narvii.com/6533/157e191525eb4532410ded637ec8f54076b23e44_hq.gif'><p class='loadingText'> loading...</p></div>";//TODO
    document.getElementById("productInformation").innerHTML = gif;
    var link  = "http://nit.tron.net.ua/api/product/"+a;
    navFunction("productDetails");

    $.ajax({
        url: link
    }).then(function (result) {
        var inf = result;
        var now = inf;
        var res = "<img src='"+inf.image_url+"'><div class='short'><p>Назва товару: </p><h4>"+inf.name+"</h4><p >Ціна: </p>";
        if(inf.special_price!=null){
            res+= "<p class='price'>"+inf.special_price+"</p><p>Колишня ціна: <span>"+inf.price+"</span></p></div>";
        } else{
            res+= "<p class='price'>"+inf.price+"</p>";
        }

        res+="<div class='btn-group'><button onclick='addAmountOfGoodDet("+now.id+",-1)' type='button' class='btn btn-warning'>-</button>";
        res+="<button disabled id='amountInBacketDetails"+now.id+"' type='button' class='btn'>"+amountOfProdInCookie(now.id)+"</button>";
        res+="<button type='button' onclick='addAmountOfGoodDet("+now.id+",1)' class='btn btn-warning'>+</button></div></div>";
        if (inf.description != "")
        res+="<div class='descDiv'><p>Опис товару: </p><p class='desc'>"+inf.description+"</p></div>";
        else
            res+="<div class='descDiv'><p style='float: left;'>На жаль, товар не містить опису...</p></div>";
        setTimeout(function(){document.getElementById("productInformation").innerHTML = res; }, 1500);
    })
}
function amountOfProdInCookie(a) {
    var cok = document.cookie;
    if(!cok.includes(a+"[")) return 0;
    var ar = cok.split("!");
    for(var i=0; i<ar.length; i++) if(ar[i]!=""){
        if(ar[i].charAt(0)==a) {
            return ar[i].charAt(2);
        }
    }
}
function addToBacket(a) {
    //a = a + +"1";
    if(document.cookie.includes(a+"[")){

        document.getElementById("addBacketShort"+a).style.backgroundColor = "transparent";
        document.getElementById("addBacketShort"+a).style.borderColor = "transparent";
        var res = document.cookie;
        var ar = res.split("!");
        res = "";
        for(var i=0; i<ar.length; i++){
            if(ar[i].charAt(0) != a) res+=ar[i]+"!";
        }
        res = res.replace(/!!/gi,'!');
        document.cookie = res;
    }else {
        document.cookie += a+"[1]!";
        document.getElementById("addBacketShort"+a).style.backgroundColor = "#fcd800";
        document.getElementById("addBacketShort"+a).style.borderColor = "#6b4327";

    }
}
function printCategoriesGoods() {
    var res= "<div>";
    for(var i=0; i<goodsList.length; i++){
        res+="<div class='oneProduct'>";
        res+="<a href='#' onclick='showDetails("+goodsList[i].id+")'><div  class='obj'><img src='"+goodsList[i].image_url+"' width='100px'></div>";
        res +="</a><input style='background-image: url("+"../Images/addBacket.png"+")' type='button' id='addBacketShort"+goodsList[i].id+"' onclick='addToBacket("+goodsList[i].id+")' value=' ' class='btn btn-default'>";

        res+="<a href='#' onclick='showDetails("+goodsList[i].id+")'><h3>"+goodsList[i].name+"</h3></a>";

        if(goodsList[i].special_price!=null){
            res+= "<a href='#' onclick='showDetails("+goodsList[i].id+")' class='price sale'>"+goodsList[i].special_price+"<span class='sp'>"+goodsList[i].price+"</span></a>";
        } else{
            res+= "<a onclick='showDetails("+goodsList[i].id+")' class='price'>"+goodsList[i].price+"</a>";
        }
        res+="</div>";
    }
    res+="</div>";
    return res;
}
function makeActive(a){
    $("span").removeClass("myActive");
    $("#helpSpan"+a).addClass("myActive");
    lastShownCategories = a;
    dowloadGoods(a);
};
function makeActiveAll() {
    lastShownCategories = 0;
    $("span").removeClass("myActive");
    $("#helpSpanAll").addClass("myActive");
        var u = 'http://nit.tron.net.ua/api/product/list';
        $.ajax({
            url: u
        }).then(function (result) {
            goodsList = result;
            document.getElementById("goodsList").innerHTML =  printCategoriesGoods();
            makeGreenGoodsFromBacket();
        })
}
function showAllProducts() {

    var res = "<ul class='nav'>";
    res+= "<span onclick='makeActiveAll()' id='helpSpanAll' class='active'>All Progucts</span>";
    for(var i=0; i<category.length; i++){
        res+= "<span onclick='makeActive("+i+")' id='helpSpan"+i+"'><a href='#' class='bande' data-toggle='popover' title='" +
            category[i].name+"' data-content='"+category[i].description+"'>&#8658;</a>"+category[i].name+"</span>";
    }
    res+="</ul>";
    document.getElementById("category").innerHTML = res;
    navFunction("categories");
    makeActiveAll();
    $('[data-toggle="popover"]').popover();
}
$("#aboutShopStartShopping").click(showAllProducts);

function showLastProducts() {
    if(lastShownCategories == "0") showAllProducts();
    else {
        navFunction("categories");
        makeActive(lastShownCategories);
    }
}
function totalSumm() {
    var all = allBacketGoods;
        var cok = document.cookie;
        var arcok = cok.split("!");
        var summ = 0;
        for (var i = 0; i < arcok.length; i++) if (arcok[i] != "") {
            var n = arcok[i].charAt(0)-1;
            var now = all[n];
            if (now.special_price != null) {
                summ += now.special_price * arcok[i].charAt(2);
            }
            else {
                summ += now.price * arcok[i].charAt(2);
            }
        }
        return summ;
}
function addAmountOfGood(a, n){
    var cok = document.cookie;
    var arcok = cok.split("!");
    var res = ""; var c = 0;
    for(var i=0; i<arcok.length; i++) if(arcok[i]!=""){
        if(arcok[i].charAt(0)!=a) res+=arcok[i]+"!";
        else{
           if(n==1)
               if(arcok[i].charAt(2)!=9)
                   c = (Number(arcok[i].charAt(2)) + +"1");
               else {
                   c = 1;
                   alert("Ми не отптовий магазин, тому ви не можете купити так багато(((");
               }
            else
                c = (Number(arcok[i].charAt(2))-1);
            if(c!=0) res+= a+"["+c+"]!";
        }
    }
    document.cookie = res;
        document.getElementById("amountInBacket" + a).innerHTML = c;
        if(c!=0) {
            document.getElementById("totalSum").innerHTML = totalSumm();
        } else {
            openBacket();
        }

}
function addAmountOfGoodDet(a, n){
    var bool = true;
    var cok = document.cookie;
    var arcok = cok.split("!");
    var res = ""; var c = 0;
        for (var i = 0; i < arcok.length; i++) if (arcok[i] != "") {
            if (arcok[i].charAt(0) != a) res += arcok[i] + "!";
            else {
                bool = false;
                if (n == 1) {
                    if(arcok[i].charAt(2)!=9)
                    c = (Number(arcok[i].charAt(2)) + +"1");
                    else {
                        c = 1;
                        alert("Ми не отптовий магазин, тому ви не можете купити так багато(((");
                    }
                }
                else {
                    if(c!=0) c = (Number(arcok[i].charAt(2)) - 1);
                }
                if (c > 0) res += a + "[" + c + "]!";
            }
        }
        if(bool && n==1){
            res += a+"[1]!";
            c = 1;
        }
    document.cookie = res;
    document.getElementById("amountInBacketDetails" + a).innerHTML = c;
    document.getElementById("amountInBacketDetails" + a).value = c;

}

function openFullBacket() {
    $.ajax({
        url: 'http://nit.tron.net.ua/api/product/list'
    }).then(function (result) {
        var cok = document.cookie;
        var arcok = cok.split("!");
        var res = "";
        var all = result;
        allBacketGoods = all;
        for(var i=0; i<arcok.length; i++) if(arcok[i]!="") {
            var n = arcok[i].charAt(0)-1;

            var now = all[n];
            res+="<div style='clear: both'><div class='btn-group'><button onclick='addAmountOfGood("+now.id+",0)' type='button' class='btn btn-warning'>-</button>";
            res+="<button disabled id='amountInBacket"+now.id+"' type='button' class='btn'>"+arcok[i].charAt(2)+"</button>";
            res+="<button type='button' onclick='addAmountOfGood("+now.id+",1)' class='btn btn-warning'>+</button></div>";
            res+="<span onclick='showDetails("+now.id+")' class='productInBacket'><div class='img'><img src='"+now.image_url+"'></div><h3>"+now.name+"</h3>";
            if (now.special_price!=null) {
                res+="<p style='color: red'>"+now.special_price+"<span> (your discount: "+(now.price-now.special_price)+"$)</span></p>";
            }
            else {
                res+="<p>"+now.price+"</p>";
            }

            res+="</span></div>";
        }
        res+="<div class='inform'>Будьте уважні! Видаляючи товар з корзини в основному меню, ви видаляєте всі одиниці товару!!!</div>";
        res+="<div class='total'><span>Total: </span><span id='totalSum'>"+totalSumm()+"</span><div><button data-toggle='modal' data-target='#myModal' type='button' onclick='orderGoods()' class='btn btn-outline-warning'>Оформити замовлення</button></div></div>";
        res+="<a class='return' href='#' onclick='showAllProducts()'><img alt src='http://www.jemome.com/cdn/2015/02/return-icon-orange_1280359.png'><p>Повернутись до покупок</p></a>";
        navFunction("backetPage");
        document.getElementById("backetPage").innerHTML = res;
    })
}
function checkTel(tel) {
    for(var i=0; i<tel.length; i++)
        if(!tel.charAt(i).isNumber() && tel.charAt(i)!="-")
            return false;
        return true;
}
function orderGoods() {
    var name1 = document.getElementById("orderName").value;
    var name2=document.getElementById("orderSurname").value;
    var tel = document.getElementById("orderTel").value;
    var gm = document.getElementById("orderGmail").value;
    if(name1!="" && name2!="" && tel!="" && gm!=""){
        var res = "{token: 'uwMtDxbv8Drq7qF-aEcw', name:"+ name1+' '+name2+", phone: "+tel+", email:"+ gm +",";
        var cok = document.cookie ;
        var ar = cok.split("!");
        for (var i=0; i<ar.length; i++) if(ar[i]!=""){
            res+= ar[i].charAt(0)+"["+ar[i].charAt(2)+"], ";
        }
        res+="}";
        $.post( "http://nit.tron.net.ua/api/order/add", res)
            .done(function( data ) {
                document.cookie = "";
                document.getElementById("orderName").value = "";
                document.getElementById("orderSurname").value = "";
                document.getElementById("orderTel").value = "";
                document.getElementById("orderGmail").value = "";
                navFunction("aboutShop");
                alert(res);
            })
            .fail(function() {
            alert( "З вашим замовленням виникли проблеми з невідомих причин" );
        })
    }
}
function openBacket() {
    var res = "";
    if(document.cookie=="" || document.cookie=="!"){
        res = "<div class='emptyBacket'><p>На жаль, зараз в корзині немає жодного товару</p><p>Повернутись до покупок</p>";
        res+="<a onclick='showAllProducts()'><img style='cursor: pointer' width='60%' alt src='https://purepng.com/public/uploads/large/purepng.com-best-buy-logologobrand-logoiconslogos-2515199394357gbpw.png'></a></div>";
        navFunction("backetPage");
        document.getElementById("backetPage").innerHTML = res;
    } else{
        openFullBacket();
    }
}





