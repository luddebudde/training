const deletion = `
  <ul> 
    <li>BANANANA</li>
    <li>APPPLEEE</li>
  </ul>`;

const a = `
<button
  style="
    background-color: red;
    color: green;
    font-size: 30px;
    padding: 50px;
    padding-bottom: 20px;
    display: flex;
    flex-direction: column;
    align-items: center;
  "
  onclick="deleteList()"
>
  DELETE
</button>
`;

document.body.insertAdjacentHTML('beforeend', deletion);
document.body.insertAdjacentHTML('beforeend', a);

function deleteList() {
  // Find and remove the <ul> element from the DOM
  const ulElement = document.querySelector('ul');
  if (ulElement) {
    ulElement.remove();
  }
}