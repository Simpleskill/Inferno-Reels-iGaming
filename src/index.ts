/*
    ProjectName :   Inferno Reels
    Author      :   André Castro
    Date        :   24/06/2024
    Description :   A slot game using PixiJS with 3x3 grid
    Versions    :   PixiJS v8
    GIT         :   https://github.com/Simpleskill/Inferno-Reels-iGaming

    **** References used ****
        - https://pixijs.com/8.x/guides/migrations/v8
        - https://pixijs.com/8.x/examples/masks/graphics
        - https://www.pixijselementals.com/#letterbox-scale
    

    **** CHANGELOGS ****
    ChangeLog 21-06-2024
        + Base version of the game
        + First version of AI Generated ART

    ChangeLog 24-06-2024 12:00
        + Win validation
        + Implementing Letterbox scale for responsiveness
        + Implementing mask for the game scene
        + Art Improvement using Photoshop
    
    ChangeLog 24-06-2024 16:00
        + Code refactor
        + Comments

    ChangeLog 24-06-2024 18:00
        + Code refactor
        + New Win effect
        + Finished Readme.md

    ChangeLog 24-06-2024 20:00
        + Removed hardcoded numbers
        + Code Reuse
        + Finish Gameplay GIF
    
*/

import {
    Application,
    Assets,
    Container,
    Texture,
    Sprite,
    Graphics,
    Text,
    TextStyle,
    BlurFilter
} from 'pixi.js';
import * as TWEEN from '@tweenjs/tween.js';

// Interfaces for defining structure of reels, symbols, and tweens
interface Reel {
    container: Container;
    symbols: Symbol[];
    position: number;
    previousPosition: number;
    blur: BlurFilter;
}

interface Symbol {
    sprite: Sprite;
}

interface Tween {
    object: any;
    property: string;
    propertyBeginValue: number;
    target: number;
    easing: (t: number) => number;
    time: number;
    change?: (tween: Tween) => void;
    complete?: (tween: Tween) => void;
    start: number;
}

// Constants for the game layout and configuration
const DESIGN_WIDTH = 1280;
const DESIGN_HEIGHT = 720;
const REEL_WIDTH = 115;
const SYMBOL_SIZE = 110;
const REEL_MAX_COLS = 3;
const REEL_MAX_ROWS = 5;
const tweening: Tween[] = [];

// Utility function for linear interpolation
function lerp(a1: number, a2: number, t: number): number {
    return a1 * (1 - t) + a2 * t;
}

// Easing function for smooth animation
function backout(amount: number): (t: number) => number {
    return (t: number) => --t * t * ((amount + 1) * t + amount) + 1;
}


// Function to create and manage tweens
function tweenTo(object: any, property: string, target: number, time: number, easing: (t: number) => number, onchange?: (tween: Tween) => void, oncomplete?: (tween: Tween) => void) {
    const tween: Tween = {
        object,
        property,
        propertyBeginValue: object[property],
        target,
        easing,
        time,
        change: onchange,
        complete: oncomplete,
        start: Date.now(),
    };

    tweening.push(tween);
    return tween;
}

// Function to extract the name of the symbol from its texture path
function getTextureName(texturePath: string | undefined): string | null {
    if (!texturePath) return null;
    const fileName = texturePath.substring(texturePath.lastIndexOf('/') + 1);
    return fileName.substring(0, fileName.lastIndexOf('.'));
}

// Function to validate if there is any connection in the given combination
function validateLines(symbolNames: (string | null)[]): boolean {
    const wild = "Wild";
    let firstSymbol: string | null = null;

    for (const symbol of symbolNames) {
        if (symbol === wild) {
            continue;
        } else if (firstSymbol === null) {
            firstSymbol = symbol;
        } else if (symbol !== firstSymbol) {
            return false;
        }
    }

    return true;
}


// Main Game Class
class SlotGame {
    private app!: Application;
    private reels!: Reel[];
    private slotTextures!: Texture[];
    private rootContainer!: Container;
    private reelContainer = new Container();
    private activeTweens: TWEEN.Tween<any>[] = [];

    constructor() {
        // Initialize the application and load assets
        this.initializeApp().then(() => {
            this.rootContainer = new Container();
            this.app.stage.addChild(this.rootContainer);
            this.reels = [];
            this.slotTextures = [];

            this.setupResizeHandler();
            this.loadAssets().then(() => this.initializeGame());
        }).catch(error => {
            console.error("Failed to initialize the application:", error);
            alert("An error occurred while initializing the game. Please try again.");
        });
    }

