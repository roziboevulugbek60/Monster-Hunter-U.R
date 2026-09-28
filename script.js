
/* =========================================================
   MONSTER HUNTER — ULUG'BEK.R
   COMPLETE SCRIPT
========================================================= */

"use strict";

/* =========================================================
   CANVAS
========================================================= */

const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");

let W = window.innerWidth;
let H = window.innerHeight;

function resizeCanvas() {
    W = window.innerWidth;
    H = window.innerHeight;

    canvas.width = Math.max(800, Math.floor(W * devicePixelRatio));
    canvas.height = Math.max(500, Math.floor(H * devicePixelRatio));

    canvas.style.width = W + "px";
    canvas.style.height = H + "px";

    ctx.setTransform(devicePixelRatio, 0, 0, devicePixelRatio, 0, 0);
}

window.addEventListener("resize", resizeCanvas);
resizeCanvas();


/* =========================================================
   DOM HELPERS
========================================================= */

const $ = id => document.getElementById(id);

function showModal(id) {
    $(id).classList.add("active");
}

function hideModal(id) {
    $(id).classList.remove("active");
}

function showScreen(id) {
    document.querySelectorAll(".screen").forEach(el => {
        el.classList.remove("active");
    });

    $(id).classList.add("active");
}

function clamp(value, min, max) {
    return Math.max(min, Math.min(max, value));
}


/* =========================================================
   GAME DATA
========================================================= */

const SAVE_KEY = "ULUGBEK_MONSTER_HUNTER_V1";

const weapons = [
    {
        id: "bow",
        name: "Hunter Bow",
        icon: "🏹",
        price: 0,
        damage: 18,
        speed: 500,
        description: "Tezkor masofaviy qurol."
    },
    {
        id: "sword",
        name: "Iron Sword",
        icon: "🗡️",
        price: 250,
        damage: 30,
        speed: 650,
        description: "Kuchli yaqin masofa quroli."
    },
    {
        id: "crossbow",
        name: "Crossbow",
        icon: "🏹",
        price: 500,
        damage: 40,
        speed: 750,
        description: "Kuchli o'q otuvchi qurol."
    },
    {
        id: "firestaff",
        name: "Fire Staff",
        icon: "🔥",
        price: 900,
        damage: 55,
        speed: 900,
        description: "Olovli sehrli hujum."
    },
    {
        id: "legendary",
        name: "Legendary Blade",
        icon: "⚔️",
        price: 1800,
        damage: 80,
        speed: 700,
        description: "Afsonaviy kuchli qurol."
    }
];

const skins = [
    { id: "default", name: "Hunter", icon: "🧙", price: 0 },
    { id: "knight", name: "Knight", icon: "🤺", price: 300 },
    { id: "ninja", name: "Ninja", icon: "🥷", price: 500 },
    { id: "samurai", name: "Samurai", icon: "👺", price: 700 },
    { id: "fire", name: "Fire Warrior", icon: "🔥", price: 1000 },
    { id: "ice", name: "Ice Warrior", icon: "❄️", price: 1200 },
    { id: "shadow", name: "Shadow", icon: "🕶️", price: 1500 },
    { id: "golden", name: "Golden Hunter", icon: "👑", price: 2000 },
    { id: "demon", name: "Demon", icon: "😈", price: 2500 },
    { id: "legendary", name: "Legendary", icon: "🦸", price: 3500 }
];

const zones = [
    {
        id: "forest",
        name: "FOREST",
        icon: "🌲",
        price: 0,
        colors: ["#315f38", "#0d2919"],
        monsters: ["Goblin", "Wolf", "Orc"]
    },
    {
        id: "desert",
        name: "DESERT",
        icon: "🏜️",
        price: 700,
        colors: ["#b97835", "#593718"],
        monsters: ["Scorpion", "Sand Beast", "Mummy"]
    },
    {
        id: "ice",
        name: "ICE LAND",
        icon: "❄️",
        price: 1200,
        colors: ["#69a7c5", "#183b58"],
        monsters: ["Ice Wolf", "Frost Beast", "Ice Golem"]
    },
    {
        id: "volcano",
        name: "VOLCANO",
        icon: "🌋",
        price: 1800,
        colors: ["#792b20", "#260b08"],
        monsters: ["Fire Beast", "Lava Orc", "Magma Golem"]
    },
    {
        id: "dark",
        name: "DARK LAND",
        icon: "🌑",
        price: 2500,
        colors: ["#33204f", "#0d0718"],
        monsters: ["Shadow Beast", "Demon", "Dark Golem"]
    }
];

const bosses = [
    {
        name: "Forest Dragon",
        icon: "🐉",
        hp: 700,
        damage: 15,
        reward: 700,
        xp: 400
    },
    {
        name: "Ice Titan",
        icon: "🐲",
        hp: 1200,
        damage: 22,
        reward: 1200,
        xp: 700
    },
    {
        name: "Demon King",
        icon: "👹",
        hp: 2000,
        damage: 30,
        reward: 2500,
        xp: 1200
    }
];


/* =========================================================
   SAVE DATA
========================================================= */

const defaultSave = {
    coins: 0,
    xp: 0,
    level: 1,

    totalKills: 0,
    bestKills: 0,

    weaponLevels: {
        bow: 1,
        sword: 1,
        crossbow: 1,
        firestaff: 1,
        legendary: 1
    },

    ownedWeapons: ["bow"],

    ownedSkins: ["default"],
    selectedSkin: "default",

    ownedZones: ["forest"],
    selectedZone: "forest",

    completedBosses: 0,

    potions: 3,

    sound: true,
    music: true,
    mobile: true
};

let saveData = loadSave();

function loadSave() {
    try {
        const saved = localStorage.getItem(SAVE_KEY);

        if (!saved) {
            return structuredClone(defaultSave);
        }

        const data = JSON.parse(saved);

        return {
            ...structuredClone(defaultSave),
            ...data,
            weaponLevels: {
                ...defaultSave.weaponLevels,
                ...(data.weaponLevels || {})
            }
        };
    } catch (error) {
        console.warn("Save file error:", error);
        return structuredClone(defaultSave);
    }
}

function saveGame() {
    try {
        localStorage.setItem(SAVE_KEY, JSON.stringify(saveData));
    } catch (error) {
        console.warn("Could not save:", error);
    }
}


/* =========================================================
   GAME STATE
========================================================= */

let gameRunning = false;
let paused = false;

let gameTime = 0;
let lastFrame = 0;

let spawnTimer = 0;
let attackCooldown = 0;
let fireballCooldown = 0;
let potionCooldown = 0;

let currentTarget = null;

let particles = [];
let projectiles = [];
let floatingTexts = [];

let monsters = [];
let obstacles = [];

let bossActive = false;
let currentBoss = null;
let bossIndex = 0;

let keys = {};

let camera = {
    x: 0,
    y: 0
};

const world = {
    width: 3200,
    height: 2200
};


/* =========================================================
   PLAYER
========================================================= */

const player = {
    x: world.width / 2,
    y: world.height / 2,

    radius: 24,

    speed: 260,

    hp: 100,
    maxHp: 100,

    facingX: 1,
    facingY: 0
};


/* =========================================================
   INPUT
========================================================= */

window.addEventListener("keydown", event => {

    keys[event.key.toLowerCase()] = true;

    if (event.key === "Escape") {
        togglePause();
    }

    if (event.key.toLowerCase() === "p") {
        togglePause();
    }

    if (event.key.toLowerCase() === "f") {
        useFireball();
    }

    if (event.code === "Space") {
        event.preventDefault();
        meleeAttack();
    }
});

window.addEventListener("keyup", event => {
    keys[event.key.toLowerCase()] = false;
});


/* =========================================================
   MOUSE
========================================================= */

let mouse = {
    x: W / 2,
    y: H / 2,
    down: false
};

canvas.addEventListener("mousemove", event => {
    const rect = canvas.getBoundingClientRect();

    mouse.x = event.clientX - rect.left;
    mouse.y = event.clientY - rect.top;
});

