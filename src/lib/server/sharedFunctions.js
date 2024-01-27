export async function fetchIMDB(url) {
    const response = await fetch(url, {
        "headers": {
            "accept-language": "pt-BR,pt;q=0.9,en;q=0.8",
        }
    })
    const htmlContent = await response.text();
    const startIndex = htmlContent.indexOf(`{"props":`);
    const endIndex = htmlContent.indexOf('<', startIndex)
    const jsonString = htmlContent.substring(startIndex, endIndex)
    const jsonObject = JSON.parse(jsonString);
    return jsonObject;
}