    // Initialize the PixiJS application
    private async initializeApp(): Promise<void> {
        this.app = new Application();
        
        await this.app.init({
            resizeTo: window,
            autoDensity: true,
            width: window.innerWidth,
            height: window.innerHeight,
            backgroundAlpha: 0,
            resolution: window.devicePixelRatio || 1,
            antialias: true
        });

        document.body.appendChild(this.app.canvas);
    }

    // Setup event listener for window resize to maintain aspect ratio
    private setupResizeHandler(): void {
        window.addEventListener('resize', this.onResize.bind(this));
        this.onResize();
    }

    // Handle window resize event to adjust the game scale
    private onResize(): void {
        const designRatio = DESIGN_WIDTH / DESIGN_HEIGHT;
        const aspectRatio = window.innerWidth / window.innerHeight;

        if (aspectRatio < designRatio) {
            this.rootContainer.scale.set(window.innerWidth / DESIGN_WIDTH);
        } else {
            this.rootContainer.scale.set(window.innerHeight / DESIGN_HEIGHT);
        }

        this.rootContainer.position.set(
            (window.innerWidth - DESIGN_WIDTH * this.rootContainer.scale.x) * 0.5,
            (window.innerHeight - DESIGN_HEIGHT * this.rootContainer.scale.y) * 0.5
        );
    }

    // Load all necessary assets for the game
    private async loadAssets(): Promise<void> {
        try {
            await Assets.load([
                'Background.png',
                'Logo.png',
                'CompanyLogo.png',
                'Coin.png',
                'Symbols/Wild.png',
                'Symbols/Cerberus.png',
                'Symbols/Trident.png',
                'Symbols/Key.png'
            ]);

            this.slotTextures = [
                Texture.from('Symbols/Wild.png'),
                Texture.from('Symbols/Cerberus.png'),
                Texture.from('Symbols/Trident.png'),
                Texture.from('Symbols/Key.png')
            ];
        } catch (error) {
            console.error("Failed to load assets:", error);
            alert("An error occurred while loading game assets. Please refresh the page and try again.");
        }
    }

    // Initialize the game components after loading assets
    private initializeGame(): void {
        this.addBackground();
        this.addLogos();
        this.createReels();
        this.addMask();
        this.addSpinButton();
        this.setupTicker();   
    }

    // Add the background image to the game
    private addBackground(): void {
        this.addSprite('Background.png', DESIGN_WIDTH / 2, DESIGN_HEIGHT / 2, DESIGN_WIDTH, DESIGN_HEIGHT);
    }

    // Add game and company logos to the scene
    private addLogos(): void {
        this.addSprite('Logo.png', DESIGN_WIDTH * 0.125, DESIGN_HEIGHT * 0.125, DESIGN_WIDTH * 0.25, DESIGN_HEIGHT * 0.25);
        this.addSprite('CompanyLogo.png', DESIGN_WIDTH * 0.89, DESIGN_HEIGHT * 0.06, DESIGN_WIDTH * 0.2, DESIGN_HEIGHT * 0.1);
    }

    // Utility function to add sprites
    private addSprite(textureName: string, x: number, y: number, width: number, height: number): void {
        const texture = Texture.from(textureName);
        const sprite = new Sprite(texture);
        sprite.anchor.set(0.5);
        sprite.position.set(x, y);
        sprite.width = width;
        sprite.height = height;
        this.rootContainer.addChild(sprite);
    }

    // Create and position the reels and symbols
    private createReels(): void {
        this.rootContainer.addChild(this.reelContainer);

        for (let i = 0; i < REEL_MAX_COLS; i++) {
            const rc = new Container();
            rc.x = i * REEL_WIDTH;
            this.reelContainer.addChild(rc);

            const reel: Reel = {
                container: rc,
                symbols: [],
                position: 0,
                previousPosition: 0,
                blur: new BlurFilter(),
            };

            reel.blur.blurX = 0;
            reel.blur.blurY = 0;
            rc.filters = [reel.blur];

            for (let j = 0; j < REEL_MAX_ROWS; j++) {
                const symbol = this.createOrUpdateSymbol();
                symbol.sprite.y = j * SYMBOL_SIZE;
                reel.symbols.push(symbol);
                rc.addChild(symbol.sprite);
            }

            this.reels.push(reel);
        }

        this.reelContainer.position.set(DESIGN_WIDTH * 0.36, DESIGN_HEIGHT * 0.20);
    }

