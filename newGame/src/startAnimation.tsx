import { playAnimation } from "./playAnimation";

export const startAnimation = () => {
    const playSecondAnimation = () => {
        playAnimation('/gothic-hero-idle.png', 4, 7, 5, 'spriteContainer', 
          () => {
          playFirstAnimation();
      }
    );
      }
    //  createCredits(); // Anropa funktionen när sidan laddas

    // generateMap()
    const playFirstAnimation = () => {
    playAnimation('/gothic-hero-crouch.png', 3, 7, 1, 'spriteContainer', () => {
      playSecondAnimation();
  });
    }
    playFirstAnimation()
}