canvas.addEventListener("mousedown", event => {
    if (event.button === 0) {
        mouse.down = true;
        rangedAttack();
    }
});

window.addEventListener("mouseup", event => {
    if (event.button === 0) {
        mouse.down = false;
    }
});


/* =========================================================
   TOUCH
========================================================= */

let touchDirection = {
    x: 0,
    y: 0
};

document.querySelectorAll("[data-direction]").forEach(button => {

    const direction = button.dataset.direction;

    function startDirection(event) {
        event.preventDefault();

        if (direction === "up") {
            touchDirection.y = -1;
        }

        if (direction === "down") {
            touchDirection.y = 1;
        }

        if (direction === "left") {
            touchDirection.x = -1;
        }

        if (direction === "right") {
            touchDirection.x = 1;
        }
    }

    function stopDirection(event) {
        event.preventDefault();

        if (direction === "up" || direction === "down") {
            touchDirection.y = 0;
        }

        if (direction === "left" || direction === "right") {
            touchDirection.x = 0;
        }
    }

    button.addEventListener("touchstart", startDirection, {
        passive: false
    });

    button.addEventListener("touchend", stopDirection, {
        passive: false
    });

    button.addEventListener("mousedown", startDirection);
    button.addEventListener("mouseup", stopDirection);
});


/* =========================================================
   MENU BUTTONS
========================================================= */

$("startGameBtn").addEventListener("click", startGame);

$("shopBtn").addEventListener("click", () => {
    updateShop("weapons");
    showModal("shopModal");
});

$("weaponsBtn").addEventListener("click", () => {
    renderWeapons();
    showModal("weaponsModal");
});

$("skinsBtn").addEventListener("click", () => {
    renderSkins();
    showModal("skinsModal");
});

$("zonesBtn").addEventListener("click", () => {
    renderZones();
    showModal("zonesModal");
});

$("settingsBtn").addEventListener("click", () => {
    updateSettingsUI();
    showModal("settingsModal");
});


/* =========================================================
   GAME BUTTONS
========================================================= */

$("pauseBtn").addEventListener("click", togglePause);

$("restartBtn").addEventListener("click", () => {
    startGame();
});

$("menuBtn").addEventListener("click", () => {
    gameRunning = false;
    paused = false;
    hideModal("pauseModal");
    showScreen("mainMenu");
    updateMenu();
});

$("continueBtn").addEventListener("click", togglePause);

$("pauseRestartBtn").addEventListener("click", () => {
    hideModal("pauseModal");
    startGame();
});

$("pauseMenuBtn").addEventListener("click", () => {
    hideModal("pauseModal");
    gameRunning = false;
    showScreen("mainMenu");
    updateMenu();
});

$("gameOverRestart").addEventListener("click", () => {
    hideModal("gameOverModal");
    startGame();
});

$("gameOverMenu").addEventListener("click", () => {
    hideModal("gameOverModal");
    showScreen("mainMenu");
    updateMenu();
});

$("victoryRestart").addEventListener("click", () => {
    hideModal("victoryModal");
    startGame();
});

$("victoryMenu").addEventListener("click", () => {
    hideModal("victoryModal");
    showScreen("mainMenu");
    updateMenu();
});


/* =========================================================
   ATTACK BUTTONS
========================================================= */

$("attackBtn").addEventListener("click", meleeAttack);
$("fireballBtn").addEventListener("click", useFireball);
$("potionBtn").addEventListener("click", usePotion);

$("mobileAttack").addEventListener("click", meleeAttack);
$("mobileFireball").addEventListener("click", useFireball);
$("mobilePotion").addEventListener("click", usePotion);


/* =========================================================
   CLOSE BUTTONS
========================================================= */

document.querySelectorAll("[data-close]").forEach(button => {

    button.addEventListener("click", () => {
        hideModal(button.dataset.close);
    });

});


/* =========================================================
   SHOP TABS
========================================================= */

document.querySelectorAll(".shop-tab").forEach(tab => {

    tab.addEventListener("click", () => {

        document.querySelectorAll(".shop-tab").forEach(t => {
            t.classList.remove("active");
        });

        tab.classList.add("active");

        updateShop(tab.dataset.shopTab);
    });

});


/* =========================================================
   SETTINGS
========================================================= */

$("soundToggle").addEventListener("change", event => {
    saveData.sound = event.target.checked;
    saveGame();
});

$("musicToggle").addEventListener("change", event => {
    saveData.music = event.target.checked;
    saveGame();
});

$("mobileToggle").addEventListener("change", event => {
    saveData.mobile = event.target.checked;
    saveGame();

    $("mobileControls").style.display =
        event.target.checked && window.innerWidth <= 900
            ? "flex"
            : "";
});

$("resetSaveBtn").addEventListener("click", () => {

    const confirmed = confirm(
        "Barcha saqlangan ma'lumotlar o'chirilsinmi?"
    );

    if (!confirmed) return;

    localStorage.removeItem(SAVE_KEY);

    saveData = structuredClone(defaultSave);

    updateMenu();
    updateSettingsUI();

    notify("Saqlangan ma'lumotlar o'chirildi.", "🗑️");
});


/* =========================================================
   START GAME
========================================================= */

function startGame() {

    hideModal("gameOverModal");
    hideModal("victoryModal");
    hideModal("pauseModal");

    showScreen("gameScreen");

    gameRunning = true;
    paused = false;

    gameTime = 0;

    player.x = world.width / 2;
    player.y = world.height / 2;

    player.hp = player.maxHp;

    monsters = [];
    particles = [];
    projectiles = [];
    floatingTexts = [];

    currentTarget = null;

    bossActive = false;
    currentBoss = null;

    spawnTimer = 0;

    createObstacles();
    createInitialMonsters();

    updateHUD();

    lastFrame = performance.now();

    requestAnimationFrame(gameLoop);
}


/* =========================================================
   CREATE OBSTACLES
========================================================= */

function createObstacles() {

    obstacles = [];

    for (let i = 0; i < 90; i++) {

        const type = Math.random() < 0.58
            ? "tree"
            : "rock";

        const radius = type === "tree"
            ? 28 + Math.random() * 18
            : 20 + Math.random() * 15;

        const x = 80 + Math.random() * (world.width - 160);
        const y = 120 + Math.random() * (world.height - 200);

        if (distance(x, y, player.x, player.y) < 180) {
            continue;
        }

        obstacles.push({
            x,
            y,
            radius,
            type
        });
    }
}


/* =========================================================
   INITIAL MONSTERS
========================================================= */

function createInitialMonsters() {

    for (let i = 0; i < 8; i++) {
        spawnMonster();
    }
}


/* =========================================================
   MONSTER SPAWN
========================================================= */

function spawnMonster() {

    if (!gameRunning || bossActive) return;

    if (monsters.length >= 18) return;

    const zone = getCurrentZone();

    let x;
    let y;

    let attempts = 0;

    do {

        x = 80 + Math.random() * (world.width - 160);
        y = 120 + Math.random() * (world.height - 200);

        attempts++;

    } while (
        distance(x, y, player.x, player.y) < 500 &&
        attempts < 30
    );

    const names = zone.monsters;

    const name = names[
        Math.floor(Math.random() * names.length)
    ];

    const scale = 1 + saveData.level * 0.035;

    const hp = Math.floor(
        (70 + Math.random() * 55) * scale
    );

    monsters.push({
        id: Date.now() + Math.random(),

        x,
        y,

        radius: 27 + Math.random() * 8,

        name,

        hp,
        maxHp: hp,

        damage: 5 + Math.floor(saveData.level * 0.4),

        speed: 45 + Math.random() * 25,

        attackTimer: Math.random() * 1000,

        color: randomMonsterColor(),

        hitFlash: 0
    });
}


/* =========================================================
   MONSTER COLORS
========================================================= */

function randomMonsterColor() {

    const colors = [
        "#b83b5e",
        "#7d4ec2",
        "#3c8d63",
        "#a85d32",
        "#526ca8"
    ];

    return colors[
        Math.floor(Math.random() * colors.length)
    ];
}


