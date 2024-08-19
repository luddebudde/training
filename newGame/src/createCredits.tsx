import { createMenu } from "./createMenu";

export const createCredits = () => {
    // Creator title
    const creatorTitle = document.createElement('p');
    // creatorTitle.style.padding = '60px';
    creatorTitle.style.padding = '30px';
    creatorTitle.style.color = 'red';
    creatorTitle.style.fontSize = '60px';
    creatorTitle.style.backgroundColor = 'darkred';
    creatorTitle.style.borderRadius = '10px';
    creatorTitle.style.textAlign = 'center';
    creatorTitle.style.position = 'absolute';
    creatorTitle.style.top = '5%';
    creatorTitle.style.left = '50%'; 
    creatorTitle.style.transform = 'translateX(-50%)';
    creatorTitle.textContent = 'Creator, maker & founder';
  

    //  Creator name square
    const wrapperDiv = document.createElement('div');
    wrapperDiv.style.display = 'flex';
    wrapperDiv.style.justifyContent = 'center';
    wrapperDiv.style.alignItems = 'center';
    wrapperDiv.style.width = '15%';
    wrapperDiv.style.height = '100px';
    wrapperDiv.style.backgroundColor = 'blue'; 
    wrapperDiv.style.margin = '0 auto'; 
    wrapperDiv.style.position = 'relative';

    const creatorText = document.createElement('textarea');
    // creatorText.style.padding = '15px';
    creatorText.style.padding = '15px';
    creatorText.style.color = 'darkred';
    // creatorText.style.fontSize = '60px';
    creatorText.style.fontSize = '45px';
    creatorText.style.textAlign = 'center';
    creatorText.style.backgroundColor = 'blue';
    creatorText.style.border = 'none';
    creatorText.style.resize = 'none';
    creatorText.style.overflow = 'hidden';
    creatorText.style.width = '15%';
    creatorText.style.height = '10%';
    creatorText.style.lineHeight = '1';
    creatorText.style.margin = '75px';
    creatorText.style.position = 'absolute';
    creatorText.style.top = '22.5%';
    creatorText.value = 'Ludwig Lindgren'; 

    wrapperDiv.appendChild(creatorText);


    // Helper credit
    const helperTitle = document.createElement('p');
    helperTitle.style.padding = '40px';
    helperTitle.style.color = 'red';
    helperTitle.style.fontSize = '40px';
    helperTitle.style.backgroundColor = 'darkred';
    helperTitle.style.borderRadius = '10px';
    helperTitle.style.textAlign = 'center'; 
    helperTitle.style.position = 'absolute';
    helperTitle.style.top = '45%';
    helperTitle.style.left = '50%'; 
    helperTitle.style.transform = 'translateX(-50%)'; 
    helperTitle.textContent = 'Assistance & helpers';

    // Helper credit name
    const helperNameTitle = document.createElement('p');
    helperNameTitle.style.padding = '30px';
    helperNameTitle.style.color = 'cyan';
    helperNameTitle.style.fontSize = '25px';
    helperNameTitle.style.backgroundColor = 'darkgreen';
    helperNameTitle.style.borderRadius = '10px';
    helperNameTitle.style.textAlign = 'center';
    helperNameTitle.style.position = 'absolute';
    helperNameTitle.style.top = '63%';
    helperNameTitle.style.left = '50%'; 
    helperNameTitle.style.transform = 'translateX(-50%)';
    helperNameTitle.textContent = 'Johannes Lindgren & ChatGPT';
  
    const backButton = document.createElement('button');
    backButton.style.padding = '40px';
    backButton.style.color = 'darkred';
    backButton.style.fontSize = '40px';
    backButton.style.backgroundColor = 'orange';
    backButton.style.position = 'absolute';
    backButton.style.top = '84%';
    backButton.style.left = '86%';
    backButton.style.width = '13%';
    helperNameTitle.style.transform = 'translateX(-50%)';
    backButton.textContent = 'BACK';
    backButton.onclick = () => {
        createMenu()
    }

    // Hitta div och lägg till alla element
    const div = document.getElementById('menu');

    if (div) {
      div.innerHTML = ''; 
      div.appendChild(creatorTitle);
      div.appendChild(creatorText);
      div.appendChild(helperTitle);
      div.appendChild(helperNameTitle);
      div.appendChild(backButton);
      document.body.appendChild(wrapperDiv);
    } else {
      console.error('Element with id "menuDiv" not found.');
    }  

    // Helper credit name
    const outsideCredit = document.createElement('p');
    outsideCredit.style.padding = '30px';
    outsideCredit.style.color = 'yellow';
    outsideCredit.style.fontSize = '25px';
    outsideCredit.style.backgroundColor = 'darkgreen';
    outsideCredit.style.borderRadius = '10px';
    outsideCredit.style.textAlign = 'center';
    outsideCredit.style.position = 'absolute';
    outsideCredit.style.top = '0%';
    outsideCredit.style.left = '1%'; 
    // outsideCredit.style.transform = 'translateX(-50%)';
    outsideCredit.textContent = 'Author of Sprites  ';


    const creditsList = document.createElement('ul');
    creditsList.style.padding = '30px';
    creditsList.style.color = 'red';
    creditsList.style.fontSize = '23px';
    // creditsList.style.backgroundColor = 'green';
    creditsList.style.borderRadius = '10px';
    creditsList.style.textAlign = 'left'; // Ändrat från center till left
    creditsList.style.position = 'absolute';
    creditsList.style.top = '8%'; // Justera position
    creditsList.style.left = '-1%';
    creditsList.style.listStyleType = 'disc'; // Standard punktlista (bullet points)
    


    // Skapa och lägg till li-element (punkter) med bilder
    const createCreditItem = (text: string, imgSrc: string) => {
        const listItem = document.createElement('li');
        listItem.style.display = 'flex';
        listItem.style.alignItems = 'center';
    
        const nameSpan = document.createElement('span');
        nameSpan.textContent = text;
        nameSpan.style.marginRight = '10px'; // Avstånd mellan text och bild
    
        const img = document.createElement('img');
        img.src = imgSrc;
        img.alt = text; // Alternativ text för bilden
        img.style.width = '50px'; // Bildbredd
        img.style.height = '50px'; // Bildhöjd
        img.style.margin = '5px'
    
        listItem.appendChild(nameSpan);
        listItem.appendChild(img);
    
        return listItem;
    };

    // Lägg till namn och bilder till punktlistan
    creditsList.appendChild(createCreditItem('John Lennon - Background & path', '/public/john lennon.jpg'));
    creditsList.appendChild(createCreditItem('Paul McCartney - Enemy block', '/paul mcartney.jpg'));
    creditsList.appendChild(createCreditItem('George Harrison - Boss block', '/george harrison.jpg'));
    creditsList.appendChild(createCreditItem('Paul McCartney - Enemy block', '/ringo starr.jpg'));
    creditsList.appendChild(createCreditItem('ChatGPT - Grey fog', '/map/fog.webp'));
    creditsList.appendChild(createCreditItem('ChatGPT - Red fog', '/map/hellishFog.webp'));
    
    // Lägg till punktlistan i dokumentet
    div.appendChild(outsideCredit);
    div.appendChild(creditsList);
  };