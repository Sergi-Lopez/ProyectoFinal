// ExperienciaPlugin.js
(function() {
    var _Window_Options_addGeneralOptions = Window_Options.prototype.addGeneralOptions;
    Window_Options.prototype.addGeneralOptions = function() {
        _Window_Options_addGeneralOptions.call(this);
        this.addCommand('Experiencia', 'experienceRate');
    };

    var _Window_Options_getConfigValue = Window_Options.prototype.getConfigValue;
    Window_Options.prototype.getConfigValue = function(symbol) {
        if (symbol === 'experienceRate') {
            return ConfigManager.experienceRate;
        }
        return _Window_Options_getConfigValue.call(this, symbol);
    };

    var _Window_Options_setConfigValue = Window_Options.prototype.setConfigValue;
    Window_Options.prototype.setConfigValue = function(symbol, value) {
        if (symbol === 'experienceRate') {
            ConfigManager.experienceRate = value;
        } else {
            _Window_Options_setConfigValue.call(this, symbol, value);
        }
    };

    var _Window_Options_statusText = Window_Options.prototype.statusText;
    Window_Options.prototype.statusText = function(index) {
        var symbol = this.commandSymbol(index);
        var value = this.getConfigValue(symbol);
        if (symbol === 'experienceRate') {
            return this.experienceRateText(value);
        } else {
            return _Window_Options_statusText.call(this, index);
        }
    };

    Window_Options.prototype.experienceRateText = function(value) {
        switch (value) {
            case 'low':
                return 'Bajo';
            case 'normal':
                return 'Normal';
            case 'high':
                return 'Alto';
            default:
                return 'Normal';
        }
    };

    var _Window_Options_processOk = Window_Options.prototype.processOk;
    Window_Options.prototype.processOk = function() {
        var index = this.index();
        var symbol = this.commandSymbol(index);
        if (symbol === 'experienceRate') {
            var value = this.getConfigValue(symbol);
            value = this.cycleExperienceRate(value);
            this.changeValue(symbol, value);
        } else {
            _Window_Options_processOk.call(this);
        }
    };

    Window_Options.prototype.cycleExperienceRate = function(value) {
        switch (value) {
            case 'low':
                return 'normal';
            case 'normal':
                return 'high';
            case 'high':
                return 'low';
            default:
                return 'normal';
        }
    };

    ConfigManager.experienceRate = 'normal';

    var _ConfigManager_makeData = ConfigManager.makeData;
    ConfigManager.makeData = function() {
        var config = _ConfigManager_makeData.call(this);
        config.experienceRate = this.experienceRate;
        return config;
    };

    var _ConfigManager_applyData = ConfigManager.applyData;
    ConfigManager.applyData = function(config) {
        _ConfigManager_applyData.call(this, config);
        this.experienceRate = this.readExperienceRate(config, 'experienceRate');
    };

    ConfigManager.readExperienceRate = function(config, name) {
        var value = config[name];
        if (value !== undefined) {
            return value;
        } else {
            return 'normal';
        }
    };

    var _Game_Actor_gainExp = Game_Actor.prototype.gainExp;
    Game_Actor.prototype.gainExp = function(exp) {
        switch (ConfigManager.experienceRate) {
            case 'low':
                exp = Math.floor(exp * 0.75);
                break;
            case 'high':
                exp = Math.floor(exp * 1.5);
                break;
        }
        _Game_Actor_gainExp.call(this, exp);
    };
})();
