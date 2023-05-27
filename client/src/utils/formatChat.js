export function formatChat(text) {
  let count = 0;
  let chat = "";
  let lines = 1;

  for (let i = 0; i < text.length; i++) {
    const char = text[i];
    const currentLine = lines * 23;
    chat += char;
    if (count >= currentLine) {
      chat += "<br/>";
      lines++;
    }
    count++;
  }
  return chat;
}
