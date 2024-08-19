export const playAnimation = (picture: string, parts: number, frameRate: number, loopTimes: number, containerId: string, whenDone?: () => void) => {
    let loopsLeft = loopTimes
    const container = document.getElementById(containerId);
    if (!container) {
        console.error(`Element with id ${containerId} not found.`);
        return;
    }

    // Cleanup any existing animations
    const existingWrapper = container.querySelector('.animation-wrapper');
    if (existingWrapper) {
        existingWrapper.remove();
    }

    // Create a wrapper to hide the overflow of the image
    const wrapper = document.createElement('div');
    wrapper.className = 'animation-wrapper'; // Add a class for easier selection
    wrapper.style.position = 'relative';
    wrapper.style.overflow = 'hidden';  // Hide the overflow
    container.appendChild(wrapper);

    // Create the image element
    const spriteImage = document.createElement('img');
    spriteImage.src = picture;
    spriteImage.style.position = 'absolute';
    spriteImage.style.width = '40vw';
    spriteImage.style.height = '10vw';
    wrapper.appendChild(spriteImage);

    let currentFrame = 0;
    let frameWidth = 0;
    let animationTimeout: number | null = null;

    spriteImage.onload = () => {
        frameWidth = spriteImage.width / parts;
        // Set the width and height of the wrapper to match one frame
        wrapper.style.width = `${frameWidth}px`;
        wrapper.style.height = `${spriteImage.height}px`;

        const animate = () => {
            // Calculate the offset to display the correct frame
            const offsetX = -currentFrame * frameWidth;
            spriteImage.style.transform = `translateX(${offsetX}px)`;

            currentFrame = (currentFrame + 1) % parts; // Go to the next frame, looping around

            if (currentFrame === 0) {

                loopsLeft--

                if (typeof whenDone === 'function' && loopsLeft === 0){
                whenDone(); 
                
                stopAnimation();
                return;}
            } 
                animationTimeout = setTimeout(animate, 1000 / frameRate);
            
        };

        // Start the animation
        animate();
    };

    const stopAnimation = () => {
        if (animationTimeout !== null) {
            clearTimeout(animationTimeout);
            animationTimeout = null;
        }

        // Remove the image and wrapper elements from the container
        if (wrapper.parentNode) {
            wrapper.parentNode.removeChild(wrapper);
        }
    };

    // Provide a way to stop animation externally if needed
    return stopAnimation;
};