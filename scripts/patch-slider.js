const fs = require('fs');

// Patch index.html to remove the inline manual scroll script (since we will handle it in home-loader.js)
let html = fs.readFileSync('index.html', 'utf8');
const scriptRegex = /<!-- Featured Listings Slider Logic -->[\s\S]*?<\/script>/;
if (scriptRegex.test(html)) {
  html = html.replace(scriptRegex, '<!-- Featured Listings Slider Logic Handled in home-loader.js -->');
  fs.writeFileSync('index.html', html, 'utf8');
  console.log("Patched index.html inline script.");
}

// Patch home-loader.js to use an infinite rotating DOM approach
let js = fs.readFileSync('assets/js/home-loader.js', 'utf8');
const oldScrollRegex = /function initAutoScroll[\s\S]*?\}\s*\}\s*$/;

const newScrollFunction = `function initAutoScroll(container, track) {
    let isHovering = false;
    let isTransitioning = false;
    let autoSlideInterval;

    // Manual Buttons
    const prevBtn = document.getElementById('featured-slider-prev');
    const nextBtn = document.getElementById('featured-slider-next');

    // Pause on hover
    container.addEventListener('mouseenter', () => { isHovering = true; });
    container.addEventListener('mouseleave', () => { isHovering = false; });
    container.addEventListener('touchstart', () => { isHovering = true; }, {passive: true});
    container.addEventListener('touchend', () => { 
      setTimeout(() => { isHovering = false; }, 2000); 
    });

    const slideNext = () => {
      if (isTransitioning || track.children.length <= 1) return;
      isTransitioning = true;
      
      const firstCard = track.firstElementChild;
      const moveDistance = firstCard.offsetWidth + 20; // width + gap
      
      track.style.transition = 'transform 0.5s ease-in-out';
      track.style.transform = \`translateX(-\${moveDistance}px)\`;
      
      setTimeout(() => {
        track.style.transition = 'none';
        track.style.transform = 'translateX(0)';
        track.appendChild(firstCard);
        isTransitioning = false;
      }, 500); // Wait for transition to finish
    };

    const slidePrev = () => {
      if (isTransitioning || track.children.length <= 1) return;
      isTransitioning = true;
      
      const lastCard = track.lastElementChild;
      const moveDistance = lastCard.offsetWidth + 20; // width + gap
      
      // Move last card to front instantly, but offset the track so it looks like it hasn't moved
      track.style.transition = 'none';
      track.insertBefore(lastCard, track.firstElementChild);
      track.style.transform = \`translateX(-\${moveDistance}px)\`;
      
      // Force reflow
      track.offsetHeight; 
      
      // Now animate it sliding back into place (to 0)
      track.style.transition = 'transform 0.5s ease-in-out';
      track.style.transform = 'translateX(0)';
      
      setTimeout(() => {
        isTransitioning = false;
      }, 500);
    };

    if (nextBtn) {
      nextBtn.addEventListener('click', () => {
        slideNext();
        resetInterval();
      });
    }

    if (prevBtn) {
      prevBtn.addEventListener('click', () => {
        slidePrev();
        resetInterval();
      });
    }

    const resetInterval = () => {
      clearInterval(autoSlideInterval);
      autoSlideInterval = setInterval(() => {
        if (!isHovering) slideNext();
      }, 3500);
    };

    // Start auto slide
    resetInterval();
  }
}
`;

if (oldScrollRegex.test(js)) {
  js = js.replace(oldScrollRegex, newScrollFunction);
  fs.writeFileSync('assets/js/home-loader.js', js, 'utf8');
  console.log("Patched home-loader.js initAutoScroll function.");
} else {
  console.log("Could not find initAutoScroll function to replace.");
}
