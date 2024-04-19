document.querySelector('form').onsubmit = async (event) => {
    // Prevent the form from submitting normally
    event.preventDefault();

    const tabs = await chrome.tabs.query({active: true, currentWindow: true});

    chrome.scripting.insertCSS({
        files: ['highlight-fields.css'],
        target: {tabId: tabs[0].id}
    });

    const url = tabs[0].url
    const formData = new FormData(event.target);
    const prompt = formData.get("messageLLM")

    const results = await postJSON({
        prompt,
        url,
        mode:"wizardlm2"
    })

    document.getElementById('json-container').innerHTML = '<pre>' + JSON.stringify(results, null, 2) + '</pre>';

    chrome.tabs.sendMessage(tabs[0].id, results, (response) => {
        console.log(response.status);
    })
    console.log('Form submitted');
    return results;
   };

async function postJSON(data) {
    try {
        const response = await fetch('http://127.0.0.1:8000/items', {
            method: "POST",
            headers: {
            "Content-Type": "application/json",
            },
            body: JSON.stringify(data),
        });

        const result = await response.json();
        console.log("Success:", result);
        return result;
    } catch (error) {
        console.error("Error:", error);
    }
}
