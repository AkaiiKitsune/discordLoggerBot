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
        channelArea.innerHTML += `<username>${data[i].author}</username>`;
        channelArea.innerHTML += `<timestamp>${data[i].time}</timestamp>`;
        channelArea.innerHTML += `<p>${data[i].message}</p>`;
    }
}