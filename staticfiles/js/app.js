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
let id_url = false

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
    id_url = false
    if (request_methond === 'POST:'){
        body_guide.textContent = 'Create'
    }else{
        body_guide.textContent = 'Update'
    }

}

const response_textrea = document.querySelector('#response_textrea')
const body_textrea = document.querySelector('#body_textrea')

async function send_request(){
    const csrftoken = document.querySelector('meta[name="csrf-token"]').getAttribute('content');
    
    let clean = request_methond.split(':')
    clean = clean[0]
    let response

    if (clean === 'GET' || clean === "DELETE"){
        response = await fetch(endpoint, {
            method : clean,
            headers : {'Content-Type' : 'application/json', 'X-CSRFToken': csrftoken},
        })

    }else if (clean === 'POST' || clean === 'PUT'){
        if (body_textrea.value !== ''){
            try {
                textarea_json = JSON.parse(body_textrea.value)
                submit_request = true
            }catch{
                body_textrea.classList.add('border-red-500')
                submit_request = false
            }


            for (field in textarea_json){
                if (textarea_json[field] === 'Change the value'){
                    submit_request = false
                }
            }

            if (submit_request){
                response = await fetch(endpoint, {
                    method : clean,
                    headers : {'Content-Type' : 'application/json', 'X-CSRFToken': csrftoken},
                    body : JSON.stringify(textarea_json)
                })
            }else{
                show_body()
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
                    if (typeof(result[key]) == 'object'){
                        let start = true
                        let new_object = result[key]
                        text += `\n\t\t"${key}" : {`

                        for(field in new_object){
                            if (start){
                                text += `\n\t\t\t"${field}" : "${new_object[field]}",`
                            }
                        }
                        text += `\n\t\t}`
                    }else{
                        text += `\n\t\t"${key}" : "${result[key]}"`
                    }
                    if (key != 'user_contactNumber'){
                        text += ','
                    }
                }
                text += `\n\t},\n`
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
    if (clean === 'POST' || clean === 'PUT' || clean === 'DELETE'){ //change delete later
        if (clean === 'PUT'){
            text = 'Updated\n{'
        }else if (clean === 'POST'){
            text = 'Created\n{'
        }else{
            text = '\n{'
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
const change_id_button = document.querySelector('#change_id_button')
const response_body = document.querySelector('#response_body')
const params_body = document.querySelector('#params_body')
const body_body = document.querySelector('#body_body')

const data_list = {
    '/api/ticket' : ['id', 'status', 'issue', 'dateCreated', 'close', 'user_fullName', 'user_email', 'user_contactNumber'],
    '/api/agent' : ['agent_id', 'agent_fullName', 'agent_email', 'total_ticket', 'is_online'],
    '/api/ticket/assigned' : ['assigned_id', 'assigned_number', 'user_id', 'user_fullName', 'user_email', 'agent_id', 'agent_fullName', 'agent_email']
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
        endpoint = backup_enpoint
    }
    params_object = {}
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
        const fields = {
            '/api/ticket' : ["user_fullName", "user_email", "user_contactNumber", "issue"],
            '/api/agent'  : ['agent_fullName', 'agent_email']
        }

        text = '{'
        fields[backup_enpoint].forEach(field => {
            text += `\n\t"${field}" : "Change the value"`
            
            if (field !== 'issue' && field !== 'agent_email'){
                text += ','
            }
        })
        text += '\n}'
        body_textrea.value = text
    }else if (request_methond === 'PUT:'){
        const fields = { 
            '/api/ticket/{id}' :  ["status", "user_fullName", "user_email", "user_contactNumber", "issue"],
            '/api/agent/{id}' : ['agent_fullName', 'agent_email', 'is_online']
        }
        const comments = {
            '/api/ticket/{id}' : [
                'The status of the ticket. Possible values: "open", "in progress", "closed"',
                'The full name of the user associated with the ticket. Example: "Carl Justin Zapanta"',
                'The email address of the user. Example: "justin@example.com"',
                'The contact number of the user. Example: "095374234531"',
                'A brief description of the issue related to the ticket. Example: "Slow Internet Connection"'
            ],
            '/api/agent/{id}' : [
                'The full name of the agent. Example: "Carl Justin Zapanta"',
                'The email address of the agent. Example: "justin@example.com"',
                'Indicates whether the agent is currently online Possible values: true, false'
            ]

        }

        if (backup_enpoint === '/api/ticket/{id}'){
            text = `Example:\n{\n\t"user_fullName" : "Carl Justin Zapanta"\n} \n\nAvailable Fields:`
        }else{
            text = `Example:\n{\n\t"agent_fullName" : "Carl Justin Zapanta"\n} \n\nAvailable Fields:`
        }
        
        let index = 0
        fields[backup_enpoint].forEach(field => {
            text += '\n - ' + field +': ' + comments[backup_enpoint][index]
            index += 1
        })
        body_textrea.placeholder = text

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
    if (input_id.value !== ''){
        endpoint = backup_enpoint
        const id = input_id.value
        endpoint = endpoint.split('{id}')[0] + id
        display_url.textContent = endpoint
        close_putModal()
    }
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
        display_method.classList.remove('text-emerald-600')
        display_method.classList.remove('text-blue-500')
        display_method.classList.remove('text-yellow-500')
        display_method.classList.remove('text-red-500')

        display_method.classList.add('text-emerald-600')
        body_button.classList.add('hidden')
        params_button.classList.remove('hidden')
        response_button.classList.remove('hidden')
        change_id_button.classList.add('hidden')
        input_id.value = ''
    }else if (method === 'POST:'){
        display_method.classList.remove('text-emerald-600')
        display_method.classList.remove('text-blue-500')
        display_method.classList.remove('text-yellow-500')
        display_method.classList.remove('text-red-500')

        display_method.classList.add('text-blue-500')
        body_button.classList.remove('hidden')
        params_button.classList.add('hidden')
        response_button.classList.remove('hidden')
        change_id_button.classList.add('hidden')
        input_id.value = ''

    }else if (method === 'PUT:'){
        display_method.classList.remove('text-emerald-600')
        display_method.classList.remove('text-blue-500')
        display_method.classList.remove('text-yellow-500')
        display_method.classList.remove('text-red-500')

        display_method.classList.add('text-yellow-500')
        show_putModal()
        body_button.classList.remove('hidden')
        params_button.classList.add('hidden')
        response_button.classList.remove('hidden')
        change_id_button.classList.remove('hidden')
    }else if (method === 'DELETE:'){
        display_method.classList.remove('text-emerald-600')
        display_method.classList.remove('text-blue-500')
        display_method.classList.remove('text-yellow-500')
        display_method.classList.remove('text-red-500')

        display_method.classList.add('text-red-500')
        show_putModal()
        body_button.classList.add('hidden')
        params_button.classList.add('hidden')
        response_button.classList.remove('hidden')
        change_id_button.classList.remove('hidden')
    }
}

hide_button(request_methond)



const loading_screen = document.querySelector('#loading_screen')
const name_ = document.querySelector('#name')
const email = document.querySelector('#email')
const message = document.querySelector('#message')
const contact_form = document.querySelector('#contact_form')
const success_modal = document.querySelector('#success_modal')

async function submit_email(event){
    event.preventDefault();
    loading_screen.classList.remove('hidden')
    const csrftoken = document.querySelector('meta[name="csrf-token"]').getAttribute('content');
    
    const response = await fetch('/api/email', {
        method : 'POST',
        headers : {'Content-Type' : 'application/json', 'X-CSRFToken': csrftoken},
        body : JSON.stringify({
            user_fullName : name_.value,
            user_message : message.value,
            user_email : email.value
        })
    })

    const response_json = await response.json()
    if (response_json){
        loading_screen.classList.add('hidden')
        success_modal.classList.remove('hidden')
    }
}

function close_success_modal(){
    success_modal.classList.add('hidden')
}


function adjustHeight(textarea) {
    textarea.style.height = "auto"
    textarea.style.height = `${textarea.scrollHeight}px`
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

