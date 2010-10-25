var bemUtil = require('../../util'),
    myPath = require('../../path'),
    Level = require('../../level').Level;

exports.OptParse = function() {
    return this
        .title('Модификатор.').helpful()
        .apply(bemUtil.techsOptParse)
        .apply(bemUtil.levelOptParse)
        .opt()
            .name('blockName').short('b').long('block')
            .title('имя блока (обязательный параметр)')
            .required()
            .end()
        .opt()
            .name('elemName').short('e').long('elem')
            .title('имя элемента')
            .end()
        .opt()
            .name('modVal').short('v').long('val')
            .title('значения модификатора')
            .push()
            .end()
        .arg()
            .name('names')
            .title('имена')
            .required()
            .push()
            .end()
        .act(function(opts, args) {
            var level = new Level(opts.levelDir),
                techs = bemUtil.mergeTechs(level, opts);

            args.names.forEach(function(name) {
                var item = opts.elemName ? 'elem' : 'block',
                    args = (opts.elemName ? [opts.blockName, opts.elemName] : [opts.blockName])
                        .concat(name),
                    vars = {
                        BlockName: opts.blockName,
                        ElemName: opts.elemName,
                        ModName: name
                    };

                if(opts.modVal) {
                    opts.modVal.forEach(function(val) {
                        var prefix = level.get(item + '-mod-val', args.concat(val));
                        bemUtil.mkdir(myPath.dirname(prefix));
                        vars.ModVal = val;
                        for (var t in techs) techs[t].bemCreate(prefix, vars);
                        delete vars.ModVal;
                    });
                } else {
                    var prefix = level.get(item + '-mod', args);
                    bemUtil.mkdir(myPath.dirname(prefix));
                    for (var t in techs) techs[t].bemCreate(prefix, vars);
                }
            });
        });
};