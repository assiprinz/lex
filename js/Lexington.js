function Lexington () {
    this.runFunc = this.start.bind(this);
    this.resetFunc = this.reset.bind(this);
    Mousetrap.bind('f', this.runFunc);
    Mousetrap.bind('r', this.resetFunc);
    this.loadPool(this.poolLoaded.bind(this));
    this.inventory = [];
    this.running = false;
    this.runCount = 0;
    this.duration = 15;
    this.gearCount = 0;
    this.weaponCount = 0;
    this.namedCount = 0;
    this.setCount = 0;
    this.wmodCount = 0;
    this.gmodCount = 0;
    this.pmodCount = 0;
    this.PxC = 0;
}

Lexington.prototype.run = function () {
    if (this.halt) {
        this.running = false;
        this.halt = false;
        return;
    }
    this.running = true;
    this.runCount++;
    $('#console').append('<p class="note">++++++++++ Started Run ' + this.runCount + ' ++++++++++</p>');
    // console.time('run ' + this.runCount);
    $('#console').append('<p class="note">Pew pew!</p>');
    $('#console').append('<p class="note">Negative, Ramos! Find a secure position and hunker down!</p>');
    $('#console').append("<p class='note'>Well, ain't that some shit …</p>");
    $('#console').append('<p class="note">Pew pew! Bang!</p>');
    $('#console').append('<p class="drop">' + '[drop] 100 Phoenix Credits</p>');
    this.PxC += 100;
    $('#pxc').html('' + this.PxC);
    for (var i = 0; i < this.drops.length; i++) {
        var loot = this.evaluateDrop(this.drops[i]);
        if (loot) {
            if (loot.cat === 'gear') {
                this.gearCount++;
            } else if (loot.cat === 'setgear') {
                this.setCount++;
            } else if (loot.cat === 'weapon') {
                if (loot.type === 'Showstopper') {
                    this.namedCount++;
                }
                this.weaponCount++;
            } else if (loot.cat === 'weaponmod') {
                this.wmodCount++;
            } else if (loot.cat === 'gearmod') {
                this.gmodCount++;
            } else if (loot.cat === 'perfmod') {
                this.pmodCount++;
            } 
            if (loot.type === "Barrett's Vest") {
                // console.warn("[Barrett's Vest] on run " + this.runCount + ", totalling in " + ((this.duration * this.runCount) / 60).toFixed(2) + " h for avg run time of " + this.duration + " min");
                $('#console').append('<p class="barrett">' + "[Barrett's Vest] Dropped on run " + this.runCount + ", totalling in on " + ((this.duration * this.runCount) / 60).toFixed(2) + " hours for an average run time of " + this.duration + " minutes" + '</p>')
                var vest = this.makeVest();
                $('#console').append('<p class="barrett">' + "[Barrett's Vest] " + (vest.armor + vest.additionalArmor) + ' Combined Armor (' + vest.armor + ' native) | ' + vest.main[0] + ' Firearms | ' + vest.main[1] + ' Stamina | ' + vest.main[2] + ' Electronics</p>');
                for (var i = 0; i < vest.major.length; i++) {
                    var stat = vest.major[i];
                    $('#console').append('<p class="barrett">' + "[Barrett's Vest] Major Stat: " + stat.value + ' ' + stat.suffix + ' ' + stat.stat + '</p>');
                }
                for (var i = 0; i < vest.minor.length; i++) {
                    var stat = vest.minor[i];
                    $('#console').append('<p class="barrett">' + "[Barrett's Vest] Minor Stat: " + stat.value + ' ' + stat.suffix + ' ' + stat.stat + '</p>');
                }
                this.stop();
                return;
            } else if (loot.type === "Showstopper") {
                $('#console').append('<p class="named">' + '[named] ' + loot.type + '</p>');
            } else {
                $('#console').append('<p class="drop">' + '[drop] ' + loot.type + '</p>');
            }
        }
    }
    this.scrollDown();
        // console.timeEnd('run ' + this.runCount);
        requestAnimationFrame(this.run.bind(this));
    };

    Lexington.prototype.scrollDown = function () {
        var c = document.getElementById('console');
        c.scrollTop = c.scrollHeight;
    };

    Lexington.prototype.reset = function(suppress){
        if (!suppress) {
            $('#reset').addClass('active');
            setTimeout(function(){
                $('#reset').removeClass('active');
            }, 200);
        }
        $('#console').empty();
        this.runCount = 0;
        this.inventory = [];
        this.gearCount = 0;
        this.weaponCount = 0;
        this.namedCount = 0;
        this.setCount = 0;
        this.wmodCount = 0;
        this.gmodCount = 0;
        this.pmodCount = 0;
        this.PxC = 0;
        $('#pxc').html('' + this.PxC);
    };

    Lexington.prototype.start = function(){
        if (this.runCount > 0) {
            this.reset(true);
        }
        this.duration = parseFloat($('#dur').val());
        if (!this.duration > 0) {
            this.duration = 15;
            $('#dur').val(15);
        }
        $('#roll').addClass('active');
        setTimeout(function(){
            $('#roll').removeClass('active');
        }, 200);
        requestAnimationFrame(this.run.bind(this));
    };

    Lexington.prototype.stop = function (count) {
        var summary = 'also found ';
        summary += '<span class="con-gear">' + this.gearCount + ' gear pieces</span>, ';
        summary += '<span class="con-setgear">' + this.setCount + ' set gear pieces</span>, ';
        summary += '<span class="con-weapons">' + this.weaponCount + ' weapons</span>, ';
        summary += '<span class="con-showstoppers">' + this.namedCount + ' Showstoppers</span>, ';
        summary += '<span class="con-weaponmods">' + this.wmodCount + ' weapon mods</span>, ';
        summary += '<span class="con-gearmods">' + this.gmodCount + ' gear mods</span> and ';
        summary += '<span class="con-perfmods">' + this.pmodCount + ' performance mods</span>';
        $('#console').append('<p class="note">' + summary +'</p>');
        this.scrollDown();
    };

    Lexington.prototype.toggle = function () {
        this.running = !this.running;
        if (!this.running) {
            this.start();
        } else {
            this.stop();
        }
    };

    Lexington.prototype.rollItem = function () {

    };

    Lexington.prototype.evaluateDrop = function (drop) {
        var pool = drop.pool
        if (this.willDrop(drop)) {
            var t = 0;
            for (var i = 0; i < pool.length; i++) {
                t += pool[i].weight;
            }
            var sPool = this.shuffle(pool);
            var roll = this.randomFromInterval(0, t);
            var c = 0;
            for (var i = 0; i < sPool.length; i++) {
                var l = sPool[i];
                c += l.weight;
                if (roll < c) {
                    return l;
                }
            }
        }
        return false;
    };

    Lexington.prototype.roll = function (loot) {
        return loot;
    };

    Lexington.prototype.willDrop = function (drop) {
        return this.randomFromInterval(0,100) < drop.dropChance;
    };

    Lexington.prototype.randomFromInterval = function(min,max) {
        return Math.random() * (max - min) + min;
    };

    Lexington.prototype.shuffle = function (a) {
        var c = a.length, tmp, r;
        while (0 !== c) {
            r = Math.floor(Math.random() * c);
            c -= 1;
            tmp = a[c];
            a[c] = a[r];
            a[r] = tmp;
        }
        return a;
    }

    Lexington.prototype.loadPool = function (callback) {
        loadJSON('json/lexington.json',
            function(data) {
                if (typeof callback === 'function') {
                    callback(data);
                }
            },
            function(xhr) { console.error(xhr); }
            );
    };
    Lexington.prototype.poolLoaded = function (data) {
        this.drops = data;
        console.info('Pool data loaded');
    };

    Lexington.prototype.randomIntFromInterval = function(min,max) {
        return Math.round(Math.random() * (max - min) + min);
    };

    Lexington.prototype.makeVest = function () {
        var item = {
            "NAME": "GEAR_VEST",
            "FRIENDLY_NAME": "Chest",
            "MAIN_STAT_QTY":  1,
            "MAJOR_ATTR_QTY": 2,
            "MINOR_ATTR_QTY": 1,
            "G_MOD_SLOT_QTY": 2,
            "P_MOD_SLOT_QTY": 0,
            "STAT_MAIN": [1114,1272],
            "STAT_SEC": 205,
            "ARMOR_NATIVE": [1704,2003],
            "MAJOR": {
                "Damage vs Elites": [6,8],
                "Armor": [1074,1263],
                "Health": [5674,6670],
                "Health on Kill": [4,5],
                "Exotic Damage Resilience": [9,11],
                "Protection from Elites": [6,8]
            },
            "MINOR": {
                "Improved Kill XP": [23,28],
                "Ammo Capacity": [46,56]
            }
        };
        var suffixes = {
            "Critical Hit Chance": "%",
            "Critical Hit Damage": "%",
            "Damage vs Elites": "%",
            "Health": "",
            "Health on Kill": "%",
            "Exotic Damage Resilience": "%",
            "Skill Power": "",
            "Skill Haste": "%",
            "Enemy Armor Damage": "%",
            "Burn Resistance": "%",
            "Bleed Resistance": "%",
            "Disorient Resistance": "%",
            "Blind/Deaf Resistance": "%",
            "Shock Resistance": "%",
            "Disrupt Resistance": "%",
            "Improved Kill XP": "%",
            "Armor": "",
            "Protection from Elites": "%",
            "Ammo Capacity": "%",
            "Critical Hit Chance": "%",
            "SMG Damage": "",
            "Assault Rifle Damage": "",
            "Shotgun Damage": "",
            "LMG Damage": "",
            "Pistol Damage": "",
            "Marksman Rifle Damage": "",
            "Signature Skill Resource Gain": "%"
        };
        var rolled = {
            main: [0,0,0],
            armor: 0,
            additionalArmor: 0,
            major: [],
            minor: []
        };
        rolled.main[0] = rolled.main[1] = rolled.main[2] = item.STAT_SEC;
        var rolledMain = this.randomIntFromInterval(0,2);
        var amt = this.randomIntFromInterval(item.STAT_MAIN[0], item.STAT_MAIN[1]);
        rolled.main[rolledMain] = amt;
    // roll armor
    rolled.armor = this.randomIntFromInterval(item.ARMOR_NATIVE[0], item.ARMOR_NATIVE[1]);
    // roll majors
    if (item.MAJOR_ATTR_QTY > 0) {
        var majors = item.MAJOR;
        var pool = Object.keys(majors);
        for (var i = pool.length; i > item.MAJOR_ATTR_QTY; i--) {
            pool.splice(this.randomIntFromInterval(0, pool.length - 1), 1);
        }
        for (var i = 0; i < pool.length; i++) {
            var stat = pool[i];
            var rolledStat = {
                stat: stat,
                value: this.randomIntFromInterval(majors[stat][0], majors[stat][1]),
                suffix: suffixes[stat]
            }
            if (rolledStat.stat === 'Armor') {
                rolled.additionalArmor = rolledStat.value;
            }
            rolled.major.push(rolledStat);
        }
    }
    // roll minors
    if (item.MINOR_ATTR_QTY > 0) {
        var minors = item.MINOR;
        var minorpool = Object.keys(minors);
        for (var i = minorpool.length; i > item.MINOR_ATTR_QTY; i--) {
            minorpool.splice(this.randomIntFromInterval(0, minorpool.length - 1), 1);
        }
        for (var i = 0; i < minorpool.length; i++) {
            var stat = minorpool[i];
            rolled.minor.push({
                stat: stat,
                value: this.randomIntFromInterval(minors[stat][0], minors[stat][1]),
                suffix: suffixes[stat]
            });
        }
    }
    return rolled;
};

window.lex = new Lexington();

(function() {
    var lastTime = 0;
    var vendors = ['webkit', 'moz'];
    for(var x = 0; x < vendors.length && !window.requestAnimationFrame; ++x) {
        window.requestAnimationFrame = window[vendors[x]+'RequestAnimationFrame'];
        window.cancelAnimationFrame =
        window[vendors[x]+'CancelAnimationFrame'] || window[vendors[x]+'CancelRequestAnimationFrame'];
    }
    if (!window.requestAnimationFrame) {
        window.requestAnimationFrame = function(callback, element) {
            var currTime = new Date().getTime();
            var timeToCall = Math.max(0, 16 - (currTime - lastTime));
            var id = window.setTimeout(function() { callback(currTime + timeToCall); },
              timeToCall);
            lastTime = currTime + timeToCall;
            return id;
        };
    }
    if (!window.cancelAnimationFrame) {
        window.cancelAnimationFrame = function(id) {
            clearTimeout(id);
        };
    }
}());
