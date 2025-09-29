export const changeDivStatus = (id: string, property: string, value: string) => {
    const mapDiv = document.getElementById(id);
    if (mapDiv) {
      mapDiv.style[property as any] = value; // Använd hakparentesnotation för att ändra stil
    }
}