/* =========================================================
   GAME LOOP
========================================================= */

function gameLoop(timestamp) {

    if (!gameRunning) return;

    const delta = Math.min(
        50,
        timestamp - lastFrame
    );

    lastFrame = timestamp;

    if (!paused) {

        update(delta);

        draw();
    }

    requestAnimationFrame(gameLoop);
}


/* =========================================================
   UPDATE
========================================================= */

function update(delta) {

    const dt = delta / 1000;

    gameTime += delta;

    attackCooldown -= delta;
    fireballCooldown -= delta;
    potionCooldown -= delta;

    updatePlayer(dt);

    updateMonsters(dt);

    updateProjectiles(dt);

    updateParticles(dt);

    updateFloatingTexts(dt);

    updateSpawning(delta);

    updateCamera();

    if (mouse.down) {
        rangedAttack();
    }

    updateHUD();

    if (player.hp <= 0) {
        gameOver();
    }
}


/* =========================================================
   PLAYER MOVEMENT
========================================================= */

function updatePlayer(dt) {

    let dx = 0;
    let dy = 0;

    if (keys["w"] || keys["arrowup"]) {
        dy -= 1;
    }

    if (keys["s"] || keys["arrowdown"]) {
        dy += 1;
    }

    if (keys["a"] || keys["arrowleft"]) {
        dx -= 1;
    }

    if (keys["d"] || keys["arrowright"]) {
        dx += 1;
    }

    dx += touchDirection.x;
    dy += touchDirection.y;

    const length = Math.hypot(dx, dy);

    if (length > 0) {

        dx /= length;
        dy /= length;

        player.facingX = dx;
        player.facingY = dy;

        const nextX = player.x + dx * player.speed * dt;
        const nextY = player.y + dy * player.speed * dt;

        if (!collidesWithObstacle(nextX, player.y, player.radius)) {
            player.x = nextX;
        }

        if (!collidesWithObstacle(player.x, nextY, player.radius)) {
            player.y = nextY;
        }
    }

    player.x = clamp(
        player.x,
        player.radius,
        world.width - player.radius
    );

    player.y = clamp(
        player.y,
        player.radius,
        world.height - player.radius
    );
}


/* =========================================================
   OBSTACLE COLLISION
========================================================= */

function collidesWithObstacle(x, y, radius) {

    return obstacles.some(obstacle => {

        return distance(
            x,
            y,
            obstacle.x,
            obstacle.y
        ) < radius + obstacle.radius * 0.7;

    });
}


/* =========================================================
   MONSTERS UPDATE
========================================================= */

function updateMonsters(dt) {

    for (const monster of monsters) {

        monster.hitFlash -= dt * 1000;
        monster.attackTimer -= dt * 1000;

        const dx = player.x - monster.x;
        const dy = player.y - monster.y;

        const dist = Math.hypot(dx, dy);

        if (dist > 65) {

            const nx = dx / dist;
            const ny = dy / dist;

            const nextX =
                monster.x +
                nx *
                monster.speed *
                dt;

            const nextY =
                monster.y +
                ny *
                monster.speed *
                dt;

            if (
                !collidesWithObstacle(
                    nextX,
                    monster.y,
                    monster.radius
                )
            ) {
                monster.x = nextX;
            }

            if (
                !collidesWithObstacle(
                    monster.x,
                    nextY,
                    monster.radius
                )
            ) {
                monster.y = nextY;
            }

        } else {

            if (monster.attackTimer <= 0) {

                player.hp -= monster.damage;

                player.hp = clamp(
                    player.hp,
                    0,
                    player.maxHp
                );

                monster.attackTimer = 1100;

                createDamageEffect(
                    player.x,
                    player.y
                );

                addFloatingText(
                    player.x,
                    player.y - 35,
                    "-" + monster.damage,
                    "#ff5353"
                );
            }
        }
    }
}


/* =========================================================
   SPAWN
========================================================= */

function updateSpawning(delta) {

    spawnTimer += delta;

    const spawnDelay = Math.max(
        700,
        1900 - saveData.level * 35
    );

    if (spawnTimer >= spawnDelay) {

        spawnTimer = 0;

        spawnMonster();
    }
}


/* =========================================================
   RANGED ATTACK
========================================================= */

function rangedAttack() {

    if (!gameRunning || paused) return;

    if (attackCooldown > 0) return;

    const weapon = getSelectedWeapon();

    const rect = canvas.getBoundingClientRect();

    const targetX =
        mouse.x + camera.x;

    const targetY =
        mouse.y + camera.y;

    let dx = targetX - player.x;
    let dy = targetY - player.y;

    const dist = Math.hypot(dx, dy);

    if (dist === 0) return;

    dx /= dist;
    dy /= dist;

    player.facingX = dx;
    player.facingY = dy;

    const level =
        saveData.weaponLevels[weapon.id] || 1;

    const damage =
        weapon.damage +
        (level - 1) * 8;

    const critical =
        Math.random() < 0.12;

    const finalDamage =
        critical
            ? Math.floor(damage * 2)
            : damage;

    projectiles.push({
        x: player.x + dx * 30,
        y: player.y + dy * 30,

        vx: dx * 700,
        vy: dy * 700,

        radius: weapon.id === "firestaff"
            ? 11
            : 6,

        damage: finalDamage,

        critical,

        color:
            weapon.id === "firestaff"
                ? "#ff671d"
                : "#f4f4f4",

        life: 1500
    });

    attackCooldown = weapon.speed;

    createMuzzleEffect(
        player.x + dx * 30,
        player.y + dy * 30,
        weapon.id === "firestaff"
    );
}


/* =========================================================
   MELEE ATTACK
========================================================= */

function meleeAttack() {

    if (!gameRunning || paused) return;

    const weapon = getSelectedWeapon();

    const level =
        saveData.weaponLevels[weapon.id] || 1;

    const damage =
        25 +
        level * 10;

    const attackRange = 100;

    let hitSomething = false;

    for (const monster of monsters) {

        const dist = distance(
            player.x,
            player.y,
            monster.x,
            monster.y
        );

        if (dist <= attackRange) {

            damageMonster(
                monster,
                damage,
                false
            );

            hitSomething = true;
        }
    }

    if (bossActive && currentBoss) {

        const dist = distance(
            player.x,
            player.y,
            currentBoss.x,
            currentBoss.y
        );

        if (dist <= 130) {

            damageBoss(
                damage,
                false
            );

            hitSomething = true;
        }
    }

    if (hitSomething) {

        createSlashEffect();

        addFloatingText(
            player.x,
            player.y - 50,
            "⚔️ HIT!",
            "#ffffff"
        );
    }
}


/* =========================================================
   FIREBALL
========================================================= */

function useFireball() {

    if (!gameRunning || paused) return;

    if (fireballCooldown > 0) {

        notify(
            "Fireball hali tayyor emas!",
            "🔥"
        );

        return;
    }

    if (saveData.coins < 5) {

        notify(
            "Fireball uchun 5 Coin kerak!",
            "💰"
        );

        return;
    }

    saveData.coins -= 5;

    saveGame();

    const targetX = mouse.x + camera.x;
    const targetY = mouse.y + camera.y;

    let dx = targetX - player.x;
    let dy = targetY - player.y;

    const dist = Math.hypot(dx, dy);

    if (dist === 0) return;

    dx /= dist;
    dy /= dist;

    projectiles.push({
        x: player.x + dx * 30,
        y: player.y + dy * 30,

        vx: dx * 480,
        vy: dy * 480,

        radius: 18,

        damage:
            75 +
            saveData.level * 12,

        critical: false,

        color: "#ff5b16",

        fireball: true,

        life: 1600
    });

    fireballCooldown = 2200;

    createFireballEffect(
        player.x,
        player.y
    );
}


/* =========================================================
   PROJECTILES
========================================================= */

