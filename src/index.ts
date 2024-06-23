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

// Definindo a interface Reel
interface Reel {
    container: Container;
    symbols: Sprite[];
    position: number;
    previousPosition: number;
    blur: BlurFilter;
}

(async () => {
    // Criar uma nova aplicação
    const app = new Application();
        
    // Inicializar a aplicação
    await app.init({
        backgroundColor: "#A183DE",
        resolution: window.devicePixelRatio || 1,
        autoDensity: true,
        resizeTo: window,
        antialias: true, 
        height: window.innerHeight,
        width: window.innerWidth
        //view: document.createElement('canvas') 
    });

    //app.stage.sortableChildren = true;

/* ************ BACKGROUND ******************  */
    // Carregar as texturas
    await Assets.load([
        'Background.png'
    ]);
    const backgroundText: Texture = Texture.from('Background.png');


    const background: Sprite = new Sprite(backgroundText);
    background.anchor.set(0.5);
    background.x = window.innerWidth/2;
    background.y = window.innerHeight/2;
    background.width = window.innerWidth;
    background.height = window.innerHeight;

    app.stage.addChild(background);

    // Adicionar o canvas da aplicação ao div com id 'pixi-content'
    document.body.appendChild(app.canvas);
    // const pixiContent = document.getElementById('pixi-content');
    // if (pixiContent) {
    //     pixiContent.appendChild(app.view);
    // } else {
    //     console.error('Elemento com ID "pixi-content" não encontrado.');
    // }

    // Carregar as texturas
    await Assets.load([
        'Wild.png',
        'Cerberus.png',
        'Trident.png',
        'Key.png'
    ]);

    const REEL_WIDTH = app.screen.width / 9;
    const SYMBOL_SIZE = app.screen.width / 9;
    const REEL_MARGIN_Y = app.screen.width /3;



    // Criar diferentes símbolos de slot
    const slotTextures: Texture[] = [
        Texture.from('Wild.png'),
        Texture.from('Cerberus.png'),
        Texture.from('Trident.png'),
        Texture.from('Key.png')
    ];

    // Construir os rolos
    const reels: Reel[] = [];
    const reelContainer = new Container();

    for (let i = 0; i < 3; i++) {
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

        // Construir os símbolos
        for (let j = 0; j < 4; j++) {
            const symbol = new Sprite(slotTextures[Math.floor(Math.random() * slotTextures.length)]);
            // Dimensionar o símbolo para caber na área do símbolo.
            symbol.y = j * SYMBOL_SIZE;
            symbol.scale.x = symbol.scale.y = Math.min(SYMBOL_SIZE / symbol.width, SYMBOL_SIZE / symbol.height);
            symbol.x = Math.round((SYMBOL_SIZE - symbol.width) / 2 -REEL_MARGIN_Y);
            reel.symbols.push(symbol);
            rc.addChild(symbol);
        }
        reels.push(reel);
    }
    app.stage.addChild(reelContainer);

    // Construir coberturas superior e inferior e posicionar reelContainer
    const margin = (app.screen.height - SYMBOL_SIZE * 3) / 2;

    reelContainer.y = margin;
    reelContainer.x = Math.round(app.screen.width - REEL_WIDTH * 3);
    
    const top = new Graphics()
    .rect(0, 0, app.screen.width, margin)
    .fill(0x0);
    
    
    const bottom = new Graphics()
    .rect(0, SYMBOL_SIZE * 3 + margin, app.screen.width, margin)
    .fill(0x000);

    // Adicionar texto de jogar
    const style = new TextStyle({
        fontFamily: 'Arial',
        fontSize: 36,
        fontStyle: 'italic',
        fontWeight: 'bold',
        fill: 0xffffff,  // Define uma cor única ou use um gradiente especial
        stroke: '#4a1850',
        //strokeThickness: 5,
        dropShadow: true,
        //dropShadowColor: '#000000',
        //dropShadowAngle: Math.PI / 6,
        //dropShadowBlur: 4,
        //dropShadowDistance: 6,
        wordWrap: true,
        wordWrapWidth: 440,
    });

    const playText = new Text('Spin the wheels!', style);
    playText.x = Math.round((bottom.width - playText.width) / 2);
    playText.y = app.screen.height - margin + Math.round((margin - playText.height) / 2);
    bottom.addChild(playText);

    // Adicionar texto de cabeçalho
    const headerText = new Text('INFERNO REELS', style);
    headerText.x = Math.round((top.width - headerText.width) / 2);
    headerText.y = Math.round((margin - headerText.height) / 2);
    top.addChild(headerText);

    app.stage.addChild(top);
    app.stage.addChild(bottom);

    // Definir a interatividade.
    bottom.eventMode = 'static';
    bottom.cursor = 'pointer';
    bottom.addListener('pointerdown', () => {
        startPlay();
    });

    let running = false;

    // Função para começar a jogar.
    function startPlay() {
        if (running) return;
        running = true;

        for (let i = 0; i < reels.length; i++) {
            const r = reels[i];
            const extra = Math.floor(Math.random() * 3);
            const target = r.position + 10 + i * 5 + extra;
            const time = 2500 + i * 600 + extra * 600;

            tweenTo(r, 'position', target, time, backout(0.5), undefined, i === reels.length - 1 ? reelsComplete : undefined);

        }
    }

    // Handler de conclusão dos reels.
    function reelsComplete() {
        running = false;
    }

    // Listen for animate update.
    app.ticker.add(() => {
        // Atualizar os slots.
        for (let i = 0; i < reels.length; i++) {
            const r = reels[i];
            // Atualizar a quantidade de filtro de desfoque y com base na velocidade.
            // Isso seria melhor se calculado também com o tempo em mente. Agora o desfoque depende da taxa de quadros.

            r.blur.blurY = (r.position - r.previousPosition) * 8;
            r.previousPosition = r.position;

            // Atualizar posições dos símbolos no rolo.
            for (let j = 0; j < r.symbols.length; j++) {
                const s = r.symbols[j];
                const prevy = s.y -100;

                s.y = ((r.position + j) % r.symbols.length) * SYMBOL_SIZE - SYMBOL_SIZE;
                if (s.y < 0 && prevy > SYMBOL_SIZE) {
                    // Detectar passagem e trocar a textura.
                    // Isso deve ser determinado de algum rolo lógico em um produto adequado.
                    s.texture = slotTextures[Math.floor(Math.random() * slotTextures.length)];
                    s.scale.x = s.scale.y = Math.min(SYMBOL_SIZE / s.texture.width, SYMBOL_SIZE / s.texture.height);
                    s.x = Math.round((SYMBOL_SIZE - s.width) / 2 - REEL_MARGIN_Y);
                }
            }
        }
    });

    // Função de interpolação simples. Isso deve ser substituído por uma biblioteca de interpolação adequada em um produto real.
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

    // Função básica de interpolação linear.
    function lerp(a1: number, a2: number, t: number): number {
        return a1 * (1 - t) + a2 * t;
    }

    // Função de saída Backout do tweenjs.
    // https://github.com/CreateJS/TweenJS/blob/master/src/tweenjs/Ease.js
    function backout(amount: number): (t: number) => number {
        return (t: number) => --t * t * ((amount + 1) * t + amount) + 1;
    }
})();
