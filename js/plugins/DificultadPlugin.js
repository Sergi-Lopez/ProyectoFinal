// DificultadPlugin.js
(function() {
    var _Window_Options_addGeneralOptions = Window_Options.prototype.addGeneralOptions;
    Window_Options.prototype.addGeneralOptions = function() {
        _Window_Options_addGeneralOptions.call(this);
        this.addCommand('Dificultad', 'difficulty');
    };

    var _Window_Options_getConfigValue = Window_Options.prototype.getConfigValue;
    Window_Options.prototype.getConfigValue = function(symbol) {
        if (symbol === 'difficulty') {
            return ConfigManager.difficulty;
        }
        return _Window_Options_getConfigValue.call(this, symbol);
    };

    var _Window_Options_setConfigValue = Window_Options.prototype.setConfigValue;
    Window_Options.prototype.setConfigValue = function(symbol, value) {
        if (symbol === 'difficulty') {
            ConfigManager.difficulty = value;
        } else {
            _Window_Options_setConfigValue.call(this, symbol, value);
        }
    };

    var _Window_Options_statusText = Window_Options.prototype.statusText;
    Window_Options.prototype.statusText = function(index) {
        var symbol = this.commandSymbol(index);
        var value = this.getConfigValue(symbol);
        if (symbol === 'difficulty') {
            return this.difficultyText(value);
        } else {
            return _Window_Options_statusText.call(this, index);
        }
    };

    Window_Options.prototype.difficultyText = function(value) {
        switch (value) {
            case 'easy':
                return 'Fácil';
            case 'normal':
                return 'Normal';
            case 'hard':
                return 'Difícil';
            default:
                return 'Normal';
        }
    };

    var _Window_Options_processOk = Window_Options.prototype.processOk;
    Window_Options.prototype.processOk = function() {
        var index = this.index();
        var symbol = this.commandSymbol(index);
        if (symbol === 'difficulty') {
            var value = this.getConfigValue(symbol);
            value = this.cycleDifficulty(value);
            this.changeValue(symbol, value);
        } else {
            _Window_Options_processOk.call(this);
        }
    };

    Window_Options.prototype.cycleDifficulty = function(value) {
        switch (value) {
            case 'easy':
                return 'normal';
            case 'normal':
                return 'hard';
            case 'hard':
                return 'easy';
            default:
                return 'normal';
        }
    };

    ConfigManager.difficulty = 'normal';

    var _ConfigManager_makeData = ConfigManager.makeData;
    ConfigManager.makeData = function() {
        var config = _ConfigManager_makeData.call(this);
        config.difficulty = this.difficulty;
        return config;
    };

    var _ConfigManager_applyData = ConfigManager.applyData;
    ConfigManager.applyData = function(config) {
        _ConfigManager_applyData.call(this, config);
        this.difficulty = this.readDifficulty(config, 'difficulty');
    };

    ConfigManager.readDifficulty = function(config, name) {
        var value = config[name];
        if (value !== undefined) {
            return value;
        } else {
            return 'normal';
        }
    };

    // Ajustar la salud de los enemigos según la dificultad
    var _Game_Enemy_setup = Game_Enemy.prototype.setup;
    Game_Enemy.prototype.setup = function(enemyId, x, y) {
        _Game_Enemy_setup.call(this, enemyId, x, y);
        this.adjustForDifficulty();
    };

    Game_Enemy.prototype.adjustForDifficulty = function() {
        var rate = 1;
        if (ConfigManager.difficulty === 'easy') {
            rate = 0.75;
        } else if (ConfigManager.difficulty === 'hard') {
            rate = 1.5;
        }
        this._hp = Math.floor(this._hp * rate);
        this._maxHp = Math.floor(this._maxHp * rate);
    };

    // Ajustar el daño de los ataques según la dificultad
    var _Game_Action_apply = Game_Action.prototype.apply;
    Game_Action.prototype.apply = function(target) {
        _Game_Action_apply.call(this, target);
        this.adjustDamageForDifficulty(target);
    };

    Game_Action.prototype.adjustDamageForDifficulty = function(target) {
        var rate = 1;
        if (ConfigManager.difficulty === 'easy') {
            rate = 0.75;
        } else if (ConfigManager.difficulty === 'hard') {
            rate = 1.5;
        }
        target.result().hpDamage = Math.floor(target.result().hpDamage * rate);
    };

})();