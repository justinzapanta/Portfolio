const up_icon = document.querySelector('#up_icon')
const down_icon = document.querySelector('#down_icon')
const url_dropdown = document.querySelector('#url_dropdown')

id = 0
function dropdown(){
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
const body_guide = document.querySelector('#body_guide')
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
    params_object = {}
    

    dropdown()
    show_response()
    hide_button(method.textContent)
    body_textrea.value = ''
    body_textrea.classList.replace('border-red-500', 'border-gray-400')

    if (request_methond === 'POST:'){
        body_guide.textContent = 'Create'
    }else{
        body_guide.textContent = 'Update'
    }

}

const response_textrea = document.querySelector('#response_textrea')
const body_textrea = document.querySelector('#body_textrea')

async function send_request(){
    let clean = request_methond.split(':')
    clean = clean[0]
    let response

    if (clean === 'GET'){
        response = await fetch(endpoint, {
            method : clean,
            headers : {'Content-Type' : 'application/json'},
        })

    }else if (clean === 'POST' || clean === 'PUT'){
        if (body_textrea.value !== ''){
            textarea_json = JSON.parse(body_textrea.value)
            submit_request = true

            for (field in textarea_json){
                if (textarea_json[field] === 'Change the value'){
                    submit_request = false
                }
            }

            if (submit_request){
                response = await fetch(endpoint, {
                    method : clean,
                    headers : {'Content-Type' : 'application/json'},
                    body : JSON.stringify(textarea_json)
                })
            }else{
                console.log('not send')
                body_textrea.classList.add('border-red-500')
            }
        }else{
            body_textrea.classList.add('border-red-500')
            show_body()
        }
    }

    const response_json = await response.json()
    let result
 
    //result
    if (clean === 'GET'){
        try{
            start = true
            let text = `{\n \tresult : [ `
            response_json.results.forEach(result => {
                text += '\n\t{'
                for(key in result){
                    text += `\n\t\t"${key}" : "${result[key]}"`
                    if (key != 'user_contactNumber'){
                        text += ','
                    }
                }
                text += `\n\t},`
            })
            
            text += `\n\t]\n}`
            response_textrea.value = text
        }catch{
            response_textrea.value = `result : ${response_json.results}`
        }
    //post
    }else if (clean === 'POST'){
        result = JSON.stringify(response_json.result)
        convert_toList = result.split(',')

    //update
    }else if (clean === 'PUT'){
        result = JSON.stringify(response_json.result)
        convert_toList = result.split(',')
    }

    //result
    if (clean === 'POST' || clean === 'PUT'){
        if (clean === 'PUT'){
            text = 'Updated\n{'
        }else{
            text = 'Created\n{'
        }

        result = JSON.stringify(response_json.result)
        convert_toList = result.split(',')

        convert_toList.forEach(element => {       
            element = element.split(':').join(' : ')
            
            text+= `\n\t${element},`

        })
        text += '\n}'

        response_textrea.value = text
    }

    show_response()
}
send_request()


const params_property = document.querySelector('#params_property')


const response_button = document.querySelector('#response_button')
const params_button = document.querySelector('#params_button')
const body_button = document.querySelector('#body_button')
const response_body = document.querySelector('#response_body')
const params_body = document.querySelector('#params_body')
const body_body = document.querySelector('#body_body')

const data_list = {
    '/api/ticket' : ['id', 'status', 'issue', 'dateCreated', 'close', 'user_fullName', 'user_email', 'user_contactNumber']
}



function show_params(){
    params_button.classList.add('font-bold')
    response_button.classList.remove('font-bold')
    body_button.classList.remove('font-bold')
    body_body.classList.add('hidden')

    params_property.innerHTML = `
        <div class="grid grid-cols-2">
            <div>
                <h1 class="font-roboto text-center text-sm ">Field</h1>
            </div>

            <div>
                <h1 class="font-roboto text-center text-sm">Value</h1>
            </div>
        </div>
    `
    const list = data_list[backup_enpoint]
    
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
    body_button.classList.remove('font-bold')
    response_button.classList.add('font-bold')

    body_body.classList.add('hidden')
    params_body.classList.add('hidden')
    response_body.classList.remove('hidden')
    if (request_methond !== 'PUT:'){
        display_url.textContent = backup_enpoint
    }
    params_object = {}
    endpoint = backup_enpoint
}

function show_body(){
    body_button.classList.add('font-bold')
    params_button.classList.remove('font-bold')
    response_button.classList.remove('font-bold')

    response_body.classList.add('hidden')
    params_body.classList.add('hidden')
    body_body.classList.remove('hidden')

    if (request_methond !== 'PUT:'){
        display_url.textContent = backup_enpoint
    }

    //textarea guide
    if (request_methond === 'POST:'){
        const fields = ["user_fullName", "user_email", "user_contactNumber", "issue"]

        text = '{'
        fields.forEach(field => {
            text += `\n\t"${field}" : "Change the value"`
            
            if (field !== 'issue'){
                text += ','
            }
        })
        text += '\n}'
        body_textrea.value = text
    }
    params_object = {}
}

const put_modal = document.querySelector('#put_modal')
const input_id = document.querySelector('#input_id')

function close_putModal(){
    put_modal.classList.replace('flex', 'hidden')
}

function show_putModal(){
    put_modal.classList.replace('hidden', 'flex')
}

function enter_id(){
    endpoint = backup_enpoint
    const id = input_id.value
    endpoint = endpoint.split('{id}')[0] + id
    display_url.textContent = endpoint
    close_putModal()
}


//params
let params_object = {}

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

    if (!has_value){
        params_text = ''
        endpoint = backup_enpoint
    }

    endpoint  = backup_enpoint + params_text
    display_url.textContent = endpoint 
}


function hide_button(method){
    if (method === 'GET:'){
        body_button.classList.add('hidden')
        params_button.classList.remove('hidden')
        response_button.classList.remove('hidden')
    }else if (method === 'POST:'){
        body_button.classList.remove('hidden')
        params_button.classList.add('hidden')
        response_button.classList.remove('hidden')
    }else if (method === 'PUT:'){
        show_putModal()
        body_button.classList.remove('hidden')
        params_button.classList.add('hidden')
        response_button.classList.remove('hidden')
    }
}

hide_button(request_methond)

































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