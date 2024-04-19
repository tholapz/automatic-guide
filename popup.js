document.getElementById('toggleCheckbox').addEventListener('change', function () {
    const debugPanel = document.getElementById('debug-panel');
    debugPanel.style.display = this.checked ? "block" : "none"
});

document.querySelector('form').onsubmit = async (event) => {
    // Prevent the form from submitting normally
    event.preventDefault();

    const tabs = await chrome.tabs.query({ active: true, currentWindow: true });
    const formData = new FormData(event.target);

    const requestPayload = {
        prompt: formData.get("prompt"),
        url: tabs[0].url,
        model: formData.get("model")
    }
    document.getElementById('request-json-container').innerHTML = JSON.stringify(requestPayload, null, 2);

    const responsePayload = await postJSON(requestPayload)

    document.getElementById('response-json-container').innerHTML = JSON.stringify(responsePayload, null, 2);

    chrome.tabs.sendMessage(tabs[0].id, responsePayload, (response) => {
        console.log(response.status);
    })
    console.log('Form submitted');
    return responsePayload;
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
