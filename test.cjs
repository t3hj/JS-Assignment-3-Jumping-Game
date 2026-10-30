const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const vm = require('node:vm');
function load() {
  const elements = new Map();
  function element() { return {textContent:'',disabled:false,dataset:{},style:{},tagName:'BODY',clientWidth:600,handlers:{},addEventListener(name, fn){this.handlers[name]=fn},append(){},remove(){},replaceChildren(){}}; }
  const buttons = Array.from({length:3}, element);
  const document = {hidden:false,handlers:{},querySelector(selector){if(!elements.has(selector))elements.set(selector,element());return elements.get(selector)},querySelectorAll(){return buttons},createElement:element,addEventListener(name,fn){this.handlers[name]=fn}};
  const context = vm.createContext({document,Math,console,requestAnimationFrame:()=>1,cancelAnimationFrame:()=>{}});
  vm.runInContext(fs.readFileSync(__dirname+'/script.js','utf8'),context);
  return {run:code=>vm.runInContext(code,context),document,buttons};
}
test('jump applies gravity and lands without a second midair jump',()=>{const a=load();a.run('startGame();jump();update(0.1)');assert.ok(a.run('height')>0);const v=a.run('velocity');a.run('jump()');assert.equal(a.run('velocity'),v);a.run('spawnTimer=100;for(let i=0;i<100;i++)update(0.01)');assert.equal(a.run('height'),0)});
test('collision ends game and freezes score; restart clears state',()=>{const a=load();a.run('startGame();spawnObstacle();obstacles[0].x=60;update(0.001)');assert.equal(a.run('running'),false);assert.match(a.document.querySelector('#status').textContent,/Final score: 0/);a.run('startGame()');assert.equal(a.run('obstacles.length'),0);assert.equal(a.run('score'),0);assert.equal(a.run('running'),true)});
test('cleared obstacles score exactly once',()=>{const a=load();a.run('startGame();spawnObstacle();obstacles[0].x=20;update(0.001);update(0.001)');assert.equal(a.run('score'),1)});
test('collision geometry distinguishes a successful jump',()=>{const a=load();assert.equal(a.run('hasCollision({x:60,width:24,height:40})'),true);a.run('height=50');assert.equal(a.run('hasCollision({x:60,width:24,height:40})'),false)});
test('visibility changes pause and resume the simulation',()=>{const a=load();a.run('startGame()');a.document.hidden=true;a.document.handlers.visibilitychange();assert.equal(a.run('paused'),true);a.document.hidden=false;a.document.handlers.visibilitychange();assert.equal(a.run('paused'),false);assert.equal(a.run('lastTime'),null)});
