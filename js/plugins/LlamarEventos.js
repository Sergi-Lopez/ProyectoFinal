var LlamarEventos = {};

// Globales

LlamarEventos.darRecompensa = function() {
    $gameParty.gainGold(100);
    $gameParty.gainItem($dataWeapons[8], 1);
    $gameParty.gainItem($dataArmors[8], 1);
};


// Mapa 1 (Inicio)
LlamarEventos.inicio = function() {
    AudioManager.playBgm({ name: "Scene2", volume: 35, pitch: 60 });
    $gameMessage.setFaceImage('Package2', 2);
    $gameMessage.setBackground(0);
    $gameMessage.setPositionType(2);
    $gameMessage.add('Por fin nos podemos comunicar... Llevo \ntiempo ya esperando. Te he traido \nalgo de dinero, aprovecha para comprar en ese cristal.\nAh, luego asegurate de pasar por el portal.');
    $gameParty.gainGold(1000);
    $gameParty.gainItem($dataWeapons[8], 1);
    $gameParty.gainItem($dataArmors[8], 1);
    
};

LlamarEventos.tienda = function() {
    SceneManager.push(Scene_Shop);
    SceneManager.prepareNextScene(
    [[0, 1, 0], [0, 2, 0], [0, 3, 0], [0, 4, 0], [0, 5, 0]], true
    );
};

LlamarEventos.cofre = function() {
    if ($gameParty.leader().level == 99) {
        $gameParty.loseGold(10000);
        $gameParty.loseItem($dataWeapons[27], 1);
        $dataSkills.forEach(function(skill){
            if (skill) $gameParty.leader().forgetSkill(skill.id);
        });
        $gameParty.leader().learnSkill(28);
        $gameParty.leader().changeLevel(1, false);
        $gameParty.members().forEach(function(actor) { actor.recoverAll(); });
        $gameMessage.setFaceImage(null, 0);
        $gameMessage.setBackground(0);
        $gameMessage.setPositionType(2);
        $gameMessage.add('Pack versión de prueba eliminado.');
    } else {
        $gameParty.gainGold(10000);
        $gameParty.gainItem($dataWeapons[27], 1);
        $dataSkills.forEach(function(skill){
            if (skill) $gameParty.leader().learnSkill(skill.id);
        });
        $gameParty.leader().changeLevel(99, false);
        $gameParty.members().forEach(function(actor) { actor.recoverAll(); });
        $gameMessage.setFaceImage(null, 0);
        $gameMessage.setBackground(0);
        $gameMessage.setPositionType(2);
        $gameMessage.add('Pack versión de prueba: \n10000 oro, nivel 99, bastón de prueba y todas las \nskills aprendidas.\nPara eliminarlo interactua otra vez con el cofre.');
    }
};

// Mapa 2 (Pelea)

LlamarEventos.aila = function() {
    $gameMessage.setFaceImage('Package2', 2);
    $gameMessage.setBackground(0);
    $gameMessage.setPositionType(2);
    $gameMessage.add('He podido traer a una de tus compañeras \nsolo será temporalmente, pero aprovechalo.');
    $gameParty.addActor(2);
};