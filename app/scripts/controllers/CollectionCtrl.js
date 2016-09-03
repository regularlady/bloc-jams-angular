(function() {
    function CollectionCtrl(Fixtures) {
      this.albums = Fixtures.getCollection(8);
    }

    angular
        .module('blocJams')
        .controller('CollectionCtrl', CollectionCtrl);
})();