function updateProjectiles(dt) {

    for (let i = projectiles.length - 1; i >= 0; i--) {

        const p = projectiles[i];

        p.x += p.vx * dt;
        p.y += p.vy * dt;

        p.life -= dt * 1000;

        let remove = false;

        if (
            p.x < 0 ||
            p.y < 0 ||
            p.x > world.width ||
            p.y > world.height ||
            p.life <= 0
        ) {
            remove = true;
        }

        if (!remove) {

            for (const monster of monsters) {

                if (
                    distance(
                        p.x,
                        p.y,
                        monster.x,
                        monster.y
                    ) <
                    p.radius + monster.radius
                ) {

                    damageMonster(
                        monster,
                        p.damage,
                        p.critical
                    );

                    if (p.fireball) {

                        createExplosion(
                            p.x,
                            p.y
                        );

                        fireballAreaDamage(
                            p.x,
                            p.y,
                            p.damage * 0.45
                        );
                    }

                    remove = true;
                    break;
                }
            }
        }

        if (
            !remove &&
            bossActive &&
            currentBoss
        ) {

            if (
                distance(
                    p.x,
                    p.y,
                    currentBoss.x,
                    currentBoss.y
                ) <
                p.radius + currentBoss.radius
            ) {

                damageBoss(
                    p.damage,
                    p.critical
                );

                if (p.fireball) {

                    createExplosion(
                        p.x,
                        p.y
                    );
                }

                remove = true;
            }
        }

        if (remove) {
            projectiles.splice(i, 1);
        }
    }
}


/* =========================================================
   FIREBALL AREA DAMAGE
========================================================= */

function fireballAreaDamage(
    x,
    y,
    damage
) {

    for (const monster of monsters) {

        const dist = distance(
            x,
            y,
            monster.x,
            monster.y
        );

        if (dist < 130) {

            damageMonster(
                monster,
                damage,
                false
            );
        }
    }
}


/* =========================================================
   DAMAGE MONSTER
========================================================= */

function damageMonster(
    monster,
    damage,
    critical
) {

    if (!monster) return;

    monster.hp -= damage;

    monster.hitFlash = 160;

    addFloatingText(
        monster.x,
        monster.y - 35,
        critical
            ? "CRITICAL " + damage
            : "-" + damage,
        critical
            ? "#ffd447"
            : "#ffffff"
    );

    createHitParticles(
        monster.x,
        monster.y,
        critical
    );

    if (monster.hp <= 0) {

        killMonster(monster);
    }
}


/* =========================================================
   KILL MONSTER
========================================================= */

function killMonster(monster) {

    const index = monsters.indexOf(monster);

    if (index !== -1) {
        monsters.splice(index, 1);
    }

    const reward =
        15 +
        Math.floor(Math.random() * 25);

    const xp =
        20 +
        Math.floor(Math.random() * 25);

    saveData.coins += reward;

    addXP(xp);

    saveData.totalKills++;

    saveData.bestKills = Math.max(
        saveData.bestKills,
        saveData.totalKills
    );

    saveGame();

    createExplosion(
        monster.x,
        monster.y
    );

    addFloatingText(
        monster.x,
        monster.y - 45,
        "+" + reward + " 💰",
        "#ffd447"
    );

    checkBossSpawn();
}


/* =========================================================
   BOSS SPAWN SYSTEM
========================================================= */

function checkBossSpawn() {

    const killsForBoss =
        (saveData.completedBosses + 1) * 100;

    if (
        saveData.totalKills >= killsForBoss &&
        saveData.completedBosses < 3 &&
        !bossActive
    ) {

        spawnBoss(
            saveData.completedBosses
        );
    }
}


/* =========================================================
   SPAWN BOSS
========================================================= */

function spawnBoss(index) {

    if (bossActive) return;

    const data = bosses[index];

    if (!data) return;

    bossActive = true;

    currentBoss = {
        ...data,

        x: player.x + 450,
        y: player.y,

        radius: 70,

        maxHp: data.hp,

        attackTimer: 1000,

        hitFlash: 0
    };

    currentBoss.x = clamp(
        currentBoss.x,
        100,
        world.width - 100
    );

    currentBoss.y = clamp(
        currentBoss.y,
        150,
        world.height - 150
    );

    $("bossNumber").textContent =
        index + 1;

    $("bossIntroNumber").textContent =
        index + 1;

    $("bossIntroName").textContent =
        data.name;

    $("bossCounter").classList.remove(
        "hidden"
    );

    $("bossIntro").classList.add("show");

    setTimeout(() => {
        $("bossIntro").classList.remove("show");
    }, 2800);

    notify(
        "BOSS PAYDO BO'LDI!",
        "👹"
    );
}


/* =========================================================
   BOSS UPDATE
========================================================= */

function updateBoss(dt) {

    if (!bossActive || !currentBoss) {
        return;
    }

    const boss = currentBoss;

    boss.attackTimer -= dt * 1000;

    boss.hitFlash -= dt * 1000;

    const dx = player.x - boss.x;
    const dy = player.y - boss.y;

    const dist = Math.hypot(dx, dy);

    if (dist > 150) {

        const nx = dx / dist;
        const ny = dy / dist;

        boss.x += nx * 45 * dt;
        boss.y += ny * 45 * dt;

    } else {

        if (boss.attackTimer <= 0) {

            player.hp -= boss.damage;

            player.hp = clamp(
                player.hp,
                0,
                player.maxHp
            );

            boss.attackTimer = 900;

            createDamageEffect(
                player.x,
                player.y
            );

            addFloatingText(
                player.x,
                player.y - 50,
                "-" + boss.damage,
                "#ff3030"
            );
        }
    }
}


/* =========================================================
   BOSS DAMAGE
========================================================= */

function damageBoss(
    damage,
    critical
) {

    if (!bossActive || !currentBoss) {
        return;
    }

    currentBoss.hp -= damage;

    currentBoss.hitFlash = 180;

    addFloatingText(
        currentBoss.x,
        currentBoss.y - 85,
        critical
            ? "CRITICAL " + damage
            : "-" + damage,
        critical
            ? "#ffd447"
            : "#ffffff"
    );

    createHitParticles(
        currentBoss.x,
        currentBoss.y,
        critical
    );

    if (currentBoss.hp <= 0) {

        defeatBoss();
    }
}


/* =========================================================
   DEFEAT BOSS
========================================================= */

function defeatBoss() {

    const boss = currentBoss;

    saveData.coins += boss.reward;

    addXP(boss.xp);

    saveData.completedBosses++;

    bossActive = false;
    currentBoss = null;

    $("bossCounter").classList.add(
        "hidden"
    );

    createBigExplosion(
        boss.x,
        boss.y
    );

    notify(
        "BOSS MAG'LUB ETILDI! +" +
        boss.reward +
        " Coin",
        "🏆"
    );

    saveGame();

    if (saveData.completedBosses >= 3) {

        setTimeout(
            victory,
            1000
        );
    }
}


/* =========================================================
   XP / LEVEL
========================================================= */

function getXPNeeded() {

    return 100 +
        (saveData.level - 1) * 70;
}

function addXP(amount) {

    saveData.xp += amount;

    while (
        saveData.xp >= getXPNeeded()
    ) {

        saveData.xp -= getXPNeeded();

        saveData.level++;

        player.maxHp += 10;
        player.hp = player.maxHp;

        showLevelUp();
    }

    saveGame();
}


/* =========================================================
   POTION
========================================================= */

function usePotion() {

    if (!gameRunning || paused) return;

    if (potionCooldown > 0) return;

    if (saveData.potions <= 0) {

        notify(
            "Potion qolmagan!",
            "🧪"
        );

        return;
    }

    if (player.hp >= player.maxHp) {

        notify(
            "HP allaqachon to'liq!",
            "❤️"
        );

        return;
    }

    saveData.potions--;

    player.hp = Math.min(
        player.maxHp,
        player.hp + 45
    );

    potionCooldown = 1000;

    createHealEffect();

    saveGame();
}


/* =========================================================
   CAMERA
========================================================= */

function updateCamera() {

    camera.x =
        player.x - W / 2;

    camera.y =
        player.y - H / 2;

    camera.x = clamp(
        camera.x,
        0,
        world.width - W
    );

    camera.y = clamp(
        camera.y,
        0,
        world.height - H
    );
}


