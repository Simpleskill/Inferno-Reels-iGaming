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

    ChangeLog 23-06-2024
        + Win validation
        + Implementing Letterbox for responsiveness
        + Implementing mask for the game scene
        + Art Improvement using Photoshop
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
    BlurFilter,
    //Color,
} from 'pixi.js';



// **************************************************************/
// ********************  Interfaces  ****************************/
// **************************************************************/

// Reel Interface
interface Reel {
    container: Container;
    symbols: Symbol[];
    position: number;
    previousPosition: number;
    blur: BlurFilter;
}

// Symbol Interface
interface Symbol {
    sprite: Sprite;
}

// Tween Interface
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

const tweening: Tween[] = [];

(async () => {
    // Create a new App
    const app = new Application();
        
    // App initialization
    await app.init({
        resizeTo: window,
        autoDensity: true,        
        width: window.innerWidth,
        height: window.innerHeight,
        backgroundAlpha: 0,
        resolution: window.devicePixelRatio || 1,
        antialias: true
    });

    // Append canvas to HTML Document Body
    document.body.appendChild(app.canvas);

    // **************************************************************/
    // ***** Letterbox system implementation for responsiveness *****/
    // **************************************************************/
    const rootContainer = app.stage.addChild(new Container());

    // Set the design width & height to calculate ratio
    const DESIGN_WIDTH = 1280;
    const DESIGN_HEIGHT = 720;

    // Function handling resize impacts on design/aspect ratio
    function OnResize () {
        const designRatio = DESIGN_WIDTH / DESIGN_HEIGHT;
        const aspectRatio = window.innerWidth / window.innerHeight;

        if (aspectRatio < designRatio) {
            rootContainer.scale.set(window.innerWidth / DESIGN_WIDTH);
        } else {
            rootContainer.scale.set(window.innerHeight / DESIGN_HEIGHT);
        }

        rootContainer.position.set(
            (window.innerWidth - DESIGN_WIDTH * rootContainer.scale.x) * 0.5,
            (window.innerHeight - DESIGN_HEIGHT * rootContainer.scale.y) * 0.5
        );
    }

    // Everytime screen resize will run the function OnResize
    window.addEventListener('resize', OnResize);

    // Run OnResize function when game starts
    OnResize();

    // **************************************************************/
    // *********************   Visual Assets   **********************/
    // **************************************************************/
    // Load Textures
    await Assets.load([
        'Background.png',
        'Logo.png',
        'CompanyLogo.png'
    ]);

    // Add Background
    const backgroundText: Texture = Texture.from('Background.png');
    const background: Sprite = new Sprite(backgroundText);
    background.anchor.set(0.5);
    background.x = DESIGN_WIDTH/2;
    background.y = DESIGN_HEIGHT/2;
    background.width = DESIGN_WIDTH;
    background.height = DESIGN_HEIGHT;
    rootContainer.addChild(background);

    // Add GameLogo
    const GameLogoText: Texture = Texture.from('Logo.png');
    const gameLogo: Sprite = new Sprite(GameLogoText);
    gameLogo.width = DESIGN_WIDTH*0.25;
    gameLogo.height = DESIGN_HEIGHT*0.25;
    rootContainer.addChild(gameLogo);  

    // Add CompanyLogo
    const companyLogoText: Texture = Texture.from('CompanyLogo.png');
    const companyLogo: Sprite = new Sprite(companyLogoText);
    companyLogo.x = DESIGN_WIDTH *0.79;
    companyLogo.y = DESIGN_HEIGHT *0.01;
    companyLogo.width = DESIGN_WIDTH*0.2;
    companyLogo.height = DESIGN_HEIGHT*0.1;
    rootContainer.addChild(companyLogo);


    // Load Symbols
    await Assets.load([
        'Symbols/Wild.png',
        'Symbols/Cerberus.png',
        'Symbols/Trident.png',
        'Symbols/Key.png'
    ]);

    const REEL_WIDTH = 115;
    const SYMBOL_SIZE = 110;
    const REEL_MARGIN_Y = 0;
    const REEL_MAX_COLS = 3;
    const REEL_MAX_ROWS = 5;


    // Create symbols textures
    const slotTextures: Texture[] = [
        Texture.from('Symbols/Wild.png'),
        Texture.from('Symbols/Cerberus.png'),
        Texture.from('Symbols/Trident.png'),
        Texture.from('Symbols/Key.png')
    ];

    // Create reels
    const reels: Reel[] = [];

    // Create reels Container
    const reelContainer = new Container();


    // Create & Draw all symbols
    for (let i = 0; i < REEL_MAX_COLS; i++) {
        const rc = new Container();
        rc.x = i * REEL_WIDTH;
        reelContainer.addChild(rc);

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

        // Create Symbols
        for (let j = 0; j < REEL_MAX_ROWS; j++) {
            const rNumber = Math.floor(Math.random() * slotTextures.length);
            
            const symbol : Symbol  ={
                sprite: new Sprite(slotTextures[rNumber])
            }
            
            symbol.sprite.scale.x = symbol.sprite.scale.y = Math.min(SYMBOL_SIZE / symbol.sprite.width, SYMBOL_SIZE / symbol.sprite.height);
            symbol.sprite.x = Math.round((SYMBOL_SIZE - symbol.sprite.width) / 2 -REEL_MARGIN_Y);
            
            reel.symbols.push(symbol);
            
            rc.addChild(symbol.sprite);
        }
        // Apend reel to the array of reels
        reels.push(reel);
    }

    // Append reelContainer to our screen rootContainer
    rootContainer.addChild(reelContainer);    


    reelContainer.x = DESIGN_WIDTH*0.36;
    reelContainer.y = DESIGN_HEIGHT*0.20;
    reelContainer.alpha = 1;
    
    const bottom = new Graphics()
    .rect(DESIGN_WIDTH * 0.5,DESIGN_HEIGHT *0.7, DESIGN_WIDTH, DESIGN_HEIGHT*0.4);

    // Spin Button
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

    const playText = new Text('Spin the wheels!', style);
    playText.x = DESIGN_WIDTH * 0.38;
    playText.y = DESIGN_HEIGHT * 0.8;
    bottom.addChild(playText);
    rootContainer.addChild(bottom);

    // Spin Button Behaviour
    bottom.eventMode = 'static';
    bottom.cursor = 'pointer';
    bottom.addListener('pointerdown', () => {
        startPlay();
    });

    
    // **************************************************************/
    // **************************   MASK   **************************/
    // **************************************************************/

    // Create a graphics object to define our mask
    let mask = new Graphics()
    // Add the rectangular area to show
    .rect(0,0,SYMBOL_SIZE*3+10,SYMBOL_SIZE*3)
    .fill(0xffffff);

    mask.alpha = 0.5;

    // Set the mask to use our graphics object from above
    reelContainer.mask = mask;

    // Add the mask as a child, so that the mask is positioned relative to its parent
    reelContainer.addChild(mask);

    let running = false;

    // Function to run once the spin is trigger
    function startPlay() {
        if (running) return;
        CleanReels();
        running = true;
        for (let i = 0; i < reels.length; i++) {
            const r = reels[i];
            const extra = Math.floor(Math.random() * 3);
            const target = r.position + 10 + i * 5 + extra;
            const time = 2500 + i * 600 + extra * 600;
            tweenTo(r, 'position', target, time, backout(0.7), undefined, i === reels.length - 1 ? reelsComplete : undefined);

        }
    }

    // Function to validate if there is any connection in the given combination
    function validateLines(symbolNames: (string | null)[]): boolean {
        const wild = "Wild";
        let firstSymbol: string | null = null;
        let wildCount = 0;
    
        for (let i = 0; i < symbolNames.length; i++) {
            const symbol = symbolNames[i];
    
            if (symbol === wild) {
                wildCount++;
            } else if (firstSymbol === null) {
                firstSymbol = symbol;
            } else if (symbol !== firstSymbol) {
                return false;
            }
        }
    
        if (wildCount === symbolNames.length) {
            return true; // 3 Wilds in a row
        }
    
        if (wildCount > 0 && firstSymbol !== null) {
            return true; // 1 Wild and 2 equal symbols
        }
    
        return wildCount === 0 && firstSymbol !== null; // All symbols are equals and not wilds
    }

    // Called after the spin is over
    function reelsComplete() {
        running = false;
        
        // Iterate through the 3 middle rows that are being shown to the player
        for (let rows = 1; rows < 4; rows++) {
            const symbolNames = [];

            for (let i = 0; i < reels.length; i++) {
                const { position } = reels[i];

                let index = ((rows - Math.round(position)) % 5);
                if (index < 0) {
                    index += 5;
                }
                symbolNames.push(GetTextureName(reels[i].symbols[index].sprite.texture.label));
            }
            console.log("Row "+ rows);
            if(validateLines(symbolNames)){
                WinRow(rows);
            }
        }
        running = false;
    }

    // Function to highlight the row after a win is detected
    function WinRow(row:number){
        console.log("Won at line: "+row);
        for (let i = 0; i < 3; i++) {
            const { position } = reels[i];

            let index = ((row - Math.round(position)) % 5);
            if (index < 0) {
                index += 5;
            }
            reels[i].container.children[index].tint = 0xff0000;
        }
    }

    // Clean highlighted reels
    function CleanReels(){
        for (let i = 0; i < reels.length; i++) {
            const r = reels[i];
            
            for (let j = 0; j < r.symbols.length; j++) {
                
                const sprite = r.symbols[j].sprite;
                sprite.tint = 0xFFFFFF;
            }
        }
    }

    // Function to return the name of the symbol based on the texturePath
    function GetTextureName(texturePath: string | undefined) {
        if (texturePath === undefined || texturePath === null) {
            return null; // Return null if texturePath equals null or don't exist
        }

        // Get full texture name
        const fileName = texturePath.substring(texturePath.lastIndexOf('/') + 1);
        // Remove extension
        const nameWithoutExtension = fileName.substring(0, fileName.lastIndexOf('.'));
        return nameWithoutExtension;
    }

    // Listen for animate update.
    app.ticker.add(() => {
        // Update Reels
        for (let i = 0; i < reels.length; i++) {
            const r = reels[i];
            
            // Update amount of blur based on y velocity
            r.blur.blurY = (r.position - r.previousPosition) * 8;
            r.previousPosition = r.position;

            // Update Symbols positions at reel
            for (let j = 0; j < r.symbols.length; j++) {
                const symb = r.symbols[j];
                const sprite = symb.sprite;
                const prevy = sprite.y -100;

                sprite.y = ((r.position + j) % r.symbols.length) * SYMBOL_SIZE - SYMBOL_SIZE;
                if (sprite.y < 0 && prevy > SYMBOL_SIZE) {
                    // Detect if should change texture
                    sprite.texture = slotTextures[Math.floor(Math.random() * slotTextures.length)];
                    sprite.scale.x = sprite.scale.y = Math.min(SYMBOL_SIZE / sprite.texture.width, SYMBOL_SIZE / sprite.texture.height);
                    sprite.x = Math.round((SYMBOL_SIZE - sprite.width) / 2 - REEL_MARGIN_Y);
                }
            }
        }
    });

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

    // Listen for animate update.
    app.ticker.add(() => {
        const now = Date.now();
        const remove: Tween[] = [];

        for (let i = 0; i < tweening.length; i++) {
            const t = tweening[i];
            const phase = Math.min(1, (now - t.start) / t.time);

            t.object[t.property] = lerp(t.propertyBeginValue, t.target, t.easing(phase));
            if (t.change) t.change(t);
            if (phase === 1) {
                t.object[t.property] = t.target;
                if (t.complete) t.complete(t);
                remove.push(t);
            }
        }
        for (let i = 0; i < remove.length; i++) {
            tweening.splice(tweening.indexOf(remove[i]), 1);
        }
    });

    // Basic linear interpolation function
    function lerp(a1: number, a2: number, t: number): number {
        return a1 * (1 - t) + a2 * t;
    }

    // Function from tweenjs Backout
    // https://github.com/CreateJS/TweenJS/blob/master/src/tweenjs/Ease.js
    function backout(amount: number): (t: number) => number {
        return (t: number) => --t * t * ((amount + 1) * t + amount) + 1;
    }
})();
