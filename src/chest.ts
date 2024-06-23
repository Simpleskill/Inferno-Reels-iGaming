//// Pirate Fortune GAME

// import { Sprite,Texture } from 'pixi.js';

// export enum Values{
// 	Empty,
// 	Reward,
// 	Bonus
// }

// const MAX_ROWS:number = 3;
// const MAX_COLS:number = 3;

// const EMPTY_CHEST_CHANCE:number = 30;//50
// const REWARD_CHEST_CHANCE:number = 60;//40
// //const BONUS_CHEST_CHANCE:number = 5;

// export class Chest{
// 	id: number;
// 	row: number;
// 	col: number;
// 	sprite: Sprite;
// 	reward: Values;
// 	prize: number;
// 	isClosed: boolean = true;

// 	constructor(id: number, sprite: Sprite, appWidth: number, appHeight: number){
// 		this.id = id;
// 		this.row = Math.floor(id / MAX_ROWS);
// 		this.col = id % MAX_COLS;
// 		this.sprite = sprite;
// 		this.reward = RandomizeValue();
// 		this.prize = GetPrize(this.reward);
// 		this.sprite.x = appWidth/2 + GetX(this.col) +50;
// 		this.sprite.y = appHeight/2 + GetY(this.row);
// 		this.sprite.alpha = 1;
// 		this.SetInteractive(true);
// 	}
	
// 	Debug(){
// 		console.log( "ID:"+this.id+ "  texture:"+this.sprite.texture + "  row:"+this.row+"  col:"+this.col);
// 	}
// 	GetTexture():Texture{
// 		return this.sprite.texture;
// 	}
// 	SetSpriteSettings(anchor:number, x:number, y:number, width?:number, height?:number){
// 		this.sprite.anchor.set(anchor);
// 		this.sprite.x = x;
// 		this.sprite.y = y;
// 		if(typeof width !== 'undefined') {
// 			this.sprite.width = width;
// 		}
// 		if(typeof height !== 'undefined') {
// 			this.sprite.height = height;
// 		}
// 	}
// 	SetInteractive(isInteractive: boolean){
// 		this.sprite.interactive = isInteractive;
// 	}
// }

// function GetPrize(reward:Values):number{
// 	if (reward == Values.Empty) 
// 		return 0;
// 	else if (reward == Values.Reward) 
// 		return getRandomInt(1,10);
// 	else 
// 		return getRandomInt(1,10)*10;
// }

// function GetX(col:number):number{
// 	return (col - 1.5)*250;
// }

// function GetY(row:number):number{
// 	return (row - 1.5)*150;
// }
// function RandomizeValue():Values{
// 	var chance:number = getRandomInt(0,100);
// 	if(chance<=EMPTY_CHEST_CHANCE)
// 		return Values.Empty;
// 	else if(chance <= EMPTY_CHEST_CHANCE + REWARD_CHEST_CHANCE)
// 		return Values.Reward;
// 	else
// 		return Values.Bonus;
// }

// function getRandomInt(min:number, max:number) : number{
// 	min = Math.ceil(min);
// 	max = Math.floor(max);
// 	return Math.floor(Math.random() * (max - min + 1)) + min; 
// }
