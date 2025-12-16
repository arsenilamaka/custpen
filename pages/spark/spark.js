document.addEventListener('DOMContentLoaded', function() {
    // kartoczki
    const cardsData = [
      {
        title: 'CyberPopover 2025',
        link:'https://developer.mozilla.org/en-US/docs/Web/API/Node/textContent',
        image: 'https://images.unsplash.com/photo-1550745165-9bc0b252726f?w=800&h=600&fit=crop',
        description: 'Click the glitchy button to open the CyberPopover complete with electro sound effects in this slick Pen from Jhey Tompkins. In classic Jhey fashion, this Pen is configurable! Open up the panel at the top right to tinker.'
      },
      {
        title: 'Everything you need to know about the Popover API',
        link:'https://developer.mozilla.org/en-US/docs/Web/API/Node/textContent',
        image: 'https://images.unsplash.com/photo-1461749280684-dccba630e2f6?w=800&h=600&fit=crop',
        description: 'Get the rundown on how to use the Popover API in this beginner-friendly tutorial from Coding in Public on YouTube. You can play along with the Pen!'
      },
      ,
      {
        title: 'Everything you need to know about the Popover API',
        link:'https://developer.mozilla.org/en-US/docs/Web/API/Node/textContent',
        image: 'https://images.unsplash.com/photo-1461749280684-dccba630e2f6?w=800&h=600&fit=crop',
        description: 'Get the rundown on how to use the Popover API in this beginner-friendly tutorial from Coding in Public on YouTube. You can play along with the Pen!'
      }
      ,
      {
        title: 'Everything you need to know about the Popover API',
        link:'https://developer.mozilla.org/en-US/docs/Web/API/Node/textContent',
        image: 'https://images.unsplash.com/photo-1461749280684-dccba630e2f6?w=800&h=600&fit=crop',
        description: 'Get the rundown on how to use the Popover API in this beginner-friendly tutorial from Coding in Public on YouTube. You can play along with the Pen!'
      }
    ];

    function createCard(data) {
      const card = document.createElement('div');
      card.className = 'card';


      const img = document.createElement('img');
      img.className = 'card-image';
      img.src = data.image;
      img.alt = data.title;
      card.appendChild(img);


      const content = document.createElement('div');
      content.className = 'card-content';


      const title = document.createElement('h2');
      title.className = 'card-title';
      
      const link = document.createElement('a');
      link.className="link";
      link.href = data.link;
      link.textContent = data.title;
      title.appendChild(link);
      content.appendChild(title);


      const description = document.createElement('div');
      description.className = 'card-description';
      description.textContent = data.description;
      content.appendChild(description);

      card.appendChild(content);
      return card;
    }


    function renderCards() {
      const container = document.getElementById('cardsContainer');
      cardsData.forEach(data => {
        container.appendChild(createCard(data));
      });
    }

    renderCards();
});

        

