var MainController = function (dataService) {
    var _this = this;
    _this.showError = false;
    _this.hideTracks = false;
    _this.model = [];
    //_this.model.artistData = { 'test': 123 };
    

    _this.search = function () {
        
        var searchTerm = _this.model.searchTerm;
        if (searchTerm) {
            searchTerm = searchTerm.replace(' ', '+');
            _this.showError = false;
        } else {
           
            _this.error = "Please enter a search term.";
            _this.showError = true;
            return false;
        }
        dataService.search(searchTerm).
        then(function (result) {
            _this.model.artistData = _.sortBy(result.data.results, function(obj) { return obj.releaseDate });
            _this.showError = false;
        }, function (error, status) {
            _this.error = error.data.Message;
            _this.showError = true;
        });

    }

    _this.showRow = function (album) {
        //alert(album.trackCount);
        album.show = !album.show;
    }
}
app.controller('MainController', MainController);