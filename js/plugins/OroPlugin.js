// OroPlugin.js
(function() {
    // Añadir la opción de oro al menú de opciones
    var _Window_Options_addGeneralOptions = Window_Options.prototype.addGeneralOptions;
    Window_Options.prototype.addGeneralOptions = function() {
        _Window_Options_addGeneralOptions.call(this);
        this.addCommand('Oro', 'goldRate');
    };

    // Obtener el valor de configuración de la opción de oro
    var _Window_Options_getConfigValue = Window_Options.prototype.getConfigValue;
    Window_Options.prototype.getConfigValue = function(symbol) {
        if (symbol === 'goldRate') {
            return ConfigManager.goldRate;
        }
        return _Window_Options_getConfigValue.call(this, symbol);
    };

    // Establecer el valor de configuración de la opción de oro
    var _Window_Options_setConfigValue = Window_Options.prototype.setConfigValue;
    Window_Options.prototype.setConfigValue = function(symbol, value) {
        if (symbol === 'goldRate') {
            ConfigManager.goldRate = value;
        } else {
            _Window_Options_setConfigValue.call(this, symbol, value);
        }
    };

    // Mostrar el texto correspondiente al valor de la opción de oro
    var _Window_Options_statusText = Window_Options.prototype.statusText;
    Window_Options.prototype.statusText = function(index) {
        var symbol = this.commandSymbol(index);
        var value = this.getConfigValue(symbol);
        if (symbol === 'goldRate') {
            return this.goldRateText(value);
        } else {
            return _Window_Options_statusText.call(this, index);
        }
    };

    // Definir los textos para los diferentes niveles de oro
    Window_Options.prototype.goldRateText = function(value) {
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

    // Manejar la acción de confirmar en el menú de opciones para cambiar entre los valores de oro
    var _Window_Options_processOk = Window_Options.prototype.processOk;
    Window_Options.prototype.processOk = function() {
        var index = this.index();
        var symbol = this.commandSymbol(index);
        if (symbol === 'goldRate') {
            var value = this.getConfigValue(symbol);
            value = this.cycleGoldRate(value);
            this.changeValue(symbol, value);
        } else {
            _Window_Options_processOk.call(this);
        }
    };

    // Cambiar entre los diferentes valores de oro
    Window_Options.prototype.cycleGoldRate = function(value) {
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

    // ConfigManager para manejar la configuración del oro
    ConfigManager.goldRate = 'normal';

    // Guardar la configuración de oro
    var _ConfigManager_makeData = ConfigManager.makeData;
    ConfigManager.makeData = function() {
        var config = _ConfigManager_makeData.call(this);
        config.goldRate = this.goldRate;
        return config;
    };

    // Aplicar la configuración de oro al cargar el juego
    var _ConfigManager_applyData = ConfigManager.applyData;
    ConfigManager.applyData = function(config) {
        _ConfigManager_applyData.call(this, config);
        this.goldRate = this.readGoldRate(config, 'goldRate');
    };

    // Leer la configuración de oro desde los datos guardados
    ConfigManager.readGoldRate = function(config, name) {
        var value = config[name];
        if (value !== undefined) {
            return value;
        } else {
            return 'normal';
        }
    };

    // Ajustar el oro obtenido según la configuración
    var _Game_Party_gainGold = Game_Party.prototype.gainGold;
    Game_Party.prototype.gainGold = function(amount) {
        switch (ConfigManager.goldRate) {
            case 'low':
                amount = Math.floor(amount * 0.75);
                break;
            case 'high':
                amount = Math.floor(amount * 1.5);
                break;
        }
        _Game_Party_gainGold.call(this, amount);
    };
})();
