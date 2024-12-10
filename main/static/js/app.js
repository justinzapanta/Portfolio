const up_icon = document.querySelector('#up_icon')
const down_icon = document.querySelector('#down_icon')
const url_dropdown = document.querySelector('#url_dropdown')

id = 0
function dropdown(_this){
    if (url_dropdown.classList.contains('hidden')){
        url_dropdown.classList.remove('hidden')
        down_icon.classList.add('hidden')
        up_icon.classList.remove('hidden')
    }else{
        url_dropdown.classList.add('hidden')
        down_icon.classList.remove('hidden')
        up_icon.classList.add('hidden')
    }
}

const display_method = document.querySelector('#display_method')
const display_url = document.querySelector('#display_url')
let endpoint = '/api/ticket'
let backup_enpoint = '/api/ticket'
let request_methond = 'GET:'

const options = document.querySelectorAll('.options')
function selected(this_){
    //remove the color in the prev selection
    const prev_selected = options[parseInt(id)]
    prev_selected.classList.remove('bg-gray-200')
    prev_selected.classList.add('hover:bg-gray-100')

    //update id add color to the new selected
    id = parseInt(this_.getAttribute('index'))
    const new_selected = options[parseInt(id)]
    new_selected.classList.add('bg-gray-200')
    new_selected.classList.remove('hover:bg-gray-100')

    const method = document.querySelector(`#h1-${this_.getAttribute('index')}`)
    const url = document.querySelector(`#h2-${this_.getAttribute('index')}`)
    display_method.textContent = method.textContent
    display_url.textContent = url.textContent
    endpoint = url.textContent
    backup_enpoint = url.textContent
    request_methond = method.textContent
    
    dropdown('none')
    console.log(method.textContent)
}

const response_textrea = document.querySelector('#response_textrea')

async function send_request(){
    let clean = request_methond.split(':')
    clean = clean[0]
    const response = await fetch(endpoint, {
        method : clean,
        headers : {'Content-Type' : 'application/json'},
    })

    const response_json = await response.json()

    let text = `{\n \tresult : [ \n\t{`
    response_json.results.forEach(result => {
        for(key in result){
            text += `\n\t\t"${key}" : "${result[key]},"`
        }
        text += `\n\t},`
    })
    
    text += `\n\t]\n}`
    response_textrea.value = text

}
send_request()




const response_body = document.querySelector('#response_body')
const params_body = document.querySelector('#params_body')
const params_property = document.querySelector('#params_property')
const response_button = document.querySelector('#response_button')
const params_button = document.querySelector('#params_button')
const data_list = {
    '/api/ticket' : ['id', 'status', 'issue', 'dateCreated', 'close', 'user_fullName', 'user_email', 'user_contactNumber']
}


function show_params(){
    params_button.classList.add('font-bold')
    response_button.classList.remove('font-bold')
    params_property.innerHTML = `
        <div class="grid grid-cols-2">
            <div>
                <h1 class="font-roboto text-center text-sm ">Key</h1>
            </div>

            <div>
                <h1 class="font-roboto text-center text-sm">Value</h1>
            </div>
        </div>
    `
    const list = data_list[endpoint]
    
    list.forEach(data => {
        const new_div = document.createElement('div')
        new_div.classList.add('grid', 'grid-cols-2', 'gap-6')

        new_div.innerHTML = `
            <div class="w-full">
                <input type="text" readonly value="${data}" class="bg-gray-100 w-full text-center h-8 rounded-md border-gray-400 border">
            </div>

            <div class="w-full font-roboto">
                <input oninput="on_type(this)" field='${data}' placeholder="Optional" type="text" class="w-full text-center h-8 rounded-md border-gray-400 border">
            </div>
        `

        params_property.appendChild(new_div)
    })

    params_body.classList.remove('hidden')
    response_body.classList.add('hidden')
}





function show_response(){
    params_button.classList.remove('font-bold')
    response_button.classList.add('font-bold')

    params_body.classList.add('hidden')
    response_body.classList.remove('hidden')
}



//params
const params_object = {}

function on_type(this_){
    //create key and value or update it
    params_object[this_.getAttribute('field')] = this_.value
    //
    let params_text = '?'
    let start = true
    let has_value = false
    for(field in params_object){
        if (params_object[field] != ''){
            if (!start){
                params_text += '&'
            }

            params_text += `${field}=${params_object[field]}`
            has_value = true
        }
        start = false
    }


    //clean
    if (params_text[1] == '&'){
        params_text = params_text.slice(0, 1) + params_text.slice(2)
    }

    console.log(params_body)
    if (!has_value){
        params_text = ''
        endpoint = backup_enpoint
    }

    endpoint  = backup_enpoint + params_text
    display_url.textContent = endpoint 
}


















AOS.init();

var TxtType = function(el, toRotate, period) {
this.toRotate = toRotate;
this.el = el;
this.loopNum = 0;
this.period = parseInt(period, 10) || 2000;
this.txt = '';
this.tick();
this.isDeleting = false;
};

TxtType.prototype.tick = function() {
var i = this.loopNum % this.toRotate.length;
var fullTxt = this.toRotate[i];

if (this.isDeleting) {
this.txt = fullTxt.substring(0, this.txt.length - 1);
} else {
this.txt = fullTxt.substring(0, this.txt.length + 1);
}

this.el.innerHTML = '<span class="wrap">'+this.txt+'</span>';

var that = this;
var delta = 200 - Math.random() * 100;

if (this.isDeleting) { delta /= 2; }

if (!this.isDeleting && this.txt === fullTxt) {
delta = this.period;
this.isDeleting = true;
} else if (this.isDeleting && this.txt === '') {
this.isDeleting = false;
this.loopNum++;
delta = 500;
}

setTimeout(function() {
that.tick();
}, delta);
};

window.onload = function() {
var elements = document.getElementsByClassName('typewrite');
for (var i=0; i<elements.length; i++) {
    var toRotate = elements[i].getAttribute('data-type');
    var period = elements[i].getAttribute('data-period');
    if (toRotate) {
      new TxtType(elements[i], JSON.parse(toRotate), period);
    }
}
// INJECT CSS
var css = document.createElement("style");
css.type = "text/css";
css.innerHTML = ".typewrite > .wrap { border-right: 0.2em solid #0ea5e9}";
document.body.appendChild(css);
};