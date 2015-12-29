window.SportData.Application = Backbone.View.extend({
    initialize: function() {
        var uploadStateModel = new Backbone.Model({state: 'NONE', statistics: {}});
        new SportData.views.UploadImportData({el: document.querySelector('#upload'), model: uploadStateModel});
        new SportData.views.RemoveRandomEventsData({el: document.querySelector('#remove')});
        new SportData.views.EventsGridView({el: document.querySelector('#grid'), collection: new SportData.models.EventRowCollection});
        var socket = io.connect('http://localhost:3000');
        socket.on('connect', function(){
            console.log('connect');
            socket.emit('register', {ioSID: window.ioSID});
        });
        socket.on('import-progress', function (data) {
            uploadStateModel.set(data);
        });
    }
});