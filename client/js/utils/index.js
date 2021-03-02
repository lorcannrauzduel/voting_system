function get(request, id = null) {
    let params = id !== null ? '/' + id : '';
    json = $.getJSON(api_url + request + params + token);
    callback(get.name, request, json)
    return json;
}

function post(request, data) {
    json = $.ajax({
        url : api_url + request + '/' + token,
        type : 'POST',
        dataType : 'json',
        data: data
    });
    callback(post.name, request, json)
    return json
}

function update(request, id, data) {
    json = $.ajax({
        url : api_url + request + '/' + id + token,
        type : 'PUT',
        dataType : 'json',
        data: data
    });
    callback(update.name, request, json)
    return json;
}

function destroy(request, id) {
    json = $.ajax({
        url : api_url + request + '/' + id + token,
        type : 'DELETE',
        dataType : 'json'
    });
    callback(destroy.name, request, json)
    return json;
}

function callback(request, request, json) {
    console.log(request + ' ' + request);
    console.log(json);
}

// Génère des tableaux
function buildTables(template_name, container, data) {
    template = $(template_name).html();
    content = Mustache.render(template, data);
    $(container).append(content);
}

// Génère des tableaux (loop)
function buildTablesEach(template_name, container, data, limit = null) {
    let max = limit !== null ? limit : data.length;
    for (let i = 0; i < max; i++) {
        template = $(template_name).html();
        content = Mustache.render(template, data[i]);
        $(container).append(content);
    }
}

// Reformate addresse 0x
function formatAddress(address) {
    return '<i class="fas fa-check"></i> '+address.substring(0, 6) + '...' + address.substring(address.length - 4);
}