/* =========================================================
   DRAW
========================================================= */

function draw() {

    const zone = getCurrentZone();

    const gradient =
        ctx.createLinearGradient(
            0,
            0,
            0,
            H
        );

    gradient.addColorStop(
        0,
        zone.colors[0]
    );

    gradient.addColorStop(
        1,
        zone.colors[1]
    );

    ctx.fillStyle = gradient;

    ctx.fillRect(
        0,
        0,
        W,
        H
    );

    ctx.save();

    ctx.translate(
        -camera.x,
        -camera.y
    );

    drawWorldGrid();

    drawObstacles();

    drawPickups();

    for (const monster of monsters) {
        drawMonster(monster);
    }

    if (bossActive && currentBoss) {
        drawBoss(currentBoss);
    }

    drawProjectiles();

    drawPlayer();

    ctx.restore();

    drawParticles();

    drawFloatingTexts();
}


/* =========================================================
   WORLD GRID
========================================================= */

function drawWorldGrid() {

    ctx.strokeStyle =
        "rgba(255,255,255,0.035)";

    ctx.lineWidth = 1;

    const grid = 100;

    const startX =
        Math.floor(camera.x / grid) * grid;

    const startY =
        Math.floor(camera.y / grid) * grid;

    for (
        let x = startX;
        x < camera.x + W + grid;
        x += grid
    ) {

        ctx.beginPath();

        ctx.moveTo(x, camera.y);
        ctx.lineTo(x, camera.y + H);

        ctx.stroke();
    }

    for (
        let y = startY;
        y < camera.y + H + grid;
        y += grid
    ) {

        ctx.beginPath();

        ctx.moveTo(camera.x, y);
        ctx.lineTo(camera.x + W, y);

        ctx.stroke();
    }
}


/* =========================================================
   OBSTACLES DRAW
========================================================= */

function drawObstacles() {

    for (const obstacle of obstacles) {

        if (
            obstacle.x < camera.x - 100 ||
            obstacle.x > camera.x + W + 100 ||
            obstacle.y < camera.y - 100 ||
            obstacle.y > camera.y + H + 100
        ) {
            continue;
        }

        ctx.save();

        if (obstacle.type === "tree") {

            ctx.fillStyle = "#6b3f22";

            ctx.fillRect(
                obstacle.x - 7,
                obstacle.y,
                14,
                obstacle.radius
            );

            ctx.fillStyle = "#174d2a";

            ctx.beginPath();

            ctx.arc(
                obstacle.x,
                obstacle.y,
                obstacle.radius,
                0,
                Math.PI * 2
            );

            ctx.fill();

            ctx.fillStyle = "#236d38";

            ctx.beginPath();

            ctx.arc(
                obstacle.x - 10,
                obstacle.y - 12,
                obstacle.radius * 0.65,
                0,
                Math.PI * 2
            );

            ctx.fill();

        } else {

            ctx.fillStyle = "#68717b";

            ctx.beginPath();

            ctx.arc(
                obstacle.x,
                obstacle.y,
                obstacle.radius,
                0,
                Math.PI * 2
            );

            ctx.fill();

            ctx.fillStyle = "#8d969d";

            ctx.beginPath();

            ctx.arc(
                obstacle.x - 6,
                obstacle.y - 7,
                obstacle.radius * 0.35,
                0,
                Math.PI * 2
            );

            ctx.fill();
        }

        ctx.restore();
    }
}


/* =========================================================
   PLAYER DRAW
========================================================= */

function drawPlayer() {

    const skin =
        skins.find(
            s => s.id === saveData.selectedSkin
        ) || skins[0];

    ctx.save();

    ctx.shadowColor =
        "rgba(0,0,0,0.55)";

    ctx.shadowBlur = 20;

    ctx.font = "42px Arial";

    ctx.textAlign = "center";
    ctx.textBaseline = "middle";

    ctx.fillText(
        skin.icon,
        player.x,
        player.y
    );

    ctx.shadowBlur = 0;

    ctx.restore();
}


/* =========================================================
   MONSTER DRAW
========================================================= */

function drawMonster(monster) {

    ctx.save();

    if (monster.hitFlash > 0) {
        ctx.globalAlpha = 0.6;
    }

    ctx.fillStyle = monster.color;

    ctx.beginPath();

    ctx.arc(
        monster.x,
        monster.y,
        monster.radius,
        0,
        Math.PI * 2
    );

    ctx.fill();

    ctx.font = "30px Arial";

    ctx.textAlign = "center";
    ctx.textBaseline = "middle";

    ctx.fillText(
        "👾",
        monster.x,
        monster.y
    );

    ctx.restore();

    drawMonsterHealth(
        monster.x,
        monster.y - monster.radius - 15,
        monster.hp,
        monster.maxHp
    );
}


/* =========================================================
   BOSS DRAW
========================================================= */

function drawBoss(boss) {

    ctx.save();

    ctx.shadowColor =
        "rgba(255,0,0,0.7)";

    ctx.shadowBlur = 30;

    if (boss.hitFlash > 0) {
        ctx.globalAlpha = 0.55;
    }

    ctx.fillStyle = "#5d1021";

    ctx.beginPath();

    ctx.arc(
        boss.x,
        boss.y,
        boss.radius,
        0,
        Math.PI * 2
    );

    ctx.fill();

    ctx.shadowBlur = 0;

    ctx.font = "76px Arial";

    ctx.textAlign = "center";
    ctx.textBaseline = "middle";

    ctx.fillText(
        boss.icon,
        boss.x,
        boss.y
    );

    ctx.restore();

    drawMonsterHealth(
        boss.x,
        boss.y - boss.radius - 22,
        boss.hp,
        boss.maxHp,
        true
    );
}


/* =========================================================
   HEALTH BAR
========================================================= */

function drawMonsterHealth(
    x,
    y,
    hp,
    maxHp,
    boss = false
) {

    const width =
        boss ? 180 : 70;

    const height =
        boss ? 11 : 7;

    ctx.fillStyle =
        "rgba(0,0,0,0.7)";

    ctx.fillRect(
        x - width / 2,
        y,
        width,
        height
    );

    ctx.fillStyle =
        boss
            ? "#ff2e43"
            : "#ff5d5d";

    ctx.fillRect(
        x - width / 2,
        y,
        width * clamp(hp / maxHp, 0, 1),
        height
    );
}


/* =========================================================
   PROJECTILES DRAW
========================================================= */

function drawProjectiles() {

    for (const p of projectiles) {

        ctx.save();

        ctx.shadowColor = p.color;
        ctx.shadowBlur = p.fireball ? 25 : 10;

        ctx.fillStyle = p.color;

        ctx.beginPath();

        ctx.arc(
            p.x,
            p.y,
            p.radius,
            0,
            Math.PI * 2
        );

        ctx.fill();

        if (p.fireball) {

            ctx.fillStyle = "#ffd447";

            ctx.beginPath();

            ctx.arc(
                p.x,
                p.y,
                p.radius * 0.45,
                0,
                Math.PI * 2
            );

            ctx.fill();
        }

        ctx.restore();
    }
}


/* =========================================================
   PARTICLES
========================================================= */

function createHitParticles(
    x,
    y,
    critical
) {

    const count =
        critical ? 16 : 8;

    for (let i = 0; i < count; i++) {

        particles.push({
            x,
            y,

            vx:
                (Math.random() - 0.5) *
                180,

            vy:
                (Math.random() - 0.5) *
                180,

            size:
                3 +
                Math.random() * 5,

            life: 450,

            maxLife: 450,

            color:
                critical
                    ? "#ffd447"
                    : "#ffffff"
        });
    }
}


function createExplosion(x, y) {

    for (let i = 0; i < 30; i++) {

        const angle =
            Math.random() *
            Math.PI *
            2;

        const speed =
            80 +
            Math.random() *
            280;

        particles.push({
            x,
            y,

            vx:
                Math.cos(angle) *
                speed,

            vy:
                Math.sin(angle) *
                speed,

            size:
                4 +
                Math.random() *
                7,

            life: 700,

            maxLife: 700,

            color:
                Math.random() < 0.5
                    ? "#ff6b00"
                    : "#ffd447"
        });
    }
}