    // Create or update a single symbol
    private createOrUpdateSymbol(sprite?: Sprite): Symbol {
        const randomTextureIndex = Math.floor(Math.random() * this.slotTextures.length);
        if (!sprite) {
            sprite = new Sprite(this.slotTextures[randomTextureIndex]);
        } else {
            sprite.texture = this.slotTextures[randomTextureIndex];
        }
        sprite.scale.set(Math.min(SYMBOL_SIZE / sprite.texture.width, SYMBOL_SIZE / sprite.texture.height));
        sprite.x = Math.round((SYMBOL_SIZE - sprite.width) / 2);
        return { sprite };
    }

    // Add mask to the reel container to hide overflow
    private addMask(): void {
        const mask = new Graphics()
        // Add the rectangular area to show
        .rect(0,0,SYMBOL_SIZE*3+10,SYMBOL_SIZE*3)
        .fill(0xffffff);
        mask.alpha = 0.5;

        // Set the mask to use our graphics object from above
        this.reelContainer.mask = mask;
    
        // Add the mask as a child, so that the mask is positioned relative to its parent
        this.reelContainer.addChild(mask);
    
    }

    // Add and configure the spin button
    private addSpinButton(): void {
        const style = new TextStyle({
            fontFamily: 'Arial',
            fontSize: 36,
            fontStyle: 'italic',
            fontWeight: 'bold',
            fill: 0xffffff,
            stroke: '#4a1850',
            dropShadow: true,
            wordWrap: true,
            wordWrapWidth: 440,
        });

        const playText = new Text({text:'Spin the wheels!', style});
        playText.position.set(DESIGN_WIDTH * 0.38, DESIGN_HEIGHT * 0.8);

        // Create an invisible button over the text
        const button = new Graphics()
            .rect(playText.x, playText.y, playText.width, playText.height)
            .fill({color:0x0, alpha:0})
            ;

        button.interactive = true;
        button.cursor = 'pointer';
        button.on('pointerdown', this.startPlay.bind(this));

        this.rootContainer.addChild(button);
        this.rootContainer.addChild(playText);
    }

    // Function to start spinning the reels
    private startPlay(): void {
        if (running) return;
        this.cleanReels();
        running = true;
        for (let i = 0; i < this.reels.length; i++) {
            const r = this.reels[i];
            const extra = Math.floor(Math.random() * 3);
            const target = r.position + 10 + i * 5 + extra;
            const time = 2500 + i * 600 + extra * 600;
            tweenTo(r, 'position', target, time, backout(0.7), undefined, i === this.reels.length - 1 ? this.reelsComplete.bind(this) : undefined);
        }
    }


    // Function to animate the winning line with the specified effect
    private animateWinningLine(row: number): void {
        for (let i = 0; i < REEL_MAX_COLS; i++) {
            const { position } = this.reels[i];
            let index = (row - Math.round(position)) % REEL_MAX_ROWS;
            if (index < 0) {
                index += REEL_MAX_ROWS;
            }
            const symbol = this.reels[i].symbols[index].sprite;

            // Start the pulse animation loop
            this.startPulseAnimation(symbol);
        }
    }

    // Function to start the pulse animation loop
    private startPulseAnimation(symbol: Sprite): void {
        const greenDuration = 500; // Duration to stay green in milliseconds
        const whiteDuration = 250; // Duration to stay white in milliseconds
        const fadeOutDuration = 1000; // Duration to fade out in milliseconds
        const fadeInDuration = 1000; // Duration to fade in in milliseconds

        this.changeToGreen(symbol, greenDuration, whiteDuration, fadeOutDuration, fadeInDuration);
    }

    // Function to change the symbol to green
    private changeToGreen(symbol: Sprite, greenDuration: number, whiteDuration: number, fadeOutDuration: number, fadeInDuration: number): void {
        const changeToGreenTween = new TWEEN.Tween(symbol)
            .to({ tint: 0x00ff00 }, 0)
            .easing(TWEEN.Easing.Linear.None)
            .onComplete(() => {
                this.stayGreen(symbol, greenDuration, whiteDuration, fadeOutDuration, fadeInDuration);
            })
            .start();

        this.activeTweens.push(changeToGreenTween);
    }

    // Function to keep the symbol green for a duration
    private stayGreen(symbol: Sprite, greenDuration: number, whiteDuration: number, fadeOutDuration: number, fadeInDuration: number): void {
        const stayGreenTween = new TWEEN.Tween(symbol)
            .to({}, greenDuration)
            .onComplete(() => {
                this.changeToWhite(symbol, whiteDuration, fadeOutDuration, fadeInDuration);
            })
            .start();

        this.activeTweens.push(stayGreenTween);
    }

