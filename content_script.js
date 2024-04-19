chrome.runtime.onMessage.addListener(
    (request, sender, sendResponse) => {
        try {
            for (const name in request) {
                if (Object.hasOwnProperty.call(request, name)) {
                    const value = request[name];
                    const node = document.getElementsByName(name)[0]
                    node.value = value;
                    node.classList.add('focused')
                    window.setTimeout(function() {
                        node.classList.remove('focused')
                    }, 5000)
                    node.dispatchEvent(new Event('input', { bubbles: true }))
                }
            }
            console.log("received");
            sendResponse({status: "Success"});
        } catch (error) {
            console.log(error)
            sendResponse({status:"Exception occurred"})
        }
    }
)