function createBigExplosion(x, y) {

    for (let i = 0; i < 100; i++) {

        const angle =
            Math.random() *
            Math.PI *
            2;

        const speed =
            100 +
            Math.random() *
            500;

        particles.push({
            x,
            y,

            vx:
                Math.cos(angle) *
                speed,

            vy:
                Math.sin(angle) *
                speed,

            size:
                4 +
                Math.random() *
                10,

            life: 1200,

            maxLife: 1200,

            color:
                i % 2 === 0
                    ? "#ff3131"
                    : "#ffd447"
        });
    }
}


function createMuzzleEffect(x, y, fire) {

    for (let i = 0; i < 6; i++) {

        particles.push({
            x,
            y,

            vx:
                (Math.random() - 0.5) *
                100,

            vy:
                (Math.random() - 0.5) *
                100,

            size:
                3 +
                Math.random() * 3,

            life: 250,

            maxLife: 250,

            color:
                fire
                    ? "#ff711c"
                    : "#ffffff"
        });
    }
}


function createFireballEffect(x, y) {

    for (let i = 0; i < 20; i++) {

        particles.push({
            x,
            y,

            vx:
                (Math.random() - 0.5) *
                220,

            vy:
                (Math.random() - 0.5) *
                220,

            size:
                4 +
                Math.random() * 6,

            life: 500,

            maxLife: 500,

            color:
                i % 2
                    ? "#ff6b00"
                    : "#ffd447"
        });
    }
}


function createDamageEffect(x, y) {

    for (let i = 0; i < 10; i++) {

        particles.push({
            x,
            y,

            vx:
                (Math.random() - 0.5) *
                100,

            vy:
                (Math.random() - 0.5) *
                100,

            size:
                3 +
                Math.random() * 3,

            life: 300,

            maxLife: 300,

            color: "#ff3030"
        });
    }
}


function createHealEffect() {

    for (let i = 0; i < 20; i++) {

        particles.push({
            x: player.x,
            y: player.y,

            vx:
                (Math.random() - 0.5) *
                100,

            vy:
                -40 -
                Math.random() * 100,

            size:
                3 +
                Math.random() * 4,

            life: 700,

            maxLife: 700,

            color: "#31e981"
        });
    }
}


function createSlashEffect() {

    for (let i = 0; i < 12; i++) {

        particles.push({
            x:
                player.x +
                player.facingX *
                50,

            y:
                player.y +
                player.facingY *
                50,

            vx:
                (Math.random() - 0.5) *
                200,

            vy:
                (Math.random() - 0.5) *
                200,

            size:
                2 +
                Math.random() * 4,

            life: 300,

            maxLife: 300,

            color: "#ffffff"
        });
    }
}


/* =========================================================
   UPDATE PARTICLES
========================================================= */

function updateParticles(dt) {

    for (let i = particles.length - 1; i >= 0; i--) {

        const p = particles[i];

        p.x += p.vx * dt;
        p.y += p.vy * dt;

        p.vx *= 0.97;
        p.vy *= 0.97;

        p.life -= dt * 1000;

        if (p.life <= 0) {
            particles.splice(i, 1);
        }
    }
}


/* =========================================================
   DRAW PARTICLES
========================================================= */

function drawParticles() {

    for (const p of particles) {

        const alpha =
            clamp(
                p.life / p.maxLife,
                0,
                1
            );

        ctx.save();

        ctx.globalAlpha = alpha;

        ctx.fillStyle = p.color;

        ctx.beginPath();

        ctx.arc(
            p.x - camera.x,
            p.y - camera.y,
            p.size,
            0,
            Math.PI * 2
        );

        ctx.fill();

        ctx.restore();
    }
}


/* =========================================================
   FLOATING TEXT
========================================================= */

function addFloatingText(
    x,
    y,
    text,
    color
) {

    floatingTexts.push({
        x,
        y,

        text,
        color,

        life: 900,

        maxLife: 900
    });
}


function updateFloatingTexts(dt) {

    for (
        let i = floatingTexts.length - 1;
        i >= 0;
        i--
    ) {

        const text =
            floatingTexts[i];

        text.y -= 35 * dt;

        text.life -= dt * 1000;

        if (text.life <= 0) {
            floatingTexts.splice(i, 1);
        }
    }
}


function drawFloatingTexts() {

    for (const text of floatingTexts) {

        ctx.save();

        ctx.globalAlpha =
            clamp(
                text.life /
                text.maxLife,
                0,
                1
            );

        ctx.font = "bold 16px Arial";

        ctx.textAlign = "center";

        ctx.fillStyle = text.color;

        ctx.fillText(
            text.text,
            text.x - camera.x,
            text.y - camera.y
        );

        ctx.restore();
    }
}


/* =========================================================
   PICKUPS
========================================================= */

function drawPickups() {
    /* Kelajakdagi bonuslar uchun joy */
}


/* =========================================================
   HUD
========================================================= */

function updateHUD() {

    const hpPercent =
        player.hp /
        player.maxHp *
        100;

    $("playerHpBar").style.width =
        clamp(hpPercent, 0, 100) + "%";

    $("playerHpText").textContent =
        Math.ceil(player.hp) +
        " / " +
        player.maxHp;

    const xpNeeded =
        getXPNeeded();

    const xpPercent =
        saveData.xp /
        xpNeeded *
        100;

    $("xpBar").style.width =
        clamp(xpPercent, 0, 100) + "%";

    $("xpText").textContent =
        saveData.xp +
        " / " +
        xpNeeded;

    $("levelText").textContent =
        saveData.level;

    $("coinText").textContent =
        saveData.coins;

    $("killText").textContent =
        saveData.totalKills % 100;

    $("timerText").textContent =
        formatTime(gameTime);

    const weapon =
        getSelectedWeapon();

    $("weaponIcon").textContent =
        weapon.icon;

    $("weaponName").textContent =
        weapon.name;

    $("weaponLevel").textContent =
        saveData.weaponLevels[
            weapon.id
        ] || 1;

    $("potionCount").textContent =
        saveData.potions;

    const zone =
        getCurrentZone();

    $("zoneName").textContent =
        zone.name;

    if (bossActive && currentBoss) {

        $("monsterHud").classList.remove(
            "hidden"
        );

        $("monsterName").textContent =
            currentBoss.name;

        $("monsterHpBar").style.width =
            clamp(
                currentBoss.hp /
                currentBoss.maxHp *
                100,
                0,
                100
            ) + "%";

        $("monsterHpText").textContent =
            Math.ceil(currentBoss.hp) +
            " / " +
            currentBoss.maxHp;

    } else {

        $("monsterHud").classList.add(
            "hidden"
        );
    }
}


/* =========================================================
   MENU
========================================================= */

function updateMenu() {

    $("menuCoins").textContent =
        saveData.coins;

    $("menuLevel").textContent =
        saveData.level;

    $("menuKills").textContent =
        saveData.totalKills;
}


/* =========================================================
   PAUSE
========================================================= */

function togglePause() {

    if (!gameRunning) return;

    paused = !paused;

    if (paused) {
        showModal("pauseModal");
    } else {
        hideModal("pauseModal");
    }
}


/* =========================================================
   GAME OVER
========================================================= */

function gameOver() {

    if (!gameRunning) return;

    gameRunning = false;

    saveGame();

    $("gameOverKills").textContent =
        saveData.totalKills;

    $("gameOverCoins").textContent =
        saveData.coins;

    $("gameOverLevel").textContent =
        saveData.level;

    $("gameOverTime").textContent =
        formatTime(gameTime);

    showModal("gameOverModal");
}


/* =========================================================
   VICTORY
========================================================= */

