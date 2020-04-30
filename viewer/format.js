function makeDocument() {
    console.log('Begin makeDocument');
    console.log(`data = ${data}`);
    let channelArea = document.getElementById("channel-area");
    channelArea.hidden = false;
    if(data == null) {
        channelArea.innerHTML += '<h1>Error processing the Database:</h1>';
        channelArea.innerHTML += '<h2>data.json is null for some reason TwT</h2>';
        return;
    }
    if(Array.isArray(data) && data.length == 0) {
        channelArea.innerHTML += '<h1>Error processing the Database:</h1>';
        channelArea.innerHTML += '<h2>data.json is empty for some reason TwT</h2>';
        return;
    }
    for(let i = 0; i < data.length; i++) {
        console.log("Writing message " + i);
        channelArea.innerHTML += `<h3>${data[i].author}</h3>`;
        channelArea.innerHTML += `<h4>${data[i].time}</h4>`;
        channelArea.innerHTML += `<p>${data[i].message}</p><hr/>`;
    }
}