(function () {

    var nameFilter = function () {

        return function (entities, name) {
            if (!name && name!="") return entities;

            var matches = [];
            name = (name)?name.toLowerCase():"";
            for (var i = 0; i < entities.length; i++) {
                var entity = entities[i];
                if ((entity.name.toLowerCase().indexOf(name) > -1 || name=="")  ) {

                    matches.push(entity);
                }
            }
            return matches;
        };
    };

    angular.module('codeGenApp').filter('nameFilter', nameFilter);

}());