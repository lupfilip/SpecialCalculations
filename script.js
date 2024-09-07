function GeneralNumber(operator, number) {
    this.operator = operator;
    this.number = number * (number > 0);

    this.text = function() {
        var ret = "";

        if(this.number > 0) {
            ret += this.operator + this.number;
        }

        return ret;
    }
}

var numbers = [];

document.getElementById("add").addEventListener("click", function() {
    var text = document.getElementById("insert").value;
    text = text.trim();
    if(text === "") return;
    var operator = "";
    var number = "";
    for(let i = 0; i < text.length; i) {
        operator = "";
        number = "";
        if(i < text.length) {
            while((text[i].charCodeAt(0) >= 65 && text[i].charCodeAt(0) <= 90) || 
            (text[i].charCodeAt(0) >= 97 && text[i].charCodeAt(0) <= 122)) {
                operator += text[i++];
                if(i >= text.length) break;
            }
        }
        if(i < text.length) {
            while((text[i].charCodeAt(0) >= 48 && text[i].charCodeAt(0) <= 57) || text[i] === '.') {
                number += text[i++];
                if(i >= text.length) break;
            }
        }
        
        if(number.length < 1 || operator.length < 1) {
            if(number.length < 1 && operator.length < 1) i++;
            continue;
        }

        numbers.push(new GeneralNumber(operator, Number(number.substring(0, number.length))));
    }

    document.getElementById("insert").value = "";
    makeList();

});

function makeList() {
    var list = document.getElementById("list");
    list.innerHTML = "";
    for(let i = 0; i < numbers.length; i++) {
        var element = document.createElement("div");
        element.innerHTML = numbers[i].text();
        list.appendChild(element);
        element = document.createElement("input");
        element.type = "button";
        element.classList.add("button");
        element.value = "Remove";
        element.id = i;
        element.addEventListener("click", remove);
        list.appendChild(element);
    }
}

function remove() {
    numbers.splice(parseInt(this.id), 1);
    makeList();
}

document.getElementById("solve").addEventListener("click", function() {
    var display = document.getElementById("display");
    display.innerHTML = "";
    var candidates = Object.create(numbers, {});
    var counter = []

    for(let k = 0; true; k++) {
        for(let i = 0; i < candidates.length; i++) {
            counter.push(1);
            for(let j = 0; j < candidates.length; j++) {
                if(candidates[j].text() == candidates[i].text() && j == i) continue;
                else if(candidates[j].operator == candidates[i].operator) {
                    candidates[i].number += candidates[j].number;
                    if(k != 0) counter[i]++;
                    candidates.splice(j, 1);
                    counter.splice(j--, 1);
                }
            }
        }

        for(let i = 0; i < candidates.length; i++) {
            candidates[i].number /= counter[i];
        }
        for(let i = 0; i < candidates.length; i++) {
            display.innerHTML += candidates[i].text() + ' ';
        }
        if(candidates.length <= 1) break;
        display.innerHTML += '= ';

        var candidates2 = [];
        var counter2 = [];
        for(let i = 0; i < candidates.length; i++) {
            for(let j = 0; j < candidates.length; j++) {
                if(candidates[j].text() == candidates[i].text() && j == i) continue;
                else if(candidates[j].number < candidates[i].number) {
                    candidates2.push(new GeneralNumber(candidates[i].operator, candidates[i].number - candidates[j].number));
                    counter2.push(counter[i]);
                }
            }
        }

        candidates = Object.create(candidates2, {});
        counter = [];
    }
});