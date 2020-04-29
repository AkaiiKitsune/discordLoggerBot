function makeDocument() {
    for(let i = 0; i < data.len; i++) {
        document.write(`<h3>${data[i].author}</h3>`);
        document.write(`<h4>${data[i].time}</h4>`);
        document.write(`<p>${data[i].message}</p><hr/>`);
    }
}