    // Function to change the symbol back to white
    private changeToWhite(symbol: Sprite, whiteDuration: number, fadeOutDuration: number, fadeInDuration: number): void {
        const changeToWhiteTween = new TWEEN.Tween(symbol)
            .to({ tint: 0xffffff }, 0)
            .easing(TWEEN.Easing.Linear.None)
            .onComplete(() => {
                this.stayWhite(symbol, whiteDuration, fadeOutDuration, fadeInDuration);
            })
            .start();

        this.activeTweens.push(changeToWhiteTween);
    }

    // Function to keep the symbol white for a duration
    private stayWhite(symbol: Sprite, whiteDuration: number, fadeOutDuration: number, fadeInDuration: number): void {
        const stayWhiteTween = new TWEEN.Tween(symbol)
            .to({}, whiteDuration)
            .onComplete(() => {
                this.fadeOut(symbol, fadeOutDuration, fadeInDuration);
            })
            .start();

        this.activeTweens.push(stayWhiteTween);
    }

    // Function to fade out the symbol
    private fadeOut(symbol: Sprite, fadeOutDuration: number, fadeInDuration: number): void {
        const fadeOutTween = new TWEEN.Tween(symbol)
            .to({ alpha: 0.5 }, fadeOutDuration)
            .easing(TWEEN.Easing.Quadratic.In)
            .onComplete(() => {
                this.fadeIn(symbol, fadeInDuration);
            })
            .start();

        this.activeTweens.push(fadeOutTween);
    }

    // Function to fade in the symbol
    private fadeIn(symbol: Sprite, fadeInDuration: number): void {
        const fadeInTween = new TWEEN.Tween(symbol)
            .to({ alpha: 1 }, fadeInDuration)
            .easing(TWEEN.Easing.Quadratic.Out)
            .onComplete(() => {
                this.startPulseAnimation(symbol); // Loop the pulse
            })
            .start();

        this.activeTweens.push(fadeInTween);
    }


    // Function to be called when the reels finish spinning
    private reelsComplete(): void {
        running = false;
        // Will not consider the first line and last line, they are only for player viewing and not for win calculations
        for (let row = 1; row < 4; row++) {
            const symbolNames: (string | null)[] = [];

            for (let i = 0; i < this.reels.length; i++) {
                const { position } = this.reels[i];
                let index = (row - Math.round(position)) % REEL_MAX_ROWS;
                if (index < 0) {
                    index += REEL_MAX_ROWS;
                }
                symbolNames.push(getTextureName(this.reels[i].symbols[index].sprite.texture.label));
            }

            console.log("Row " + row);
            if (validateLines(symbolNames)) {
                this.animateWinningLine(row);
            }
        }
    }

    // Clean highlighted reels and stop animations
    private cleanReels(): void {
        // Stop all active tweens
        for (const tween of this.activeTweens) {
            tween.stop();
        }
        this.activeTweens = []; // Clear the active tweens list

        // Remove Tints and set alpha back to 1
        for (const reel of this.reels) {
            for (const symbol of reel.symbols) {
                symbol.sprite.alpha = 1;
                symbol.sprite.tint = 0xFFFFFF;
            }
        }
    }

    // Function to update reels while spining
    private updateReels():void{
        for (const reel of this.reels) {
            reel.blur.blurY = (reel.position - reel.previousPosition) * 8;
            reel.previousPosition = reel.position;

            // Update symbol positions
            for (let j = 0; j < reel.symbols.length; j++) {
                const symbol = reel.symbols[j];
                const prevY = symbol.sprite.y;
                symbol.sprite.y = ((reel.position + j) % reel.symbols.length) * SYMBOL_SIZE - SYMBOL_SIZE;
                if (symbol.sprite.y < 0 && prevY > SYMBOL_SIZE) {
                    this.createOrUpdateSymbol(symbol.sprite);
                }
            }
        }
    }

    // Setup the ticker for continuous updates
    private setupTicker(): void {
        this.app.ticker.add(() => {
            const now = Date.now();
            const remove: Tween[] = [];

            for (const t of tweening) {
                const phase = Math.min(1, (now - t.start) / t.time);
                t.object[t.property] = lerp(t.propertyBeginValue, t.target, t.easing(phase));
                if (t.change) t.change(t);
                if (phase === 1) {
                    t.object[t.property] = t.target;
                    if (t.complete) t.complete(t);
                    remove.push(t);
                }
            }

            for (const t of remove) {
                tweening.splice(tweening.indexOf(t), 1);
            }

            // Update TWEEN.js animations
            TWEEN.update();

            // Update reels
            this.updateReels();
        });
    }
}

// Initialize the game
let running = false;
new SlotGame();