function victory() {

    gameRunning = false;

    $("victoryKills").textContent =
        saveData.totalKills;

    $("victoryCoins").textContent =
        saveData.coins;

    $("victoryLevel").textContent =
        saveData.level;

    $("victoryTime").textContent =
        formatTime(gameTime);

    saveGame();

    showModal("victoryModal");
}


/* =========================================================
   LEVEL UP EFFECT
========================================================= */

function showLevelUp() {

    $("newLevelText").textContent =
        "LEVEL " +
        saveData.level;

    $("levelUpEffect").classList.remove(
        "show"
    );

    void $("levelUpEffect").offsetWidth;

    $("levelUpEffect").classList.add(
        "show"
    );
}


/* =========================================================
   WEAPON HELPERS
========================================================= */

function getSelectedWeapon() {

    const weapon =
        weapons.find(
            w =>
                w.id ===
                window.selectedWeapon
        );

    return weapon || weapons[0];
}

window.selectedWeapon = "bow";


/* =========================================================
   WEAPON SHOP
========================================================= */

function buyWeapon(id) {

    const weapon =
        weapons.find(
            w => w.id === id
        );

    if (!weapon) return;

    if (
        saveData.ownedWeapons.includes(id)
    ) {

        window.selectedWeapon = id;

        notify(
            weapon.name +
            " tanlandi!",
            weapon.icon
        );

        renderWeapons();

        updateHUD();

        return;
    }

    if (saveData.coins < weapon.price) {

        notify(
            "Coin yetarli emas!",
            "💰"
        );

        return;
    }

    saveData.coins -= weapon.price;

    saveData.ownedWeapons.push(id);

    window.selectedWeapon = id;

    saveGame();

    notify(
        weapon.name +
        " sotib olindi!",
        "🛒"
    );

    renderWeapons();

    updateMenu();
}


/* =========================================================
   WEAPON UPGRADE
========================================================= */

function upgradeWeapon(id) {

    const weapon =
        weapons.find(
            w => w.id === id
        );

    if (!weapon) return;

    if (
        !saveData.ownedWeapons.includes(id)
    ) {

        notify(
            "Avval qurolni sotib oling!",
            "🔒"
        );

        return;
    }

    const level =
        saveData.weaponLevels[id] || 1;

    if (level >= 12) {

        notify(
            "Bu qurol MAX LEVEL!",
            "⭐"
        );

        return;
    }

    const price =
        150 * level;

    if (saveData.coins < price) {

        notify(
            "Upgrade uchun Coin yetarli emas!",
            "💰"
        );

        return;
    }

    saveData.coins -= price;

    saveData.weaponLevels[id] =
        level + 1;

    saveGame();

    notify(
        weapon.name +
        " → LEVEL " +
        (level + 1),
        "⬆️"
    );

    renderWeapons();

    updateMenu();
}


/* =========================================================
   RENDER WEAPONS
========================================================= */

function renderWeapons() {

    const container =
        $("weaponsContent");

    container.innerHTML = "";

    weapons.forEach(weapon => {

        const owned =
            saveData.ownedWeapons.includes(
                weapon.id
            );

        const level =
            saveData.weaponLevels[
                weapon.id
            ] || 1;

        const selected =
            window.selectedWeapon ===
            weapon.id;

        const card =
            document.createElement("div");

        card.className =
            "item-card";

        card.innerHTML = `
            <div class="icon">${weapon.icon}</div>

            <h3>${weapon.name}</h3>

            <p>${weapon.description}</p>

            <p>
                ⚔️ Damage:
                ${weapon.damage + (level - 1) * 8}
            </p>

            <p>
                ⭐ Upgrade:
                ${level} / 12
            </p>

            ${
                owned
                    ? `
                        <button
                            class="card-btn ${
                                selected
                                    ? "equipped"
                                    : ""
                            }"
                            data-select="${weapon.id}">
                            ${
                                selected
                                    ? "✓ TANLANGAN"
                                    : "⚔️ TANLASH"
                            }
                        </button>

                        <button
                            class="card-btn"
                            data-upgrade="${weapon.id}">
                            ⬆️ UPGRADE
                            ${
                                level < 12
                                    ? " — " +
                                      (150 * level) +
                                      " 💰"
                                    : ""
                            }
                        </button>
                    `
                    : `
                        <div class="card-price">
                            💰 ${weapon.price}
                        </div>

                        <button
                            class="card-btn buy"
                            data-buy="${weapon.id}">
                            🛒 SOTIB OLISH
                        </button>
                    `
            }
        `;

        container.appendChild(card);
    });

    container
        .querySelectorAll("[data-buy]")
        .forEach(button => {

            button.addEventListener(
                "click",
                () =>
                    buyWeapon(
                        button.dataset.buy
                    )
            );

        });

    container
        .querySelectorAll("[data-select]")
        .forEach(button => {

            button.addEventListener(
                "click",
                () => {

                    window.selectedWeapon =
                        button.dataset.select;

                    renderWeapons();
                    updateHUD();
                }
            );

        });

    container
        .querySelectorAll("[data-upgrade]")
        .forEach(button => {

            button.addEventListener(
                "click",
                () =>
                    upgradeWeapon(
                        button.dataset.upgrade
                    )
            );

        });
}


/* =========================================================
   SKINS
========================================================= */

function buyOrSelectSkin(id) {

    const skin =
        skins.find(
            s => s.id === id
        );

    if (!skin) return;

    if (
        saveData.ownedSkins.includes(id)
    ) {

        saveData.selectedSkin = id;

        saveGame();

        renderSkins();

        notify(
            skin.name +
            " tanlandi!",
            skin.icon
        );

        return;
    }

    if (saveData.coins < skin.price) {

        notify(
            "Coin yetarli emas!",
            "💰"
        );

        return;
    }

    saveData.coins -= skin.price;

    saveData.ownedSkins.push(id);

    saveData.selectedSkin = id;

    saveGame();

    renderSkins();

    updateMenu();

    notify(
        skin.name +
        " ochildi!",
        skin.icon
    );
}


/* =========================================================
   RENDER SKINS
========================================================= */

function renderSkins() {

    const container =
        $("skinsContent");

    container.innerHTML = "";

    skins.forEach(skin => {

        const owned =
            saveData.ownedSkins.includes(
                skin.id
            );

        const selected =
            saveData.selectedSkin ===
            skin.id;

        const card =
            document.createElement("div");

        card.className =
            "item-card";

        card.innerHTML = `
            <div class="icon">${skin.icon}</div>

            <h3>${skin.name}</h3>

            ${
                owned
                    ? `
                        <button
                            class="card-btn ${
                                selected
                                    ? "equipped"
                                    : ""
                            }"
                            data-skin="${skin.id}">
                            ${
                                selected
                                    ? "✓ TANLANGAN"
                                    : "👕 TANLASH"
                            }
                        </button>
                    `
                    : `
                        <div class="card-price">
                            💰 ${skin.price}
                        </div>

                        <button
                            class="card-btn buy"
                            data-skin="${skin.id}">
                            🛒 SOTIB OLISH
                        </button>
                    `
            }
        `;

        container.appendChild(card);
    });

    container
        .querySelectorAll("[data-skin]")
        .forEach(button => {

            button.addEventListener(
                "click",
                () =>
                    buyOrSelectSkin(
                        button.dataset.skin
                    )
            );

        });
}


/* =========================================================
   ZONES
========================================================= */

function buyOrSelectZone(id) {

    const zone =
        zones.find(
            z => z.id === id
        );

    if (!zone) return;

    if (
        saveData.ownedZones.includes(id)
    ) {

        saveData.selectedZone = id;

        saveGame();

        renderZones();

        notify(
            zone.name +
            " tanlandi!",
            zone.icon
        );

        return;
    }

    if (saveData.coins < zone.price) {

        notify(
            "Bu zona uchun Coin yetarli emas!",
            "💰"
        );

        return;
    }

    saveData.coins -= zone.price;

    saveData.ownedZones.push(id);

    saveData.selectedZone = id;

    saveGame();

    renderZones();

    updateMenu();

    notify(
        zone.name +
        " ochildi!",
        zone.icon
    );
}


