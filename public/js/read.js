const textData = document.querySelector(".data");
document.body.innerHTML = `<a href="/users/logout" class="btn btn-secondary logoutbtn" style="    position: absolute;top: 10px;background-color: red;right: 5%;" >Logout</a>
<a href="/dashboard" class="btn btn-secondary editbtn" style="position: absolute;top: 10px;background-color: green;right: 10%;">Home</a>`;
var jsonStr = textData.textContent // THE OBJECT STRINGIFIED
var regeStr = '' // A EMPTY STRING TO EVENTUALLY HOLD THE FORMATTED STRINGIFIED OBJECT
var f = {
        brace: 0
    }; // AN OBJECT FOR TRACKING INCREMENTS/DECREMENTS,
    // IN PARTICULAR CURLY BRACES (OTHER PROPERTIES COULD BE ADDED)

    regeStr = jsonStr.replace(/({|}[,]*|[^{}:]+:[^{}:,]*[,{]*)/g, function (m, p1) {
    var rtnFn = function() {
            return '<div style="text-indent: ' + (f['brace'] * 20) + 'px;">' + p1 + '</div>';
        },
        rtnStr = 0;
        if (p1.lastIndexOf('{') === (p1.length - 1)) {
            rtnStr = rtnFn();
            f['brace'] += 1;
        } else if (p1.indexOf('}') === 0) {
            f['brace'] -= 1;
            rtnStr = rtnFn();
        } else {
            rtnStr = rtnFn();
        }
        
        console.log(rtnStr);
        return textData.innerHTML = rtnStr;
        
});

document.body.innerHTML += regeStr;