/* =========================================================
   RENDER ZONES
========================================================= */

function renderZones() {

    const container =
        $("zonesContent");

    container.innerHTML = "";

    zones.forEach(zone => {

        const owned =
            saveData.ownedZones.includes(
                zone.id
            );

        const selected =
            saveData.selectedZone ===
            zone.id;

        const card =
            document.createElement("div");

        card.className =
            "zone-card";

        card.innerHTML = `
            <div class="icon">${zone.icon}</div>

            <h3>${zone.name}</h3>

            <p>
                ${zone.monsters.join(", ")}
            </p>

            ${
                owned
                    ? `
                        <button
                            class="card-btn ${
                                selected
                                    ? "equipped"
                                    : ""
                            }"
                            data-zone="${zone.id}">
                            ${
                                selected
                                    ? "✓ TANLANGAN"
                                    : "🗺️ TANLASH"
                            }
                        </button>
                    `
                    : `
                        <div class="card-price">
                            💰 ${zone.price}
                        </div>

                        <button
                            class="card-btn buy"
                            data-zone="${zone.id}">
                            🔓 OCHISH
                        </button>
                    `
            }
        `;

        container.appendChild(card);
    });

    container
        .querySelectorAll("[data-zone]")
        .forEach(button => {

            button.addEventListener(
                "click",
                () =>
                    buyOrSelectZone(
                        button.dataset.zone
                    )
            );

        });
}


/* =========================================================
   SHOP
========================================================= */

function updateShop(type) {

    $("shopCoins").textContent =
        saveData.coins;

    const container =
        $("shopContent");

    container.innerHTML = "";

    if (type === "weapons") {

        weapons.forEach(weapon => {

            const owned =
                saveData.ownedWeapons.includes(
                    weapon.id
                );

            const level =
                saveData.weaponLevels[
                    weapon.id
                ] || 1;

            const card =
                document.createElement("div");

            card.className =
                "shop-card";

            card.innerHTML = `
                <div class="icon">${weapon.icon}</div>

                <h3>${weapon.name}</h3>

                <p>
                    Damage:
                    ${weapon.damage + (level - 1) * 8}
                </p>

                <p>
                    Upgrade:
                    ${level}/12
                </p>

                ${
                    owned
                        ? `
                            <button
                                class="card-btn"
                                data-shop-upgrade="${weapon.id}">
                                ⬆️ UPGRADE
                            </button>
                        `
                        : `
                            <div class="card-price">
                                💰 ${weapon.price}
                            </div>

                            <button
                                class="card-btn buy"
                                data-shop-buy="${weapon.id}">
                                🛒 SOTIB OLISH
                            </button>
                        `
                }
            `;

            container.appendChild(card);
        });

        container
            .querySelectorAll("[data-shop-buy]")
            .forEach(button => {

                button.addEventListener(
                    "click",
                    () => {

                        buyWeapon(
                            button.dataset.shopBuy
                        );

                        updateShop("weapons");
                    }
                );

            });

        container
            .querySelectorAll("[data-shop-upgrade]")
            .forEach(button => {

                button.addEventListener(
                    "click",
                    () => {

                        upgradeWeapon(
                            button.dataset.shopUpgrade
                        );

                        updateShop("weapons");
                    }
                );

            });

    }

    if (type === "skins") {

        skins.forEach(skin => {

            const owned =
                saveData.ownedSkins.includes(
                    skin.id
                );

            const card =
                document.createElement("div");

            card.className =
                "shop-card";

            card.innerHTML = `
                <div class="icon">${skin.icon}</div>

                <h3>${skin.name}</h3>

                ${
                    owned
                        ? `
                            <button
                                class="card-btn equipped">
                                ✓ OCHILGAN
                            </button>
                        `
                        : `
                            <div class="card-price">
                                💰 ${skin.price}
                            </div>

                            <button
                                class="card-btn buy"
                                data-shop-skin="${skin.id}">
                                👕 SOTIB OLISH
                            </button>
                        `
                }
            `;

            container.appendChild(card);
        });

        container
            .querySelectorAll("[data-shop-skin]")
            .forEach(button => {

                button.addEventListener(
                    "click",
                    () => {

                        buyOrSelectSkin(
                            button.dataset.shopSkin
                        );

                        updateShop("skins");
                    }
                );

            });
    }

    if (type === "items") {

        const card =
            document.createElement("div");

        card.className =
            "shop-card";

        card.innerHTML = `
            <div class="icon">🧪</div>

            <h3>Health Potion</h3>

            <p>
                +45 HP beradi.
            </p>

            <div class="card-price">
                💰 50
            </div>

            <button
                class="card-btn buy"
                id="buyPotionShop">
                🧪 SOTIB OLISH
            </button>
        `;

        container.appendChild(card);

        $("buyPotionShop").addEventListener(
            "click",
            buyPotion
        );
    }
}


/* =========================================================
   BUY POTION
========================================================= */

function buyPotion() {

    if (saveData.coins < 50) {

        notify(
            "50 Coin kerak!",
            "💰"
        );

        return;
    }

    saveData.coins -= 50;

    saveData.potions++;

    saveGame();

    notify(
        "Potion sotib olindi!",
        "🧪"
    );

    updateShop("items");
    updateMenu();
}


/* =========================================================
   SETTINGS UI
========================================================= */

function updateSettingsUI() {

    $("soundToggle").checked =
        saveData.sound;

    $("musicToggle").checked =
        saveData.music;

    $("mobileToggle").checked =
        saveData.mobile;
}


/* =========================================================
   NOTIFICATION
========================================================= */

let notificationTimer = null;

function notify(
    message,
    icon = "ℹ️"
) {

    $("notificationIcon").textContent =
        icon;

    $("notificationText").textContent =
        message;

    $("notification").classList.add(
        "show"
    );

    clearTimeout(notificationTimer);

    notificationTimer =
        setTimeout(() => {

            $("notification")
                .classList.remove(
                    "show"
                );

        }, 2200);
}


/* =========================================================
   UTILITIES
========================================================= */

function distance(
    x1,
    y1,
    x2,
    y2
) {

    return Math.hypot(
        x2 - x1,
        y2 - y1
    );
}


function formatTime(ms) {

    const totalSeconds =
        Math.floor(ms / 1000);

    const minutes =
        Math.floor(
            totalSeconds / 60
        );

    const seconds =
        totalSeconds % 60;

    return (
        String(minutes).padStart(2, "0") +
        ":" +
        String(seconds).padStart(2, "0")
    );
}


function getCurrentZone() {

    return (
        zones.find(
            z =>
                z.id ===
                saveData.selectedZone
        ) ||
        zones[0]
    );
}


/* =========================================================
   BOSS UPDATE PATCH
========================================================= */

const originalUpdate =
    update;

update = function(delta) {

    originalUpdate(delta);

    if (!paused && bossActive) {

        updateBoss(
            delta / 1000
        );
    }
};


/* =========================================================
   LOADING
========================================================= */

let loadingProgress = 0;

const loadingInterval =
    setInterval(() => {

        loadingProgress +=
            Math.random() * 14 + 5;

        loadingProgress =
            Math.min(
                loadingProgress,
                100
            );

        $("loadingProgress").style.width =
            loadingProgress + "%";

        if (loadingProgress >= 100) {

            clearInterval(
                loadingInterval
            );

            setTimeout(() => {

                showScreen("mainMenu");

                updateMenu();

            }, 350);
        }

    }, 120);


/* =========================================================
   MOBILE DISPLAY
========================================================= */

function updateMobileControls() {

    if (
        saveData.mobile &&
        window.innerWidth <= 900
    ) {

        $("mobileControls").style.display =
            "flex";

    } else {

        $("mobileControls").style.display =
            "none";
    }
}

window.addEventListener(
    "resize",
    updateMobileControls
);

setTimeout(
    updateMobileControls,
    500
);


/* =========================================================
   INITIALIZATION
========================================================= */

updateMenu();
updateSettingsUI();

console.log(
    "🔥 Monster Hunter ULUG'BEK.R loaded successfully!"
);

